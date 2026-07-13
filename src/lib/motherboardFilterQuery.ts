import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getMotherboardFilters } from '@/lib/filterConfig';
import {
  formFactorDbValueMatches,
  mapFormFactorFilterToPatterns,
  mapMotherboardMakerToBrandSlugs,
  motherboardMakerMatchesBrandSlug,
  socketDbValueMatches,
  specialFeatureDbValueMatches,
  MOTHERBOARD_SPEC_FILTER_KEYS,
} from '@/lib/motherboardFilterMappings';

export async function buildMotherboardCategoryWhere(
  sub?: string | null,
  type?: string | null
): Promise<Prisma.ProductWhereInput> {
  const slug =
    sub === 'intel-motherboard' || type === 'intel-motherboard'
      ? 'intel-motherboard'
      : sub === 'amd-motherboard' || type === 'amd-motherboard'
        ? 'amd-motherboard'
        : sub === 'motherboard' || type === 'motherboard'
          ? 'motherboard'
          : null;

  if (!slug || slug === 'motherboard') {
    return {
      category: {
        OR: [
          { slug: 'motherboard' },
          { parent: { slug: 'motherboard' } },
          { slug: 'intel-motherboard' },
          { slug: 'amd-motherboard' },
        ],
      },
    };
  }

  const [category, parentCategory] = await Promise.all([
    prisma.category.findFirst({
      where: { slug },
      include: { children: true },
    }),
    prisma.category.findFirst({ where: { slug: 'motherboard' } }),
  ]);

  const categoryIds = category ? [category.id, ...category.children.map((c) => c.id)] : [];
  const orConditions: Prisma.ProductWhereInput[] = [];

  if (categoryIds.length > 0) {
    orConditions.push({ categoryId: { in: categoryIds } });
  }

  if (parentCategory) {
    orConditions.push({ categoryId: parentCategory.id });
  }

  return orConditions.length > 0 ? { OR: orConditions } : { category: { slug } };
}

