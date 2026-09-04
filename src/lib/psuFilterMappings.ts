import { PSU_SPEC_FILTER_KEYS } from '@/lib/psuSpecDefinitions';

export { PSU_SPEC_FILTER_KEYS };

export function mapWattageFilterToPatterns(value: string): string[] {
  const numeric = value.replace(/W$/i, '').trim();
  return [value, `${numeric}W`, `${numeric} W`, `${numeric} Watt`, `${numeric}Watt`];
}

export function wattageDbValueMatches(filterValue: string, dbValue: string): boolean {
  const filterNum = filterValue.replace(/W$/i, '').trim();
  const db = dbValue.toLowerCase().replace(/\s+/g, '');
  return (
    db.includes(`${filterNum.toLowerCase()}w`) ||
    db === filterNum.toLowerCase() ||
    dbValue.trim().toLowerCase() === filterValue.toLowerCase()
  );
}

export function efficiencyDbValueMatches(filterValue: string, dbValue: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/80\s*\+|80\s*plus/g, '80 plus')
      .replace(/\s+/g, ' ')
      .trim();
  const f = normalize(filterValue);
  const d = normalize(dbValue);
  if (d === f || d.includes(f)) return true;
  // "80 Plus" alone should not match Bronze/Gold/etc. as equal, but contains is ok for exact tier
  if (f === '80 plus') {
    return d === '80 plus' || d === '80 plus white' || d === '80 plus standard';
  }
  return false;
}

export function modularDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase().replace(/\s+/g, '');
  const f = filterValue.toLowerCase().replace(/\s+/g, '');
  if (d.includes(f) || d === f) return true;
  if (f === 'full-modular' || f === 'fullymodular') {
    return d.includes('fullmodular') || d.includes('fullymodular') || d.includes('full-modular');
  }
  if (f === 'semi-modular' || f === 'semimodular') {
    return d.includes('semimodular') || d.includes('semi-modular');
  }
  if (f === 'non-modular' || f === 'nonmodular') {
    return d.includes('nonmodular') || d.includes('non-modular') || d.includes('fixedcable');
  }
  return false;
}
