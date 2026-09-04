import { CPU_COOLER_SPEC_FILTER_KEYS } from '@/lib/cpuCoolerSpecDefinitions';

export { CPU_COOLER_SPEC_FILTER_KEYS };

export function socketDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase().replace(/\s+/g, '');
  const f = filterValue.toLowerCase().replace(/\s+/g, '');
  if (d.includes(f)) return true;
  // LGA1700 vs 1700
  if (f.startsWith('lga') && d.includes(f.replace('lga', ''))) return true;
  return false;
}

export function fanSizeDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase().replace(/\s+/g, '');
  const f = filterValue.toLowerCase().replace(/\s+/g, '');
  if (d.includes(f)) return true;
  const mm = f.replace('mm', '');
  return d.includes(`${mm}mm`) || d.includes(mm);
}

/** Map stored RPM text / range label to filter buckets */
export function fanSpeedDbValueMatches(filterValue: string, dbValue: string): boolean {
  const label = filterValue.toLowerCase();
  const raw = dbValue.toLowerCase();

  if (raw.includes(label) || raw === label) return true;

  // Extract highest number that looks like RPM
  const numbers = [...raw.matchAll(/(\d+)\s*(?:rpm)?/gi)].map((m) => Number(m[1]));
  const maxRpm = numbers.length > 0 ? Math.max(...numbers) : NaN;

  if (Number.isNaN(maxRpm)) {
    if (label.includes('up to 1500')) return raw.includes('1500') || raw.includes('low');
    if (label.includes('1500') && label.includes('2500')) return raw.includes('2000') || raw.includes('2500');
    if (label.includes('above 2500')) return raw.includes('3000') || raw.includes('above');
    return false;
  }

  if (label.includes('up to 1500')) return maxRpm <= 1500;
  if (label.includes('1500') && label.includes('2500')) return maxRpm > 1500 && maxRpm <= 2500;
  if (label.includes('above 2500')) return maxRpm > 2500;
  return false;
}

export function coolerSpecialFeatureDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase();
  const f = filterValue.toLowerCase();
  if (f === 'rgb') return /\brgb\b/.test(d) && !d.includes('argb');
  if (f === 'argb') return d.includes('argb') || d.includes('addressable');
  return d.includes(f);
}

export function processorTypeDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase();
  const f = filterValue.toLowerCase();
  if (d.includes(f)) return true;
  if (f === 'intel') return d.includes('lga') || d.includes('intel');
  if (f === 'amd') return d.includes('am4') || d.includes('am5') || d.includes('amd') || d.includes('ryzen');
  return false;
}
