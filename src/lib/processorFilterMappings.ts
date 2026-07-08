/**
 * Maps TechLand-style processor filter UI values to database specification values.
 */

export function mapCoreFilterToDb(value: string): string {
  return `${value} Core`;
}

export function mapThreadFilterToDb(value: string): string {
  return `${value} Threads`;
}

const TYPE_FILTER_MAP: Record<string, string[]> = {
  PDC: ['PDC'],
  'Core i3': ['Intel Core i3'],
  'Core i5': ['Intel Core i5'],
  'Core i7': ['Intel Core i7'],
  'Core i9': ['Intel Core i9'],
  'Core Ultra 5': ['Intel Core Ultra 5'],
  'Core Ultra 7': ['Intel Core Ultra 7'],
  'Core Ultra 9': ['Intel Core Ultra 9'],
};

export function mapTypeFilterToDb(value: string): string[] {
  return TYPE_FILTER_MAP[value] || [value];
}

const GENERATION_FILTER_MAP: Record<string, string[]> = {
  'Up to 9th Gen': [
    '9th Gen',
    '8th Gen',
    '7th Gen',
    '6th Gen',
    '5th Gen',
    '4th Gen',
    '3rd Gen',
    '2nd Gen',
    '1st Gen',
  ],
  '10th Gen': ['10th Gen (Comet Lake)', '10th Gen'],
  '11th Gen': ['11th Gen (Rocket Lake)', '11th Gen'],
  '12th Gen': ['12th Gen (Alder Lake)', '12th Gen'],
  '13th Gen': ['13th Gen (Raptor Lake)', '13th Gen'],
  '14th Gen': ['14th Gen (Raptor Lake Refresh)', '14th Gen'],
};

export function mapGenerationFilterToDb(value: string): string[] {
  if (value === 'Up to 9th Gen') {
    return GENERATION_FILTER_MAP['Up to 9th Gen'];
  }
  return GENERATION_FILTER_MAP[value] || [value];
}

export function generationDbValueMatchesFilter(filterValue: string, dbValue: string): boolean {
  if (filterValue === 'Up to 9th Gen') {
    return GENERATION_FILTER_MAP['Up to 9th Gen'].some(
      (token) => dbValue.includes(token) || dbValue.toLowerCase().includes('9th gen')
    );
  }
  const candidates = mapGenerationFilterToDb(filterValue);
  return candidates.some((c) => dbValue === c || dbValue.includes(filterValue.replace(' Gen', '')));
}

const SOCKET_FILTER_MAP: Record<string, string[]> = {
  LGA2011: ['LGA2011', 'LGA 2011'],
  LGA1155: ['LGA1155', 'LGA 1155'],
  LGA1200: ['LGA1200', 'LGA 1200'],
  LGA1700: ['LGA1700', 'LGA 1700'],
  LGA1851: ['LGA1851', 'LGA 1851', 'FCLGA1851'],
};

export function mapSocketFilterToDb(value: string): string[] {
  return SOCKET_FILTER_MAP[value] || [value];
}

export function parseClockGhz(value: string): number | null {
  const match = value.match(/[\d.]+/);
  return match ? Number(match[0]) : null;
}

export function clockBucketMatches(bucket: string, ghz: number): boolean {
  switch (bucket) {
    case 'Up to 2.4GHz':
      return ghz <= 2.4;
    case '2.5GHz to 3.4GHz':
      return ghz >= 2.5 && ghz <= 3.4;
    case '3.5GHz to 3.9GHz':
      return ghz >= 3.5 && ghz <= 3.9;
    case '4.0GHz to 5.0GHz':
      return ghz >= 4.0 && ghz <= 5.0;
    case 'Above 5.1GHz':
      return ghz >= 5.1;
    default:
      return false;
  }
}

export function parseCacheMb(value: string): number | null {
  const match = value.match(/[\d.]+/);
  return match ? Number(match[0]) : null;
}

export function cacheBucketMatches(bucket: string, mb: number): boolean {
  switch (bucket) {
    case '2MB to 8MB':
      return mb >= 2 && mb <= 8;
    case '9MB to 12MB':
      return mb >= 9 && mb <= 12;
    case '14MB to 30MB':
      return mb >= 14 && mb <= 30;
    case '32MB & Above':
      return mb >= 32;
    default:
      return false;
  }
}

export const PROCESSOR_SPEC_FILTER_KEYS = [
  'generation',
  'processor_model',
  'socket_type',
  'number_of_cores',
  'number_of_threads',
  'base_clock',
  'cache_size',
] as const;
