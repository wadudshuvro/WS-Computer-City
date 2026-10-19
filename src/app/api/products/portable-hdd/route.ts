import { NextRequest, NextResponse } from 'next/server';
import { guardCatalogRead } from '@/lib/rateLimit/http';
import { boundPageSize } from '@/lib/rateLimit/policies';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getPortableHddFilters } from '@/lib/filterConfig';
import { PORTABLE_HDD_SPEC_FILTER_KEYS } from '@/lib/portableHddSpecDefinitions';

async function categoryWhere(): Promise<Prisma.ProductWhereInput> {
  const category = await prisma.category.findFirst({ where: { slug: 'portable-hdd' } });
  return category ? { categoryId: category.id } : { category: { slug: 'portable-hdd' } };
}

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
    const where: Prisma.ProductWhereInput = { isActive: true, ...(await categoryWhere()) };
    if (brands.length > 0) where.brand = { slug: { in: brands } };
    if (stockStatuses.length > 0) where.stockStatus = { in: stockStatuses as Prisma.EnumStockStatusFilter['in'] };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = new Prisma.Decimal(minPrice);
      if (maxPrice !== undefined) where.price.lte = new Prisma.Decimal(maxPrice);
    }
    const specAnd: Prisma.ProductWhereInput[] = PORTABLE_HDD_SPEC_FILTER_KEYS.flatMap((key) => {
      const values = searchParams.get(key)?.split(',').filter(Boolean) || [];
      if (!values.length) return [];
      return [{
        OR: values.map((value) => ({
          specifications: {
            some: {
              specificationDefinition: { key },
              value: { equals: value, mode: 'insensitive' as const },
            },
          },
        })),
      }];
    });
    if (search) {
      specAnd.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      } as Prisma.ProductWhereInput);
    }
    if (specAnd.length) where.AND = specAnd;

    const [products, total, priceAggregation, counts] = await Promise.all([
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
        orderBy: { price: sort === 'price_desc' ? 'desc' : 'asc' },
      }),
      prisma.product.count({ where }),
      prisma.product.aggregate({
        where: { isActive: true, ...(await categoryWhere()) },
        _min: { price: true },
        _max: { price: true },
      }),
      filterCounts(brands),
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
          specificationDefinition: { key: spec.specificationDefinition.key, name: spec.specificationDefinition.name },
          value: spec.value,
        })),
      })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      filters: {
        priceRange: {
          min: priceAggregation._min.price ? Number(priceAggregation._min.price) : 0,
          max: priceAggregation._max.price ? Number(priceAggregation._max.price) : 200000,
        },
        counts,
      },
    });
  } catch (error) {
    console.error('Error fetching portable HDD products:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An error occurred while fetching products' } },
      { status: 500 }
    );
  }
}

async function filterCounts(brandSlugs: string[]) {
  const base: Prisma.ProductWhereInput = {
    isActive: true,
    ...(await categoryWhere()),
    ...(brandSlugs.length ? { brand: { slug: { in: brandSlugs } } } : {}),
  };
  const stockCounts: Record<string, number> = {};
  const brandCounts: Record<string, number> = {};
  const counts: Record<string, Record<string, number>> = { stockStatus: stockCounts, brand: brandCounts };
  const stock = await prisma.product.groupBy({ by: ['stockStatus'], where: base, _count: true });
  stock.forEach((row) => {
    stockCounts[row.stockStatus] = row._count;
  });
  const brandGroups = await prisma.product.groupBy({ by: ['brandId'], where: base, _count: true });
  const brands = await prisma.brand.findMany({
    where: { id: { in: brandGroups.map((row) => row.brandId) } },
    select: { id: true, slug: true },
  });
  brandGroups.forEach((row) => {
    const brand = brands.find((item) => item.id === row.brandId);
    if (brand) brandCounts[brand.slug] = row._count;
  });
  for (const filter of getPortableHddFilters()) {
    if (!filter.options || filter.key === 'brand' || filter.key === 'stockStatus') continue;
    const bucket: Record<string, number> = {};
    counts[filter.key] = bucket;
    const rows = await prisma.productSpecification.groupBy({
      by: ['value'],
      where: { specificationDefinition: { key: filter.key }, product: base },
      _count: true,
    });
    for (const option of filter.options) {
      bucket[option.value] = rows
        .filter((row) => row.value.toLowerCase() === option.value.toLowerCase())
        .reduce((sum, row) => sum + row._count, 0);
    }
  }
  return counts;
}
