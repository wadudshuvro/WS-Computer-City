import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCasingFilters } from '@/lib/filterConfig';
import {
  motherboardTypeDbValueMatches,
  sidePanelDbValueMatches,
  specialFeatureDbValueMatches,
  CASING_SPEC_FILTER_KEYS,
} from '@/lib/casingFilterMappings';

export async function buildCasingCategoryWhere(
  sub?: string | null,
  type?: string | null
): Promise<Prisma.ProductWhereInput> {
  const slug = sub || type || 'computer-case';
  const target =
    slug === 'casing' || slug === 'case' || slug === 'computer-case' ? 'computer-case' : 'computer-case';

  const category = await prisma.category.findFirst({
    where: { slug: target },
    include: { children: true },
  });

  if (!category) {
    return {
      category: {
        OR: [
          { slug: 'computer-case' },
          { slug: 'casing' },
          { parent: { slug: 'computer-case' } },
        ],
      },
    };
  }

  return {
    categoryId: { in: [category.id, ...category.children.map((c) => c.id)] },
  };
}

export function buildCasingSpecCondition(
  key: string,
  values: string[]
): Prisma.ProductWhereInput | null {
  if (values.length === 0) return null;

  switch (key) {
    case 'color':
    case 'case_type':
    case 'psu_included':
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            value: { in: values },
          },
        },
      };

    case 'motherboard_type':
      return {
        OR: values.flatMap((v) => {
          const patterns =
            v === 'Micro-ATX'
              ? ['Micro-ATX', 'Micro ATX', 'mATX', 'M-ATX']
              : v === 'Mini-ITX'
                ? ['Mini-ITX', 'Mini ITX', 'ITX']
                : v === 'E-ATX'
                  ? ['E-ATX', 'EATX', 'Extended ATX']
                  : ['ATX'];
          return patterns.map((pattern) => ({
            specifications: {
              some: {
                specificationDefinition: { key: 'motherboard_type' },
                value: { contains: pattern, mode: 'insensitive' as const },
              },
            },
          }));
        }),
      };

    case 'side_panel':
      return {
        OR: values.map((v) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'side_panel' },
              value: { contains: v, mode: 'insensitive' as const },
            },
          },
        })),
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

export function buildCasingFilterCounts(
  specValuesByKey: Record<string, { value: string; count: number }[]>,
  stockCounts: Record<string, number>,
  brandCounts: Record<string, number>
): Record<string, Record<string, number>> {
  const casingFilters = getCasingFilters();
  const counts: Record<string, Record<string, number>> = {
    stockStatus: stockCounts,
    brand: brandCounts,
  };

  for (const key of ['color', 'case_type', 'psu_included'] as const) {
    const filter = casingFilters.find((f) => f.key === key);
    if (!filter?.options) continue;
    counts[key] = {};
    const dbCounts = specValuesByKey[key] || [];
    for (const option of filter.options) {
      const match = dbCounts.find((d) => d.value.toLowerCase() === option.value.toLowerCase());
      if (match) counts[key][option.value] = match.count;
    }
  }

  const mbFilter = casingFilters.find((f) => f.key === 'motherboard_type');
  if (mbFilter?.options) {
    counts.motherboard_type = {};
    const dbCounts = specValuesByKey.motherboard_type || [];
    for (const option of mbFilter.options) {
      counts.motherboard_type[option.value] = dbCounts
        .filter((d) => motherboardTypeDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const sideFilter = casingFilters.find((f) => f.key === 'side_panel');
  if (sideFilter?.options) {
    counts.side_panel = {};
    const dbCounts = specValuesByKey.side_panel || [];
    for (const option of sideFilter.options) {
      counts.side_panel[option.value] = dbCounts
        .filter((d) => sidePanelDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const featureFilter = casingFilters.find((f) => f.key === 'special_features');
  if (featureFilter?.options) {
    counts.special_features = {};
    const dbCounts = specValuesByKey.special_features || [];
    for (const option of featureFilter.options) {
      counts.special_features[option.value] = dbCounts
        .filter((d) => specialFeatureDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  return counts;
}

export { CASING_SPEC_FILTER_KEYS };
