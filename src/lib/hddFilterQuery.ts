import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getHddFilters } from '@/lib/filterConfig';
import { HDD_SPEC_FILTER_KEYS } from '@/lib/hddSpecDefinitions';

export { HDD_SPEC_FILTER_KEYS };

export async function buildHddCategoryWhere(): Promise<Prisma.ProductWhereInput> {
  const category = await prisma.category.findFirst({
    where: { slug: { in: ['hdd', 'hard-disk-drive'] } },
    include: { children: true },
  });

  if (!category) {
    return { category: { slug: { in: ['hdd', 'hard-disk-drive'] } } };
  }

  const categoryIds = [category.id, ...category.children.map((child) => child.id)];
  return { categoryId: { in: categoryIds } };
}

export function buildHddSpecCondition(key: string, values: string[]): Prisma.ProductWhereInput | null {
  if (values.length === 0 || !HDD_SPEC_FILTER_KEYS.includes(key as (typeof HDD_SPEC_FILTER_KEYS)[number])) {
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

export function buildHddFilterCounts(
  specValuesByKey: Record<string, { value: string; count: number }[]>,
  stockCounts: Record<string, number>,
  brandCounts: Record<string, number>
): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {
    stockStatus: stockCounts,
    brand: brandCounts,
  };

  for (const filter of getHddFilters()) {
    if (!filter.options || filter.key === 'stockStatus' || filter.key === 'brand' || filter.type === 'range') {
      continue;
    }
    counts[filter.key] = {};
    const dbCounts = specValuesByKey[filter.key] || [];
    for (const option of filter.options) {
      counts[filter.key][option.value] = dbCounts
        .filter((row) => row.value.toLowerCase() === option.value.toLowerCase())
        .reduce((sum, row) => sum + row.count, 0);
    }
  }

  return counts;
}
