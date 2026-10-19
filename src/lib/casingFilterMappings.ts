import { CASING_SPEC_FILTER_KEYS } from '@/lib/casingSpecDefinitions';

export { CASING_SPEC_FILTER_KEYS };

export function motherboardTypeDbValueMatches(filterValue: string, dbValue: string): boolean {
  const tokens = dbValue
    .toLowerCase()
    .split(/[,/|]+/)
    .map((token) => token.replace(/\s+/g, ''));
  const f = filterValue.toLowerCase().replace(/\s+/g, '');
  const isMicro = (token: string) => /micro-?atx|matx|m-atx/.test(token);
  const isMini = (token: string) => /mini-?itx|mitx|^itx$/.test(token);
  const isEatx = (token: string) => /e-?atx|extendedatx|extended/.test(token);
  const isAtx = (token: string) => /atx/.test(token) && !isMicro(token) && !isEatx(token) && !token.includes('mini');
  if (f === 'micro-atx' || f === 'matx') return tokens.some(isMicro);
  if (f === 'mini-itx' || f === 'mitx') return tokens.some(isMini);
  if (f === 'e-atx' || f === 'eatx') return tokens.some(isEatx);
  if (f === 'atx') return tokens.some(isAtx);
  return tokens.some((token) => token.includes(f));
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
