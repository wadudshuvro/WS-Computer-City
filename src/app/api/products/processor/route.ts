import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
    const specKeys = [
      'number_of_cores',
      'processor_model',
      'number_of_threads',
      'generation',
      'base_clock',
      'socket_type',
      'cache_size',
      'processor_features',
    ];

    specKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        specFilters[key] = value.split(',').filter(Boolean);
      }
    });

    // Build where clause
    const where: Prisma.ProductWhereInput = {
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

    // Brand filter
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

    // Specification filters - build dynamic conditions
    // Use AND logic between different spec types, OR logic within same spec type
    if (Object.keys(specFilters).length > 0) {
      // Each spec type needs to have at least one matching value (AND between types)
      // Within each spec type, any of the selected values can match (OR within type)
      const specAndConditions: Prisma.ProductWhereInput[] = [];

      for (const [key, values] of Object.entries(specFilters)) {
        if (values.length > 0) {
          // For each spec type, the product must have a matching specification
          specAndConditions.push({
            specifications: {
              some: {
                specificationDefinition: { key },
                value: { in: values },
              },
            },
          });
        }
      }

      // Apply AND logic between different specification types
      if (specAndConditions.length > 0) {
        where.AND = specAndConditions;
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
  const counts: Record<string, Record<string, number>> = {};

  try {
    // Base where clause for processor products
    const baseWhere = {
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

    // Get brand counts
    const brandCounts = await prisma.product.groupBy({
      by: ['brandId'],
      where: baseWhere,
      _count: true,
    });

    const brands = await prisma.brand.findMany({
      where: { id: { in: brandCounts.map((b) => b.brandId) } },
      select: { id: true, slug: true },
    });

    counts['brand'] = {};
    brandCounts.forEach((bc) => {
      const brand = brands.find((b) => b.id === bc.brandId);
      if (brand) {
        counts['brand'][brand.slug] = bc._count;
      }
    });

    // Get stock status counts
    const stockCounts = await prisma.product.groupBy({
      by: ['stockStatus'],
      where: baseWhere,
      _count: true,
    });

    counts['stockStatus'] = {};
    stockCounts.forEach((sc) => {
      counts['stockStatus'][sc.stockStatus] = sc._count;
    });

    // Get specification value counts for all filter-relevant specs
    // These keys must match both the filter config and the specification definition keys
    const specKeys = [
      'number_of_cores',
      'processor_model',
      'number_of_threads',
      'generation',
      'socket_type',
      'cache_size',
      'tdp',
      'processor_features',
      'integrated_graphics',
      'memory_type',
    ];

    for (const key of specKeys) {
      const specCounts = await prisma.productSpecification.groupBy({
        by: ['value'],
        where: {
          specificationDefinition: { key },
          product: baseWhere,
        },
        _count: true,
      });

      counts[key] = {};
      specCounts.forEach((sc) => {
        // Handle multi-value specs (like processor_features which can be comma-separated)
        if (key === 'processor_features' && sc.value.includes(',')) {
          // Split comma-separated values and count each
          const features = sc.value.split(',').map(f => f.trim());
          features.forEach(feature => {
            counts[key][feature] = (counts[key][feature] || 0) + sc._count;
          });
        } else {
          counts[key][sc.value] = sc._count;
        }
      });
    }
  } catch (error) {
    console.error('Error getting filter counts:', error);
  }

  return counts;
}
