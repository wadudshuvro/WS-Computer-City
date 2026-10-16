import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { canReadOrder } from '@/lib/auth/orderAccess';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ orderNumber: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not allowed' } }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || session.user?.sessionVersion !== user.sessionVersion) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Not allowed' } }, { status: 401 });
  }
  const { orderNumber } = await context.params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      status: true,
      total: true,
      userId: true,
      paymentStatus: true,
    },
  });
  if (!order || !canReadOrder({ id: user.id, role: user.role }, order)) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Not found' } }, { status: 404 });
  }
  return NextResponse.json({
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      paymentStatus: order.paymentStatus,
    },
  });
}
