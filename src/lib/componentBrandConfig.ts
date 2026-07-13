import type { MainCategorySlug } from '@/lib/categoryConfig';
import { GPU_MANUFACTURER_BRANDS } from '@/lib/filterConfig';
import { RAM_BRANDS } from '@/lib/ramSpecDefinitions';

export interface ComponentBrandOption {
  slug: string;
  label: string;
}

/** Motherboard brands — Star Tech style (chipset-specific board makers) */
export const MOTHERBOARD_BRANDS: ComponentBrandOption[] = [
  { slug: 'msi-intel', label: 'MSI (Intel)' },
  { slug: 'msi-amd', label: 'MSI (AMD)' },
  { slug: 'asrock-intel', label: 'ASRock (Intel)' },
  { slug: 'asrock-amd', label: 'ASRock (AMD)' },
  { slug: 'asus-intel', label: 'ASUS (Intel)' },
  { slug: 'asus-amd', label: 'ASUS (AMD)' },
  { slug: 'gigabyte-intel', label: 'GIGABYTE (Intel)' },
  { slug: 'gigabyte-amd', label: 'GIGABYTE (AMD)' },
  { slug: 'colorful-intel', label: 'Colorful (Intel)' },
  { slug: 'colorful-amd', label: 'Colorful (AMD)' },
  { slug: 'intel-motherboard', label: 'Intel Motherboard' },
  { slug: 'amd-motherboard', label: 'AMD Motherboard' },
];

export const PROCESSOR_BRANDS: ComponentBrandOption[] = [
  { slug: 'intel', label: 'Intel' },
  { slug: 'amd', label: 'AMD' },
];

export const RAM_COMPONENT_BRANDS: ComponentBrandOption[] = RAM_BRANDS;

export const GRAPHICS_CARD_BRANDS: ComponentBrandOption[] = GPU_MANUFACTURER_BRANDS.map((b) => ({
  slug: b.value,
  label: b.label,
}));

/**
 * Per-component brand lists for CMS Add/Edit product forms.
 * Add a new entry here when a component needs its own brand dropdown.
 */
export const COMPONENT_BRAND_OPTIONS: Partial<Record<MainCategorySlug, ComponentBrandOption[]>> = {
  motherboard: MOTHERBOARD_BRANDS,
  processor: PROCESSOR_BRANDS,
  graphics_card: GRAPHICS_CARD_BRANDS,
  ram: RAM_COMPONENT_BRANDS,
};

export function hasComponentBrandFilter(mainCategory: string): boolean {
  return mainCategory in COMPONENT_BRAND_OPTIONS;
}

export function getComponentBrandSlugs(mainCategory: string): string[] | null {
  const options = COMPONENT_BRAND_OPTIONS[mainCategory as MainCategorySlug];
  if (!options) return null;
  return options.map((o) => o.slug);
}

export function filterBrandsForComponent<T extends { id: string; slug: string }>(
  brands: T[],
  mainCategory: string,
  options?: { includeBrandId?: string }
): T[] {
  const slugs = getComponentBrandSlugs(mainCategory);
  let result: T[];

  if (!slugs) {
    result = [...brands];
  } else {
    const slugOrder = new Map(slugs.map((slug, index) => [slug, index]));
    result = brands
      .filter((brand) => slugOrder.has(brand.slug))
      .sort((a, b) => (slugOrder.get(a.slug) ?? 0) - (slugOrder.get(b.slug) ?? 0));
  }

  if (options?.includeBrandId) {
    const current = brands.find((b) => b.id === options.includeBrandId);
    if (current && !result.some((b) => b.id === current.id)) {
      result = [current, ...result];
    }
  }

  return result;
}
