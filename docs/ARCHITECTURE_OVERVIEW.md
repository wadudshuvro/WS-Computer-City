# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Browser   │  │   Mobile   │  │  Crawler   │            │
│  │  (Next.js) │  │   (API)    │  │  (SEO)     │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
└────────┼────────────────┼────────────────┼──────────────────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────┐
│                    APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js App Router                      │   │
│  │  ┌─────────────┐  ┌────────────┐  ┌──────────────┐  │   │
│  │  │   Public    │  │   Admin    │  │  API Routes  │  │   │
│  │  │   Pages     │  │   Panel    │  │              │  │   │
│  │  └─────────────┘  └────────────┘  └──────┬───────┘  │   │
│  └────────────────────────────────────────────┼──────────┘   │
│                                               │              │
│  ┌────────────────────────────────────────────▼──────────┐   │
│  │             Middleware Layer                          │   │
│  │  • Authentication (NextAuth)                          │   │
│  │  • Rate Limiting                                      │   │
│  │  • CORS                                               │   │
│  └────────────────────────────────────────────┬──────────┘   │
└─────────────────────────────────────────────────┼────────────┘
                                                  │
┌─────────────────────────────────────────────────▼────────────┐
│                    BUSINESS LOGIC LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Product    │  │   Category   │  │    Brand     │       │
│  │   Service    │  │   Service    │  │   Service    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│  ┌────────────────────────▼────────────────────────────┐     │
│  │            Validation Layer (Zod)                   │     │
│  └────────────────────────┬────────────────────────────┘     │
└─────────────────────────────────────────────────────────┼────┘
                                                          │
┌─────────────────────────────────────────────────────────▼────┐
│                    DATA ACCESS LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Product    │  │   Category   │  │    Brand     │       │
│  │  Repository  │  │  Repository  │  │  Repository  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│  ┌────────────────────────▼────────────────────────────┐     │
│  │              Prisma ORM                             │     │
│  └────────────────────────┬────────────────────────────┘     │
└─────────────────────────────────────────────────────────┼────┘
                                                          │
┌─────────────────────────────────────────────────────────▼────┐
│                     PERSISTENCE LAYER                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   PostgreSQL   │  │  Redis Cache   │  │  File Storage  │ │
│  │   (Primary)    │  │  (Optional)    │  │  (S3/R2)       │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. Presentation Layer (Frontend)

```typescript
src/
├── app/                           # Next.js App Router
│   ├── (main)/                    # Public-facing routes
│   │   ├── layout.tsx             # Main layout
│   │   ├── page.tsx               # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx           # Product listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Product details
│   │   └── categories/
│   │       └── [slug]/
│   │           └── page.tsx       # Category page
│   │
│   ├── admin/                     # Admin routes
│   │   ├── layout.tsx             # Admin layout
│   │   ├── products/
│   │   │   ├── page.tsx           # Product management
│   │   │   └── new/
│   │   │       └── page.tsx       # Create product
│   │   └── categories/
│   │       └── page.tsx           # Category management
│   │
│   └── api/                       # API Routes
│       ├── products/
│       │   └── route.ts           # GET /api/products
│       └── admin/
│           └── products/
│               └── route.ts       # POST /api/admin/products
│
└── components/
    ├── ui/                        # Base UI components (shadcn)
    ├── products/                  # Product-specific components
    ├── categories/                # Category components
    └── admin/                     # Admin components
```

### 2. Business Logic Layer

```typescript
src/services/
├── product.service.ts             # Product business logic
│   ├── create()                   # Create product
│   ├── update()                   # Update product
│   ├── getFiltered()              # Get with filters
│   ├── getBySlug()                # Get single product
│   └── delete()                   # Delete product
│
├── category.service.ts            # Category business logic
│   ├── create()
│   ├── getTree()                  # Get category tree
│   └── getBreadcrumb()            # Generate breadcrumb
│
└── specification.service.ts       # Specification logic
    ├── createDefinition()
    └── getForCategory()
```

### 3. Data Access Layer