export function buildMotherboardSpecCondition(
  key: string,
  values: string[]
): Prisma.ProductWhereInput | null {
  if (values.length === 0) return null;

  switch (key) {
    case 'mb_brand': {
      const brandSlugs = values.flatMap(mapMotherboardMakerToBrandSlugs);
      return {
        brand: { slug: { in: brandSlugs } },
      };
    }

    case 'processor_type': {
      const orConditions: Prisma.ProductWhereInput[] = [];
      for (const value of values) {
        const type = value.toLowerCase();
        if (type === 'intel') {
          orConditions.push(
            { brand: { slug: { endsWith: '-intel' } } },
            { brand: { slug: { in: ['intel', 'intel-motherboard'] } } },
            { category: { slug: { contains: 'intel' } } }
          );
        } else if (type === 'amd') {
          orConditions.push(
            { brand: { slug: { endsWith: '-amd' } } },
            { brand: { slug: { in: ['amd', 'amd-motherboard'] } } },
            { category: { slug: { contains: 'amd' } } }
          );
        }
      }
      return orConditions.length > 0 ? { OR: orConditions } : null;
    }

    case 'cpu_socket': {
      return {
        OR: values.flatMap((socket) => [
          {
            specifications: {
              some: {
                specificationDefinition: { key: 'supported_cpu' },
                value: { contains: socket, mode: 'insensitive' as const },
              },
            },
          },
          {
            specifications: {
              some: {
                specificationDefinition: { key: 'cpu_socket' },
                value: { contains: socket, mode: 'insensitive' as const },
              },
            },
          },
          {
            name: { contains: socket, mode: 'insensitive' as const },
          },
        ]),
      };
    }

    case 'form_factor': {
      const patterns = values.flatMap(mapFormFactorFilterToPatterns);
      return {
        OR: patterns.map((pattern) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'form_factor' },
              value: { contains: pattern, mode: 'insensitive' as const },
            },
          },
        })),
      };
    }

    case 'memory_type':
      return {
        specifications: {
          some: {
            specificationDefinition: { key: 'memory_type' },
            value: { in: values },
          },
        },
      };

    case 'special_features':
      return {
        OR: values.flatMap((feature) => {
          const patterns =
            feature.toLowerCase() === 'm.2' || feature.toLowerCase() === 'm2'
              ? ['m.2', 'm2', 'M.2']
              : feature.toLowerCase() === 'wi-fi' || feature.toLowerCase() === 'wifi'
                ? ['Wi-Fi', 'WiFi', 'wifi', 'Wireless']
                : [feature];
          return patterns.map((pattern) => ({
            specifications: {
              some: {
                specificationDefinition: { key: 'special_features' },
                value: { contains: pattern, mode: 'insensitive' as const },
              },
            },
          }));
        }),
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

export function buildMotherboardFilterCounts(
  specValuesByKey: Record<string, { value: string; count: number }[]>,
  stockCounts: Record<string, number>,
  brandCountsBySlug: Record<string, number>
): Record<string, Record<string, number>> {
  const mbFilters = getMotherboardFilters();
  const counts: Record<string, Record<string, number>> = {
    stockStatus: stockCounts,
  };

  const brandFilter = mbFilters.find((f) => f.key === 'mb_brand');
  if (brandFilter?.options) {
    counts.mb_brand = {};
    for (const option of brandFilter.options) {
      counts.mb_brand[option.value] = Object.entries(brandCountsBySlug)
        .filter(([slug]) => motherboardMakerMatchesBrandSlug(option.value, slug))
        .reduce((sum, [, c]) => sum + c, 0);
    }
  }

  const processorFilter = mbFilters.find((f) => f.key === 'processor_type');
  if (processorFilter?.options) {
    counts.processor_type = {};
    for (const option of processorFilter.options) {
      const type = option.value.toLowerCase();
      counts.processor_type[option.value] = Object.entries(brandCountsBySlug)
        .filter(([slug]) =>
          type === 'intel'
            ? slug.endsWith('-intel') || slug === 'intel' || slug === 'intel-motherboard'
            : slug.endsWith('-amd') || slug === 'amd' || slug === 'amd-motherboard'
        )
        .reduce((sum, [, c]) => sum + c, 0);
    }
  }

  const socketFilterKeys = mbFilters.filter((f) => f.key === 'cpu_socket');
  counts.cpu_socket = {};
  const socketDb = [
    ...(specValuesByKey.supported_cpu || []),
    ...(specValuesByKey.cpu_socket || []),
  ];
  for (const socketFilter of socketFilterKeys) {
    for (const option of socketFilter.options || []) {
      counts.cpu_socket[option.value] = socketDb
        .filter((d) => socketDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const formFilter = mbFilters.find((f) => f.key === 'form_factor');
  if (formFilter?.options) {
    counts.form_factor = {};
    const dbCounts = specValuesByKey.form_factor || [];
    for (const option of formFilter.options) {
      counts.form_factor[option.value] = dbCounts
        .filter((d) => formFactorDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const ramFilter = mbFilters.find((f) => f.key === 'memory_type');
  if (ramFilter?.options) {
    counts.memory_type = {};
    const dbCounts = specValuesByKey.memory_type || [];
    for (const option of ramFilter.options) {
      const match = dbCounts.find((d) => d.value.toUpperCase() === option.value.toUpperCase());
      if (match) counts.memory_type[option.value] = match.count;
    }
  }

  const featuresFilter = mbFilters.find((f) => f.key === 'special_features');
  if (featuresFilter?.options) {
    counts.special_features = {};
    const dbCounts = specValuesByKey.special_features || [];
    for (const option of featuresFilter.options) {
      counts.special_features[option.value] = dbCounts
        .filter((d) => specialFeatureDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  return counts;
}

export { MOTHERBOARD_SPEC_FILTER_KEYS };
