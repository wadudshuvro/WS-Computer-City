import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizeAdmin, isAdminActor } from '@/lib/auth/guard';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
});

/**
 * PATCH /api/admin/orders/[id]
 * Moves an order to a new status (Pending -> Confirmed -> Completed, or Cancelled).
 * Only the status changes. Stock and prices are never touched here.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorizeAdmin(req);
  if (!isAdminActor(gate)) return gate;

  const { id } = await params;
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Choose a valid order status' } },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });
    return NextResponse.json({ data: updated });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Order not found' } }, { status: 404 });
    }
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update order' } },
      { status: 500 }
    );
  }
}
