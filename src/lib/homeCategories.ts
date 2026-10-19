import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

type TopCategoryDef = {
  name: string;
  href: string;
  /** Category slugs whose products can supply the card photo. */
  categories: string[];
};

/** Home "Top Categories": only categories that really hold products in this shop. */
const TOP_CATEGORIES: TopCategoryDef[] = [
  { name: 'Processor', href: '/products?category=components&sub=processor', categories: ['intel', 'amd'] },
  { name: 'Motherboard', href: '/products?category=components&sub=motherboard', categories: ['intel-motherboard', 'amd-motherboard'] },
  { name: 'Graphics Card', href: '/products?category=components&sub=graphics-card', categories: ['nvidia', 'amd-gpu', 'graphics-card'] },
  { name: 'RAM', href: '/products?category=components&sub=desktop-ram', categories: ['desktop-ram'] },
  { name: 'SSD', href: '/products?category=components&sub=ssd', categories: ['ssd'] },
  { name: 'Hard Disk', href: '/products?category=components&sub=hdd', categories: ['hdd'] },
  { name: 'Power Supply', href: '/products?category=components&sub=power-supply', categories: ['power-supply'] },
  { name: 'Casing', href: '/products?category=components&sub=computer-case', categories: ['computer-case'] },
  { name: 'CPU Cooler', href: '/products?category=components&sub=cpu-cooler', categories: ['cpu-cooler'] },
  { name: 'Monitor', href: '/products?category=monitor', categories: ['monitor'] },
  { name: 'Router', href: '/products?category=networking&sub=router', categories: ['router'] },
  { name: 'UPS', href: '/products?category=power&sub=ups', categories: ['ups'] },
  { name: 'Keyboard', href: '/products?category=accessories&sub=keyboard', categories: ['keyboard'] },
  { name: 'Mouse', href: '/products?category=accessories&sub=mouse', categories: ['mouse'] },
  { name: 'Headphone', href: '/products?category=accessories&sub=headphone', categories: ['headphone'] },
  { name: 'Smart Watch', href: '/products?category=gadget&sub=watch', categories: ['watch'] },
  { name: 'Earbuds', href: '/products?category=gadget&sub=earbuds', categories: ['earbuds'] },
  { name: 'Power Bank', href: '/products?category=gadget&sub=power-bank', categories: ['power-bank'] },
  { name: 'Speaker', href: '/products?category=accessories&sub=bluetooth-speakers', categories: ['bluetooth-speakers'] },
  { name: 'Gaming Laptop', href: '/products?category=gaming&sub=gaming-laptop', categories: ['gaming-laptop'] },
  { name: 'Gaming Chair', href: '/products?category=gaming&sub=gaming-chair', categories: ['gaming-chair'] },
];

export type HomeTopCategory = { name: string; href: string; imageUrl: string | null };

async function loadTopCategories(): Promise<HomeTopCategory[]> {
  const result: HomeTopCategory[] = [];
  for (const def of TOP_CATEGORIES) {
    const product = await prisma.product.findFirst({
      where: {
        isActive: true,
        stockStatus: 'IN_STOCK',
        category: { slug: { in: def.categories } },
        images: { some: { url: { startsWith: '/uploads/' } } },
      },
      orderBy: { price: 'desc' },
      select: {
        images: {
          where: { url: { startsWith: '/uploads/' } },
          orderBy: { order: 'asc' },
          take: 1,
          select: { url: true },
        },
      },
    });
    const imageUrl = product?.images[0]?.url;
    // Skip categories with no in-stock product photo so the grid never shows an empty card.
    if (imageUrl) result.push({ name: def.name, href: def.href, imageUrl });
  }
  return result;
}

export const getHomeTopCategories = unstable_cache(loadTopCategories, ['home-top-categories'], {
  revalidate: 600,
});
