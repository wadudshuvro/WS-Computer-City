import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getProcessorFilters, type ProcessorBrand } from '@/lib/filterConfig';
import {
  cacheBucketMatches,
  clockBucketMatches,
  generationDbValueMatchesFilter,
  mapCoreFilterToDb,
  mapGenerationFilterToDb,
  mapSocketFilterToDb,
  mapThreadFilterToDb,
  mapTypeFilterToDb,
  parseCacheMb,
  parseClockGhz,
  PROCESSOR_SPEC_FILTER_KEYS,
} from '@/lib/processorFilterMappings';

export function buildProcessorSpecCondition(
  key: string,
  values: string[],
  distinctSpecValues: Record<string, string[]>,
  brand: ProcessorBrand = 'intel'
): Prisma.ProductWhereInput | null {
  if (values.length === 0) return null;

  switch (key) {
    case 'number_of_cores':
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            value: { in: values.map(mapCoreFilterToDb) },
          },
        },
      };

    case 'number_of_threads':
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            value: { in: values.map(mapThreadFilterToDb) },
          },
        },
      };

    case 'processor_model': {
      const dbValues = values.flatMap((v) => mapTypeFilterToDb(v, brand));
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            value: { in: dbValues },
          },
        },
      };
    }

    case 'generation': {
      const dbValues = values.flatMap((v) => mapGenerationFilterToDb(v, brand));
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            OR: [
              { value: { in: dbValues } },
              ...values.map((filterValue) => ({
                value: {
                  contains:
                    brand === 'amd'
                      ? filterValue.replace(' Series', '')
                      : filterValue.replace(' Gen', ''),
                  mode: 'insensitive' as const,
                },
              })),
            ],
          },
        },
      };
    }

    case 'socket_type': {
      const dbValues = values.flatMap((v) => mapSocketFilterToDb(v, brand));
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            value: { in: dbValues },
          },
        },
      };
    }

    case 'base_clock': {
      const allValues = distinctSpecValues.base_clock || [];
      const matched = allValues.filter((dbValue) => {
        const ghz = parseClockGhz(dbValue);
        return ghz !== null && values.some((bucket) => clockBucketMatches(bucket, ghz));
      });
      if (matched.length === 0) {
        return { id: { in: [] } };
      }
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            value: { in: matched },
          },
        },
      };
    }

    case 'cache_size': {
      const allValues = distinctSpecValues.cache_size || [];
      const matched = allValues.filter((dbValue) => {
        const mb = parseCacheMb(dbValue);
        return mb !== null && values.some((bucket) => cacheBucketMatches(bucket, mb));
      });
      if (matched.length === 0) {
        return { id: { in: [] } };
      }
      return {
        specifications: {
          some: {
            specificationDefinition: { key },
            value: { in: matched },
          },
        },
      };
    }

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

export async function getDistinctProcessorSpecValues(
  keys: string[],
  productWhere: Prisma.ProductWhereInput
): Promise<Record<string, string[]>> {
  const result: Record<string, string[]> = {};

  await Promise.all(
    keys.map(async (key) => {
      const specs = await prisma.productSpecification.findMany({
        where: {
          specificationDefinition: { key },
          product: productWhere,
        },
        select: { value: true },
        distinct: ['value'],
      });
      result[key] = specs.map((s) => s.value);
    })
  );

  return result;
}

export function buildProcessorFilterCounts(
  specValuesByKey: Record<string, { value: string; count: number }[]>,
  stockCounts: Record<string, number>,
  brand: ProcessorBrand = 'intel'
): Record<string, Record<string, number>> {
  const processorFilters = getProcessorFilters(brand);
  const counts: Record<string, Record<string, number>> = {
    stockStatus: stockCounts,
  };

  const coreFilter = processorFilters.find((f) => f.key === 'number_of_cores');
  if (coreFilter?.options) {
    counts.number_of_cores = {};
    const dbCounts = specValuesByKey.number_of_cores || [];
    for (const option of coreFilter.options) {
      const dbValue = mapCoreFilterToDb(option.value);
      const match = dbCounts.find((d) => d.value === dbValue);
      if (match) counts.number_of_cores[option.value] = match.count;
    }
  }

  const threadFilter = processorFilters.find((f) => f.key === 'number_of_threads');
  if (threadFilter?.options) {
    counts.number_of_threads = {};
    const dbCounts = specValuesByKey.number_of_threads || [];
    for (const option of threadFilter.options) {
      const dbValue = mapThreadFilterToDb(option.value);
      const match = dbCounts.find((d) => d.value === dbValue);
      if (match) counts.number_of_threads[option.value] = match.count;
    }
  }

  const typeFilter = processorFilters.find((f) => f.key === 'processor_model');
  if (typeFilter?.options) {
    counts.processor_model = {};
    const dbCounts = specValuesByKey.processor_model || [];
    for (const option of typeFilter.options) {
      const dbValues = mapTypeFilterToDb(option.value, brand);
      counts.processor_model[option.value] = dbCounts
        .filter((d) => dbValues.includes(d.value))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const genFilter = processorFilters.find((f) => f.key === 'generation');
  if (genFilter?.options) {
    counts.generation = {};
    const dbCounts = specValuesByKey.generation || [];
    for (const option of genFilter.options) {
      counts.generation[option.value] = dbCounts
        .filter((d) => generationDbValueMatchesFilter(option.value, d.value, brand))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const socketFilter = processorFilters.find((f) => f.key === 'socket_type');
  if (socketFilter?.options) {
    counts.socket_type = {};
    const dbCounts = specValuesByKey.socket_type || [];
    for (const option of socketFilter.options) {
      const dbValues = mapSocketFilterToDb(option.value, brand);
      counts.socket_type[option.value] = dbCounts
        .filter((d) => dbValues.some((v) => d.value.replace(/\s+/g, '') === v.replace(/\s+/g, '')))
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const clockFilter = processorFilters.find((f) => f.key === 'base_clock');
  if (clockFilter?.options) {
    counts.base_clock = {};
    const dbCounts = specValuesByKey.base_clock || [];
    for (const option of clockFilter.options) {
      counts.base_clock[option.value] = dbCounts
        .filter((d) => {
          const ghz = parseClockGhz(d.value);
          return ghz !== null && clockBucketMatches(option.value, ghz);
        })
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  const cacheFilter = processorFilters.find((f) => f.key === 'cache_size');
  if (cacheFilter?.options) {
    counts.cache_size = {};
    const dbCounts = specValuesByKey.cache_size || [];
    for (const option of cacheFilter.options) {
      counts.cache_size[option.value] = dbCounts
        .filter((d) => {
          const mb = parseCacheMb(d.value);
          return mb !== null && cacheBucketMatches(option.value, mb);
        })
        .reduce((sum, d) => sum + d.count, 0);
    }
  }

  return counts;
}

export { PROCESSOR_SPEC_FILTER_KEYS };
