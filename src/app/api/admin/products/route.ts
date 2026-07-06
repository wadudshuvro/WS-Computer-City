import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ProductService } from '@/services/product.service';
import { createProductSchema, productFilterSchema } from '@/lib/validations/product.schema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

/**
 * GET /api/admin/products
 * Get all products with filters (admin view)
 * Note: Auth check temporarily disabled for testing
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication - TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: { code: 'UNAUTHORIZED', message: 'You must be an admin to access this resource' } },
    //     { status: 401 }
    //   );
    // }

    // Parse and validate query parameters
    const searchParams = req.nextUrl.searchParams;
    
    const categorySlug = ProductService.resolveCategorySlug(
      searchParams.get('sub'),
      searchParams.get('category'),
      searchParams.get('type')
    );
    
    const filters = {
      category: categorySlug,
      brand: searchParams.get('brand')?.split(',') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      stockStatus: searchParams.get('stockStatus')?.split(',') || undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    };

    const validated = productFilterSchema.parse(filters);

    // Get products - include child category products
    const result = await ProductService.getFilteredWithChildren(validated);

    return NextResponse.json({
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request parameters',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching products',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Create a new product
 * Note: Auth check temporarily disabled for testing
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication - TEMPORARILY DISABLED FOR TESTING
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: { code: 'UNAUTHORIZED', message: 'You must be an admin to access this resource' } },
    //     { status: 401 }
    //   );
    // }

    // Parse and validate request body
    const body = await req.json();
    
    // Debug: Log incoming request
    console.log('=== INCOMING PRODUCT CREATE REQUEST ===');
    console.log('categoryId:', body.categoryId);
    console.log('brandId:', body.brandId);
    console.log('slug:', body.slug);
    console.log('sku:', body.sku);
    console.log('price:', body.price, typeof body.price);
    console.log('images count:', body.images?.length);
    console.log('========================================');
    
    const validated = createProductSchema.parse(body);

    // Create product
    const product = await ProductService.create(validated);

    // Revalidate relevant pages
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);
    revalidatePath(`/categories/${product.category.slug}`);

    return NextResponse.json(
      {
        data: product,
        message: 'Product created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error('Validation Error:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid product data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    // Handle unique constraint errors (slug, sku)
    if (error?.code === 'P2002') {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_ERROR',
            message: `A product with this ${error.meta?.target?.[0]} already exists`,
          },
        },
        { status: 409 }
      );
    }

    // Handle foreign key constraint errors (invalid categoryId or brandId)
    if (error?.code === 'P2003') {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_REFERENCE',
            message: `Invalid reference: The specified ${error.meta?.field_name || 'category or brand'} does not exist`,
          },
        },
        { status: 400 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error?.message || 'An error occurred while creating the product',
        },
      },
      { status: 500 }
    );
  }
}
