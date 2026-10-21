import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { ProductService } from '@/services/product.service';
import { productFilterSchema } from '@/lib/validations/product.schema';
import { guardCatalogRead } from '@/lib/rateLimit/http';
import { boundPageSize } from '@/lib/rateLimit/policies';
import { ZodError } from 'zod';
import { WATCH_FILTER_KEYS } from '@/lib/watchFilters';
import { GADGET_FILTER_KEYS, findGadgetLeaf } from '@/lib/gadgetCatalog';
import { MONITOR_FILTER_KEYS } from '@/lib/monitorFilters';
import { ROUTER_FILTER_KEYS } from '@/lib/routerFilters';
import { UPS_FILTER_KEYS } from '@/lib/upsCatalog';
import { toPublicProduct } from '@/lib/publicProduct';

/**
 * GET /api/products
 * Public endpoint to get products with filters
 */
export async function GET(req: NextRequest) {
  try {
    const limited = await guardCatalogRead(req);
    if (limited) return limited;
    const searchParams = req.nextUrl.searchParams;

    const categorySlug = ProductService.resolveCategorySlug(
      searchParams.get('sub'),
      searchParams.get('category'),
      searchParams.get('type')
    );
    
    const filters: Record<string, unknown> = {
      category: categorySlug,
      brand: searchParams.get('brand')?.split(',') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      stockStatus: searchParams.get('stockStatus')?.split(',') || undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || 'price_asc',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: boundPageSize(searchParams.get('limit') ? Number(searchParams.get('limit')) : 20),
    };

    // Parse dynamic specification filters (e.g., ?socket_type=LGA1700&cores=8)
    const specs: Record<string, string> = {};
    const knownKeys = ['category', 'sub', 'type', 'brand', 'minPrice', 'maxPrice', 'stockStatus', 'search', 'sort', 'page', 'limit'];
    searchParams.forEach((value, key) => {
      if (!knownKeys.includes(key)) {
        specs[key] = value;
      }
    });

    if (Object.keys(specs).length > 0) {
      filters.specs = specs;
    }

    const validated = productFilterSchema.parse(filters);

    const result = await ProductService.getFilteredWithChildren(validated);

    const availableFilters = await getAvailableFilters(
      validated.category,
      searchParams.get('brand')?.split(',').filter(Boolean)[0]
    );

    return NextResponse.json({
      data: result.products.map(toPublicProduct),
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
async function getAvailableFilters(categorySlug?: string, brandSlug?: string) {
  const { prisma } = await import('@/lib/prisma');

  let where: Prisma.ProductWhereInput = { isActive: true };
  let brandCountWhere: Prisma.ProductWhereInput = { isActive: true };

  if (categorySlug) {
    const ids = await ProductService.getCategoryDescendantIds(categorySlug);
    const placement: Prisma.ProductWhereInput =
      ids.length > 0
        ? {
            OR: [
              { categoryId: { in: ids } },
              { listings: { some: { categoryId: { in: ids } } } },
            ],
          }
        : { category: { slug: categorySlug } };
    where = { isActive: true, AND: [placement] };
    brandCountWhere = { isActive: true, AND: [placement] };
  }

  if (brandSlug) {
    where = { ...where, brand: { slug: brandSlug } };
  }

  const brands = await prisma.brand.findMany({
    where: {
      products: {
        some: brandCountWhere,
      },
    },
    select: {
      slug: true,
      name: true,
      _count: {
        select: {
          products: {
            where: brandCountWhere,
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
  let specifications: unknown[] = [];
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

  const stockCounts: Record<string, number> = {};
  stockStatuses.forEach((row) => {
    stockCounts[row.stockStatus] = row._count;
  });
  const brandCounts: Record<string, number> = {};
  brands.forEach((brand) => {
    brandCounts[brand.slug] = brand._count.products;
  });

  const facetCounts: Record<string, Record<string, number>> = {};
  if (
    categorySlug === 'watch' ||
    categorySlug === 'gadget' ||
    categorySlug === 'monitor' ||
    categorySlug === 'router' ||
    categorySlug === 'ups' ||
    findGadgetLeaf(categorySlug)
  ) {
    const keys =
      categorySlug === 'watch'
        ? [...WATCH_FILTER_KEYS]
        : categorySlug === 'monitor'
          ? [...MONITOR_FILTER_KEYS]
          : categorySlug === 'router'
            ? [...ROUTER_FILTER_KEYS]
            : categorySlug === 'ups'
              ? [...UPS_FILTER_KEYS]
              : [...GADGET_FILTER_KEYS, ...WATCH_FILTER_KEYS];
    const rows = await prisma.productSpecification.findMany({
      where: {
        product: where,
        specificationDefinition: { key: { in: keys } },
      },
      select: { value: true, specificationDefinition: { select: { key: true } } },
    });
    for (const row of rows) {
      const key = row.specificationDefinition.key;
      facetCounts[key] = facetCounts[key] || {};
      for (const part of row.value.split('|')) {
        const label = part.trim();
        if (!label) continue;
        facetCounts[key][label] = (facetCounts[key][label] || 0) + 1;
      }
    }
  }

  return {
    brands: brands.map((b) => ({
      slug: b.slug,
      name: b.name,
      count: b._count.products,
    })),
    counts: {
      stockStatus: stockCounts,
      brand: brandCounts,
      ...facetCounts,
    },
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
