import type { FilterDefinition } from '@/lib/filterConfig';
import { WATCH_BRANDS } from '@/lib/watchCatalog';
import scraped from '@/lib/gadgetFilters.data.json';

export type GadgetBrand = { slug: string; label: string };

export type GadgetLeaf = {
  name: string;
  slug: string;
  startechUrl: string;
  parentSlug?: string;
  brands: GadgetBrand[];
  filters: FilterDefinition[];
};

type ScrapedPage = {
  slug: string;
  url: string;
  children?: { name: string; href: string }[];
  groups?: { name: string; options: string[] }[];
};

const NESTED_SLUGS = new Set([
  'studio-microphones',
  'studio-monitors',
  'studio-headphones',
  'audio-interfaces',
  'switcher',
  'mini-toy-drone',
  'professional-drone',
  '4k-drone',
  'enterprise-drone',
  'drone-accessories',
  'scientific-calculator',
  'blower-machine',
  'drill-machine',
  'angle-grinder',
  'saw-machine',
  'sander-machine',
  'screwdriver',
]);

export function gadgetLabelSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function filterKey(groupName: string): string {
  return `gd_${gadgetLabelSlug(groupName).replace(/-/g, '_')}`;
}

function hrefSlug(href: string): string {
  try {
    return new URL(href).pathname.split('/').filter(Boolean).pop() || '';
  } catch {
    return '';
  }
}

const scrapedPages = scraped as ScrapedPage[];

function pageBySlug(slug: string): ScrapedPage | undefined {
  return scrapedPages.find((page) => page.slug === slug);
}

const TOP_LEAVES: { name: string; slug: string; startechUrl: string }[] = [
  { name: 'Smart Watch', slug: 'watch', startechUrl: 'https://www.startech.com.bd/gadget/smart-watch' },
  { name: 'Smart Band', slug: 'smart-band', startechUrl: 'https://www.startech.com.bd/smart-band' },
  { name: 'Earphone', slug: 'earphone', startechUrl: 'https://www.startech.com.bd/earphone' },
  { name: 'Earbuds', slug: 'earbuds', startechUrl: 'https://www.startech.com.bd/earbuds' },
  { name: 'Neckband', slug: 'neckband', startechUrl: 'https://www.startech.com.bd/neckband' },
  { name: 'Smart Ring', slug: 'smart-ring', startechUrl: 'https://www.startech.com.bd/smart-ring' },
  { name: 'Smart Glasses', slug: 'smart-glasses', startechUrl: 'https://www.startech.com.bd/smart-glasses' },
  { name: 'Power Bank', slug: 'power-bank', startechUrl: 'https://www.startech.com.bd/power-bank' },
  { name: 'Car Charger', slug: 'car-charger', startechUrl: 'https://www.startech.com.bd/car-charger' },
  { name: 'TV Box', slug: 'tv-box', startechUrl: 'https://www.startech.com.bd/tv-box' },
  { name: 'Health Monitor', slug: 'health-monitor', startechUrl: 'https://www.startech.com.bd/health-monitor' },
  { name: 'Studio Equipment', slug: 'studio-equipment', startechUrl: 'https://www.startech.com.bd/studio-equipment' },
  { name: 'Drones', slug: 'drone', startechUrl: 'https://www.startech.com.bd/drone' },
  { name: 'Gimbal', slug: 'gimbal', startechUrl: 'https://www.startech.com.bd/gimbal' },
  { name: 'Calculator', slug: 'calculator', startechUrl: 'https://www.startech.com.bd/calculator' },
  { name: 'Stream Deck', slug: 'stream-deck', startechUrl: 'https://www.startech.com.bd/stream-deck' },
  { name: 'Power Tools', slug: 'power-tools', startechUrl: 'https://www.startech.com.bd/power-tools' },
];

function filtersFor(slug: string): FilterDefinition[] {
  const groups = pageBySlug(slug)?.groups || [];
  return groups.map((group) => ({
    key: filterKey(group.name),
    name: group.name,
    type: 'checkbox' as const,
    defaultExpanded: true,
    options: group.options.map((label) => ({ value: label, label })),
  }));
}

function brandsFor(slug: string): GadgetBrand[] {
  if (slug === 'watch') return WATCH_BRANDS;
  const children = pageBySlug(slug)?.children || [];
  return children
    .filter((child) => !NESTED_SLUGS.has(hrefSlug(child.href)))
    .map((child) => ({ label: child.name, slug: gadgetLabelSlug(child.name) }));
}

function nestedFor(parentSlug: string): GadgetLeaf[] {
  const children = pageBySlug(parentSlug)?.children || [];
  return children
    .filter((child) => NESTED_SLUGS.has(hrefSlug(child.href)))
    .map((child) => ({
      name: child.name,
      slug: hrefSlug(child.href),
      startechUrl: child.href,
      parentSlug,
      brands: [],
      filters: [],
    }));
}

export const GADGET_LEAVES: GadgetLeaf[] = TOP_LEAVES.flatMap((leaf) => {
  const parent: GadgetLeaf = {
    ...leaf,
    brands: brandsFor(leaf.slug),
    filters: filtersFor(leaf.slug),
  };
  return [parent, ...nestedFor(leaf.slug)];
});

export const GADGET_FILTER_KEYS = [
  ...new Set(GADGET_LEAVES.flatMap((leaf) => leaf.filters.map((filter) => filter.key))),
];

export function gadgetTopLeaves(): GadgetLeaf[] {
  return GADGET_LEAVES.filter((leaf) => !leaf.parentSlug);
}

export function gadgetNestedLeaves(parentSlug: string): GadgetLeaf[] {
  return GADGET_LEAVES.filter((leaf) => leaf.parentSlug === parentSlug);
}

export function findGadgetLeaf(slug: string | null | undefined): GadgetLeaf | null {
  if (!slug) return null;
  return GADGET_LEAVES.find((leaf) => leaf.slug === slug) ?? null;
}

export function gadgetListingHref(slug?: string | null, brandSlug?: string | null): string {
  const params = new URLSearchParams({ category: 'gadget' });
  if (slug) params.set('sub', slug);
  if (brandSlug) params.set('brand', brandSlug);
  return `/products?${params.toString()}`;
}
