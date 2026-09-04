import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCpuCoolerFilters } from '@/lib/filterConfig';
import {
  coolerSpecialFeatureDbValueMatches,
  fanSizeDbValueMatches,
  fanSpeedDbValueMatches,
  processorTypeDbValueMatches,
  socketDbValueMatches,
  CPU_COOLER_SPEC_FILTER_KEYS,
} from '@/lib/cpuCoolerFilterMappings';

export async function buildCpuCoolerCategoryWhere(
  sub?: string | null,
  type?: string | null
): Promise<Prisma.ProductWhereInput> {
  const slug = sub || type || 'cpu-cooler';
  const target =
    slug === 'cpu-cooler' || slug === 'cpu-coolers' || slug === 'cooler' ? 'cpu-cooler' : 'cpu-cooler';

  const category = await prisma.category.findFirst({
    where: { slug: target },
    include: { children: true },
  });

  if (!category) {
    return {
      category: {
        OR: [
          { slug: 'cpu-cooler' },
          { slug: 'cpu-coolers' },
          { parent: { slug: 'cpu-cooler' } },
        ],
      },
    };
  }

  return {
    categoryId: { in: [category.id, ...category.children.map((c) => c.id)] },
  };
}

export function buildCpuCoolerSpecCondition(
  key: string,
  values: string[]
): Prisma.ProductWhereInput | null {
  if (values.length === 0) return null;

  switch (key) {
    case 'cooler_type':
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            value: { in: values },
          },
        },
      };

    case 'processor_type':
      return {
        OR: values.map((v) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'processor_type' },
              value: { contains: v, mode: 'insensitive' as const },
            },
          },
        })),
      };

    case 'socket':
      return {
        OR: values.map((v) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'socket' },
              value: { contains: v, mode: 'insensitive' as const },
            },
          },
        })),
      };

    case 'fan_size':
      return {
        OR: values.map((v) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'fan_size' },
              value: { contains: v.replace(/mm/i, ''), mode: 'insensitive' as const },
            },
          },
        })),
      };

    case 'fan_speed':
      return {
        OR: values.flatMap((v) => {
          const labelMatch = {
            specifications: {
              some: {
                specificationDefinition: { key: 'fan_speed' },
                value: { contains: v, mode: 'insensitive' as const },
              },
            },
          };
          // Also match free-text fan_speed_detail via contains heuristics in counts;
          // for query, include label equality paths only (range stored as select).
          return [labelMatch];
        }),
      };

    case 'special_features':
      return {
        OR: values.map((v) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'special_features' },
              value: { contains: v, mode: 'insensitive' as const },
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

export function buildCpuCoolerFilterCounts(
  specValuesByKey: Record<string, { value: string; count: number }[]>,
  stockCounts: Record<string, number>,
  brandCounts: Record<string, number>
): Record<string, Record<string, number>> {
  const coolerFilters = getCpuCoolerFilters();
  const counts: Record<string, Record<string, number>> = {
    stockStatus: stockCounts,
    brand: brandCounts,
  };

  const coolerTypeFilter = coolerFilters.find((f) => f.key === 'cooler_type');
  if (coolerTypeFilter?.options) {
    counts.cooler_type = {};
    const dbCounts = specValuesByKey.cooler_type || [];
    for (const option of coolerTypeFilter.options) {
      const match = dbCounts.find((d) => d.value.toLowerCase() === option.value.toLowerCase());
      if (match) counts.cooler_type[option.value] = match.count;
    }
  }

  const processorFilter = coolerFilters.find((f) => f.key === 'processor_type');
  if (processorFilter?.options) {
    counts.processor_type = {};
    const dbCounts = specValuesByKey.processor_type || [];
    for (const option of processorFilter.options) {
      counts.processor_type[option.value] = dbCounts
        .filter((d) => processorTypeDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const socketFilter = coolerFilters.find((f) => f.key === 'socket');
  if (socketFilter?.options) {
    counts.socket = {};
    const dbCounts = specValuesByKey.socket || [];
    for (const option of socketFilter.options) {
      counts.socket[option.value] = dbCounts
        .filter((d) => socketDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const fanSizeFilter = coolerFilters.find((f) => f.key === 'fan_size');
  if (fanSizeFilter?.options) {
    counts.fan_size = {};
    const dbCounts = specValuesByKey.fan_size || [];
    for (const option of fanSizeFilter.options) {
      counts.fan_size[option.value] = dbCounts
        .filter((d) => fanSizeDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const fanSpeedFilter = coolerFilters.find((f) => f.key === 'fan_speed');
  if (fanSpeedFilter?.options) {
    counts.fan_speed = {};
    const dbCounts = [
      ...(specValuesByKey.fan_speed || []),
      ...(specValuesByKey.fan_speed_detail || []),
    ];
    for (const option of fanSpeedFilter.options) {
      counts.fan_speed[option.value] = dbCounts
        .filter((d) => fanSpeedDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const featureFilter = coolerFilters.find((f) => f.key === 'special_features');
  if (featureFilter?.options) {
    counts.special_features = {};
    const dbCounts = specValuesByKey.special_features || [];
    for (const option of featureFilter.options) {
      counts.special_features[option.value] = dbCounts
        .filter((d) => coolerSpecialFeatureDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  return counts;
}

export { CPU_COOLER_SPEC_FILTER_KEYS };
