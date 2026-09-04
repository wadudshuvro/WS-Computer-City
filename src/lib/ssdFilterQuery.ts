import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSsdFilters } from '@/lib/filterConfig';
import {
  capacityDbValueMatches,
  dramDbValueMatches,
  formFactorDbValueMatches,
  interfaceDbValueMatches,
  mapCapacityFilterToDbValues,
  pcieGenDbValueMatches,
  speedBucketDbValueMatches,
  technologyDbValueMatches,
  SSD_SPEC_FILTER_KEYS,
} from '@/lib/ssdFilterMappings';

export async function buildSsdCategoryWhere(
  sub?: string | null,
  type?: string | null
): Promise<Prisma.ProductWhereInput> {
  const raw = sub || type || 'ssd';
  const slug = raw === 'storage' ? 'ssd' : raw;

  if (slug === 'nvme') {
    const [nvme, ssdParent] = await Promise.all([
      prisma.category.findFirst({ where: { slug: 'nvme' }, include: { children: true } }),
      prisma.category.findFirst({ where: { slug: 'ssd' } }),
    ]);
    const ids = nvme ? [nvme.id, ...nvme.children.map((c) => c.id)] : [];
    const orConditions: Prisma.ProductWhereInput[] = [];
    if (ids.length) orConditions.push({ categoryId: { in: ids } });
    if (ssdParent) {
      orConditions.push({
        AND: [
          { categoryId: ssdParent.id },
          {
            OR: [
              {
                specifications: {
                  some: {
                    specificationDefinition: { key: 'interface' },
                    value: { contains: 'NVMe', mode: 'insensitive' },
                  },
                },
              },
              { name: { contains: 'NVMe', mode: 'insensitive' } },
            ],
          },
        ],
      });
    }
    return orConditions.length > 0
      ? { OR: orConditions }
      : {
          category: {
            OR: [{ slug: 'nvme' }, { slug: 'ssd' }, { parent: { slug: 'ssd' } }],
          },
        };
  }

  const category = await prisma.category.findFirst({
    where: { slug: 'ssd' },
    include: { children: true },
  });

  if (!category) {
    return {
      category: {
        OR: [{ slug: 'ssd' }, { slug: 'nvme' }, { parent: { slug: 'ssd' } }, { slug: 'storage' }],
      },
    };
  }

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];
  // Also include nvme sibling category
  const nvme = await prisma.category.findFirst({ where: { slug: 'nvme' } });
  if (nvme) categoryIds.push(nvme.id);

  return { categoryId: { in: categoryIds } };
}

export function buildSsdSpecCondition(
  key: string,
  values: string[]
): Prisma.ProductWhereInput | null {
  if (values.length === 0) return null;

  switch (key) {
    case 'capacity': {
      const dbValues = values.flatMap(mapCapacityFilterToDbValues);
      return {
        OR: dbValues.map((v) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'capacity' },
              value: { equals: v, mode: 'insensitive' as const },
            },
          },
        })),
      };
    }

    case 'interface':
      return {
        OR: values.flatMap((v) => {
          const patterns = v === 'NVMe' ? ['NVMe', 'PCIe'] : ['SATA'];
          return patterns.map((pattern) => ({
            specifications: {
              some: {
                specificationDefinition: { key: 'interface' },
                value: { contains: pattern, mode: 'insensitive' as const },
              },
            },
          }));
        }),
      };

    case 'form_factor':
      return {
        OR: values.flatMap((v) => {
          const patterns =
            v === '2.5 Inch' ? ['2.5', '2.5 Inch', '2.5-inch'] : ['M.2', 'M2', '2280'];
          return patterns.map((pattern) => ({
            specifications: {
              some: {
                specificationDefinition: { key: 'form_factor' },
                value: { contains: pattern, mode: 'insensitive' as const },
              },
            },
          }));
        }),
      };

    case 'pcie_gen':
      return {
        OR: values.flatMap((v) => {
          const gen = v.replace(/Gen/i, '').trim();
          const patterns = [v, `Gen ${gen}`, `PCIe ${gen}`, `PCI-E ${gen}.0`, `${gen}.0`];
          return patterns.map((pattern) => ({
            specifications: {
              some: {
                specificationDefinition: { key: 'pcie_gen' },
                value: { contains: pattern, mode: 'insensitive' as const },
              },
            },
          }));
        }),
      };

    case 'dram':
      return {
        OR: values.map((v) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'dram' },
              value: { contains: v === 'With DRAM' ? 'DRAM' : 'DRAM-less', mode: 'insensitive' as const },
            },
          },
        })),
      };

    case 'technology':
      return {
        specifications: {
          some: {
            specificationDefinition: { key: 'technology' },
            value: { in: values },
          },
        },
      };

    case 'read_speed':
    case 'write_speed':
      return {
        OR: values.map((v) => ({
          specifications: {
            some: {
              specificationDefinition: { key },
              value: { equals: v, mode: 'insensitive' as const },
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

export function buildSsdFilterCounts(
  specValuesByKey: Record<string, { value: string; count: number }[]>,
  stockCounts: Record<string, number>,
  brandCounts: Record<string, number>
): Record<string, Record<string, number>> {
  const ssdFilters = getSsdFilters();
  const counts: Record<string, Record<string, number>> = {
    stockStatus: stockCounts,
    brand: brandCounts,
  };

  const capacityFilter = ssdFilters.find((f) => f.key === 'capacity');
  if (capacityFilter?.options) {
    counts.capacity = {};
    const dbCounts = specValuesByKey.capacity || [];
    for (const option of capacityFilter.options) {
      counts.capacity[option.value] = dbCounts
        .filter((d) => capacityDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const interfaceFilter = ssdFilters.find((f) => f.key === 'interface');
  if (interfaceFilter?.options) {
    counts.interface = {};
    const dbCounts = specValuesByKey.interface || [];
    for (const option of interfaceFilter.options) {
      counts.interface[option.value] = dbCounts
        .filter((d) => interfaceDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const formFilter = ssdFilters.find((f) => f.key === 'form_factor');
  if (formFilter?.options) {
    counts.form_factor = {};
    const dbCounts = specValuesByKey.form_factor || [];
    for (const option of formFilter.options) {
      counts.form_factor[option.value] = dbCounts
        .filter((d) => formFactorDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const pcieFilter = ssdFilters.find((f) => f.key === 'pcie_gen');
  if (pcieFilter?.options) {
    counts.pcie_gen = {};
    const dbCounts = specValuesByKey.pcie_gen || [];
    for (const option of pcieFilter.options) {
      counts.pcie_gen[option.value] = dbCounts
        .filter((d) => pcieGenDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const dramFilter = ssdFilters.find((f) => f.key === 'dram');
  if (dramFilter?.options) {
    counts.dram = {};
    const dbCounts = specValuesByKey.dram || [];
    for (const option of dramFilter.options) {
      counts.dram[option.value] = dbCounts
        .filter((d) => dramDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const techFilter = ssdFilters.find((f) => f.key === 'technology');
  if (techFilter?.options) {
    counts.technology = {};
    const dbCounts = specValuesByKey.technology || [];
    for (const option of techFilter.options) {
      counts.technology[option.value] = dbCounts
        .filter((d) => technologyDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  for (const key of ['read_speed', 'write_speed'] as const) {
    const filter = ssdFilters.find((f) => f.key === key);
    if (!filter?.options) continue;
    counts[key] = {};
    const dbCounts = specValuesByKey[key] || [];
    for (const option of filter.options) {
      counts[key][option.value] = dbCounts
        .filter((d) => speedBucketDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  return counts;
}

export { SSD_SPEC_FILTER_KEYS };
