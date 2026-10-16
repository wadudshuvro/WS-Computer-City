import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteUrl } from '@/lib/launch/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  const staticPaths = ['', '/products', '/cart', '/deals'];
  return [
    ...staticPaths.map((path) => ({
      url: `${origin}${path || '/'}`,
      changeFrequency: 'daily' as const,
      priority: path === '' ? 1 : 0.6,
    })),
    ...products.map((product) => ({
      url: `${origin}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
