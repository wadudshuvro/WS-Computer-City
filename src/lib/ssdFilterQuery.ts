import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSsdFilters } from '@/lib/filterConfig';
import { SSD_SPEC_FILTER_KEYS } from '@/lib/ssdSpecDefinitions';

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
                    value: { contains: 'PCI-E', mode: 'insensitive' },
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
  if (values.length === 0 || !SSD_SPEC_FILTER_KEYS.includes(key as (typeof SSD_SPEC_FILTER_KEYS)[number])) {
    return null;
  }
  return {
    OR: values.map((value) => ({
      specifications: {
        some: {
          specificationDefinition: { key },
          value: { equals: value, mode: 'insensitive' as const },
        },
      },
    })),
  };
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

  for (const filter of ssdFilters) {
    if (!filter.options || filter.key === 'stockStatus' || filter.key === 'brand' || filter.type === 'range') {
      continue;
    }
    const bucket: Record<string, number> = {};
    counts[filter.key] = bucket;
    const dbCounts = specValuesByKey[filter.key] || [];
    for (const option of filter.options) {
      bucket[option.value] = dbCounts
        .filter((row) => row.value.toLowerCase() === option.value.toLowerCase())
        .reduce((sum, row) => sum + row.count, 0);
    }
  }

  return counts;
}

export { SSD_SPEC_FILTER_KEYS };