```typescript
src/repositories/
├── product.repository.ts          # Product data access
│   ├── findMany()                 # Query products
│   ├── findBySlug()               # Find by slug
│   └── create()                   # Insert product
│
├── category.repository.ts         # Category data access
│   ├── findTree()                 # Get category tree
│   └── findWithAncestors()        # Get with parents
│
└── base.repository.ts             # Base repository
    ├── findById()
    ├── create()
    ├── update()
    └── delete()
```

---

## Data Flow Patterns

### 1. Reading Data (Product Listing Page)

```
User visits /products
         │
         ▼
app/products/page.tsx
         │
         ▼
ProductService.getFiltered()
         │
         ▼
ProductRepository.findMany()
         │
         ▼
Prisma Client
         │
         ▼
PostgreSQL
         │
         ▼
Transform data
         │
         ▼
Render ProductCard components
         │
         ▼
Display to user
```

### 2. Writing Data (Create Product - Admin)

```
Admin fills form
         │
         ▼
Validate with Zod (client-side)
         │
         ▼
POST /api/admin/products
         │
         ▼
Authenticate user
         │
         ▼
Validate with Zod (server-side)
         │
         ▼
ProductService.create()
         │
         ▼
Database transaction:
  1. Create product
  2. Create images
  3. Create specifications
  4. Update filter cache
         │
         ▼
Revalidate Next.js cache
         │
         ▼
Return success response
         │
         ▼
Redirect to product list
         │
         ▼
Product visible on website
```

### 3. Filtering Products

```
User selects filters
         │
         ▼
Update URL params
         │
         ▼
GET /api/products?brand=intel&socket_type=LGA1700
         │
         ▼
Parse query parameters
         │
         ▼
Build Prisma where clause
         │
         ▼
Execute optimized query:
  SELECT * FROM products
  WHERE brand_id IN (...)
    AND specifications @> [...]
    AND price BETWEEN ... AND ...
  ORDER BY created_at DESC
  LIMIT 20 OFFSET 0
         │
         ▼
Return products + filter counts
         │
         ▼
Render filtered products
```

---

## Database Schema Patterns

### 1. Category Tree (Adjacency List)

```sql
categories:
  id          parent_id   name        level
  ──────────  ──────────  ──────────  ─────
  cat_1       NULL        Desktop     0
  cat_2       NULL        Components  0
  cat_3       cat_2       Processor   1
  cat_4       cat_3       Intel       2
  cat_5       cat_3       AMD         2
```

**Queries:**
- Get all root categories: `WHERE parent_id IS NULL`
- Get children: `WHERE parent_id = 'cat_2'`
- Get breadcrumb: Recursive CTE

### 2. Dynamic Specifications (EAV Pattern - Enhanced)

```sql
-- Define what specs a category has
specification_definitions:
  id      category_id   key           name        data_type
  ──────  ────────────  ────────────  ──────────  ─────────
  def_1   cat_3         socket_type   Socket      TEXT
  def_2   cat_3         core_count    Cores       NUMBER

-- Store actual values per product
product_specifications:
  id      product_id   spec_def_id   value
  ──────  ───────────  ────────────  ───────
  ps_1    prod_1       def_1         LGA1700
  ps_2    prod_1       def_2         6
```

**Benefits:**
- Flexible: Add new specs without schema changes
- Type-safe: Data type defined in definition
- Filterable: Indexed for fast queries

### 3. Filterable Specification Cache

```sql
-- Pre-computed for fast filtering
filterable_specifications:
  key           value      category_id   count
  ────────────  ─────────  ────────────  ─────
  socket_type   LGA1700    cat_3         45
  socket_type   AM4        cat_3         32
  core_count    6          cat_3         28
  core_count    8          cat_3         40
```

**Purpose:**
- Show filter options with counts: "LGA1700 (45)"
- Updated when products are created/updated
- Dramatically improves filter sidebar performance

---

## Security Architecture

### 1. Authentication Flow

```
User login attempt
         │
         ▼
POST /api/auth/login
         │
         ▼
Validate credentials (bcrypt)
         │
         ▼
Create JWT session (NextAuth)
         │
         ▼
Return session cookie (httpOnly, secure)
         │
         ▼
Subsequent requests include cookie
         │
         ▼
Middleware validates session
         │
         ▼
Attach user to request
```

