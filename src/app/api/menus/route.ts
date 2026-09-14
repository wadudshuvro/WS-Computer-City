import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildMenuTree, FALLBACK_MENU_TREE } from '@/lib/menu';
import { enrichMenuWithBrandFlyouts } from '@/lib/componentBrandMenu';

/**
 * GET /api/menus
 * Public storefront mega-menu tree (visible items only).
 * Brand flyouts for Component subs are filled when CMS has no children yet.
 */
export async function GET() {
  try {
    const rows = await prisma.menuItem.findMany({
      where: { isVisible: true },
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
      include: {
        category: { select: { slug: true } },
      },
    });

    const tree = enrichMenuWithBrandFlyouts(buildMenuTree(rows, true));
    return NextResponse.json({
      data: tree.length > 0 ? tree : enrichMenuWithBrandFlyouts(FALLBACK_MENU_TREE),
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({
      data: enrichMenuWithBrandFlyouts(FALLBACK_MENU_TREE),
    });
  }
}
