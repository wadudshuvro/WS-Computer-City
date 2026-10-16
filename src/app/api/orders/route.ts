import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { placeOrder } from '@/lib/orders/placeOrder';
import { createOrderSchema } from '@/lib/orders/schema';
import { authOptions } from '@/lib/auth/options';
import { guardAction } from '@/lib/rateLimit/http';
import { MAX_ORDER_BODY_BYTES } from '@/lib/rateLimit/policies';
import { captureException } from '@/lib/launch/sentry';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared > MAX_ORDER_BODY_BYTES) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'Request is too large' } }, { status: 413 });
  }

  try {
    const idempotencyKey = req.headers.get('idempotency-key')?.trim().slice(0, 80) || undefined;
    if (idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey },
        select: { id: true, orderNumber: true, total: true, status: true },
      });
      if (existing) {
        return NextResponse.json({
          data: {
            id: existing.id,
            orderNumber: existing.orderNumber,
            total: Number(existing.total),
            status: existing.status,
            replayed: true,
          },
        });
      }
    }

    const session = await getServerSession(authOptions);
    const account = session?.user?.email
      ? await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
      : null;
    const limited = await guardAction(req, 'order', { userId: account?.id });
    if (limited) return limited;

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Please fix the highlighted fields',
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const order = await placeOrder({
      ...parsed.data,
      idempotencyKey,
      userId: account?.id,
    });

    return NextResponse.json({ data: order }, { status: order.replayed ? 200 : 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to place order';
    const clientError = /cannot be purchased|no longer available|in stock|sold out/i.test(message);
    if (!clientError) {
      console.error('Error creating order:', error);
      await captureException(error, { route: 'orders' });
    }
    return NextResponse.json(
      { error: { code: clientError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR', message: clientError ? message : 'Failed to place order' } },
      { status: clientError ? 400 : 500 }
    );
  }
}
