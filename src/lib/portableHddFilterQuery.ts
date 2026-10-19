import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PORTABLE_HDD_SPEC_FILTER_KEYS } from '@/lib/portableHddSpecDefinitions';

export { PORTABLE_HDD_SPEC_FILTER_KEYS };

export async function buildPortableHddCategoryWhere(): Promise<Prisma.ProductWhereInput> {
  const category = await prisma.category.findFirst({ where: { slug: 'portable-hdd' } });
  if (!category) return { category: { slug: 'portable-hdd' } };
  return { categoryId: category.id };
}

export function buildPortableHddSpecCondition(key: string, values: string[]): Prisma.ProductWhereInput | null {
  if (!values.length || !PORTABLE_HDD_SPEC_FILTER_KEYS.includes(key as (typeof PORTABLE_HDD_SPEC_FILTER_KEYS)[number])) {
    return null;
  }
  return {
    OR: values.map((value) => ({
      specifications: {
        some: {
          specificationDefinition: { key },
          value: { equals: value, mode: 'insensitive' },
        },
      },
    })),
  };
}
