import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';

export type PaymentNotice = {
  id: string;
  type: 'payment_succeeded' | 'payment_failed';
  orderNumber: string;
  amount: number;
};

export function signPaymentBody(rawBody: string, secret: string): string {
  return createHmac('sha256', secret).update(rawBody).digest('hex');
}

export function webhookSecret(): string {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) throw new Error('PAYMENT_WEBHOOK_SECRET is not set');
  return secret;
}

export function signaturesMatch(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = Buffer.from(signPaymentBody(rawBody, secret));
  const received = Buffer.from(header);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

/** Marks the order paid. A repeated event id is ignored and does not touch stock. */
export async function applyPaymentNotice(notice: PaymentNotice, provider = 'logicbay'): Promise<'applied' | 'duplicate'> {
  const existing = await prisma.paymentEvent.findUnique({
    where: { provider_eventId: { provider, eventId: notice.id } },
  });
  if (existing) return 'duplicate';

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { orderNumber: notice.orderNumber } });
    if (!order) throw new Error('Order not found');
    if (Math.round(Number(order.total)) !== Math.round(notice.amount)) {
      throw new Error('Paid amount does not match the order');
    }
    await tx.paymentEvent.create({
      data: {
        provider,
        eventId: notice.id,
        type: notice.type,
        orderId: order.id,
      },
    });
    if (notice.type === 'payment_succeeded') {
      await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      });
    } else {
      await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'FAILED' },
      });
    }
  });

  return 'applied';
}
