import { RAM_BRANDS } from '@/lib/ramSpecDefinitions';
import { PSU_BRANDS } from '@/lib/psuSpecDefinitions';
import { SSD_BRANDS } from '@/lib/ssdSpecDefinitions';
import { CASING_BRANDS } from '@/lib/casingSpecDefinitions';
import { CPU_COOLER_BRANDS } from '@/lib/cpuCoolerSpecDefinitions';
import type { MenuTreeItem } from '@/lib/menu';
import { enrichAccessoriesBrandFlyouts } from '@/lib/accessoriesBrandMenu';
import { ACCESSORIES_MENU_ITEMS } from '@/lib/accessoriesMenuItems';
import { enrichGamingBrandFlyouts, GAMING_MENU_ITEMS } from '@/lib/gamingMenu';
import { gadgetListingHref, gadgetNestedLeaves, gadgetTopLeaves } from '@/lib/gadgetCatalog';

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

function mergeCatalogChildren(
  top: MenuTreeItem,
  items: { name: string; slug: string; href: string; hideArrow?: boolean }[]
): MenuTreeItem {
  const bySlug = new Map(top.children.map((child) => [child.slug, child]));
  const merged: MenuTreeItem[] = [];

  items.forEach((item, index) => {
    const existing = bySlug.get(item.slug);
    if (existing) {
      merged.push({
        ...existing,
        name: item.name,
        href: existing.href || item.href,
        sortOrder: index,
        hideArrow: item.hideArrow ?? existing.hideArrow,
      });
      return;
    }
    merged.push({
      id: `${top.slug}-leaf-${item.slug}`,
      name: item.name,
      slug: item.slug,
      level: 1,
      sortOrder: index,
      href: item.href,
      categoryId: null,
      categorySlug: null,
      isVisible: true,
      hideArrow: Boolean(item.hideArrow),
      children: [],
    });
  });

  for (const child of top.children) {
    if (!items.some((item) => item.slug === child.slug)) {
      merged.push(child);
    }
  }

  return { ...top, children: merged };
}

function gadgetMenuChildren(): MenuTreeItem[] {
  const leaves = gadgetTopLeaves().map((leaf, index) => {
    const nested = gadgetNestedLeaves(leaf.slug);
    const children: MenuTreeItem[] = nested.length
      ? nested.map((child, childIndex) => ({
          id: `gadget-nested-${child.slug}`,
          name: child.name,
          slug: child.slug,
          level: 2,
          sortOrder: childIndex,
          href: gadgetListingHref(child.slug),
          categoryId: null,
          categorySlug: null,
          isVisible: true,
          hideArrow: true,
          children: [],
        }))
      : leaf.brands.map((brand, brandIndex) => ({
          id: `gadget-brand-${leaf.slug}-${brand.slug}`,
          name: brand.label,
          slug: brand.slug,
          level: 2,
          sortOrder: brandIndex,
          href: gadgetListingHref(leaf.slug, brand.slug),
          categoryId: null,
          categorySlug: null,
          isVisible: true,
          hideArrow: true,
          children: [],
        }));
    return {
      id: `gadget-leaf-${leaf.slug}`,
      name: leaf.name,
      slug: leaf.slug,
      level: 1,
      sortOrder: index,
      href: gadgetListingHref(leaf.slug),
      categoryId: null,
      categorySlug: null,
      isVisible: true,
      hideArrow: children.length === 0,
      children,
    };
  });
  leaves.push({
    id: 'gadget-all',
    name: 'Show All Gadget',
    slug: 'gadget-all',
    level: 1,
    sortOrder: leaves.length,
    href: gadgetListingHref(),
    categoryId: null,
    categorySlug: null,
    isVisible: true,
    hideArrow: true,
    children: [],
  });
  return leaves;
}

function ensureGadgetTop(tree: MenuTreeItem[]): MenuTreeItem[] {
  const withoutWatch = tree.filter((item) => item.slug !== 'watch');
  const children = gadgetMenuChildren();
  const existing = withoutWatch.find((item) => item.slug === 'gadget');
  if (existing) {
    return withoutWatch.map((item) =>
      item.slug === 'gadget'
        ? { ...item, name: 'Gadget', href: gadgetListingHref(), hideArrow: false, children }
        : item
    );
  }
  const gadget: MenuTreeItem = {
    id: 'catalog-gadget',
    name: 'Gadget',
    slug: 'gadget',
    level: 0,
    sortOrder: withoutWatch.length,
    href: gadgetListingHref(),
    categoryId: null,
    categorySlug: 'gadget',
    isVisible: true,
    hideArrow: false,
    children,
  };
  const accessoriesIndex = withoutWatch.findIndex((item) => item.slug === 'accessories');
  if (accessoriesIndex === -1) return [...withoutWatch, gadget];
  const next = [...withoutWatch];
  next.splice(accessoriesIndex + 1, 0, gadget);
  return next;
}

function ensureGamingTop(tree: MenuTreeItem[]): MenuTreeItem[] {
  if (tree.some((item) => item.slug === 'gaming')) return tree;
  const gaming: MenuTreeItem = {
    id: 'catalog-gaming',
    name: 'Gaming',
    slug: 'gaming',
    level: 0,
    sortOrder: tree.length,
    href: '/products?category=gaming',
    categoryId: null,
    categorySlug: 'gaming',
    isVisible: true,
    hideArrow: false,
    children: [],
  };
  const accessoriesIndex = tree.findIndex((item) => item.slug === 'accessories');
  if (accessoriesIndex === -1) return [...tree, gaming];
  const next = [...tree];
  next.splice(accessoriesIndex + 1, 0, gaming);
  return next;
}

/**
 * If a Component sub has no CMS children, attach the catalog brand flyout
 * (Desktop RAM, PSU, SSD, Casing, CPU Cooler, Laptop RAM).
 * Accessories and Gaming leaves are filled from the Star Tech category lists.
 */
export function enrichMenuWithBrandFlyouts(tree: MenuTreeItem[]): MenuTreeItem[] {
  const withGadget = ensureGadgetTop(tree);
  const withGaming = ensureGamingTop(withGadget);
  const withCatalog = withGaming.map((top) => {
    if (top.slug === 'accessories') return mergeCatalogChildren(top, ACCESSORIES_MENU_ITEMS);
    if (top.slug === 'gaming') return mergeCatalogChildren(top, GAMING_MENU_ITEMS);
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

  return enrichGamingBrandFlyouts(enrichAccessoriesBrandFlyouts(withCatalog));
}

export const COMPONENT_BRAND_PARENT_SLUGS = [
  'desktop-ram',
  'laptop-ram',
  'power-supply',
  'ssd',
  'computer-case',
  'cpu-cooler',
] as const;
