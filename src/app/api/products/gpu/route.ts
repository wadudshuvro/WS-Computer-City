import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  buildGpuCategoryWhere,
  buildGpuFilterCounts,
  buildGpuSpecCondition,
  GPU_SPEC_FILTER_KEYS,
} from '@/lib/gpuFilterQuery';
import { resolveGpuChipsetBrand } from '@/lib/gpuFilterMappings';

/**
 * GET /api/products/gpu
 * Get graphics card products with Star Tech-style sidebar filtering
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 30;
    const sort = searchParams.get('sort') || 'default';
    const search = searchParams.get('search') || undefined;

    const sub = searchParams.get('sub');
    const type = searchParams.get('type');
    const stockStatuses = searchParams.get('stockStatus')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    const specFilters: Record<string, string[]> = {};
    GPU_SPEC_FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        specFilters[key] = value.split(',').filter(Boolean);
      }
    });

    const chipsetBrand = resolveGpuChipsetBrand(sub, type);
    const hasChipsetFilter = (specFilters.gpu_chipset?.length ?? 0) > 0;
    const categoryWhere = await buildGpuCategoryWhere(sub, type, {
      scopeAllGpus: hasChipsetFilter,
    });

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...categoryWhere,
    };

    if (stockStatuses.length > 0) {
      where.stockStatus = { in: stockStatuses as Prisma.EnumStockStatusFilter['in'] };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(maxPrice);
      }
    }

    if (search) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    if (Object.keys(specFilters).length > 0) {
      const specAndConditions: Prisma.ProductWhereInput[] = [];

      for (const [key, values] of Object.entries(specFilters)) {
        const condition = buildGpuSpecCondition(key, values);
        if (condition) {
          specAndConditions.push(condition);
        }
      }

      if (specAndConditions.length > 0) {
        where.AND = [...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), ...specAndConditions];
      }
    }

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

    const [products, total, priceAggregation, filterCounts] = await Promise.all([
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
      prisma.product.count({ where }),
      prisma.product.aggregate({
        where: {
          isActive: true,
          ...(await buildGpuCategoryWhere(sub, type)),
        },
        _min: { price: true },
        _max: { price: true },
      }),
      getFilterCounts(chipsetBrand, sub, type),
    ]);

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
          max: priceAggregation._max.price ? Number(priceAggregation._max.price) : 4600000,
        },
        counts: filterCounts,
      },
    });
  } catch (error) {
    console.error('Error fetching GPU products:', error);
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

async function getFilterCounts(
  brand: 'nvidia' | 'amd',
  sub?: string | null,
  type?: string | null
): Promise<Record<string, Record<string, number>>> {
  try {
    const baseWhere: Prisma.ProductWhereInput = {
      isActive: true,
      ...(await buildGpuCategoryWhere(sub, type)),
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

    const manufacturerCountsRaw = await prisma.product.groupBy({
      by: ['brandId'],
      where: baseWhere,
      _count: true,
    });

    const brandIds = manufacturerCountsRaw.map((m) => m.brandId);
    const brands = await prisma.brand.findMany({
      where: { id: { in: brandIds } },
      select: { id: true, slug: true },
    });

    const manufacturerCounts: Record<string, number> = {};
    manufacturerCountsRaw.forEach((mc) => {
      const brandRecord = brands.find((b) => b.id === mc.brandId);
      if (brandRecord) {
        manufacturerCounts[brandRecord.slug] = mc._count;
      }
    });

    const specValuesByKey: Record<string, { value: string; count: number }[]> = {};

    for (const key of GPU_SPEC_FILTER_KEYS) {
      if (key === 'manufacturer') continue;

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

    return buildGpuFilterCounts(specValuesByKey, stockCounts, manufacturerCounts, brand);
  } catch (error) {
    console.error('Error getting GPU filter counts:', error);
    return {};
  }
}
