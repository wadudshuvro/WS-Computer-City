import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/orders
 * List recent customer orders for the admin CMS.
 */
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        items: true,
      },
    });

    const data = orders.map((order) => ({
      ...order,
      deliveryFee: Number(order.deliveryFee),
      subtotal: Number(order.subtotal),
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })),
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch orders' } },
      { status: 500 }
    );
  }
}
