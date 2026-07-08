import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  buildProcessorFilterCounts,
  buildProcessorSpecCondition,
  getDistinctProcessorSpecValues,
  PROCESSOR_SPEC_FILTER_KEYS,
} from '@/lib/processorFilterQuery';

/**
 * GET /api/products/processor
 * Get processor products with dynamic filtering
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Parse query parameters
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 30;
    const sort = searchParams.get('sort') || 'default';
    const search = searchParams.get('search') || undefined;

    // Standard filters
    const brands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
    const stockStatuses = searchParams.get('stockStatus')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    // Dynamic specification filters
    const specFilters: Record<string, string[]> = {};
    PROCESSOR_SPEC_FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        specFilters[key] = value.split(',').filter(Boolean);
      }
    });

    // Build where clause — brand filter takes precedence over sub tab
    const sub = searchParams.get('sub');
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (brands.length === 1) {
      where.category = { slug: brands[0] === 'amd' ? 'amd' : 'intel' };
    } else if (brands.length > 1) {
      where.category = { slug: { in: ['intel', 'amd'] } };
    } else if (sub === 'intel') {
      where.category = { slug: 'intel' };
    } else if (sub === 'amd' || sub === 'amd-ryzen') {
      where.category = { slug: 'amd' };
    } else {
      where.category = {
        OR: [
          { slug: 'processor' },
          { parent: { slug: 'processor' } },
          { slug: 'intel' },
          { slug: 'amd' },
        ],
      };
    }

    // Brand filter (redundant when single brand already scoped category, needed for multi-brand)
    if (brands.length > 0) {
      where.brand = {
        slug: { in: brands },
      };
    }

    // Stock status filter
    if (stockStatuses.length > 0) {
      where.stockStatus = { in: stockStatuses as any[] };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(maxPrice);
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Specification filters — AND between types, OR within type
    if (Object.keys(specFilters).length > 0) {
      const needsDistinct = specFilters.base_clock || specFilters.cache_size;
      const distinctSpecValues = needsDistinct
        ? await getDistinctProcessorSpecValues(
            ['base_clock', 'cache_size'].filter((k) => specFilters[k]),
            where
          )
        : {};

      const specAndConditions: Prisma.ProductWhereInput[] = [];

      for (const [key, values] of Object.entries(specFilters)) {
        const condition = buildProcessorSpecCondition(key, values, distinctSpecValues);
        if (condition) {
          specAndConditions.push(condition);
        }
      }

      if (specAndConditions.length > 0) {
        where.AND = [...(Array.isArray(where.AND) ? where.AND : []), ...specAndConditions];
      }
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Execute queries in parallel
    const [products, total, priceAggregation, filterCounts] = await Promise.all([
      // Get products
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: {
            orderBy: { order: 'asc' },
          },
          specifications: {
            include: {
              specificationDefinition: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      // Get total count
      prisma.product.count({ where }),
      // Get price range
      prisma.product.aggregate({
        where: {
          isActive: true,
          category: {
            OR: [
              { slug: 'processor' },
              { parent: { slug: 'processor' } },
            ],
          },
        },
        _min: { price: true },
        _max: { price: true },
      }),
      // Get filter counts
      getFilterCounts(),
    ]);

    // Format products for response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
      shortDescription: product.shortDescription,
      stockStatus: product.stockStatus,
      category: {
        name: product.category.name,
        slug: product.category.slug,
      },
      brand: {
        name: product.brand.name,
        slug: product.brand.slug,
      },
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
      })),
      specifications: product.specifications.map((spec) => ({
        specificationDefinition: {
          key: spec.specificationDefinition.key,
          name: spec.specificationDefinition.name,
        },
        value: spec.value,
      })),
    }));

    return NextResponse.json({
      data: formattedProducts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      filters: {
        priceRange: {
          min: priceAggregation._min.price ? Number(priceAggregation._min.price) : 0,
          max: priceAggregation._max.price ? Number(priceAggregation._max.price) : 1000000,
        },
        counts: filterCounts,
      },
    });
  } catch (error) {
    console.error('Error fetching processor products:', error);
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
 * Get counts for each filter option
 * These counts show how many products have each specification value
 */
async function getFilterCounts(): Promise<Record<string, Record<string, number>>> {
  try {
    const baseWhere: Prisma.ProductWhereInput = {
      isActive: true,
      category: {
        OR: [
          { slug: 'processor' },
          { parent: { slug: 'processor' } },
          { slug: 'intel' },
          { slug: 'amd' },
        ],
      },
    };

    const stockCountsRaw = await prisma.product.groupBy({
      by: ['stockStatus'],
      where: baseWhere,
      _count: true,
    });

    const stockCounts: Record<string, number> = {};
    stockCountsRaw.forEach((sc) => {
      stockCounts[sc.stockStatus] = sc._count;
    });

    const specValuesByKey: Record<string, { value: string; count: number }[]> = {};

    for (const key of PROCESSOR_SPEC_FILTER_KEYS) {
      const specCounts = await prisma.productSpecification.groupBy({
        by: ['value'],
        where: {
          specificationDefinition: { key },
          product: baseWhere,
        },
        _count: true,
      });

      specValuesByKey[key] = specCounts.map((sc) => ({
        value: sc.value,
        count: sc._count,
      }));
    }

    return buildProcessorFilterCounts(specValuesByKey, stockCounts);
  } catch (error) {
    console.error('Error getting filter counts:', error);
    return {};
  }
}
