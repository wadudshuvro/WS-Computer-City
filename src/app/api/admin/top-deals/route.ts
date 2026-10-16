import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAdminActor } from '@/lib/auth/guard';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getTopDeals } from '@/lib/topDeals';

export async function GET(req: NextRequest) {
  const gate = await authorizeAdmin(req);
  if (!isAdminActor(gate)) return gate;
  const search = req.nextUrl.searchParams.get('search')?.trim();
  const deals = await getTopDeals();

  if (!search) {
    return NextResponse.json({ deals, results: [] });
  }

  const results = await prisma.product.findMany({
    where: {
      isActive: true,
      topDealOrder: null,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ],
    },
    take: 12,
    orderBy: { name: 'asc' },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { order: 'asc' }, take: 1 },
    },
  });

  return NextResponse.json({
    deals,
    results: results.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice == null ? null : Number(product.compareAtPrice),
      imageUrl: product.images[0]?.url ?? null,
      categoryName: product.category.name,
    })),
  });
}

export async function POST(req: NextRequest) {
  const gate = await authorizeAdmin(req);
  if (!isAdminActor(gate)) return gate;
  const body = await req.json().catch(() => null);
  const productId = typeof body?.productId === 'string' ? body.productId : '';
  if (!productId) {
    return NextResponse.json({ error: { message: 'Choose a product to add.' } }, { status: 400 });
  }

  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true } });
  if (!product) {
    return NextResponse.json({ error: { message: 'Product not found.' } }, { status: 404 });
  }

  const last = await prisma.product.aggregate({ _max: { topDealOrder: true } });
  const nextOrder = (last._max.topDealOrder ?? -1) + 1;
  await prisma.product.update({
    where: { id: product.id },
    data: { topDealOrder: product.topDealOrder ?? nextOrder },
  });

  revalidatePath('/');
  revalidatePath('/deals');
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const gate = await authorizeAdmin(req);
  if (!isAdminActor(gate)) return gate;
  const body = await req.json().catch(() => null);
  const ids: unknown = body?.ids;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) {
    return NextResponse.json({ error: { message: 'Invalid order.' } }, { status: 400 });
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.product.update({
        where: { id },
        data: { topDealOrder: index },
      })
    )
  );

  revalidatePath('/');
  revalidatePath('/deals');
  return NextResponse.json({ ok: true });
}
