import type { GpuChipsetBrand } from '@/lib/filterConfig';

export function mapMemorySizeFilterToDb(value: string): string[] {
  const numeric = value.replace(/GB$/i, '').trim();
  return [`${numeric} GB`, `${numeric}GB`, `${numeric} GB`, value];
}

export function memorySizeDbValueMatches(filterValue: string, dbValue: string): boolean {
  const candidates = mapMemorySizeFilterToDb(filterValue);
  const normalizedDb = dbValue.replace(/\s+/g, '').toLowerCase();
  return candidates.some(
    (c) => normalizedDb === c.replace(/\s+/g, '').toLowerCase() || dbValue === c
  );
}

export function mapGpuChipsetFilterToPatterns(value: string): string[] {
  switch (value) {
    case 'NVIDIA GeForce':
      return ['geforce', 'rtx', 'gtx', 'nvidia', 'quadro'];
    case 'AMD Radeon':
      return ['radeon', 'rx 6', 'rx 7', 'rx 9', 'rx 5', 'rx6', 'rx7', 'rx9', 'amd radeon'];
    case 'Intel Arc':
      return ['intel arc', 'arc a'];
    default:
      return [value.toLowerCase()];
  }
}

export function gpuChipsetDbValueMatches(filterValue: string, dbValue: string): boolean {
  const patterns = mapGpuChipsetFilterToPatterns(filterValue);
  const lower = dbValue.toLowerCase();
  return patterns.some((p) => lower.includes(p));
}

export function resolutionDbValueMatches(filterValue: string, dbValue: string): boolean {
  const normalizedFilter = filterValue.replace(/\s+/g, '').toLowerCase();
  const normalizedDb = dbValue.replace(/\s+/g, '').toLowerCase();
  return normalizedDb.includes(normalizedFilter) || normalizedDb.includes(filterValue.toLowerCase());
}

export function resolveGpuChipsetBrand(
  sub?: string | null,
  type?: string | null
): GpuChipsetBrand {
  if (sub === 'amd-gpu' || type === 'amd-gpu') return 'amd';
  return 'nvidia';
}

export const GPU_SPEC_FILTER_KEYS = [
  'manufacturer',
  'gpu_chipset',
  'memory_size',
  'memory_type',
  'resolution',
] as const;
