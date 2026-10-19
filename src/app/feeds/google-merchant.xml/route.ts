import { prisma } from '@/lib/prisma';
import { siteName, siteUrl } from '@/lib/launch/site';
import { productPath } from '@/lib/seo/catalogSeo';

export const revalidate = 3600;

function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function availability(status: string): string {
  if (status === 'IN_STOCK') return 'in_stock';
  if (status === 'PRE_ORDER') return 'preorder';
  return 'out_of_stock';
}

/** Google Merchant Center product feed. Served at /feeds/google-merchant.xml */
export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { order: 'asc' }, take: 1 },
    },
  });

  const items = products
    .map((product) => {
      const image = product.images[0]?.url;
      const link = `${siteUrl()}${productPath(product.category.slug, product.slug)}`;
      const description = (product.shortDescription || product.description || product.name).replace(/<[^>]+>/g, '');
      return `<item>
        <g:id>${xml(product.sku)}</g:id>
        <g:title>${xml(product.name)}</g:title>
        <g:description>${xml(description.slice(0, 5000))}</g:description>
        <g:link>${xml(link)}</g:link>
        ${image ? `<g:image_link>${xml(image.startsWith('http') ? image : `${siteUrl()}${image}`)}</g:image_link>` : ''}
        <g:availability>${availability(product.stockStatus)}</g:availability>
        <g:price>${Math.round(Number(product.price))} BDT</g:price>
        <g:brand>${xml(product.brand.name)}</g:brand>
        <g:condition>new</g:condition>
        ${product.gtin ? `<g:gtin>${xml(product.gtin)}</g:gtin>` : ''}
        ${product.mpn ? `<g:mpn>${xml(product.mpn)}</g:mpn>` : ''}
      </item>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xml(siteName())}</title>
    <link>${xml(siteUrl())}</link>
    <description>Product feed for Google Merchant Center</description>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
