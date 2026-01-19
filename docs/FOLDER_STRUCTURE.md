# Project Folder Structure

```
WS-Computer-City/
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Database migrations
│   └── seed.ts                    # Seed data for development
│
├── src/
│   │
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Auth routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (main)/                # Public-facing pages
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── layout.tsx         # Main layout
│   │   │   ├── products/
│   │   │   │   ├── page.tsx       # Product listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Product details
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Category page
│   │   │   └── brands/
│   │   │       └── [slug]/
│   │   │           └── page.tsx   # Brand page
│   │   │
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── layout.tsx         # Admin layout
│   │   │   ├── page.tsx           # Admin dashboard
│   │   │   ├── products/
│   │   │   │   ├── page.tsx       # Product list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx   # Create product
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Edit product
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── brands/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   └── specifications/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                   # API Routes
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts   # NextAuth config
│   │       ├── products/
│   │       │   ├── route.ts       # GET /api/products
│   │       │   └── [slug]/
│   │       │       └── route.ts   # GET /api/products/:slug
│   │       ├── categories/
│   │       │   ├── route.ts
│   │       │   └── [slug]/
│   │       │       └── route.ts
│   │       ├── brands/
│   │       │   └── route.ts
│   │       ├── search/
│   │       │   └── route.ts
│   │       └── admin/
│   │           ├── products/
│   │           │   ├── route.ts
│   │           │   ├── [id]/
│   │           │   │   └── route.ts
│   │           │   └── bulk-update/
│   │           │       └── route.ts
│   │           ├── categories/
│   │           │   ├── route.ts
│   │           │   ├── [id]/
│   │           │   │   └── route.ts
│   │           │   └── [categoryId]/
│   │           │       └── specifications/
│   │           │           └── route.ts
│   │           ├── brands/
│   │           │   └── route.ts
│   │           └── upload/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── MegaMenu.tsx
│   │   │
│   │   ├── products/              # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── ProductImageGallery.tsx
│   │   │   └── SpecificationTable.tsx
│   │   │
│   │   ├── categories/            # Category components
│   │   │   ├── CategoryTree.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   └── Breadcrumb.tsx
│   │   │
│   │   └── admin/                 # Admin components
│   │       ├── Sidebar.tsx
│   │       ├── DataTable.tsx
│   │       ├── ProductForm.tsx
│   │       ├── CategoryForm.tsx
│   │       ├── SpecificationManager.tsx
│   │       └── ImageUploader.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth config
│   │   ├── utils.ts               # Utility functions
│   │   ├── validations/           # Zod schemas
│   │   │   ├── product.schema.ts
│   │   │   ├── category.schema.ts
│   │   │   └── user.schema.ts
│   │   └── constants.ts           # App constants
│   │
│   ├── services/                  # Business logic layer
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── brand.service.ts
│   │   ├── specification.service.ts
│   │   └── search.service.ts
│   │
│   ├── repositories/              # Data access layer
│   │   ├── product.repository.ts
│   │   ├── category.repository.ts
│   │   └── brand.repository.ts
│   │
│   ├── types/                     # TypeScript types
│   │   ├── product.types.ts
│   │   ├── category.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useProducts.ts
│   │   ├── useCategories.ts
│   │   ├── useFilters.ts
│   │   └── useDebounce.ts
│   │
│   └── middleware.ts              # Next.js middleware (auth, etc.)
│
├── public/
│   ├── images/
│   ├── icons/
│   └── uploads/                   # Uploaded product images
│
├── docs/
│   ├── API_STRUCTURE.md
│   ├── FOLDER_STRUCTURE.md
│   └── DATABASE_DESIGN.md
│
├── .env                           # Environment variables
├── .env.example                   # Example env file
├── next.config.js                 # Next.js config
├── tailwind.config.ts             # Tailwind config
├── tsconfig.json                  # TypeScript config
├── package.json
└── README.md
```

## Key Principles

### 1. Separation of Concerns
- **app/**: UI and routing (Next.js App Router)
- **services/**: Business logic (independent of framework)
- **repositories/**: Data access (Prisma queries)
- **components/**: Reusable UI components

### 2. Layered Architecture
```
API Route (app/api) 
  → Service Layer (services/) 
    → Repository Layer (repositories/) 
      → Database (Prisma)
```

### 3. Type Safety
- All API responses typed
- Zod validation schemas
- Prisma-generated types

### 4. Scalability
- Clear separation between public and admin routes
- Reusable components
- Service layer can be extracted to microservices later

### 5. Maintainability
- Consistent naming conventions
- Co-located components (products/, categories/)
- Centralized validation (lib/validations/)
