import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ProductService } from '@/services/product.service';
import { createProductSchema, productFilterSchema } from '@/lib/validations/product.schema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

/**
 * GET /api/admin/products
 * Get all products with filters (admin view)
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'You must be an admin to access this resource' } },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const searchParams = req.nextUrl.searchParams;
    const filters = {
      category: searchParams.get('category') || undefined,
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

    // Get products
    const result = await ProductService.getFiltered(validated);

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
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'You must be an admin to access this resource' } },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
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
  } catch (error) {
    if (error instanceof ZodError) {
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
    if (error.code === 'P2002') {
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

    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the product',
        },
      },
      { status: 500 }
    );
  }
}
