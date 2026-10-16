/**
 * Places one staging order, checks stock and idempotency, then posts a signed payment notice twice.
 * Run: npx tsx scripts/staging-test-order.ts
 */
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
process.env.PAYMENT_WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'staging-only-not-a-live-key';

async function main() {
  const { prisma } = await import('../src/lib/prisma');
  const { placeOrder } = await import('../src/lib/orders/placeOrder');
  const { applyPaymentNotice, signPaymentBody } = await import('../src/lib/payments/webhook');

  const product = await prisma.product.findFirst({
    where: { isActive: true, stockStatus: 'IN_STOCK' },
    orderBy: { price: 'asc' },
  });
  if (!product) throw new Error('No in-stock product to test');

  const originalQty = product.stockQuantity;
  await prisma.product.update({ where: { id: product.id }, data: { stockQuantity: 3 } });

  const key = `staging-${Date.now()}`;
  const input = {
    firstName: 'Staging',
    lastName: 'Order',
    address: 'Launch check',
    district: 'Dhaka - City',
    mobile: '01700000000',
    email: 'staging-test@logicbay.local',
    deliveryMethod: 'STORE_PICKUP' as const,
    idempotencyKey: key,
    items: [{ productId: product.id, quantity: 1 }],
  };

  const first = await placeOrder(input);
  const after = await prisma.product.findUnique({ where: { id: product.id } });
  const second = await placeOrder(input);
  const afterReplay = await prisma.product.findUnique({ where: { id: product.id } });

  if (after?.stockQuantity !== 2) throw new Error(`Stock did not decrement (got ${after?.stockQuantity})`);
  if (second.orderNumber !== first.orderNumber || !second.replayed) throw new Error('Idempotency replay failed');
  if (afterReplay?.stockQuantity !== 2) throw new Error('Replay changed stock');

  const notice = {
    id: `evt_${key}`,
    type: 'payment_succeeded' as const,
    orderNumber: first.orderNumber,
    amount: first.total,
  };
  const raw = JSON.stringify(notice);
  const signature = signPaymentBody(raw, process.env.PAYMENT_WEBHOOK_SECRET || '');
  if (!signature) throw new Error('Missing signature');

  const applied = await applyPaymentNotice(notice);
  const replay = await applyPaymentNotice(notice);
  const order = await prisma.order.findUnique({ where: { orderNumber: first.orderNumber } });

  await prisma.product.update({ where: { id: product.id }, data: { stockQuantity: originalQty } });

  if (applied !== 'applied' || replay !== 'duplicate') throw new Error('Webhook was not idempotent');
  if (order?.paymentStatus !== 'PAID' || order.status !== 'CONFIRMED') throw new Error('Order was not confirmed');

  console.log(
    JSON.stringify(
      {
        ok: true,
        orderNumber: first.orderNumber,
        total: first.total,
        stockAfterSale: 2,
        stockAfterReplay: 2,
        webhookReplay: replay,
        paymentStatus: order.paymentStatus,
        restoredQuantity: originalQty,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { prisma } = await import('../src/lib/prisma');
    await prisma.$disconnect();
  });
