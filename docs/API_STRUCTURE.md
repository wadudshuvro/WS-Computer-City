# API Structure

## Base URL
```
Production: https://wscomputercity.com/api
Development: http://localhost:3000/api
```

## Authentication
- Admin routes require JWT token in Authorization header
- `Authorization: Bearer <token>`

---

## PUBLIC ENDPOINTS (User-facing)

### Categories

#### GET /api/categories
Get all categories (with tree structure)
```typescript
Query params:
  - includeProducts?: boolean (default: false)
  - level?: number (filter by level: 0=root only)
  
Response:
{
  data: [
    {
      id: string,
      name: string,
      slug: string,
      image: string | null,
      level: number,
      children: Category[] | null,
      _count: { products: number }
    }
  ]
}
```

#### GET /api/categories/:slug
Get single category with products
```typescript
Query params:
  - page?: number (default: 1)
  - limit?: number (default: 20)
  
Response:
{
  data: {
    category: Category,
    products: Product[],
    pagination: { total, page, limit, pages }
  }
}
```

---

### Products

#### GET /api/products
Get products with filters
```typescript
Query params:
  - category?: string (slug)
  - brand?: string[] (slugs)
  - minPrice?: number
  - maxPrice?: number
  - stockStatus?: StockStatus[]
  - specs?: object // e.g., { socket_type: "LGA1700", cores: "8" }
  - search?: string
  - sort?: "price_asc" | "price_desc" | "newest" | "name"
  - page?: number
  - limit?: number

Response:
{
  data: Product[],
  pagination: { total, page, limit, pages },
  filters: {
    brands: [{ slug, name, count }],
    priceRange: { min, max },
    stockStatuses: [{ status, count }],
    specifications: [
      { key, name, values: [{ value, count }] }
    ]
  }
}
```

#### GET /api/products/:slug
Get single product details
```typescript
Response:
{
  data: {
    id: string,
    name: string,
    slug: string,
    sku: string,
    description: string,
    price: number,
    compareAtPrice: number | null,
    stockStatus: StockStatus,
    stockQuantity: number,
    category: {
      id: string,
      name: string,
      slug: string,
      breadcrumb: Category[] // Full path: Desktop → Components → Processor
    },
    brand: {
      id: string,
      name: string,
      slug: string,
      logo: string
    },
    images: [
      { id, url, alt, isPrimary, order }
    ],
    specifications: [
      {
        key: string,
        name: string,
        value: string,
        unit: string | null
      }
    ],
    relatedProducts?: Product[]
  }
}
```

---

### Brands

#### GET /api/brands
Get all brands
```typescript
Query params:
  - includeProductCount?: boolean

Response:
{
  data: [
    {
      id: string,
      name: string,
      slug: string,
      logo: string | null,
      _count?: { products: number }
    }
  ]
}
```

---

### Search

#### GET /api/search
Global search
```typescript
Query params:
  - q: string (required)
  - category?: string
  - limit?: number

Response:
{
  data: {
    products: Product[],
    categories: Category[],
    brands: Brand[]
  }
}
```

---

## ADMIN ENDPOINTS (Protected)

### Admin Authentication

#### POST /api/admin/auth/login
Admin login
```typescript
Body:
{
  email: string,
  password: string
}

Response:
{
  user: { id, email, name, role },
  token: string
}
```

---

### Admin Categories

#### GET /api/admin/categories
Get all categories (admin view)
```typescript
Response:
{
  data: Category[] // with full tree + product counts
}
```

#### POST /api/admin/categories
Create category
```typescript
Body:
{
  name: string,
  slug: string,
  description?: string,
  image?: string,
  parentId?: string,
  order?: number,
  isActive?: boolean
}

Response:
{
  data: Category
}
```

#### PATCH /api/admin/categories/:id
Update category
```typescript
Body: Partial<Category>

Response:
{
  data: Category
}
```

#### DELETE /api/admin/categories/:id
Delete category (cascade deletes children)
```typescript
Response:
{
  success: boolean
}
```

---

### Admin Brands

#### POST /api/admin/brands
Create brand
```typescript
Body:
{
  name: string,
  slug: string,
  logo?: string,
  description?: string
}
```

#### PATCH /api/admin/brands/:id
Update brand

#### DELETE /api/admin/brands/:id
Delete brand

---

### Admin Products

#### GET /api/admin/products
Get all products (with filters)
```typescript
Query params:
  - status?: "active" | "inactive" | "draft"
  - stockStatus?: StockStatus
  - category?: string
  - brand?: string
  - search?: string
  - page?: number
  - limit?: number
```

#### POST /api/admin/products
Create product
```typescript
Body:
{
  name: string,
  slug: string,
  sku: string,
  description?: string,
  price: number,
  compareAtPrice?: number,
  stockStatus: StockStatus,
  stockQuantity: number,
  categoryId: string,
  brandId: string,
  images: [
    { url: string, alt?: string, isPrimary?: boolean, order?: number }
  ],
  specifications: [
    { specificationDefinitionId: string, value: string }
  ],
  metaTitle?: string,
  metaDescription?: string,
  isFeatured?: boolean,
  isActive?: boolean
}

Response:
{
  data: Product // with all relations
}
```

#### PATCH /api/admin/products/:id
Update product
```typescript
Body: Partial<Product> + images[] + specifications[]
```

#### DELETE /api/admin/products/:id
Delete product (soft delete recommended)

#### POST /api/admin/products/bulk-update
Bulk update products
```typescript
Body:
{
  productIds: string[],
  updates: {
    stockStatus?: StockStatus,
    isActive?: boolean,
    categoryId?: string,
    // ... other fields
  }
}
```

---

### Admin Specification Definitions

#### GET /api/admin/categories/:categoryId/specifications
Get specification definitions for a category

#### POST /api/admin/categories/:categoryId/specifications
Create specification definition
```typescript
Body:
{
  name: string,
  key: string, // e.g., "socket_type"
  dataType: DataType,
  unit?: string,
  isFilterable: boolean,
  isRequired: boolean,
  order?: number
}
```

#### PATCH /api/admin/specifications/:id
Update specification definition

#### DELETE /api/admin/specifications/:id
Delete specification definition

---

### Admin File Upload

#### POST /api/admin/upload
Upload images
```typescript
Body: FormData (multipart/form-data)
  - files: File[]

Response:
{
  data: [
    {
      url: string,
      filename: string,
      size: number
    }
  ]
}
```

---

## Error Responses

All errors follow this format:
```typescript
{
  error: {
    code: string, // e.g., "VALIDATION_ERROR", "NOT_FOUND"
    message: string,
    details?: any // Zod validation errors, etc.
  }
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
