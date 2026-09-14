import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PUT /api/admin/menus/[id]
 * Update fields and/or move among siblings (insertAfterId / move: up|down).
 */
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Menu item not found' } },
        { status: 404 }
      );
    }

    if (body.move === 'up' || body.move === 'down') {
      const siblings = await prisma.menuItem.findMany({
        where: { parentId: existing.parentId },
        orderBy: { sortOrder: 'asc' },
      });
      const index = siblings.findIndex((s) => s.id === id);
      const swapWith = body.move === 'up' ? index - 1 : index + 1;
      if (index >= 0 && swapWith >= 0 && swapWith < siblings.length) {
        const other = siblings[swapWith]!;
        await prisma.$transaction([
          prisma.menuItem.update({
            where: { id: existing.id },
            data: { sortOrder: other.sortOrder },
          }),
          prisma.menuItem.update({
            where: { id: other.id },
            data: { sortOrder: existing.sortOrder },
          }),
        ]);
      }
    }

    const data: {
      name?: string;
      slug?: string;
      href?: string | null;
      categoryId?: string | null;
      isVisible?: boolean;
      hideArrow?: boolean;
      sortOrder?: number;
    } = {};

    if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim();
    if (typeof body.slug === 'string' && body.slug.trim()) {
      data.slug = body.slug.trim().toLowerCase().replace(/\s+/g, '-');
    }
    if (body.href !== undefined) {
      data.href = body.href ? String(body.href).trim() : null;
    }
    if (body.categoryId !== undefined) {
      data.categoryId = body.categoryId || null;
    }
    if (typeof body.isVisible === 'boolean') data.isVisible = body.isVisible;
    if (typeof body.hideArrow === 'boolean') data.hideArrow = body.hideArrow;

    if (body.insertAfterId !== undefined) {
      const siblings = await prisma.menuItem.findMany({
        where: { parentId: existing.parentId, id: { not: id } },
        orderBy: { sortOrder: 'asc' },
      });
      const insertAfterId = body.insertAfterId ? String(body.insertAfterId) : null;
      let newOrder = 0;
      if (insertAfterId) {
        const afterIndex = siblings.findIndex((s) => s.id === insertAfterId);
        newOrder = afterIndex >= 0 ? afterIndex + 1 : siblings.length;
      }
      const ordered = [...siblings];
      ordered.splice(newOrder, 0, existing);
      await prisma.$transaction(
        ordered.map((item, index) =>
          prisma.menuItem.update({
            where: { id: item.id },
            data: { sortOrder: index },
          })
        )
      );
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    revalidatePath('/');
    revalidatePath('/products');

    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update menu item' } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/menus/[id]
 * Deletes item and cascade children.
 */
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Menu item not found' } },
        { status: 404 }
      );
    }

    await prisma.menuItem.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath('/products');

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete menu item' } },
      { status: 500 }
    );
  }
}
