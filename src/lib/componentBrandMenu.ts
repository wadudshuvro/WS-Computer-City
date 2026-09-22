import { RAM_BRANDS } from '@/lib/ramSpecDefinitions';
import { PSU_BRANDS } from '@/lib/psuSpecDefinitions';
import { SSD_BRANDS } from '@/lib/ssdSpecDefinitions';
import { CASING_BRANDS } from '@/lib/casingSpecDefinitions';
import { CPU_COOLER_BRANDS } from '@/lib/cpuCoolerSpecDefinitions';
import type { MenuTreeItem } from '@/lib/menu';
import { enrichAccessoriesBrandFlyouts } from '@/lib/accessoriesBrandMenu';

type BrandRef = { slug: string; label: string };

/** Star Tech–style order for Desktop RAM brand flyout (rest appended after). */
const DESKTOP_RAM_MENU_BRAND_ORDER = [
  'team',
  'colorful',
  'corsair',
  'kingston',
  'pny',
  'g-skill',
  'aitc',
  'lexar',
  'netac',
  'ocpc',
  'oscoo',
  'kingbank',
] as const;

/** Laptop RAM menu brands only (Star Tech reference). */
const LAPTOP_RAM_MENU_BRANDS: BrandRef[] = [
  { slug: 'team', label: 'TEAM' },
  { slug: 'adata', label: 'Adata' },
  { slug: 'g-skill', label: 'G.Skill' },
  { slug: 'lexar', label: 'Lexar' },
  { slug: 'corsair', label: 'Corsair' },
  { slug: 'pny', label: 'PNY' },
  { slug: 'ocpc', label: 'OCPC' },
  { slug: 'netac', label: 'Netac' },
];

function brandHref(subSlug: string, brandSlug: string) {
  return `/products?category=components&sub=${subSlug}&brand=${brandSlug}`;
}

function toMenuChildren(
  parentKey: string,
  subSlug: string,
  brands: BrandRef[]
): MenuTreeItem[] {
  return brands.map((brand, index) => ({
    id: `brand-${parentKey}-${brand.slug}`,
    name: brand.label,
    slug: brand.slug,
    level: 2,
    sortOrder: index,
    href: brandHref(subSlug, brand.slug),
    categoryId: null,
    categorySlug: null,
    isVisible: true,
    hideArrow: false,
    children: [],
  }));
}

function getDesktopRamBrands(): BrandRef[] {
  const bySlug = new Map(RAM_BRANDS.map((b) => [b.slug, b]));
  const ordered: BrandRef[] = [];
  const seen = new Set<string>();

  for (const slug of DESKTOP_RAM_MENU_BRAND_ORDER) {
    const brand = bySlug.get(slug);
    if (brand) {
      ordered.push(brand);
      seen.add(slug);
    }
  }

  for (const brand of RAM_BRANDS) {
    if (!seen.has(brand.slug)) ordered.push(brand);
  }

  return ordered;
}

/** Brand flyouts keyed by Component sub-menu slug (same as pre-CMS MegaMenu). */
export function getComponentBrandFlyout(subSlug: string): MenuTreeItem[] | null {
  switch (subSlug) {
    case 'desktop-ram':
      return toMenuChildren(subSlug, subSlug, getDesktopRamBrands());
    case 'laptop-ram':
      return toMenuChildren(subSlug, subSlug, LAPTOP_RAM_MENU_BRANDS);
    case 'power-supply':
      return toMenuChildren(
        subSlug,
        subSlug,
        PSU_BRANDS.map((b) => ({ slug: b.slug, label: b.label }))
      );
    case 'ssd':
      return toMenuChildren(
        subSlug,
        subSlug,
        SSD_BRANDS.map((b) => ({ slug: b.slug, label: b.label }))
      );
    case 'computer-case':
    case 'casing':
      return toMenuChildren(
        'computer-case',
        'computer-case',
        CASING_BRANDS.map((b) => ({ slug: b.slug, label: b.label }))
      );
    case 'cpu-cooler':
      return toMenuChildren(
        subSlug,
        subSlug,
        CPU_COOLER_BRANDS.map((b) => ({ slug: b.slug, label: b.label }))
      );
    default:
      return null;
  }
}

/**
 * If a Component sub has no CMS children, attach the catalog brand flyout
 * (Desktop RAM, PSU, SSD, Casing, CPU Cooler, Laptop RAM).
 * Accessories brand flyouts are applied separately without changing Component.
 */
export function enrichMenuWithBrandFlyouts(tree: MenuTreeItem[]): MenuTreeItem[] {
  const withComponents = tree.map((top) => {
    if (top.slug !== 'components' && top.slug !== 'component') return top;

    return {
      ...top,
      children: top.children.map((sub) => {
        if (sub.children.length > 0 || sub.hideArrow) return sub;
        const brands = getComponentBrandFlyout(sub.slug);
        if (!brands?.length) return sub;
        return { ...sub, children: brands };
      }),
    };
  });

  return enrichAccessoriesBrandFlyouts(withComponents);
}

export const COMPONENT_BRAND_PARENT_SLUGS = [
  'desktop-ram',
  'laptop-ram',
  'power-supply',
  'ssd',
  'computer-case',
  'cpu-cooler',
] as const;
