# Data Flow: CMS → Database → Website

This document explains how data flows from the Admin CMS to the database and finally appears on the website.

---

## 1. CATEGORY CREATION FLOW

### Step 1: Admin Creates Category

**Admin Action:**
- Admin navigates to `/admin/categories/new`
- Fills form: Name, Slug, Description, Parent Category, Image
- Clicks "Create Category"

**Frontend:**
```typescript
// app/admin/categories/new/page.tsx
const handleSubmit = async (data: CategoryFormData) => {
  const response = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  // Redirect to category list
};
```

**Backend API:**
```typescript
// app/api/admin/categories/route.ts
export async function POST(req: Request) {
  // 1. Validate admin authentication
  const user = await getServerSession();
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  // 2. Validate request body
  const body = await req.json();
  const validated = categorySchema.parse(body);
  
  // 3. Call service layer
  const category = await CategoryService.create(validated);
  
  return NextResponse.json({ data: category }, { status: 201 });
}
```

**Service Layer:**
```typescript
// services/category.service.ts
export class CategoryService {
  static async create(data: CreateCategoryDTO) {
    // Calculate level based on parent
    let level = 0;
    if (data.parentId) {
      const parent = await CategoryRepository.findById(data.parentId);
      level = parent.level + 1;
    }
    
    // Create category
    return await CategoryRepository.create({
      ...data,
      level
    });
  }
}
```

**Repository Layer:**
```typescript
// repositories/category.repository.ts
export class CategoryRepository {
  static async create(data: CreateCategoryData) {
    return await prisma.category.create({
      data,
      include: {
        parent: true,
        children: true
      }
    });
  }
}
```

**Database:**
```sql
INSERT INTO categories (id, name, slug, parent_id, level, created_at, updated_at)
VALUES ('cat_123', 'Processors', 'processors', 'cat_parent', 2, NOW(), NOW());
```

### Step 2: Category Appears on Website

**Frontend Query:**
```typescript
// app/(main)/categories/[slug]/page.tsx
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await fetch(`/api/categories/${params.slug}`);
  const data = await category.json();
  
  return <CategoryView category={data.category} products={data.products} />;
}
```

**Public API:**
```typescript
// app/api/categories/[slug]/route.ts
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const category = await CategoryService.getBySlugWithProducts(params.slug);
  
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
  
  return NextResponse.json({ data: category });
}
```

**Result:**
- Category immediately visible at `/categories/processors`
- Appears in mega menu navigation
- Shows all assigned products

---

## 2. PRODUCT CREATION FLOW

### Step 1: Admin Prepares Data

**Admin navigates to `/admin/products/new`:**

1. **Selects Category** → Triggers specification loading
```typescript
// When category is selected, fetch its specification definitions
const handleCategoryChange = async (categoryId: string) => {
  const specs = await fetch(`/api/admin/categories/${categoryId}/specifications`);
  const definitions = await specs.json();
  
  // Dynamically render specification input fields
  setSpecificationFields(definitions.data);
};
```

2. **Fills Product Details:**
   - Name: "Intel Core i5-12400F"
   - SKU: "PROC-INTEL-12400F"
   - Price: 24,100 BDT
   - Compare at Price: 27,390 BDT
   - Stock Status: IN_STOCK
   - Stock Quantity: 50
   - Category: Processors (selected above)
   - Brand: Intel

3. **Uploads Images:**
   - Drag & drop images
   - Mark one as primary
   - Set order

4. **Fills Specifications** (based on category):
   - Socket: LGA1700
   - Cores: 6
   - Threads: 12
   - Base Clock: 2.5 GHz
   - Boost Clock: 4.4 GHz
   - Cache: 18 MB
   - TDP: 65W

### Step 2: Form Submission

**Frontend:**
```typescript
// components/admin/ProductForm.tsx
const handleSubmit = async (formData: ProductFormData) => {
  // 1. Upload images first
  const uploadedImages = await uploadImages(formData.imageFiles);
  
  // 2. Prepare payload
  const payload = {
    name: formData.name,
    slug: formData.slug,
    sku: formData.sku,
    description: formData.description,
    price: formData.price,
    compareAtPrice: formData.compareAtPrice,
    stockStatus: formData.stockStatus,
    stockQuantity: formData.stockQuantity,
    categoryId: formData.categoryId,
    brandId: formData.brandId,
    images: uploadedImages.map((img, index) => ({
      url: img.url,
      alt: formData.name,
      order: index,
      isPrimary: index === 0
    })),
    specifications: formData.specifications.map(spec => ({
      specificationDefinitionId: spec.definitionId,
      value: spec.value
    })),
    metaTitle: formData.metaTitle,
    metaDescription: formData.metaDescription,
    isFeatured: formData.isFeatured,
    isActive: true
  };
  
  // 3. Create product
  const response = await fetch('/api/admin/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (response.ok) {
    toast.success('Product created successfully!');
    router.push('/admin/products');
  }
};
```

