import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getGpuFilters, type GpuChipsetBrand } from '@/lib/filterConfig';
import {
  gpuChipsetDbValueMatches,
  mapGpuChipsetFilterToPatterns,
  mapMemorySizeFilterToDb,
  memorySizeDbValueMatches,
  resolutionDbValueMatches,
  GPU_SPEC_FILTER_KEYS,
} from '@/lib/gpuFilterMappings';

function getGpuTypeMatchConditions(gpuType: GpuChipsetBrand): Prisma.ProductWhereInput[] {
  const patterns =
    gpuType === 'nvidia'
      ? ['geforce', 'rtx', 'gtx', 'nvidia', 'quadro']
      : ['radeon', 'rx 6', 'rx 7', 'rx 9', 'rx 5', 'rx6', 'rx7', 'rx9', 'amd radeon'];

  const conditions: Prisma.ProductWhereInput[] = [];
  for (const pattern of patterns) {
    conditions.push({
      specifications: {
        some: {
          specificationDefinition: { key: 'gpu_chipset' },
          value: { contains: pattern, mode: 'insensitive' },
        },
      },
    });
    conditions.push({
      name: { contains: pattern, mode: 'insensitive' },
    });
  }
  return conditions;
}

export async function buildGpuCategoryWhere(
  sub?: string | null,
  type?: string | null,
  options?: { scopeAllGpus?: boolean }
): Promise<Prisma.ProductWhereInput> {
  if (options?.scopeAllGpus) {
    return {
      category: {
        OR: [
          { slug: 'graphics-card' },
          { parent: { slug: 'graphics-card' } },
          { slug: 'nvidia' },
          { slug: 'amd-gpu' },
        ],
      },
    };
  }

  const slug = sub === 'nvidia' || type === 'nvidia' ? 'nvidia' : sub === 'amd-gpu' || type === 'amd-gpu' ? 'amd-gpu' : null;

  if (!slug) {
    return {
      category: {
        OR: [
          { slug: 'graphics-card' },
          { parent: { slug: 'graphics-card' } },
          { slug: 'nvidia' },
          { slug: 'amd-gpu' },
        ],
      },
    };
  }

  const gpuType = slug === 'nvidia' ? 'nvidia' : 'amd';
  const [category, parentCategory] = await Promise.all([
    prisma.category.findFirst({
      where: { slug },
      include: { children: true },
    }),
    prisma.category.findFirst({ where: { slug: 'graphics-card' } }),
  ]);

  const categoryIds = category ? [category.id, ...category.children.map((c) => c.id)] : [];
  const orConditions: Prisma.ProductWhereInput[] = [];

  if (categoryIds.length > 0) {
    orConditions.push({ categoryId: { in: categoryIds } });
  }

  if (parentCategory) {
    orConditions.push({
      AND: [{ categoryId: parentCategory.id }, { OR: getGpuTypeMatchConditions(gpuType) }],
    });
  }

  return orConditions.length > 0 ? { OR: orConditions } : { category: { slug } };
}

export function buildGpuSpecCondition(
  key: string,
  values: string[]
): Prisma.ProductWhereInput | null {
  if (values.length === 0) return null;

  switch (key) {
    case 'manufacturer':
      return {
        brand: {
          slug: { in: values },
        },
      };

    case 'gpu_chipset': {
      const patternGroups = values.flatMap(mapGpuChipsetFilterToPatterns);
      return {
        OR: patternGroups.flatMap((pattern) => [
          {
            specifications: {
              some: {
                specificationDefinition: { key: 'gpu_chipset' },
                value: { contains: pattern, mode: 'insensitive' },
              },
            },
          },
          {
            name: { contains: pattern, mode: 'insensitive' },
          },
        ]),
      };
    }

    case 'memory_size': {
      const dbValues = values.flatMap(mapMemorySizeFilterToDb);
      return {
        specifications: {
          some: {
            specificationDefinition: { key: 'memory_size' },
            OR: dbValues.map((v) => ({
              value: { equals: v, mode: 'insensitive' as const },
            })),
          },
        },
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

    case 'resolution':
      return {
        OR: values.map((filterValue) => ({
          specifications: {
            some: {
              specificationDefinition: { key: 'resolution' },
              value: { contains: filterValue.replace(/x/i, 'x'), mode: 'insensitive' as const },
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

export function buildGpuFilterCounts(
  specValuesByKey: Record<string, { value: string; count: number }[]>,
  stockCounts: Record<string, number>,
  manufacturerCounts: Record<string, number>,
  brand: GpuChipsetBrand
): Record<string, Record<string, number>> {
  const gpuFilters = getGpuFilters(brand);
  const counts: Record<string, Record<string, number>> = {
    stockStatus: stockCounts,
    manufacturer: manufacturerCounts,
  };

  const memoryFilter = gpuFilters.find((f) => f.key === 'memory_size');
  if (memoryFilter?.options) {
    counts.memory_size = {};
    const dbCounts = specValuesByKey.memory_size || [];
    for (const option of memoryFilter.options) {
      counts.memory_size[option.value] = dbCounts
        .filter((d) => memorySizeDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const memoryTypeFilter = gpuFilters.find((f) => f.key === 'memory_type');
  if (memoryTypeFilter?.options) {
    counts.memory_type = {};
    const dbCounts = specValuesByKey.memory_type || [];
    for (const option of memoryTypeFilter.options) {
      const match = dbCounts.find((d) => d.value === option.value);
      if (match) counts.memory_type[option.value] = match.count;
    }
  }

  const chipsetFilter = gpuFilters.find((f) => f.key === 'gpu_chipset');
  if (chipsetFilter?.options) {
    counts.gpu_chipset = {};
    const dbCounts = specValuesByKey.gpu_chipset || [];
    for (const option of chipsetFilter.options) {
      counts.gpu_chipset[option.value] = dbCounts
        .filter((d) => gpuChipsetDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const resolutionFilter = gpuFilters.find((f) => f.key === 'resolution');
  if (resolutionFilter?.options) {
    counts.resolution = {};
    const dbCounts = specValuesByKey.resolution || [];
    for (const option of resolutionFilter.options) {
      counts.resolution[option.value] = dbCounts
        .filter((d) => resolutionDbValueMatches(option.value, d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  return counts;
}

export { GPU_SPEC_FILTER_KEYS };
