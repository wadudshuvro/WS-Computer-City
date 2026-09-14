import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { buildMenuTree } from '@/lib/menu';

/**
 * GET /api/admin/menus
 * Full menu tree (including hidden) for CMS.
 */
export async function GET() {
  try {
    const rows = await prisma.menuItem.findMany({
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({
      data: buildMenuTree(rows, false),
      flat: rows,
    });
  } catch (error) {
    console.error('Error fetching admin menus:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch menus' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/menus
 * Create a menu item. Optional insertAfterId places it after a sibling.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const slug = String(body.slug || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

    if (!name || !slug) {
      return NextResponse.json(
        { error: { code: 'VALIDATION', message: 'Name and slug are required' } },
        { status: 400 }
      );
    }

    const parentId = body.parentId ? String(body.parentId) : null;
    let level = 0;

    if (parentId) {
      const parent = await prisma.menuItem.findUnique({ where: { id: parentId } });
      if (!parent) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Parent menu not found' } },
          { status: 404 }
        );
      }
      if (parent.level >= 2) {
        return NextResponse.json(
          { error: { code: 'VALIDATION', message: 'Max menu depth is 3 levels' } },
          { status: 400 }
        );
      }
      level = parent.level + 1;
    }

    const siblings = await prisma.menuItem.findMany({
      where: { parentId },
      orderBy: { sortOrder: 'asc' },
    });

    let sortOrder = siblings.length;
    const insertAfterId = body.insertAfterId ? String(body.insertAfterId) : null;

    if (insertAfterId) {
      const after = siblings.find((s) => s.id === insertAfterId);
      if (after) {
        sortOrder = after.sortOrder + 1;
        await prisma.menuItem.updateMany({
          where: {
            parentId,
            sortOrder: { gte: sortOrder },
          },
          data: { sortOrder: { increment: 1 } },
        });
      }
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        slug,
        parentId,
        level,
        sortOrder,
        href: body.href ? String(body.href).trim() : null,
        categoryId: body.categoryId || null,
        isVisible: body.isVisible ?? true,
        hideArrow: body.hideArrow ?? false,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    revalidatePath('/');
    revalidatePath('/products');

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create menu item' } },
      { status: 500 }
    );
  }
}
