# Best Practices & Scaling Guide

## 1. DATABASE OPTIMIZATION

### Indexing Strategy
```sql
-- Already included in Prisma schema, but here's the rationale:

-- Product queries
CREATE INDEX idx_product_slug ON products(slug);
CREATE INDEX idx_product_sku ON products(sku);
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_brand ON products(brand_id);
CREATE INDEX idx_product_stock_status ON products(stock_status);
CREATE INDEX idx_product_price ON products(price);

-- Category tree queries
CREATE INDEX idx_category_parent ON categories(parent_id);
CREATE INDEX idx_category_slug ON categories(slug);

-- Specification filtering (most important for performance)
CREATE INDEX idx_product_spec_product ON product_specifications(product_id);
CREATE INDEX idx_product_spec_definition ON product_specifications(specification_definition_id);
CREATE INDEX idx_spec_def_category ON specification_definitions(category_id);

-- Filterable specifications cache
CREATE INDEX idx_filterable_spec_key ON filterable_specifications(key);
CREATE INDEX idx_filterable_spec_category ON filterable_specifications(category_id);
```

### Query Optimization
```typescript
// BAD: N+1 query problem
const products = await prisma.product.findMany();
for (const product of products) {
  const brand = await prisma.brand.findUnique({ where: { id: product.brandId } });
}

// GOOD: Use include/select
const products = await prisma.product.findMany({
  include: {
    brand: true,
    category: true,
    images: { where: { isPrimary: true }, take: 1 }
  }
});

// BETTER: Only select what you need
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    slug: true,
    price: true,
    brand: { select: { name: true, slug: true } },
    images: { 
      where: { isPrimary: true },
      take: 1,
      select: { url: true, alt: true }
    }
  }
});
```

### Database Connection Pooling
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // Connection pooling for production
  // DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20"
}
```

---

## 2. CACHING STRATEGY

### Next.js Cache (Recommended for Start)
```typescript
// app/products/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
    where: { isActive: true }
  });
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}
```

### Redis Caching (For High Traffic)
```typescript
// lib/redis.ts
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL);

// services/product.service.ts
static async getBySlug(slug: string) {
  // Try cache first
  const cached = await redis.get(`product:${slug}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { ... }
  });
  
  // Cache for 1 hour
  await redis.setex(`product:${slug}`, 3600, JSON.stringify(product));
  
  return product;
}
```

### Cache Invalidation
```typescript
// When product is updated
await redis.del(`product:${product.slug}`);
await redis.del(`category:${product.categoryId}:products`);
revalidatePath(`/products/${product.slug}`);
```

---

## 3. IMAGE OPTIMIZATION

### Storage Options

**Option 1: Cloud Storage (Recommended)**
```typescript
// Use AWS S3, Cloudflare R2, or DigitalOcean Spaces
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

async function uploadImage(file: File) {
  const buffer = await file.arrayBuffer();
  const key = `products/${Date.now()}-${file.name}`;
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  }));
  
  return `https://${process.env.AWS_CDN_DOMAIN}/${key}`;
}
```

**Option 2: UploadThing (Easy Setup)**
```typescript
// lib/uploadthing.ts
import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

export const uploadRouter = {
  productImage: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      const user = await getServerSession();
      if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
};
```

### Image Optimization
```typescript
// Use Next.js Image component (automatic optimization)
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={500}
  height={500}
  quality={85}
  loading="lazy"
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>
```

---

## 4. SEARCH IMPLEMENTATION

### Option 1: PostgreSQL Full-Text Search (Start Here)
```typescript
// Add to Prisma schema
model Product {
  // ... existing fields
  searchVector Unsupported("tsvector")?
  
  @@index([searchVector], type: Gin)
}

// Create trigger for auto-update
await prisma.$executeRaw`
  CREATE TRIGGER product_search_update BEFORE INSERT OR UPDATE
  ON products FOR EACH ROW EXECUTE PROCEDURE
  tsvector_update_trigger(
    search_vector, 'pg_catalog.english', name, description, sku
  );
`;

// Search query
const products = await prisma.$queryRaw`
  SELECT * FROM products
  WHERE search_vector @@ to_tsquery('english', ${searchTerm})
  ORDER BY ts_rank(search_vector, to_tsquery('english', ${searchTerm})) DESC
  LIMIT 20;
`;
```

### Option 2: Typesense (Better Search Experience)
```typescript
// lib/typesense.ts
import Typesense from 'typesense';

export const typesense = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST,
    port: 443,
    protocol: 'https'
  }],
  apiKey: process.env.TYPESENSE_API_KEY,
});

// Index product on creation
await typesense.collections('products').documents().create({
  id: product.id,
  name: product.name,
  description: product.description,
  price: Number(product.price),
  brand: product.brand.name,
  category: product.category.name,
  image: product.images[0]?.url,
});

