import { NextRequest, NextResponse } from 'next/server';
import { guardCatalogRead } from '@/lib/rateLimit/http';
import { boundPageSize } from '@/lib/rateLimit/policies';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  buildHddCategoryWhere,
  buildHddFilterCounts,
  buildHddSpecCondition,
  HDD_SPEC_FILTER_KEYS,
} from '@/lib/hddFilterQuery';

export async function GET(req: NextRequest) {
  try {
    const limited = await guardCatalogRead(req);
    if (limited) return limited;
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = boundPageSize(Number(searchParams.get('limit')) || 30);
    const sort = searchParams.get('sort') || 'price_asc';
    const search = searchParams.get('search') || undefined;
    const brands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
    const stockStatuses = searchParams.get('stockStatus')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    const specFilters: Record<string, string[]> = {};
    HDD_SPEC_FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) specFilters[key] = value.split(',').filter(Boolean);
    });

    const categoryWhere = await buildHddCategoryWhere();
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...categoryWhere,
    };

    if (brands.length > 0) where.brand = { slug: { in: brands } };
    if (stockStatuses.length > 0) {
      where.stockStatus = { in: stockStatuses as Prisma.EnumStockStatusFilter['in'] };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = new Prisma.Decimal(minPrice);
      if (maxPrice !== undefined) where.price.lte = new Prisma.Decimal(maxPrice);
    }
    if (search) {
      where.AND = [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    const specConditions = Object.entries(specFilters)
      .map(([key, values]) => buildHddSpecCondition(key, values))
      .filter((condition): condition is Prisma.ProductWhereInput => Boolean(condition));
    if (specConditions.length > 0) {
      where.AND = [...(Array.isArray(where.AND) ? where.AND : []), ...specConditions];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'price_desc' ? { price: 'desc' } : { price: 'asc' };

    const [products, total, priceAggregation, filterCounts] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: { orderBy: { order: 'asc' } },
          specifications: { include: { specificationDefinition: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
      prisma.product.aggregate({
        where: { isActive: true, ...categoryWhere },
        _min: { price: true },
        _max: { price: true },
      }),
      getFilterCounts(brands),
    ]);

    return NextResponse.json({
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
        shortDescription: product.shortDescription,
        stockStatus: product.stockStatus,
        category: { name: product.category.name, slug: product.category.slug },
        brand: { name: product.brand.name, slug: product.brand.slug },
        images: product.images.map((img) => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary })),
        specifications: product.specifications.map((spec) => ({
          specificationDefinition: {
            key: spec.specificationDefinition.key,
            name: spec.specificationDefinition.name,
          },
          value: spec.value,
        })),
      })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      filters: {
        priceRange: {
          min: priceAggregation._min.price ? Number(priceAggregation._min.price) : 0,
          max: priceAggregation._max.price ? Number(priceAggregation._max.price) : 200000,
        },
        counts: filterCounts,
      },
    });
  } catch (error) {
    console.error('Error fetching HDD products:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching products' } },
      { status: 500 }
    );
  }
}

async function getFilterCounts(brandSlugs: string[]): Promise<Record<string, Record<string, number>>> {
  try {
    const baseWhere: Prisma.ProductWhereInput = {
      isActive: true,
      ...(await buildHddCategoryWhere()),
      ...(brandSlugs.length > 0 ? { brand: { slug: { in: brandSlugs } } } : {}),
    };

    const [stockCountsRaw, brandCountsRaw] = await Promise.all([
      prisma.product.groupBy({ by: ['stockStatus'], where: baseWhere, _count: true }),
      prisma.product.groupBy({ by: ['brandId'], where: baseWhere, _count: true }),
    ]);

    const stockCounts: Record<string, number> = {};
    stockCountsRaw.forEach((row) => {
      stockCounts[row.stockStatus] = row._count;
    });

    const brandRows = await prisma.brand.findMany({
      where: { id: { in: brandCountsRaw.map((row) => row.brandId) } },
      select: { id: true, slug: true },
    });
    const brandCounts: Record<string, number> = {};
    brandCountsRaw.forEach((row) => {
      const brand = brandRows.find((item) => item.id === row.brandId);
      if (brand) brandCounts[brand.slug] = row._count;
    });

    const specValuesByKey: Record<string, { value: string; count: number }[]> = {};
    for (const key of HDD_SPEC_FILTER_KEYS) {
      const specCounts = await prisma.productSpecification.groupBy({
        by: ['value'],
        where: { specificationDefinition: { key }, product: baseWhere },
        _count: true,
      });
      specValuesByKey[key] = specCounts.map((row) => ({ value: row.value, count: row._count }));
    }

    return buildHddFilterCounts(specValuesByKey, stockCounts, brandCounts);
  } catch (error) {
    console.error('Error getting HDD filter counts:', error);
    return {};
  }
}
