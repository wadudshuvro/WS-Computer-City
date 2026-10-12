import { prisma } from '@/lib/prisma';

export type ShowcaseProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
};

export type HomeShowcase = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  image: string;
  products: ShowcaseProduct[];
};

const sections: Omit<HomeShowcase, 'products'>[] = [
  {
    id: 'laptops',
    eyebrow: 'Gaming laptop',
    title: 'Laptops,\nready to play',
    description: 'Gaming laptops from the catalog, with the price and photos saved for each model.',
    href: '/products?category=gaming&sub=gaming-laptop',
    linkLabel: 'See all laptops',
    image: '/images/home/laptop.jpg',
  },
  {
    id: 'monitors',
    eyebrow: 'Monitor',
    title: 'Vision,\non your desk',
    description: 'Desktop monitors from the catalog, from everyday panels to high-refresh displays.',
    href: '/products?category=monitor',
    linkLabel: 'See all monitors',
    image: '/images/home/monitor.jpg',
  },
  {
    id: 'watches',
    eyebrow: 'Smart watch',
    title: 'Time,\non your wrist',
    description: 'Smart watches from the gadget catalog, each opening its own product page.',
    href: '/products?category=gadget&sub=watch',
    linkLabel: 'See all watches',
    image: '/images/home/watch.jpg',
  },
  {
    id: 'headphones',
    eyebrow: 'Headphone',
    title: 'Sound,\nconnected',
    description: 'Headphones from the accessories catalog, with photos and prices from each product.',
    href: '/products?category=accessories&sub=headphone',
    linkLabel: 'See all headphones',
    image: '/images/home/headphone.jpg',
  },
];

const categorySlug: Record<string, string> = {
  laptops: 'gaming-laptop',
  monitors: 'monitor',
  watches: 'watch',
  headphones: 'headphone',
};

async function productsFor(slug: string): Promise<ShowcaseProduct[]> {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      images: { some: {} },
      OR: [{ category: { slug } }, { listings: { some: { category: { slug } } } }],
    },
    orderBy: { price: 'asc' },
    take: 12,
    include: { images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }], take: 1 } },
  });

  return rows.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    imageUrl: product.images[0]?.url ?? null,
  }));
}

export async function getHomeShowcases(): Promise<HomeShowcase[]> {
  const loaded = await Promise.all(
    sections.map(async (section) => ({
      ...section,
      products: await productsFor(categorySlug[section.id]!),
    }))
  );
  return loaded.filter((section) => section.products.length >= 10);
}
