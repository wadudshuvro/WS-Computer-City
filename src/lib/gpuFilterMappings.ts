import type { GpuChipsetBrand } from '@/lib/filterConfig';
import { GPU_SPEC_FILTER_KEYS } from '@/lib/gpuFilterOptions';

export { GPU_SPEC_FILTER_KEYS };
export type { GpuSpecFilterKey } from '@/lib/gpuFilterOptions';

export function mapMemorySizeFilterToDb(value: string): string[] {
  const numeric = value.replace(/GB$/i, '').trim();
  return [`${numeric} GB`, `${numeric}GB`, value];
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

/** Match Star Tech-style chipset series against stored series or gpu_chipset text. */
export function mapChipsetSeriesToPatterns(value: string): string[] {
  switch (value) {
    case 'GT 700':
      return ['gt 7', 'gt7', 'geforce gt 7'];
    case 'GT 1000':
      return ['gt 10', 'gt10', 'gtx 10', 'gtx10'];
    case 'GTX 1600':
      return ['gtx 16', 'gtx16', '1660', '1650', '1630'];
    case 'RTX 3000':
      return ['rtx 30', 'rtx30', '3090', '3080', '3070', '3060', '3050'];
    case 'RTX 4000':
      return ['rtx 40', 'rtx40', '4090', '4080', '4070', '4060', '4050'];
    case 'RTX 5000':
      return ['rtx 50', 'rtx50', '5090', '5080', '5070', '5060', '5050'];
    case 'RTX PRO':
      return ['rtx pro', 'quadro', 'rtx a', 'rtx 6000', 'rtx 5000 ada'];
    case 'RX 500':
      return ['rx 5', 'rx5', 'rx 550', 'rx 560', 'rx 570', 'rx 580', 'rx 590'];
    case 'RX 6000':
      return ['rx 6', 'rx6', '6900', '6800', '6750', '6700', '6650', '6600', '6500', '6400'];
    case 'RX 7000':
      return ['rx 7', 'rx7', '7900', '7800', '7700', '7600'];
    case 'RX 8000':
      return ['rx 8', 'rx8'];
    case 'RX 9000':
      return ['rx 9', 'rx9', '9070', '9060'];
    case 'Arc A':
      return ['arc a', 'intel arc'];
    default:
      return [value.toLowerCase()];
  }
}

export function chipsetSeriesDbValueMatches(filterValue: string, dbValue: string): boolean {
  const lower = dbValue.toLowerCase();
  if (lower === filterValue.toLowerCase()) return true;
  return mapChipsetSeriesToPatterns(filterValue).some((p) => lower.includes(p));
}

export function resolutionDbValueMatches(filterValue: string, dbValue: string): boolean {
  const normalizedFilter = filterValue.replace(/\s+/g, '').toLowerCase();
  const normalizedDb = dbValue.replace(/\s+/g, '').toLowerCase();
  return normalizedDb.includes(normalizedFilter) || normalizedDb.includes(filterValue.toLowerCase());
}

export function portTypeDbValueMatches(filterValue: string, dbValue: string): boolean {
  const lower = dbValue.toLowerCase();
  switch (filterValue) {
    case 'HDMI':
      return lower.includes('hdmi');
    case 'DisplayPort':
      return lower.includes('displayport') || lower.includes('display port') || /\bdp\b/.test(lower);
    case 'Mini DisplayPort':
      return lower.includes('mini displayport') || lower.includes('mini-dp') || lower.includes('mdp');
    case 'DVI':
      return lower.includes('dvi');
    case 'VGA (D-Sub)':
      return lower.includes('vga') || lower.includes('d-sub') || lower.includes('dsub');
    case 'Type-C':
      return (
        lower.includes('type-c') ||
        lower.includes('type c') ||
        lower.includes('usb-c') ||
        lower.includes('usbc')
      );
    default:
      return lower.includes(filterValue.toLowerCase());
  }
}

export function coolingTypeDbValueMatches(filterValue: string, dbValue: string): boolean {
  const lower = dbValue.toLowerCase();
  const filter = filterValue.toLowerCase();
  if (lower.includes(filter)) return true;
  if (filter === 'single fan') return lower.includes('1 fan') || lower.includes('one fan');
  if (filter === 'dual fan') return lower.includes('2 fan') || lower.includes('two fan');
  if (filter === 'triple fan') return lower.includes('3 fan') || lower.includes('three fan');
  return false;
}

export function resolveGpuChipsetBrand(
  sub?: string | null,
  type?: string | null
): GpuChipsetBrand {
  if (sub === 'amd-gpu' || type === 'amd-gpu') return 'amd';
  return 'nvidia';
}
