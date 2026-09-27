import { MOTHERBOARD_BRANDS } from '@/lib/componentBrandConfig';

/**
 * Storefront listing URL for a category (or brand-leaf) slug.
 * PDP breadcrumbs must land on the filtered category page, not /products.
 */
export function resolveStorefrontCategoryHref(slug: string): string {
  switch (slug) {
    case 'components':
    case 'component':
      return '/products?category=components';

    case 'processor':
      return '/products?category=components&sub=processor';
    case 'amd':
    case 'amd-ryzen':
      return '/products?category=components&sub=processor&brand=amd';
    case 'intel':
      return '/products?category=components&sub=processor&brand=intel';

    case 'graphics-card':
      return '/products?category=components&sub=graphics-card';
    case 'nvidia':
      return '/products?category=components&sub=graphics-card&type=nvidia';
    case 'amd-gpu':
      return '/products?category=components&sub=graphics-card&type=amd-gpu';

    case 'motherboard':
      return '/products?category=components&sub=motherboard';
    case 'intel-motherboard':
    case 'amd-motherboard':
      return '/products?category=components&sub=motherboard';

    case 'desktop-ram':
    case 'ram':
      return '/products?category=components&sub=desktop-ram';
    case 'laptop-ram':
      return '/products?category=components&sub=laptop-ram';
    case 'ddr4-ram':
      return '/products?category=components&sub=desktop-ram&memory_type=DDR4';
    case 'ddr5-ram':
      return '/products?category=components&sub=desktop-ram&memory_type=DDR5';

    case 'power-supply':
    case 'psu':
      return '/products?category=components&sub=power-supply';
    case 'ssd':
    case 'nvme':
    case 'storage':
      return '/products?category=components&sub=ssd';
    case 'computer-case':
    case 'casing':
    case 'case':
      return '/products?category=components&sub=computer-case';
    case 'cpu-cooler':
    case 'cooler':
      return '/products?category=components&sub=cpu-cooler';

    default:
      return `/products?category=components&sub=${slug}`;
  }
}

/**
 * Motherboard PDP leaf crumb: GIGABYTE (Intel) → listing with that brand pill.
 * Replaces the Intel Motherboard / AMD Motherboard category slug.
 */
export function resolveMotherboardBrandCrumb(
  brandSlug: string,
  platformCategorySlug: string
): { href: string; label: string } {
  const platform = /amd/.test(platformCategorySlug) ? 'amd' : 'intel';
  const exact = MOTHERBOARD_BRANDS.find((b) => b.slug === brandSlug);
  if (
    exact &&
    exact.slug !== 'intel-motherboard' &&
    exact.slug !== 'amd-motherboard'
  ) {
    return {
      label: exact.label,
      href: `/products?category=components&sub=motherboard&brand=${exact.slug}`,
    };
  }

  const maker = brandSlug.replace(/-(intel|amd)$/i, '').toLowerCase();
  const inferredSlug = `${maker}-${platform}`;
  const inferred = MOTHERBOARD_BRANDS.find((b) => b.slug === inferredSlug);
  const slug = inferred?.slug || inferredSlug;
  const label = inferred?.label || `${maker.toUpperCase()} (${platform === 'amd' ? 'AMD' : 'Intel'})`;

  return {
    label,
    href: `/products?category=components&sub=motherboard&brand=${slug}`,
  };
}
