import { CASING_SPEC_FILTER_KEYS } from '@/lib/casingSpecDefinitions';

export { CASING_SPEC_FILTER_KEYS };

export function motherboardTypeDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase().replace(/\s+/g, '');
  const f = filterValue.toLowerCase().replace(/\s+/g, '');
  if (d.includes(f)) return true;
  if (f === 'micro-atx' || f === 'matx') {
    return d.includes('micro-atx') || d.includes('matx') || d.includes('m-atx');
  }
  if (f === 'mini-itx' || f === 'mitx') {
    return d.includes('mini-itx') || d.includes('mitx') || d.includes('itx');
  }
  if (f === 'e-atx' || f === 'eatx') {
    return d.includes('e-atx') || d.includes('eatx') || d.includes('extended');
  }
  if (f === 'atx') {
    return (d.includes('atx') || /\batx\b/.test(dbValue.toLowerCase())) && !d.includes('micro') && !d.includes('mini') && !d.includes('e-atx') && !d.includes('eatx');
  }
  return false;
}

export function sidePanelDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase();
  const f = filterValue.toLowerCase();
  if (d.includes(f)) return true;
  if (f === 'tempered glass') return d.includes('tempered') || d.includes('tg panel') || d.includes('glass');
  if (f === 'side window') return d.includes('window') || d.includes('side glass');
  if (f === 'full window') return d.includes('full window') || d.includes('full glass');
  if (f === 'solid panel') return d.includes('solid') || d.includes('steel panel');
  return false;
}

export function specialFeatureDbValueMatches(filterValue: string, dbValue: string): boolean {
  const d = dbValue.toLowerCase();
  const f = filterValue.toLowerCase();
  if (f === 'rgb') return /\brgb\b/.test(d) && !d.includes('argb');
  if (f === 'argb') return d.includes('argb') || d.includes('addressable');
  if (f === 'glass side panel') {
    return d.includes('glass') || d.includes('tempered') || d.includes('side panel');
  }
  return d.includes(f);
}
