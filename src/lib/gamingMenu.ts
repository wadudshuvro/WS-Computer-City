/**
 * Star Tech Gaming menu. Child-list order from startech.com.bd/gaming,
 * plus Gaming Laptop, Gaming Monitor, and Gaming Router from the Gaming nav.
 */

import type { MenuTreeItem } from '@/lib/menu';
import { GAMING_LEAVES, catalogLeafHref } from '@/lib/storefrontCatalog';

export type GamingMenuItem = {
  name: string;
  slug: string;
  href: string;
  hideArrow?: boolean;
};

export const GAMING_MENU_ITEMS: GamingMenuItem[] = [
  ...GAMING_LEAVES.map((leaf) => ({
    name: leaf.name,
    slug: leaf.slug,
    href: catalogLeafHref(leaf),
  })),
  {
    name: 'Show All Gaming',
    slug: 'gaming-all',
    href: '/products?category=gaming',
    hideArrow: true,
  },
];

type BrandRef = { slug: string; label: string };

function brandHref(subSlug: string, brandSlug: string) {
  return `/products?category=gaming&sub=${subSlug}&brand=${brandSlug}`;
}

function toMenuChildren(subSlug: string, brands: BrandRef[]): MenuTreeItem[] {
  return brands.map((brand, index) => ({
    id: `gaming-brand-${subSlug}-${brand.slug}`,
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

function brands(labels: string[]): BrandRef[] {
  return labels.map((label) => ({
    label,
    slug: label
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  }));
}

/** Brand flyouts taken from the Star Tech Gaming menu, not invented. */
export const GAMING_BRAND_FLYOUTS: Record<string, BrandRef[]> = {
  'gaming-chair': brands([
    'Xtrike Me',
    'Phantom Edge',
    'Corsair',
    'Gigabyte',
    'Fantech',
    'Thermaltake',
    'Cougar',
  ]),
  gamepad: brands([
    'Xbox',
    'PlayStation',
    'Nintendo',
    'Xtrike Me',
    'Logitech',
    'Fantech',
    'Havit',
    'Rapoo',
    'Redragon',
    'Thunderobot',
    'SteelSeries',
    'Corsair',
    'PXN',
    '8BitDo',
  ]),
};

export function enrichGamingBrandFlyouts(tree: MenuTreeItem[]): MenuTreeItem[] {
  return tree.map((top) => {
    if (top.slug !== 'gaming') return top;
    return {
      ...top,
      children: top.children.map((sub) => {
        if (sub.children.length > 0) return sub;
        const list = GAMING_BRAND_FLYOUTS[sub.slug];
        if (!list?.length) return sub;
        return { ...sub, hideArrow: false, children: toMenuChildren(sub.slug, list) };
      }),
    };
  });
}
