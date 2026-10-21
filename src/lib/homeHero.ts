import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { productPath } from '@/lib/seo/catalogSeo';

type HeroDef = {
  id: string;
  /** Category slugs whose in-stock products feed the banner. */
  categories: string[];
  eyebrow: string;
  title: string;
  /** Line under the title; the live "from price" is appended from the database. */
  blurb: string;
  cta: string;
  href: string;
  theme: 'sky' | 'violet' | 'teal' | 'ember' | 'indigo';
};

/** Banners only for categories that really have in-stock products with local photos. */
const HERO_DEFS: HeroDef[] = [
  {
    id: 'gpu',
    categories: ['nvidia', 'amd-gpu', 'graphics-card'],
    eyebrow: 'Graphics Cards',
    title: 'Pick the GPU that fits your build',
    blurb: 'NVIDIA and AMD cards, with memory, clock and port details on every listing.',
    cta: 'Shop graphics cards',
    href: '/products?category=components&sub=graphics-card',
    theme: 'sky',
  },
  {
    id: 'gaming-laptop',
    categories: ['gaming-laptop'],
    eyebrow: 'Gaming Laptops',
    title: 'Play anywhere, upgrade nothing',
    blurb: 'Ready-to-play laptops from ASUS, HP, Lenovo, MSI and more.',
    cta: 'Shop gaming laptops',
    href: '/products?category=gaming&sub=gaming-laptop',
    theme: 'violet',
  },
  {
    id: 'monitor',
    categories: ['monitor', 'gaming-monitor'],
    eyebrow: 'Monitors',
    title: 'A sharper screen for work and play',
    blurb: 'Office, gaming and creator displays, filterable by size, panel and refresh rate.',
    cta: 'Shop monitors',
    href: '/products?category=monitor',
    theme: 'teal',
  },
  {
    id: 'watch',
    categories: ['watch'],
    eyebrow: 'Smart Watches',
    title: 'Calls, fitness and notifications on your wrist',
    blurb: 'Compare specs line by line before you add to cart.',
    cta: 'Shop smart watches',
    href: '/products?category=gadget&sub=watch',
    theme: 'ember',
  },
  {
    id: 'ssd',
    categories: ['ssd'],
    eyebrow: 'SSD Storage',
    title: 'Faster boots, shorter load screens',
    blurb: 'NVMe and SATA drives from every major brand.',
    cta: 'Shop SSDs',
    href: '/products?category=components&sub=ssd',
    theme: 'indigo',
  },
];

export type HeroProduct = {
  name: string;
  href: string;
  imageUrl: string;
  price: string;
  oldPrice: string | null;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  cta: string;
  href: string;
  theme: HeroDef['theme'];
  fromPrice: string;
  inStock: number;
  products: HeroProduct[];
};

const money = (value: number) => `৳${Math.round(value).toLocaleString('en-US')}`;

async function loadHeroSlides(): Promise<HeroSlide[]> {
  const slides: HeroSlide[] = [];

  for (const def of HERO_DEFS) {
    const where = {
      isActive: true,
      stockStatus: 'IN_STOCK' as const,
      price: { gt: 0 },
      category: { slug: { in: def.categories } },
      images: { some: { url: { startsWith: '/uploads/' } } },
    };

    const [aggregate, count] = await Promise.all([
      prisma.product.aggregate({ where, _min: { price: true } }),
      prisma.product.count({ where }),
    ]);
    if (count < 3 || !aggregate._min.price) continue;

    // Three real products spread across the price range (upper, middle, lower).
    const picks: HeroProduct[] = [];
    for (const share of [0.8, 0.45, 0.12]) {
      const [row] = await prisma.product.findMany({
        where,
        orderBy: [{ price: 'asc' }, { id: 'asc' }],
        skip: Math.min(count - 1, Math.floor(count * share)),
        take: 1,
        select: {
          name: true,
          slug: true,
          price: true,
          compareAtPrice: true,
          category: { select: { slug: true } },
          images: {
            where: { url: { startsWith: '/uploads/' } },
            orderBy: { order: 'asc' },
            take: 1,
            select: { url: true },
          },
        },
      });
      const image = row?.images[0]?.url;
      if (!row || !image) continue;
      const price = Number(row.price);
      const compare = row.compareAtPrice ? Number(row.compareAtPrice) : 0;
      picks.push({
        name: row.name,
        href: productPath(row.category.slug, row.slug),
        imageUrl: image,
        price: money(price),
        oldPrice: compare > price ? money(compare) : null,
      });
    }
    if (picks.length < 3) continue;

    slides.push({
      id: def.id,
      eyebrow: def.eyebrow,
      title: def.title,
      blurb: def.blurb,
      cta: def.cta,
      href: def.href,
      theme: def.theme,
      fromPrice: money(Number(aggregate._min.price)),
      inStock: count,
      products: picks,
    });
  }

  return slides;
}

export const getHeroSlides = unstable_cache(loadHeroSlides, ['home-hero-slides'], {
  revalidate: 600,
});
