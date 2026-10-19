import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { siteName } from '@/lib/launch/site';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  categoryPath,
  clampText,
  productPath,
  RESERVED_ROOT_SLUGS,
  stockLabel,
} from '@/lib/seo/catalogSeo';

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const PAGE_SIZE = 24;

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const { page } = await searchParams;
  if (RESERVED_ROOT_SLUGS.has(categorySlug)) return {};
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category || !category.isActive) return { title: 'Category not found' };
  const pageNumber = Math.max(1, Number(page) || 1);
  const title = clampText(
    category.metaTitle?.trim() ||
      `${category.name}${pageNumber > 1 ? ` — page ${pageNumber}` : ''} | ${siteName()}`,
    60
  );
  const description = clampText(
    category.metaDescription?.trim() ||
      category.description?.trim() ||
      `${category.name} at ${siteName()}. Compare price and availability.`,
    160
  );
  const path = pageNumber > 1 ? `${categoryPath(category.slug)}?page=${pageNumber}` : categoryPath(category.slug);
  return {
    title,
    description,
    alternates: {
      canonical: path,
      ...(pageNumber > 1 ? { prev: pageNumber === 2 ? categoryPath(category.slug) : `${categoryPath(category.slug)}?page=${pageNumber - 1}` } : {}),
    },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: absoluteUrl(path), siteName: siteName() },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { categorySlug } = await params;
  if (RESERVED_ROOT_SLUGS.has(categorySlug)) notFound();
  const { page } = await searchParams;
  const pageNumber = Math.max(1, Number(page) || 1);
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: { parent: true },
  });
  if (!category || !category.isActive) notFound();

  const where = { isActive: true, categoryId: category.id };
  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { brand: true, images: { orderBy: { order: 'asc' }, take: 1 } },
      orderBy: { price: 'asc' },
      skip: (pageNumber - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pageNumber > pages && total > 0) notFound();

  const crumbs = [
    { name: 'Home', path: '/' },
    ...(category.parent ? [{ name: category.parent.name, path: categoryPath(category.parent.slug) }] : []),
    { name: category.name, path: categoryPath(category.slug) },
  ];
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: (pageNumber - 1) * PAGE_SIZE + index + 1,
      url: absoluteUrl(productPath(category.slug, product.slug)),
      name: product.name,
    })),
  };

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>
      <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
        {category.description?.trim() ||
          `${category.name} from ${siteName()}. Prices and stock on this page come from the product catalog.`}
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((product) => (
          <li key={product.id} className="rounded-lg border bg-white p-3">
            <Link href={productPath(category.slug, product.slug)} className="font-medium text-gray-900 hover:text-blue-700">
              {product.name}
            </Link>
            <p className="mt-2 text-sm text-red-600">৳ {Math.round(Number(product.price)).toLocaleString()}</p>
            <p className="text-xs text-gray-500">{stockLabel(product.stockStatus)}</p>
          </li>
        ))}
      </ul>
      {products.length === 0 && <p className="mt-6 text-sm text-gray-600">No products in this category yet.</p>}
      {pages > 1 && (
        <nav className="mt-6 flex gap-3 text-sm" aria-label="Pagination">
          {pageNumber > 1 && (
            <Link rel="prev" href={pageNumber === 2 ? categoryPath(category.slug) : `${categoryPath(category.slug)}?page=${pageNumber - 1}`}>
              Previous
            </Link>
          )}
          <span>
            Page {pageNumber} of {pages}
          </span>
          {pageNumber < pages && (
            <Link rel="next" href={`${categoryPath(category.slug)}?page=${pageNumber + 1}`}>
              Next
            </Link>
          )}
        </nav>
      )}
      <p className="mt-6 text-sm">
        <Link className="text-blue-700 hover:underline" href={`/products?sub=${category.slug}`}>
          Open filters for {category.name}
        </Link>
      </p>
    </main>
  );
}
