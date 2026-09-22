import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getDeliveryFee, DeliveryMethodId } from '@/lib/cart/delivery';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  productSlug: z.string().optional(),
  imageUrl: z.string().optional(),
  variantLabel: z.string().optional(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive().max(99),
});

const createOrderSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().optional(),
  address: z.string().trim().min(1, 'Address is required'),
  upazila: z.string().trim().optional(),
  district: z.string().trim().min(1),
  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .transform((v) => v.replace(/[\s-]/g, ''))
    .refine((v) => /^(\+?88)?01[3-9]\d{8}$/.test(v), 'Invalid mobile number'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  comment: z.string().trim().optional(),
  deliveryMethod: z.enum(['HOME_DELIVERY', 'STORE_PICKUP', 'EXPRESS']),
  paymentMethod: z.literal('CASH_ON_DELIVERY'),
  items: z.array(orderItemSchema).min(1),
});

function generateOrderNumber(): string {
  const now = new Date();
  const stamp = [
    now.getFullYear().toString().slice(-2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
  ].join('');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LB${stamp}${rand}`;
}

export async function POST(req: NextRequest) {
  try {
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

    const data = parsed.data;
    const deliveryFee = getDeliveryFee(data.deliveryMethod as DeliveryMethodId);
    const lineItems = data.items.map((item) => ({
      ...item,
      lineTotal: Math.round(item.unitPrice * item.quantity),
    }));
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const total = subtotal + deliveryFee;

    // Verify products still exist (optional soft check)
    const productIds = [...new Set(lineItems.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, sku: true },
    });
    const skuById = new Map(products.map((p) => [p.id, p.sku]));

    let orderNumber = generateOrderNumber();
    // Retry once on rare collision
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const order = await prisma.order.create({
          data: {
            orderNumber,
            status: 'PENDING',
            firstName: data.firstName,
            lastName: data.lastName || null,
            address: data.address,
            upazila: data.upazila || null,
            district: data.district,
            mobile: data.mobile,
            email: data.email || null,
            comment: data.comment || null,
            paymentMethod: 'CASH_ON_DELIVERY',
            deliveryMethod: data.deliveryMethod,
            deliveryFee,
            subtotal,
            total,
            items: {
              create: lineItems.map((item) => ({
                productId: skuById.has(item.productId) ? item.productId : null,
                productName: item.productName,
                productSlug: item.productSlug || null,
                productSku: skuById.get(item.productId) || null,
                imageUrl: item.imageUrl || null,
                variantLabel: item.variantLabel || null,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                lineTotal: item.lineTotal,
              })),
            },
          },
          include: { items: true },
        });

        console.info(
          `[order] New COD order ${order.orderNumber} — ${order.firstName} ${order.mobile} — ৳${Number(order.total)}`
        );

        return NextResponse.json(
          {
            data: {
              id: order.id,
              orderNumber: order.orderNumber,
              total: Number(order.total),
              status: order.status,
            },
          },
          { status: 201 }
        );
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code;
        if (code === 'P2002') {
          orderNumber = generateOrderNumber();
          continue;
        }
        throw err;
      }
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Could not create order number' } },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to place order' } },
      { status: 500 }
    );
  }
}
