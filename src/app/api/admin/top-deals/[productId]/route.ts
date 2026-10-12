import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function DELETE(_req: Request, context: { params: Promise<{ productId: string }> }) {
  const { productId } = await context.params;
  await prisma.product.updateMany({
    where: { id: productId },
    data: { topDealOrder: null },
  });
  revalidatePath('/');
  revalidatePath('/deals');
  return NextResponse.json({ ok: true });
}
