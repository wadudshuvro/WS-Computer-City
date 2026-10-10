/** Smart Watch brands from Star Tech Gadget → Smart Watch, plus brands shown on the category page. */
export const WATCH_BRANDS: { slug: string; label: string }[] = [
  'Amazfit',
  'Apple',
  'Black Shark',
  'boAt',
  'COLMI',
  'DIZO',
  'Google',
  'Havit',
  'Haylou',
  'HiFuture',
  'HUAWEI',
  'IMILAB',
  'Kieslect',
  'KOSPET',
  'OnePlus',
  'Oraimo',
  'QCY',
  'Realme',
  'RIVERSONG',
  'Samsung',
  'Titan',
  'WiWU',
  'Xiaomi',
  'XTRA',
  'Yison',
  'Zeblaze',
  'Remax',
  'Joyroom',
  'Awei',
  'MOVR',
  'Tecno',
  'BWOO',
  'CHARG',
  'Unikyy',
  'XO',
  'Fastrack',
  'Fire-Boltt',
  'Weofly',
  'HONOR',
  'cmf by NOTHING',
  'KFI',
].map((label) => ({
  label,
  slug: label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, ''),
}));

export const WATCH_LISTING_URL = 'https://www.startech.com.bd/gadget/smart-watch';

export function watchListingHref(brandSlug?: string | null): string {
  const params = new URLSearchParams({ category: 'watch' });
  if (brandSlug) params.set('brand', brandSlug);
  return `/products?${params.toString()}`;
}