**Backend API:**
```typescript
// app/api/admin/products/route.ts
export async function POST(req: Request) {
  const user = await getServerSession();
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  const body = await req.json();
  
  // Validate with Zod
  const validated = productSchema.parse(body);
  
  // Create product via service
  const product = await ProductService.create(validated);
  
  // Revalidate cache (Next.js)
  revalidatePath('/products');
  revalidatePath(`/categories/${product.category.slug}`);
  
  return NextResponse.json({ data: product }, { status: 201 });
}
```

**Service Layer:**
```typescript
// services/product.service.ts
export class ProductService {
  static async create(data: CreateProductDTO) {
    // Use transaction for data integrity
    return await prisma.$transaction(async (tx) => {
      // 1. Create product
      const product = await tx.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          description: data.description,
          price: data.price,
          compareAtPrice: data.compareAtPrice,
          stockStatus: data.stockStatus,
          stockQuantity: data.stockQuantity,
          categoryId: data.categoryId,
          brandId: data.brandId,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          publishedAt: new Date()
        }
      });
      
      // 2. Create images
      if (data.images?.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map(img => ({
            productId: product.id,
            url: img.url,
            alt: img.alt,
            order: img.order,
            isPrimary: img.isPrimary
          }))
        });
      }
      
      // 3. Create specifications
      if (data.specifications?.length > 0) {
        await tx.productSpecification.createMany({
          data: data.specifications.map(spec => ({
            productId: product.id,
            specificationDefinitionId: spec.specificationDefinitionId,
            value: spec.value
          }))
        });
      }
      
      // 4. Update filterable specs cache (optional, for performance)
      await this.updateFilterCache(tx, product.id, data.specifications);
      
      return product;
    });
  }
  
  private static async updateFilterCache(tx: any, productId: string, specs: any[]) {
    // Update FilterableSpecification table for faster filtering
    for (const spec of specs) {
      const definition = await tx.specificationDefinition.findUnique({
        where: { id: spec.specificationDefinitionId }
      });
      
      if (definition.isFilterable) {
        await tx.filterableSpecification.upsert({
          where: {
            key_value_categoryId: {
              key: definition.key,
              value: spec.value,
              categoryId: definition.categoryId
            }
          },
          update: {
            count: { increment: 1 }
          },
          create: {
            key: definition.key,
            value: spec.value,
            categoryId: definition.categoryId,
            count: 1
          }
        });
      }
    }
  }
}
```

### Step 3: Product Appears on Website

**Immediately available at:**
1. **Product List Page:** `/products`
2. **Category Page:** `/categories/processors`
3. **Product Detail Page:** `/products/intel-core-i5-12400f`
4. **Search Results:** When user searches "i5"