### 2. Authorization Layers

```typescript
// 1. Route-level (middleware.ts)
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Verify session exists
  }
}

// 2. API-level (API routes)
export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Process request
}

// 3. Component-level (React)
export function AdminPanel() {
  const { data: session } = useSession();
  if (session?.user.role !== 'ADMIN') {
    return <AccessDenied />;
  }
  // Render admin UI
}
```

### 3. Input Validation

```typescript
// Client-side validation
const form = useForm<ProductFormData>({
  resolver: zodResolver(productSchema),
});

// Server-side validation (ALWAYS required)
export async function POST(req: Request) {
  const body = await req.json();
  
  try {
    const validated = productSchema.parse(body);
    // Process validated data
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
  }
}
```

---

## Performance Optimization Strategies

### 1. Database Query Optimization

**Bad:**
```typescript
// N+1 problem
const products = await prisma.product.findMany();
for (const product of products) {
  product.brand = await prisma.brand.findUnique({ where: { id: product.brandId } });
}
```

**Good:**
```typescript
// Include relations in single query
const products = await prisma.product.findMany({
  include: {
    brand: true,
    category: true,
    images: { where: { isPrimary: true }, take: 1 }
  }
});
```

### 2. Caching Strategy

```typescript
// Level 1: Next.js Static Generation
export const revalidate = 3600; // 1 hour

// Level 2: Redis cache
const cached = await redis.get(`product:${slug}`);
if (cached) return JSON.parse(cached);

// Level 3: Database query
const product = await prisma.product.findUnique(...);
await redis.setex(`product:${slug}`, 3600, JSON.stringify(product));
```

### 3. Image Optimization

```typescript
// Next.js automatic optimization
<Image
  src={product.image}
  alt={product.name}
  width={500}
  height={500}
  quality={85}
  loading="lazy"
  placeholder="blur"
/>
```

---

## Scaling Strategy

### Phase 1: Monolith (0-10K users)
- Single Next.js application
- PostgreSQL on managed service
- Vercel deployment
- **Cost**: ~$20/month

### Phase 2: Caching (10K-100K users)
- Add Redis for caching
- CDN for images
- Database read replicas
- **Cost**: ~$100/month

### Phase 3: Horizontal Scaling (100K-1M users)
```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ App1 │  │ App2 │  (Multiple Next.js instances)
└───┬──┘  └──┬───┘
    │        │
    └────┬───┘
         │
┌────────▼────────┐
│   Redis Cache   │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │
│  (Primary +     │
│   Replicas)     │
└─────────────────┘
```

### Phase 4: Microservices (1M+ users)
- Separate services for Product, Order, User
- Message queue (RabbitMQ/Kafka)
- Elasticsearch for search
- Kubernetes orchestration

---

## Testing Strategy

```typescript
// Unit tests
describe('ProductService', () => {
  it('should create product with specifications', async () => {
    const product = await ProductService.create({ ... });
    expect(product).toBeDefined();
  });
});

// Integration tests
describe('POST /api/admin/products', () => {
  it('should require authentication', async () => {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify({ ... })
    });
    expect(response.status).toBe(401);
  });
});

// E2E tests
describe('Product flow', () => {
  it('should allow admin to create and view product', async () => {
    await page.goto('/admin/login');
    await page.fill('input[name=email]', 'admin@test.com');
    await page.click('button[type=submit]');
    // ... continue flow
  });
});
```

---

## Summary

This architecture provides:
- ✅ **Separation of Concerns**: Clear boundaries between layers
- ✅ **Type Safety**: TypeScript + Prisma + Zod
- ✅ **Scalability**: Can grow from prototype to enterprise
- ✅ **Maintainability**: Clean code, well-documented
- ✅ **Performance**: Optimized queries, caching strategies
- ✅ **Security**: Multi-layer authentication and validation
- ✅ **Flexibility**: Dynamic specifications, unlimited categories
- ✅ **Production-Ready**: Error handling, monitoring, testing
