import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteUrl } from '@/lib/launch/site';
import { categoryPath, productPath } from '@/lib/seo/catalogSeo';

export const revalidate = 3600;

function abs(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return `${siteUrl()}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

/** Indexable URLs only. One file is enough under 50,000 URLs; split here if the catalog grows past that. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
        category: { select: { slug: true } },
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      },
    }),
  ]);

  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl()}/deals`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteUrl()}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl()}/feedback`, changeFrequency: 'yearly', priority: 0.4 },
    ...categories.map((category) => ({
      url: `${siteUrl()}${categoryPath(category.slug)}`,
      lastModified: category.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${siteUrl()}${productPath(product.category.slug, product.slug)}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      images: product.images[0] ? [abs(product.images[0].url)] : undefined,
    })),
  ];

  return pages.length > 50000 ? pages.slice(0, 50000) : pages;
}