**Product Detail Page Rendering:**
```typescript
// app/(main)/products/[slug]/page.tsx
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.slug}`);
  const { data } = await product.json();
  
  return (
    <div>
      <Breadcrumb path={data.category.breadcrumb} />
      <ProductImageGallery images={data.images} />
      <ProductDetails product={data} />
      <SpecificationTable specs={data.specifications} />
    </div>
  );
}
```

---

## 3. FILTERING FLOW (User Searches for Products)

### User Journey:
1. User navigates to `/categories/processors`
2. Applies filters:
   - Brand: Intel
   - Socket: LGA1700
   - Price: 20,000 - 30,000 BDT
   - Stock: In Stock only

### Frontend:
```typescript
// components/products/ProductFilters.tsx
const handleFilterChange = (filters: FilterState) => {
  const searchParams = new URLSearchParams();
  
  if (filters.brands.length > 0) {
    searchParams.set('brand', filters.brands.join(','));
  }
  
  if (filters.specs.socket_type) {
    searchParams.set('socket_type', filters.specs.socket_type);
  }
  
  if (filters.minPrice) {
    searchParams.set('minPrice', filters.minPrice.toString());
  }
  
  if (filters.maxPrice) {
    searchParams.set('maxPrice', filters.maxPrice.toString());
  }
  
  if (filters.stockStatus.length > 0) {
    searchParams.set('stockStatus', filters.stockStatus.join(','));
  }
  
  // Update URL
  router.push(`/categories/${categorySlug}?${searchParams.toString()}`);
};
```

### Backend Query:
```typescript
// services/product.service.ts
export class ProductService {
  static async getFiltered(filters: ProductFilters) {
    const where: any = {
      isActive: true
    };
    
    // Category filter
    if (filters.category) {
      where.category = {
        slug: filters.category
      };
    }
    
    // Brand filter
    if (filters.brands?.length > 0) {
      where.brand = {
        slug: { in: filters.brands }
      };
    }
    
    // Price filter
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    
    // Stock status filter
    if (filters.stockStatus?.length > 0) {
      where.stockStatus = { in: filters.stockStatus };
    }
    
    // Specification filters (complex)
    if (filters.specs && Object.keys(filters.specs).length > 0) {
      where.specifications = {
        some: {
          AND: Object.entries(filters.specs).map(([key, value]) => ({
            specificationDefinition: { key },
            value
          }))
        }
      };
    }
    
    // Execute query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: { where: { isPrimary: true } }
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: this.getSortOrder(filters.sort)
      }),
      prisma.product.count({ where })
    ]);
    
    return {
      products,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        pages: Math.ceil(total / filters.limit)
      }
    };
  }
}
```

### Result:
- Filtered products displayed instantly
- Filter counts updated dynamically
- URL reflects current filter state (shareable)

---

## 4. SPECIFICATION MANAGEMENT FLOW

### Why Dynamic Specifications?

Different product categories have different specs:
- **Processors**: Socket, Cores, Threads, Cache
- **Graphics Cards**: VRAM, CUDA Cores, Clock Speed
- **SSDs**: Capacity, Read Speed, Write Speed, Form Factor

Instead of hardcoding columns, we use a flexible system:

### Admin Sets Up Specs for Category:

**Step 1: Define Specifications**
```typescript
// Admin goes to /admin/categories/processors/specifications
// Adds specifications:
[
  { name: "Socket Type", key: "socket_type", dataType: "TEXT", isFilterable: true },
  { name: "Core Count", key: "core_count", dataType: "NUMBER", unit: "cores", isFilterable: true },
  { name: "Thread Count", key: "thread_count", dataType: "NUMBER", unit: "threads" },
  { name: "Base Clock", key: "base_clock", dataType: "NUMBER", unit: "GHz" },
  { name: "Cache", key: "cache", dataType: "NUMBER", unit: "MB", isFilterable: true },
  { name: "TDP", key: "tdp", dataType: "NUMBER", unit: "W" }
]
```

**Step 2: Add Product**
- When admin selects "Processors" category
- Form dynamically shows these specification fields
- Admin fills values for THIS specific product

**Database Storage:**
```sql
-- specification_definitions (per category)
id: spec_def_1
category_id: cat_processors
name: "Socket Type"
key: "socket_type"
data_type: TEXT
is_filterable: true

-- product_specifications (per product)
id: prod_spec_1
product_id: prod_123
specification_definition_id: spec_def_1
value: "LGA1700"
```

**Website Display:**
```typescript
// Specifications are fetched with product
{
  specifications: [
    { key: "socket_type", name: "Socket Type", value: "LGA1700", unit: null },
    { key: "core_count", name: "Core Count", value: "6", unit: "cores" },
    { key: "thread_count", name: "Thread Count", value: "12", unit: "threads" },
    { key: "base_clock", name: "Base Clock", value: "2.5", unit: "GHz" },
    { key: "cache", name: "Cache", value: "18", unit: "MB" },
    { key: "tdp", name: "TDP", value: "65", unit: "W" }
  ]
}
```

---

## 5. REAL-TIME UPDATES

### Cache Invalidation Strategy:

**After product creation/update:**
```typescript
// Next.js revalidation
revalidatePath('/products');
revalidatePath(`/products/${product.slug}`);
revalidatePath(`/categories/${product.category.slug}`);

// Or with Redis
await redis.del(`product:${productId}`);
await redis.del(`category:${categoryId}:products`);
```

**Result:**
- Product appears immediately on website
- No manual refresh needed
- Incremental Static Regeneration (ISR) keeps pages fast

---

## SUMMARY

```
ADMIN CREATES PRODUCT
        ↓
  Validation (Zod)
        ↓
  Service Layer (business logic)
        ↓
  Repository Layer (Prisma)
        ↓
  DATABASE (PostgreSQL)
        ↓
  Cache Invalidation
        ↓
  WEBSITE UPDATED (user sees new product)
```

**Key Benefits:**
1. **Type Safety**: TypeScript end-to-end
2. **Data Integrity**: Database transactions
3. **Flexibility**: Dynamic specifications
4. **Performance**: Cached queries, indexed filters
5. **Scalability**: Layered architecture
6. **Real-time**: Instant updates via cache invalidation
