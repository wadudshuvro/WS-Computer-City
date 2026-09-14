export type MenuTreeItem = {
  id: string;
  name: string;
  slug: string;
  level: number;
  sortOrder: number;
  href: string | null;
  categoryId: string | null;
  categorySlug: string | null;
  isVisible: boolean;
  hideArrow: boolean;
  updatedAt?: string | Date | null;
  children: MenuTreeItem[];
};

export type MenuItemRow = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  level: number;
  sortOrder: number;
  href: string | null;
  categoryId: string | null;
  isVisible: boolean;
  hideArrow: boolean;
  updatedAt?: string | Date | null;
  category?: { slug: string } | null;
};

/** Resolve storefront href for a menu node using custom URL, category, or slug chain. */
export function resolveMenuHref(
  item: Pick<MenuTreeItem, 'href' | 'slug' | 'categorySlug'>,
  topSlug: string,
  parentSlug?: string
): string {
  if (item.href) return item.href;
  if (item.categorySlug) {
    // Top-level category pages use category=slug; deeper use components-style query.
    if (!parentSlug) {
      return `/products?category=${item.categorySlug}`;
    }
    return `/products?category=${topSlug}&sub=${item.categorySlug}`;
  }
  if (!parentSlug) {
    return `/products?category=${item.slug}`;
  }
  return `/products?category=${topSlug}&sub=${item.slug}`;
}

export function buildMenuTree(rows: MenuItemRow[], visibleOnly = false): MenuTreeItem[] {
  const filtered = visibleOnly ? rows.filter((r) => r.isVisible) : rows;
  const byParent = new Map<string | null, MenuItemRow[]>();

  for (const row of filtered) {
    const key = row.parentId;
    const list = byParent.get(key) ?? [];
    list.push(row);
    byParent.set(key, list);
  }

  for (const list of byParent.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  }

  const mapNode = (row: MenuItemRow): MenuTreeItem => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    level: row.level,
    sortOrder: row.sortOrder,
    href: row.href,
    categoryId: row.categoryId,
    categorySlug: row.category?.slug ?? null,
    isVisible: row.isVisible,
    hideArrow: row.hideArrow,
    updatedAt: row.updatedAt ?? null,
    children: (byParent.get(row.id) ?? []).map(mapNode),
  });

  return (byParent.get(null) ?? []).map(mapNode);
}

/** Minimal fallback if DB has no visible top items. */
export const FALLBACK_MENU_TREE: MenuTreeItem[] = [
  {
    id: 'fallback-components',
    name: 'Component',
    slug: 'components',
    level: 0,
    sortOrder: 0,
    href: null,
    categoryId: null,
    categorySlug: null,
    isVisible: true,
    hideArrow: false,
    children: [
      {
        id: 'fallback-processor',
        name: 'Processor',
        slug: 'processor',
        level: 1,
        sortOrder: 0,
        href: null,
        categoryId: null,
        categorySlug: null,
        isVisible: true,
        hideArrow: false,
        children: [
          {
            id: 'fallback-intel',
            name: 'Intel',
            slug: 'intel',
            level: 2,
            sortOrder: 0,
            href: null,
            categoryId: null,
            categorySlug: null,
            isVisible: true,
            hideArrow: false,
            children: [],
          },
          {
            id: 'fallback-amd',
            name: 'AMD Ryzen',
            slug: 'amd-ryzen',
            level: 2,
            sortOrder: 1,
            href: null,
            categoryId: null,
            categorySlug: null,
            isVisible: true,
            hideArrow: false,
            children: [],
          },
        ],
      },
      {
        id: 'fallback-gpu',
        name: 'Graphics Card',
        slug: 'graphics-card',
        level: 1,
        sortOrder: 1,
        href: null,
        categoryId: null,
        categorySlug: null,
        isVisible: true,
        hideArrow: false,
        children: [
          {
            id: 'fallback-nvidia',
            name: 'NVIDIA',
            slug: 'nvidia',
            level: 2,
            sortOrder: 0,
            href: null,
            categoryId: null,
            categorySlug: null,
            isVisible: true,
            hideArrow: false,
            children: [],
          },
          {
            id: 'fallback-amd-gpu',
            name: 'AMD',
            slug: 'amd-gpu',
            level: 2,
            sortOrder: 1,
            href: null,
            categoryId: null,
            categorySlug: null,
            isVisible: true,
            hideArrow: false,
            children: [],
          },
        ],
      },
    ],
  },
];
