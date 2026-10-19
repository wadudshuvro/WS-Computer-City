import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { ProductService } from '@/services/product.service';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  productJsonLd,
  productMetaDescription,
  productPath,
  productTitle,
  RESERVED_ROOT_SLUGS,
} from '@/lib/seo/catalogSeo';
import { siteName } from '@/lib/launch/site';

export const revalidate = 3600;

type PageProps = { params: Promise<{ categorySlug: string; productSlug: string }> };

async function load(productSlug: string) {
  return ProductService.getBySlug(productSlug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  if (RESERVED_ROOT_SLUGS.has(categorySlug)) return {};
  const product = await load(productSlug);
  if (!product) return { title: `Product not found | ${siteName()}`, robots: { index: false, follow: false } };
  const path = productPath(product.category.slug, product.slug);
  const title = productTitle(product.name, product.metaTitle);
  const description = productMetaDescription({
    name: product.name,
    brand: product.brand.name,
    price: Number(product.price),
    shortDescription: product.shortDescription,
    metaDescription: product.metaDescription,
  });
  const image = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;
  return {
    title,
    description,
    alternates: { canonical: path },
    keywords: product.metaKeywords
      ?.split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteName(),
      type: 'website',
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductSeoPage({ params }: PageProps) {
  const { categorySlug, productSlug } = await params;
  if (RESERVED_ROOT_SLUGS.has(categorySlug)) notFound();
  const product = await load(productSlug);
  if (!product || !product.isActive) {
    const redirect = await prisma.productRedirect.findUnique({
      where: { fromPath: `/${categorySlug}/${productSlug}` },
    });
    if (redirect) permanentRedirect(redirect.toPath);
    notFound();
  }
  const canonical = productPath(product.category.slug, product.slug);
  if (categorySlug !== product.category.slug) permanentRedirect(canonical);

  const related = await prisma.product.findMany({
    where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
    take: 8,
    orderBy: { price: 'asc' },
    include: { images: { take: 1, orderBy: { order: 'asc' } }, brand: true },
  });

  const warranty = product.specifications.find((spec) => spec.specificationDefinition.key === 'warranty')?.value;
  const image = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;
  const jsonLd = productJsonLd({
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    shortDescription: product.shortDescription,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    price: Number(product.price),
    stockStatus: product.stockStatus,
    gtin: product.gtin,
    mpn: product.mpn,
    categorySlug: product.category.slug,
    categoryName: product.category.name,
    brandName: product.brand.name,
    images: image ? [image] : [],
  });
  const crumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: product.category.name, path: `/${product.category.slug}` },
    { name: product.name, path: canonical },
  ]);

  return (
    <>
      {image && <link rel="preload" as="image" href={image} />}
      <meta property="og:type" content="product" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <ProductDetailClient
        slug={product.slug}
        initialProduct={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
          shortDescription: product.shortDescription ?? undefined,
          description: product.description ?? undefined,
          stockStatus: product.stockStatus,
          stockQuantity: product.stockQuantity,
          category: {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
            breadcrumb: product.category.breadcrumb,
          },
          brand: { id: product.brand.id, name: product.brand.name, slug: product.brand.slug },
          images: product.images.map((img) => ({
            url: img.url,
            alt: img.alt || `${product.name}${warranty ? `, ${warranty}` : ''}`,
            isPrimary: img.isPrimary,
            order: img.order,
          })),
          specifications: product.specifications.map((spec) => ({
            specificationDefinition: {
              key: spec.specificationDefinition.key,
              name: spec.specificationDefinition.name,
            },
            value: spec.value,
          })),
        }}
        initialRelated={related.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          categorySlug: product.category.slug,
          price: Number(item.price),
          compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : undefined,
          stockStatus: item.stockStatus,
          brand: { name: item.brand.name },
          images: item.images.map((img) => ({
            url: img.url,
            alt: img.alt || item.name,
            isPrimary: img.isPrimary,
            order: img.order,
          })),
        }))}
      />
    </>
  );
}
