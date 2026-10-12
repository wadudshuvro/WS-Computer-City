import { prisma } from '@/lib/prisma';
import type { TopDealProduct } from '@/lib/topDealTypes';

export async function getTopDeals(): Promise<TopDealProduct[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, topDealOrder: { not: null } },
    orderBy: { topDealOrder: 'asc' },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { order: 'asc' }, take: 1 },
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice == null ? null : Number(product.compareAtPrice),
    imageUrl: product.images[0]?.url ?? null,
    categoryName: product.category.name,
  }));
}
