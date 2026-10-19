import { siteName, siteUrl } from '@/lib/launch/site';

export const RESERVED_ROOT_SLUGS = new Set([
  'admin',
  'api',
  'products',
  'cart',
  'checkout',
  'deals',
  'terms',
  'account',
  'search',
  'pc-builder',
  'feeds',
  'uploads',
  'images',
  '_next',
]);

const INDEXABLE_LISTING_KEYS = new Set(['category', 'sub', 'page']);

export function productPath(categorySlug: string, productSlug: string): string {
  return `/${categorySlug}/${productSlug}`;
}

export function categoryPath(categorySlug: string): string {
  return `/${categorySlug}`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl()).toString();
}

function usableBlurb(value?: string | null): string | null {
  if (!value) return null;
  const text = value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  const colons = text.split(':').length - 1;
  if (text.includes('\n') || colons >= 2 || text.length > 160) return null;
  return text;
}

export function seoDescriptionWasSpecDump(stored?: string | null, shortDescription?: string | null): boolean {
  if (!stored?.trim() || !shortDescription?.trim()) return false;
  const plain = shortDescription.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').trim();
  return stored.trim() === clampText(plain, 160);
}

function isStoredOverride(value?: string | null): boolean {
  const text = value?.trim();
  if (!text) return false;
  const lower = text.toLowerCase();
  return !lower.includes('price in bangladesh') && !lower.includes('at best price') && !lower.includes('ready to ship');
}

export function clampText(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function productTitle(name: string, metaTitle?: string | null): string {
  if (isStoredOverride(metaTitle)) return clampText(metaTitle!.trim(), 60);
  const suffix = ` | ${siteName()}`;
  if (name.length + suffix.length <= 60) return `${name}${suffix}`;
  const room = Math.max(12, 60 - suffix.length - 1);
  return `${name.slice(0, room).trim()}…${suffix}`;
}

export function productKeywords(input: {
  name: string;
  brand?: string | null;
  category?: string | null;
}): string {
  const parts = [input.brand, input.category, input.name]
    .map((value) => value?.replace(/\s+/g, ' ').trim())
    .filter((value): value is string => Boolean(value));
  const unique: string[] = [];
  for (const part of parts) {
    if (!unique.some((item) => item.toLowerCase() === part.toLowerCase())) unique.push(part);
  }
  const joined = unique.join(', ');
  return joined.length <= 180 ? joined : joined.slice(0, 180).trim();
}

export function productSeoFields(input: {
  name: string;
  brand?: string | null;
  category?: string | null;
  price?: number | null;
  shortDescription?: string | null;
  warranty?: string | null;
}): { metaTitle: string; metaDescription: string; metaKeywords: string } {
  return {
    metaTitle: productTitle(input.name),
    metaDescription: productMetaDescription({
      name: input.name,
      brand: input.brand,
      price: input.price,
      shortDescription: input.shortDescription,
      warranty: input.warranty,
    }),
    metaKeywords: productKeywords(input),
  };
}

export function seoFieldNeedsFill(value?: string | null): boolean {
  return !isStoredOverride(value);
}

export function productMetaDescription(input: {
  name: string;
  brand?: string | null;
  price?: number | null;
  shortDescription?: string | null;
  metaDescription?: string | null;
  warranty?: string | null;
}): string {
  if (isStoredOverride(input.metaDescription)) return clampText(input.metaDescription!.trim(), 160);
  const short = usableBlurb(input.shortDescription);
  if (short) return short;
  const warranty = input.warranty?.trim();
  const hasWarranty = Boolean(warranty && !/^no warranty$/i.test(warranty));
  const fact = hasWarranty ? `Warranty: ${warranty}.` : 'Official product page.';
  const price = input.price != null ? ` Price ৳${Math.round(input.price)}.` : '';
  return clampText(`${input.name}${input.brand ? ` by ${input.brand}` : ''}. ${fact}${price}`, 160);
}

export function schemaAvailability(stockStatus: string): string {
  if (stockStatus === 'IN_STOCK') return 'https://schema.org/InStock';
  if (stockStatus === 'PRE_ORDER') return 'https://schema.org/PreOrder';
  return 'https://schema.org/OutOfStock';
}

export function stockLabel(stockStatus: string): string {
  if (stockStatus === 'IN_STOCK') return 'In Stock';
  if (stockStatus === 'PRE_ORDER') return 'Pre-Order';
  if (stockStatus === 'UPCOMING') return 'Upcoming';
  if (stockStatus === 'DISCONTINUED') return 'Discontinued';
  return 'Out of Stock';
}

export function listingShouldNoindex(params: Record<string, string | string[] | undefined>): boolean {
  return Object.keys(params).some((key) => !INDEXABLE_LISTING_KEYS.has(key) && params[key]);
}

export type SeoProduct = {
  name: string;
  slug: string;
  sku: string;
  description?: string | null;
  shortDescription?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  price: number;
  stockStatus: string;
  gtin?: string | null;
  mpn?: string | null;
  categorySlug: string;
  categoryName: string;
  brandName: string;
  images: string[];
};

export function productJsonLd(product: SeoProduct) {
  const path = productPath(product.categorySlug, product.slug);
  const description = productMetaDescription({
    name: product.name,
    brand: product.brandName,
    price: product.price,
    shortDescription: product.shortDescription,
    metaDescription: product.metaDescription,
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description,
    sku: product.sku,
    image: product.images.map((url) => absoluteUrl(url)),
    brand: { '@type': 'Brand', name: product.brandName },
    ...(product.gtin ? { gtin13: product.gtin } : {}),
    ...(product.mpn ? { mpn: product.mpn } : {}),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(path),
      priceCurrency: 'BDT',
      price: Math.round(product.price),
      availability: schemaAvailability(product.stockStatus),
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function slugChangeRedirects(input: {
  previousCategorySlug: string;
  previousSlug: string;
  nextCategorySlug: string;
  nextSlug: string;
}): Array<{ fromPath: string; toPath: string }> {
  const toPath = productPath(input.nextCategorySlug, input.nextSlug);
  return [
    { fromPath: `/products/${input.previousSlug}`, toPath },
    { fromPath: productPath(input.previousCategorySlug, input.previousSlug), toPath },
  ];
}

export function sitemapAllows(path: string): boolean {
  return !['/cart', '/checkout', '/admin', '/account', '/search'].some(
    (blocked) => path === blocked || path.startsWith(`${blocked}/`)
  );
}
export function organizationJsonLd() {
  const origin = siteUrl();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName(),
      url: origin,
      logo: absoluteUrl('/logo.svg'),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName(),
      url: origin,
    },
  ];
}
