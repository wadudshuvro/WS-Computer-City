import {
  MOTHERBOARD_FORM_FACTORS,
  MOTHERBOARD_MAKER_BRANDS,
  MOTHERBOARD_SPEC_FILTER_KEYS,
} from '@/lib/motherboardFilterOptions';

/** Expand sidebar maker (e.g. msi) to CMS brand slugs (msi-intel, msi-amd, msi). */
export function mapMotherboardMakerToBrandSlugs(maker: string): string[] {
  const base = maker.toLowerCase().trim();
  return [base, `${base}-intel`, `${base}-amd`];
}

export function motherboardMakerMatchesBrandSlug(maker: string, brandSlug: string): boolean {
  const slugs = mapMotherboardMakerToBrandSlugs(maker);
  const normalized = brandSlug.toLowerCase();
  return slugs.some((s) => normalized === s || normalized.startsWith(`${s}-`));
}

export function mapFormFactorFilterToPatterns(value: string): string[] {
  switch (value) {
    case 'Micro ATX':
      return ['Micro ATX', 'mATX', 'Micro-ATX', 'micro atx'];
    case 'Mini ITX':
      return ['Mini ITX', 'Mini-ITX', 'ITX', 'mITX'];
    case 'Extended ATX':
      return ['Extended ATX', 'E-ATX', 'EATX', 'Extended-ATX'];
    case 'ATX':
      return ['ATX'];
    default:
      return [value];
  }
}

export function formFactorDbValueMatches(filterValue: string, dbValue: string): boolean {
  const patterns = mapFormFactorFilterToPatterns(filterValue);
  const normalizedDb = dbValue.replace(/\s+/g, '').toLowerCase();
  return patterns.some((p) => {
    const normalized = p.replace(/\s+/g, '').toLowerCase();
    if (filterValue === 'ATX') {
      // Avoid matching E-ATX / Micro ATX when filtering plain ATX
      if (/eatx|extended|matx|micro|mini|mitx/i.test(dbValue.replace(/\s+/g, ''))) {
        return false;
      }
      return normalizedDb === 'atx' || /\batx\b/i.test(dbValue);
    }
    return normalizedDb.includes(normalized) || dbValue.toLowerCase().includes(p.toLowerCase());
  });
}

export function socketDbValueMatches(filterValue: string, dbValue: string): boolean {
  const normalizedDb = dbValue.replace(/\s+/g, '').toUpperCase();
  const normalizedFilter = filterValue.replace(/\s+/g, '').toUpperCase();
  return normalizedDb.includes(normalizedFilter);
}

export function specialFeatureDbValueMatches(filterValue: string, dbValue: string): boolean {
  const db = dbValue.toLowerCase();
  const filter = filterValue.toLowerCase();
  if (filter === 'm.2' || filter === 'm2') {
    return db.includes('m.2') || db.includes('m2');
  }
  if (filter === 'wi-fi' || filter === 'wifi') {
    return db.includes('wi-fi') || db.includes('wifi') || db.includes('wireless');
  }
  return db.includes(filter);
}

export function processorTypeMatchesBrandOrCategory(
  processorType: string,
  brandSlug?: string | null,
  categorySlug?: string | null
): boolean {
  const type = processorType.toLowerCase();
  const brand = (brandSlug || '').toLowerCase();
  const category = (categorySlug || '').toLowerCase();

  if (type === 'intel') {
    return (
      brand.endsWith('-intel') ||
      brand === 'intel' ||
      brand === 'intel-motherboard' ||
      category.includes('intel')
    );
  }
  if (type === 'amd') {
    return (
      brand.endsWith('-amd') ||
      brand === 'amd' ||
      brand === 'amd-motherboard' ||
      category.includes('amd')
    );
  }
  return false;
}

export { MOTHERBOARD_SPEC_FILTER_KEYS, MOTHERBOARD_FORM_FACTORS, MOTHERBOARD_MAKER_BRANDS };
