import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAdminActor } from '@/lib/auth/guard';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest, context: { params: Promise<{ productId: string }> }) {
  const gate = await authorizeAdmin(req);
  if (!isAdminActor(gate)) return gate;
  const { productId } = await context.params;
  await prisma.product.updateMany({
    where: { id: productId },
    data: { topDealOrder: null },
  });
  revalidatePath('/');
  revalidatePath('/deals');
  return NextResponse.json({ ok: true });
}
