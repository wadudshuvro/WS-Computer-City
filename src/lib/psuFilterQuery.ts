import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getPsuFilters } from '@/lib/filterConfig';
import {
  efficiencyDbValueMatches,
  mapWattageFilterToPatterns,
  modularDbValueMatches,
  wattageDbValueMatches,
  PSU_SPEC_FILTER_KEYS,
} from '@/lib/psuFilterMappings';

export async function buildPsuCategoryWhere(
  sub?: string | null,
  type?: string | null
): Promise<Prisma.ProductWhereInput> {
  const slug = sub || type || 'power-supply';
  const target = slug === 'psu' ? 'power-supply' : slug === 'power-supply' ? 'power-supply' : 'power-supply';

  const category = await prisma.category.findFirst({
    where: { slug: target },
    include: { children: true },
  });

  if (!category) {
    return {
      category: {
        OR: [{ slug: 'power-supply' }, { parent: { slug: 'power-supply' } }, { slug: 'psu' }],
      },
    };
  }

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];
  return { categoryId: { in: categoryIds } };
}

export function buildPsuSpecCondition(
  key: string,
  values: string[]
): Prisma.ProductWhereInput | null {
  if (values.length === 0) return null;

  switch (key) {
    case 'wattage': {
      const patterns = values.flatMap(mapWattageFilterToPatterns);
      return {
        OR: patterns.flatMap((pattern) => [
          {
            specifications: {
              some: {
                specificationDefinition: { key: 'wattage' },
                value: { contains: pattern.replace(/\s/g, ''), mode: 'insensitive' as const },
              },
            },
          },
          {
            name: { contains: pattern.replace(/\s/g, ''), mode: 'insensitive' as const },
          },
        ]),
      };
    }

    case 'efficiency':
      return {
        OR: values.flatMap((v) => {
          const patterns =
            v === '80 Plus'
              ? ['80 Plus', '80+', '80 Plus White', '80 Plus Standard']
              : [v, v.replace('80 Plus ', '80+ ')];
          return patterns.map((pattern) => ({
            specifications: {
              some: {
                specificationDefinition: { key: 'efficiency' },
                value: { contains: pattern, mode: 'insensitive' as const },
              },
            },
          }));
        }),
      };

    case 'modular_type':
      return {
        OR: values.flatMap((v) => {
          const patterns =
            v === 'Full-Modular'
              ? ['Full-Modular', 'Fully Modular', 'Full Modular']
              : v === 'Semi-Modular'
                ? ['Semi-Modular', 'Semi Modular']
                : ['Non-Modular', 'Non Modular', 'Fixed'];
          return patterns.map((pattern) => ({
            specifications: {
              some: {
                specificationDefinition: { key: 'modular_type' },
                value: { contains: pattern, mode: 'insensitive' as const },
              },
            },
          }));
        }),
      };

    case 'form_factor':
      return {
        specifications: {
          some: {
            specificationDefinition: { key: 'form_factor' },
            value: { in: values },
          },
        },
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

export function buildPsuFilterCounts(
  specValuesByKey: Record<string, { value: string; count: number }[]>,
  stockCounts: Record<string, number>,
  brandCounts: Record<string, number>
): Record<string, Record<string, number>> {
  const psuFilters = getPsuFilters();
  const counts: Record<string, Record<string, number>> = {
    stockStatus: stockCounts,
    brand: brandCounts,
  };

  const wattageFilter = psuFilters.find((f) => f.key === 'wattage');
  if (wattageFilter?.options) {
    counts.wattage = {};
    const dbCounts = specValuesByKey.wattage || [];
    for (const option of wattageFilter.options) {
      counts.wattage[option.value] = dbCounts
        .filter((d) => wattageDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const efficiencyFilter = psuFilters.find((f) => f.key === 'efficiency');
  if (efficiencyFilter?.options) {
    counts.efficiency = {};
    const dbCounts = specValuesByKey.efficiency || [];
    for (const option of efficiencyFilter.options) {
      counts.efficiency[option.value] = dbCounts
        .filter((d) => efficiencyDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const modularFilter = psuFilters.find((f) => f.key === 'modular_type');
  if (modularFilter?.options) {
    counts.modular_type = {};
    const dbCounts = specValuesByKey.modular_type || [];
    for (const option of modularFilter.options) {
      counts.modular_type[option.value] = dbCounts
        .filter((d) => modularDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const formFilter = psuFilters.find((f) => f.key === 'form_factor');
  if (formFilter?.options) {
    counts.form_factor = {};
    const dbCounts = specValuesByKey.form_factor || [];
    for (const option of formFilter.options) {
      const match = dbCounts.find((d) => d.value.toLowerCase() === option.value.toLowerCase());
      if (match) counts.form_factor[option.value] = match.count;
    }
  }

  return counts;
}

export { PSU_SPEC_FILTER_KEYS };
