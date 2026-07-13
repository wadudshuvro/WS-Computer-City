import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getRamFilters } from '@/lib/filterConfig';
import {
  mapRamSizeFilterToDb,
  mapRamSpeedFilterToPatterns,
  ramSizeDbValueMatches,
  ramSpeedDbValueMatches,
  RAM_SPEC_FILTER_KEYS,
} from '@/lib/ramFilterMappings';

export async function buildRamCategoryWhere(
  sub?: string | null,
  type?: string | null
): Promise<Prisma.ProductWhereInput> {
  const raw = sub || type || null;
  const slug =
    raw === 'desktop-ram' || raw === 'ddr4-ram' || raw === 'ddr5-ram'
      ? 'desktop-ram'
      : raw === 'laptop-ram'
        ? 'laptop-ram'
        : raw === 'ram'
          ? 'ram'
          : null;

  if (!slug || slug === 'ram') {
    return {
      category: {
        OR: [
          { slug: 'ram' },
          { parent: { slug: 'ram' } },
          { slug: 'desktop-ram' },
          { slug: 'laptop-ram' },
        ],
      },
    };
  }

  const [category, parentCategory] = await Promise.all([
    prisma.category.findFirst({
      where: { slug },
      include: { children: true },
    }),
    prisma.category.findFirst({ where: { slug: 'ram' } }),
  ]);

  const categoryIds = category ? [category.id, ...category.children.map((c) => c.id)] : [];
  const orConditions: Prisma.ProductWhereInput[] = [];

  if (categoryIds.length > 0) {
    orConditions.push({ categoryId: { in: categoryIds } });
  }

  if (parentCategory && slug === 'desktop-ram') {
    orConditions.push({ categoryId: parentCategory.id });
  }

  return orConditions.length > 0 ? { OR: orConditions } : { category: { slug } };
}

export function buildRamSpecCondition(
  key: string,
  values: string[]
): Prisma.ProductWhereInput | null {
  if (values.length === 0) return null;

  switch (key) {
    case 'memory_type':
      return {
        OR: values.flatMap((v) => [
          {
            specifications: {
              some: {
                specificationDefinition: { key: 'memory_type' },
                value: { contains: v, mode: 'insensitive' as const },
              },
            },
          },
          {
            name: { contains: v, mode: 'insensitive' as const },
          },
        ]),
      };

    case 'speed': {
      const patterns = values.flatMap(mapRamSpeedFilterToPatterns);
      return {
        OR: patterns.map((pattern) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'speed' },
              value: { contains: pattern.replace(/\s/g, ''), mode: 'insensitive' as const },
            },
          },
        })),
      };
    }

    case 'capacity': {
      const dbValues = values.flatMap(mapRamSizeFilterToDb);
      return {
        OR: dbValues.map((v) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'capacity' },
              OR: [
                { value: { equals: v, mode: 'insensitive' as const } },
                { value: { contains: v.replace(/GB/i, '').trim(), mode: 'insensitive' as const } },
              ],
            },
          },
        })),
      };
    }

    case 'ram_features':
      return {
        OR: values.map((feature) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'ram_features' },
              value: { contains: feature, mode: 'insensitive' as const },
            },
          },
        })),
      };

    default:
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            value: { in: values },
          },
        },
      };
  }
}

export function buildRamFilterCounts(
  specValuesByKey: Record<string, { value: string; count: number }[]>,
  stockCounts: Record<string, number>,
  brandCounts: Record<string, number>
): Record<string, Record<string, number>> {
  const ramFilters = getRamFilters();
  const counts: Record<string, Record<string, number>> = {
    stockStatus: stockCounts,
    brand: brandCounts,
  };

  const speedFilter = ramFilters.find((f) => f.key === 'speed');
  if (speedFilter?.options) {
    counts.speed = {};
    const dbCounts = specValuesByKey.speed || [];
    for (const option of speedFilter.options) {
      counts.speed[option.value] = dbCounts
        .filter((d) => ramSpeedDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const typeFilter = ramFilters.find((f) => f.key === 'memory_type');
  if (typeFilter?.options) {
    counts.memory_type = {};
    const dbCounts = specValuesByKey.memory_type || [];
    for (const option of typeFilter.options) {
      const match = dbCounts.find((d) => d.value === option.value);
      if (match) counts.memory_type[option.value] = match.count;
    }
  }

  const sizeFilter = ramFilters.find((f) => f.key === 'capacity');
  if (sizeFilter?.options) {
    counts.capacity = {};
    const dbCounts = specValuesByKey.capacity || [];
    for (const option of sizeFilter.options) {
      counts.capacity[option.value] = dbCounts
        .filter((d) => ramSizeDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const featuresFilter = ramFilters.find((f) => f.key === 'ram_features');
  if (featuresFilter?.options) {
    counts.ram_features = {};
    const dbCounts = specValuesByKey.ram_features || [];
    for (const option of featuresFilter.options) {
      counts.ram_features[option.value] = dbCounts
        .filter((d) => d.value.toLowerCase().includes(option.value.toLowerCase()))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  return counts;
}

export { RAM_SPEC_FILTER_KEYS };