// Search
const results = await typesense.collections('products').documents().search({
  q: searchQuery,
  query_by: 'name,description,sku',
  filter_by: 'stockStatus:IN_STOCK',
  sort_by: 'price:asc',
});
```

---

## 5. SECURITY BEST PRACTICES

### Authentication
```typescript
// Use NextAuth.js with proper configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) return null;
        
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        
        return { id: user.id, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  }
};
```

### Input Validation
```typescript
// ALWAYS validate with Zod before database operations
const result = schema.safeParse(data);
if (!result.success) {
  return { error: result.error.errors };
}
```

### Rate Limiting
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  return NextResponse.next();
}
```

---

## 6. PERFORMANCE MONITORING

### Error Tracking (Sentry)
```typescript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### Database Query Monitoring
```typescript
// Prisma logging
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) { // Log slow queries
    console.warn('Slow query detected:', {
      query: e.query,
      duration: e.duration,
    });
  }
});
```

---

## 7. SCALING STRATEGY

### Phase 1: Single Server (0-10K users)
- Next.js on Vercel
- PostgreSQL on Railway/Render
- Images on Cloudflare R2
- No caching needed yet

### Phase 2: Caching Layer (10K-100K users)
- Add Redis for product caching
- Enable Next.js ISR
- CDN for images
- Database read replicas

### Phase 3: Horizontal Scaling (100K+ users)
- Separate frontend and backend
- API on multiple servers (load balanced)
- Database sharding by category
- Elasticsearch for search
- Message queue (RabbitMQ/Redis) for async tasks

### Phase 4: Microservices (Enterprise)
```
┌─────────────────┐
│  Next.js (UI)   │
└────────┬────────┘
         │
    ┌────▼────┐
    │ API GW  │ (Kong/NGINX)
    └────┬────┘
         │
    ┌────┴────────────────────┐
    │                         │
┌───▼──────┐         ┌───────▼────┐
│ Product  │         │   Order    │
│ Service  │         │  Service   │
└───┬──────┘         └───────┬────┘
    │                        │
┌───▼──────┐         ┌───────▼────┐
│ Product  │         │   Order    │
│   DB     │         │     DB     │
└──────────┘         └────────────┘
```

---

## 8. DEPLOYMENT CHECKLIST

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://yourdomain.com"

# File Upload
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BUCKET_NAME="..."
AWS_REGION="..."

# Search (optional)
TYPESENSE_HOST="..."
TYPESENSE_API_KEY="..."

# Redis (optional)
REDIS_URL="..."

# Monitoring
SENTRY_DSN="..."
```

### Pre-Deployment
- [ ] Run database migrations
- [ ] Seed initial data (categories, admin user)
- [ ] Test all API endpoints
- [ ] Verify image uploads work
- [ ] Test admin login
- [ ] Check SEO meta tags
- [ ] Test on mobile devices
- [ ] Run security audit (npm audit)
- [ ] Set up error monitoring
- [ ] Configure CDN for images
- [ ] Set up automated backups

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check database query performance
- [ ] Verify caching works
- [ ] Test payment flow (when implemented)
- [ ] Set up uptime monitoring
- [ ] Create admin documentation

---

## 9. CODE QUALITY

### TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Testing (Recommended)
```typescript
// tests/product.test.ts
import { describe, it, expect } from 'vitest';
import { ProductService } from '@/services/product.service';

describe('ProductService', () => {
  it('should create product with specifications', async () => {
    const product = await ProductService.create({
      name: 'Test Processor',
      // ... other fields
    });
    
    expect(product).toBeDefined();
    expect(product.specifications.length).toBeGreaterThan(0);
  });
});
```

---

## 10. MAINTENANCE TASKS

### Regular Tasks
- **Daily**: Monitor error logs
- **Weekly**: Check database size, review slow queries
- **Monthly**: Update dependencies, security patches
- **Quarterly**: Database optimization, cleanup old data

### Automated Tasks
```typescript
// Cron job: Update filterable specs cache
export async function updateFilterCache() {
  const categories = await prisma.category.findMany();
  
  for (const category of categories) {
    // Recalculate filter counts
    await ProductService.rebuildFilterCache(category.id);
  }
}

// Cron job: Cleanup unused images
export async function cleanupImages() {
  const allImages = await getImagesFromStorage();
  const usedImages = await prisma.productImage.findMany({
    select: { url: true }
  });
  
  const unused = allImages.filter(
    img => !usedImages.some(used => used.url === img)
  );
  
  // Delete unused images
  for (const img of unused) {
    await deleteFromStorage(img);
  }
}
```

---

## SUMMARY

**Start Simple:**
1. Next.js + Prisma + PostgreSQL
2. Deploy on Vercel + Railway
3. Use Next.js built-in caching

**Scale Up:**
1. Add Redis caching
2. Implement search (Typesense)
3. Move images to CDN
4. Add monitoring (Sentry)

**Enterprise:**
1. Microservices architecture
2. Kubernetes deployment
3. Advanced analytics
4. Multi-region deployment
