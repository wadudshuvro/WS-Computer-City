/**
 * Star Tech Accessories mega-menu children.
 * Order matches the Accessories category child list on startech.com.bd/accessories.
 */

import { ACCESSORIES_LEAVES, catalogLeafHref } from '@/lib/storefrontCatalog';

export type AccessoriesMenuItem = {
  name: string;
  slug: string;
  href: string;
  hideArrow?: boolean;
};

export const ACCESSORIES_MENU_ITEMS: AccessoriesMenuItem[] = [
  ...ACCESSORIES_LEAVES.map((leaf) => ({
    name: leaf.name,
    slug: leaf.slug,
    href: catalogLeafHref(leaf),
  })),
  {
    name: 'Show All Accessories',
    slug: 'accessories-all',
    href: '/products?category=accessories',
    hideArrow: true,
  },
];
