# WS Computer City 🖥️

A modern, production-ready e-commerce platform for computer hardware, built with cutting-edge technologies and designed for the Bangladesh market.

**Live Demo**: [Coming Soon]  
**Admin Panel**: [Coming Soon]

---

## 🚀 Features

### User-Facing Features
- ✅ **Multi-level Category Navigation** (Category → Sub-category → Sub-sub-category)
- ✅ **Advanced Product Filtering** (Price, Brand, Stock Status, Technical Specs)
- ✅ **Dynamic Product Specifications** (Unique specs per category)
- ✅ **Responsive Design** (Mobile, Tablet, Desktop)
- ✅ **SEO Optimized** (Meta tags, structured data, sitemap)
- ✅ **Fast Page Loads** (Next.js ISR, image optimization)
- ✅ **Search Functionality** (Full-text search across products)

### Admin CMS Features
- ✅ **Secure Authentication** (Role-based access control)
- ✅ **Category Management** (Unlimited nesting with drag-and-drop)
- ✅ **Brand Management** (Create and manage brands)
- ✅ **Product Management** (Add, edit, delete products)
- ✅ **Dynamic Specifications** (Define specs per category)
- ✅ **Image Upload** (Multiple images per product)
- ✅ **Stock Management** (In Stock, Out of Stock, Pre-Order, Upcoming)
- ✅ **Bulk Operations** (Update multiple products at once)
- ✅ **Real-time Preview** (See changes immediately)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) + [React Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes (REST)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Validation**: Zod schemas

### Database
- **Database**: [PostgreSQL 15+](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Migrations**: Prisma Migrate

### File Storage
- **Options**: AWS S3, Cloudflare R2, or [UploadThing](https://uploadthing.com/)

### Optional Services
- **Caching**: Redis
- **Search**: Typesense or PostgreSQL Full-Text Search
- **Monitoring**: Sentry
- **Analytics**: Google Analytics

---

## 📁 Project Structure

```
WS-Computer-City/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed data
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (main)/            # Public pages
│   │   ├── admin/             # Admin dashboard
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── products/          # Product-related components
│   │   ├── categories/        # Category components
│   │   └── admin/             # Admin components
│   ├── lib/                   # Utilities
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   └── validations/       # Zod schemas
│   ├── services/              # Business logic
│   ├── types/                 # TypeScript types
│   └── hooks/                 # React hooks
├── docs/                      # Documentation
│   ├── API_STRUCTURE.md       # API documentation
│   ├── FOLDER_STRUCTURE.md    # Project structure
│   ├── DATA_FLOW.md           # How data flows
│   └── BEST_PRACTICES.md      # Scaling & best practices
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 15+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/WShuvro/WS-Computer-City.git
cd WS-Computer-City
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your database connection string and other credentials.

4. **Set up the database**
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed sample data
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First-Time Setup

1. **Create Admin User**
```typescript
// Run this in Prisma Studio or via seed script
await prisma.user.create({
  data: {
    email: 'admin@example.com',
    name: 'Admin',
    password: await bcrypt.hash('your-secure-password', 10),
    role: 'ADMIN'
  }
});
```

2. **Access Admin Panel**
- Navigate to `/admin/login`
- Log in with your admin credentials
- Start creating categories and products!

---

## 📖 Documentation

- **[API Structure](docs/API_STRUCTURE.md)** - Complete API documentation
- **[Database Design](prisma/schema.prisma)** - Database schema and ER diagram
- **[Data Flow](docs/DATA_FLOW.md)** - How CMS → DB → Website works
- **[Best Practices](docs/BEST_PRACTICES.md)** - Scaling, optimization, security

---

## 🗄️ Database Schema Overview

### Core Tables
- **users** - Admin users and authentication
- **categories** - Self-referencing tree structure
- **brands** - Product brands (Intel, AMD, etc.)
- **products** - Main product data
- **product_images** - Multiple images per product
- **specification_definitions** - Define specs per category
- **product_specifications** - Actual spec values per product
- **filterable_specifications** - Pre-computed filter cache

### Key Design Decisions

**1. Dynamic Specifications System**
- Different products have different specs (Processor vs SSD vs Graphics Card)
- `specification_definitions` defines what specs a category has
- `product_specifications` stores actual values
- Completely flexible - no schema changes needed

**2. Category Tree (Unlimited Nesting)**
- Self-referencing parent-child relationship
- Supports: Desktop → Components → Processor → Intel
- `level` field for easy querying

**3. Optimized for Filtering**
- Indexed fields for fast queries
- `filterable_specifications` table for pre-computed filter counts
- Efficient price range queries with Decimal type

---

## 🔧 Development Workflow

### Creating a New Category

1. Go to `/admin/categories`
2. Click "New Category"
3. Fill in: Name, Slug, Parent (optional), Image
4. Click "Create"
5. Define specifications for this category (e.g., "Socket", "Cores", "TDP")

### Adding a Product

1. Go to `/admin/products`
2. Click "New Product"
3. Fill in basic details:
   - Name, SKU, Price
   - Category (triggers spec fields)
   - Brand
   - Stock status
4. Upload images (drag & drop)
5. Fill in specifications (auto-generated based on category)
6. Click "Create"
7. Product immediately appears on website!

### Testing the Flow

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Watch database in Prisma Studio
npm run db:studio

# Create product in admin panel
# → Check Prisma Studio (data saved)
# → Visit /products (product visible)
# → Apply filters (filtering works)
```

---

## 🚢 Deployment

### Option 1: Vercel + Railway (Recommended)

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Database (Railway):**
1. Create account on [Railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string
4. Add to Vercel environment variables
5. Run migrations: `npm run db:migrate:prod`

**Total Cost**: ~$10-20/month

### Option 2: Docker (Self-Hosted)

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/wscomputercity
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: wscomputercity
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Post-Deployment Checklist
- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Create admin user
- [ ] Test all API endpoints
- [ ] Verify image uploads
- [ ] Set up monitoring (Sentry)
- [ ] Configure CDN for images
- [ ] Set up automated backups
- [ ] Add custom domain
- [ ] Enable HTTPS

---

## 🔐 Security

- **Authentication**: NextAuth.js with secure session handling
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Zod schemas on all API routes
- **SQL Injection**: Prevented by Prisma (parameterized queries)
- **XSS Protection**: React's built-in escaping
- **CSRF**: Next.js built-in protection
- **Rate Limiting**: Implement with Upstash or Redis
- **Environment Variables**: Never commit `.env` file

---

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm run test
```

---

## 📈 Performance Optimization

### Built-in Optimizations
- ✅ Next.js Automatic Code Splitting
- ✅ Image Optimization (next/image)
- ✅ Font Optimization (next/font)
- ✅ Incremental Static Regeneration (ISR)

### Recommended Optimizations
1. **Enable Redis Caching** (see [Best Practices](docs/BEST_PRACTICES.md))
2. **Use CDN for Images** (Cloudflare, AWS CloudFront)
3. **Implement Search** (Typesense recommended)
4. **Database Indexing** (already configured in schema)
5. **Enable Compression** (gzip/brotli)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**WShuvro**
- GitHub: [@WShuvro](https://github.com/WShuvro)

---

## 🙏 Acknowledgments

- Inspired by [Techland BD](https://www.techlandbd.com/)
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM by [Prisma](https://www.prisma.io/)

---

## 📞 Support

For questions or support:
- Open an [Issue](https://github.com/WShuvro/WS-Computer-City/issues)
- Email: [your-email@example.com]

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Product catalog
- [x] Category navigation
- [x] Admin CMS
- [x] Product filtering
- [ ] Shopping cart
- [ ] Checkout flow

### Phase 2: E-commerce
- [ ] Payment gateway integration (SSL Commerz, bKash)
- [ ] Order management
- [ ] Customer accounts
- [ ] Email notifications
- [ ] Invoice generation

### Phase 3: Advanced Features
- [ ] Product reviews and ratings
- [ ] Wishlist
- [ ] Product comparison
- [ ] Live chat support
- [ ] Advanced analytics
- [ ] Inventory management
- [ ] Multi-vendor support

### Phase 4: Mobile App
- [ ] React Native mobile app
- [ ] Push notifications
- [ ] Offline mode

---

## 💡 Why This Architecture?

### Scalable Database Design
- Supports unlimited categories (tree structure)
- Dynamic specifications (no schema changes needed)
- Optimized for filtering (indexed fields, cache table)
- Can handle 100K+ products easily

### Modern Tech Stack
- **Next.js**: Best React framework, excellent SEO, great DX
- **Prisma**: Type-safe ORM, easy migrations, excellent tooling
- **TypeScript**: Catch errors at compile time, better IDE support
- **Tailwind CSS**: Rapid UI development, consistent design
- **shadcn/ui**: Beautiful components, fully customizable

### Production-Ready
- Clean architecture (service layer, repository pattern)
- Proper error handling and validation
- Comprehensive documentation
- Security best practices
- Performance optimized
- Easy to maintain and extend

---

**Built with ❤️ for the Bangladesh tech community**
