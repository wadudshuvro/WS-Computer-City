import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';
import { productFilterSchema } from '@/lib/validations/product.schema';
import { ZodError } from 'zod';

/**
 * GET /api/products
 * Public endpoint to get products with filters
 */
export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
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

    // Parse dynamic specification filters (e.g., ?socket_type=LGA1700&cores=8)
    const specs: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      // Skip known filter keys
      const knownKeys = ['category', 'brand', 'minPrice', 'maxPrice', 'stockStatus', 'search', 'sort', 'page', 'limit'];
      if (!knownKeys.includes(key)) {
        specs[key] = value;
      }
    });

    if (Object.keys(specs).length > 0) {
      filters.specs = specs;
    }

    // Validate filters
    const validated = productFilterSchema.parse(filters);

    // Get products
    const result = await ProductService.getFiltered(validated);

    // Get available filters for sidebar
    const availableFilters = await this.getAvailableFilters(validated.category);

    return NextResponse.json({
      data: result.products,
      pagination: result.pagination,
      filters: availableFilters,
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
 * Helper: Get available filters for a category
 */
async function getAvailableFilters(categorySlug?: string) {
  const { prisma } = await import('@/lib/prisma');

  const where = categorySlug
    ? {
        category: { slug: categorySlug },
        isActive: true,
      }
    : { isActive: true };

  // Get brands with product counts
  const brands = await prisma.brand.findMany({
    where: {
      products: {
        some: where,
      },
    },
    select: {
      slug: true,
      name: true,
      _count: {
        select: {
          products: {
            where,
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  // Get price range
  const priceRange = await prisma.product.aggregate({
    where,
    _min: { price: true },
    _max: { price: true },
  });

  // Get stock statuses with counts
  const stockStatuses = await prisma.product.groupBy({
    by: ['stockStatus'],
    where,
    _count: true,
  });

  // Get filterable specifications
  let specifications = [];
  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        specificationDefinitions: {
          where: { isFilterable: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (category) {
      specifications = await Promise.all(
        category.specificationDefinitions.map(async (def) => {
          const values = await prisma.productSpecification.groupBy({
            by: ['value'],
            where: {
              specificationDefinitionId: def.id,
              product: where,
            },
            _count: true,
            orderBy: { _count: { value: 'desc' } },
          });

          return {
            key: def.key,
            name: def.name,
            unit: def.unit,
            values: values.map((v) => ({
              value: v.value,
              count: v._count,
            })),
          };
        })
      );
    }
  }

  return {
    brands: brands.map((b) => ({
      slug: b.slug,
      name: b.name,
      count: b._count.products,
    })),
    priceRange: {
      min: priceRange._min.price ? Number(priceRange._min.price) : 0,
      max: priceRange._max.price ? Number(priceRange._max.price) : 0,
    },
    stockStatuses: stockStatuses.map((s) => ({
      status: s.stockStatus,
      count: s._count,
    })),
    specifications,
  };
}
