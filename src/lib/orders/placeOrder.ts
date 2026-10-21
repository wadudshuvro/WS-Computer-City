import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getDeliveryFee, DeliveryMethodId } from '@/lib/cart/delivery';
import { sendAdminOrderEmail, sendOrderEmail } from '@/lib/launch/mail';

export type PlaceOrderInput = {
  firstName: string;
  lastName?: string;
  address: string;
  upazila?: string;
  district: string;
  mobile: string;
  email: string;
  comment?: string;
  deliveryMethod: DeliveryMethodId;
  idempotencyKey?: string;
  userId?: string;
  items: { productId: string; quantity: number; variantLabel?: string }[];
};

export type PlacedOrder = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  replayed: boolean;
};

function orderNumber(): string {
  const now = new Date();
  const stamp = [
    now.getFullYear().toString().slice(-2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
  return `LB${stamp}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlacedOrder> {
  if (input.idempotencyKey) {
    const existing = await prisma.order.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (existing) {
      return {
        id: existing.id,
        orderNumber: existing.orderNumber,
        total: Number(existing.total),
        status: existing.status,
        replayed: true,
      };
    }
  }

  const ids = [...new Set(input.items.map((item) => item.productId))];
  const deliveryFee = getDeliveryFee(input.deliveryMethod);

  let created;
  try {
    created = await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: ids }, isActive: true },
      include: { images: { orderBy: { order: 'asc' }, take: 1 } },
    });
    const byId = new Map(products.map((product) => [product.id, product]));

    const lines = input.items.map((item) => {
      const product = byId.get(item.productId);
      if (!product) throw new Error(`Product is no longer available`);
      if (product.stockStatus !== 'IN_STOCK') throw new Error(`${product.name} cannot be purchased`);
      if (product.stockQuantity > 0 && item.quantity > product.stockQuantity) {
        throw new Error(`${product.name} only has ${product.stockQuantity} in stock`);
      }
      const unitPrice = Number(product.price);
      return {
        product,
        quantity: item.quantity,
        variantLabel: item.variantLabel,
        unitPrice,
        lineTotal: Math.round(unitPrice * item.quantity),
        tracked: product.stockQuantity > 0,
      };
    });

    for (const line of lines) {
      if (!line.tracked) continue;
      const updated = await tx.product.updateMany({
        where: { id: line.product.id, stockQuantity: { gte: line.quantity } },
        data: { stockQuantity: { decrement: line.quantity } },
      });
      if (updated.count !== 1) throw new Error(`${line.product.name} sold out while checking out`);
    }

    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const total = subtotal + deliveryFee;
    let number = orderNumber();

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await tx.order.create({
          data: {
            orderNumber: number,
            status: 'PENDING',
            firstName: input.firstName,
            lastName: input.lastName || null,
            address: input.address,
            upazila: input.upazila || null,
            district: input.district,
            mobile: input.mobile,
            email: input.email,
            comment: input.comment || null,
            paymentMethod: 'CASH_ON_DELIVERY',
            deliveryMethod: input.deliveryMethod,
            deliveryFee,
            subtotal,
            total,
            idempotencyKey: input.idempotencyKey || null,
            userId: input.userId || null,
            paymentStatus: 'UNPAID',
            stockAdjusted: lines.some((line) => line.tracked),
            items: {
              create: lines.map((line) => ({
                productId: line.product.id,
                productName: line.product.name,
                productSlug: line.product.slug,
                productSku: line.product.sku,
                imageUrl: line.product.images[0]?.url || null,
                variantLabel: line.variantLabel || null,
                unitPrice: new Prisma.Decimal(line.unitPrice),
                quantity: line.quantity,
                lineTotal: new Prisma.Decimal(line.lineTotal),
              })),
            },
          },
          include: { items: true },
        });
      } catch (error) {
        if ((error as { code?: string }).code === 'P2002' && attempt < 2) {
          number = orderNumber();
          continue;
        }
        throw error;
      }
    }
    throw new Error('Could not create order number');
    });
  } catch (error) {
    if (input.idempotencyKey && (error as { code?: string }).code === 'P2002') {
      const existing = await prisma.order.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
      if (existing) {
        return {
          id: existing.id,
          orderNumber: existing.orderNumber,
          total: Number(existing.total),
          status: existing.status,
          replayed: true,
        };
      }
    }
    throw error;
  }

  // The order is already saved. Email problems must never fail the checkout.
  // Wait for the emails at most 8s so the customer is never kept on the checkout page.
  await Promise.race([
    new Promise((resolve) => setTimeout(resolve, 8000)),
    Promise.allSettled([
    sendAdminOrderEmail({
      orderNumber: created.orderNumber,
      placedAt: created.createdAt,
      firstName: created.firstName,
      lastName: created.lastName,
      mobile: created.mobile,
      email: created.email,
      address: created.address,
      upazila: created.upazila,
      district: created.district,
      deliveryMethod: created.deliveryMethod,
      paymentMethod: created.paymentMethod,
      comment: created.comment,
      items: created.items.map((item) => ({
        productName: item.productName,
        productSku: item.productSku,
        variantLabel: item.variantLabel,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })),
      subtotal: Number(created.subtotal),
      deliveryFee: Number(created.deliveryFee),
      total: Number(created.total),
    }),
    sendOrderEmail({
      to: input.email,
      orderNumber: created.orderNumber,
      total: Number(created.total),
      firstName: input.firstName,
    }),
    ]),
  ]);

  return {
    id: created.id,
    orderNumber: created.orderNumber,
    total: Number(created.total),
    status: created.status,
    replayed: false,
  };
}
