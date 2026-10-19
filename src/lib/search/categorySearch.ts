import { prisma } from '@/lib/prisma';
import { buildMenuTree, FALLBACK_MENU_TREE, resolveMenuHref, type MenuTreeItem } from '@/lib/menu';
import { enrichMenuWithBrandFlyouts } from '@/lib/componentBrandMenu';
import { normalizeText, stem, tokenize } from '@/lib/search/text';

export type SearchCategoryHit = {
  label: string;
  href: string;
  /** Parent category shown in grey, e.g. "Accessories". */
  trail: string;
};

type Entry = SearchCategoryHit & { norm: string; words: string[] };

const CACHE_MS = 60_000;
let cache: { at: number; entries: Entry[] } | null = null;

const SKIP_LABEL = /^show all/i;
const hasBrandParam = (href: string) => /[?&]brand=/.test(href);

function flatten(tree: MenuTreeItem[]): SearchCategoryHit[] {
  const out: SearchCategoryHit[] = [];
  const seen = new Set<string>();
  const add = (label: string, href: string, trail: string) => {
    if (!label || !href || SKIP_LABEL.test(label) || seen.has(href)) return;
    seen.add(href);
    out.push({ label, href, trail });
  };

  for (const top of tree) {
    add(top.name, resolveMenuHref(top, top.slug), '');
    for (const sub of top.children ?? []) {
      const subHref = resolveMenuHref(sub, top.slug, top.slug);
      // Brand shortcuts directly under a main tab read "MSI Monitor".
      add(hasBrandParam(subHref) ? `${sub.name} ${top.name}` : sub.name, subHref, top.name);
      for (const child of sub.children ?? []) {
        const childHref = resolveMenuHref(child, top.slug, sub.slug);
        add(hasBrandParam(childHref) ? `${child.name} ${sub.name}` : child.name, childHref, top.name);
      }
    }
  }
  return out;
}

async function loadEntries(): Promise<Entry[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.entries;

  let tree: MenuTreeItem[];
  try {
    const rows = await prisma.menuItem.findMany({
      where: { isVisible: true },
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
      include: { category: { select: { slug: true } } },
    });
    const built = enrichMenuWithBrandFlyouts(buildMenuTree(rows, true));
    tree = built.length > 0 ? built : enrichMenuWithBrandFlyouts(FALLBACK_MENU_TREE);
  } catch {
    tree = enrichMenuWithBrandFlyouts(FALLBACK_MENU_TREE);
  }

  const entries = flatten(tree).map((hit) => ({
    ...hit,
    norm: normalizeText(hit.label),
    words: hit.label.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
  }));
  cache = { at: Date.now(), entries };
  return entries;
}

function rank(entry: Entry, compact: string): number {
  if (entry.norm === compact) return 0;
  if (entry.norm.startsWith(compact)) return 1;
  if (entry.words.some((w) => w.startsWith(compact))) return 2;
  if (entry.norm.includes(compact)) return 3;
  return 4;
}

/** Categories and brand shortcuts from the same menu the storefront shows, so every hit is a real page. */
export async function searchCatalogCategories(query: string, limit = 8): Promise<SearchCategoryHit[]> {
  const tokens = tokenize(query);
  const compact = normalizeText(query).slice(0, 80);
  if (tokens.length === 0 || compact.length < 2) return [];

  const entries = await loadEntries();
  const matchAll = (e: Entry, ts: string[]) => ts.every((t) => e.norm.includes(t));

  let matched = entries.filter((e) => matchAll(e, tokens));
  if (matched.length === 0) {
    // Model numbers never appear in category names, so match on the plain words only
    // ("intel i5 12400" -> Intel). Words may be shortened to catch plurals and typos.
    const words = tokens.filter((t) => /^[a-z]{3,}$/.test(t)).map(stem);
    if (words.length > 0) {
      matched = entries.filter((e) => words.every((w) => e.words.some((ew) => ew.startsWith(w))));
    }
  }

  return matched
    .map((e) => ({ e, r: rank(e, compact) }))
    .sort((a, b) => a.r - b.r || a.e.label.length - b.e.label.length || a.e.label.localeCompare(b.e.label))
    .slice(0, limit)
    .map(({ e }) => ({ label: e.label, href: e.href, trail: e.trail }));
}
