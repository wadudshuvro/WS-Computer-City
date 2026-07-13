export function mapRamSizeFilterToDb(value: string): string[] {
  const numeric = value.replace(/GB$/i, '').trim();
  return [value, `${numeric} GB`, `${numeric}GB`, numeric];
}

export function ramSizeDbValueMatches(filterValue: string, dbValue: string): boolean {
  const candidates = mapRamSizeFilterToDb(filterValue);
  const normalizedDb = dbValue.replace(/\s+/g, '').toLowerCase();
  return candidates.some(
    (c) => normalizedDb === c.replace(/\s+/g, '').toLowerCase() || dbValue === c
  );
}

export function mapRamSpeedFilterToPatterns(value: string): string[] {
  const numeric = value.replace(/\s*MHz$/i, '').trim();
  return [value, `${numeric}MHz`, `${numeric} MHz`, numeric];
}

export function ramSpeedDbValueMatches(filterValue: string, dbValue: string): boolean {
  const patterns = mapRamSpeedFilterToPatterns(filterValue);
  const normalizedDb = dbValue.replace(/\s+/g, '').toLowerCase();
  return patterns.some((p) => normalizedDb.includes(p.replace(/\s+/g, '').toLowerCase()));
}

export const RAM_SPEC_FILTER_KEYS = [
  'memory_type',
  'speed',
  'capacity',
  'ram_features',
] as const;
