import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductService } from '@/services/product.service';
import ProductDetailClient from '@/components/products/ProductDetailClient';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'LogicBay BD';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductService.getBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | LogicBay BD',
    };
  }

  const title =
    product.metaTitle?.trim() ||
    `${product.name} Price in Bangladesh | LogicBay BD`;
  const description =
    product.metaDescription?.trim() ||
    product.shortDescription?.trim() ||
    `Buy ${product.name} at the best price in Bangladesh from LogicBay BD.`;
  const keywords =
    product.metaKeywords
      ?.split(',')
      .map((k) => k.trim())
      .filter(Boolean) || undefined;

  const productPath = `/products/${product.slug}`;
  const productUrl = new URL(productPath, SITE_URL).toString();
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  const ogImages = primaryImage
    ? [
        {
          url: primaryImage,
          alt: product.name,
        },
      ]
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: productPath,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: SITE_NAME,
      locale: 'en_BD',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: primaryImage ? [primaryImage] : undefined,
    },
    // Star Tech–style product social tags (og:type=product + commerce hints)
    other: {
      'og:type': 'product',
      'product:brand': product.brand.name,
      'product:availability':
        product.stockStatus === 'IN_STOCK' ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:price:amount': String(Number(product.price)),
      'product:price:currency': 'BDT',
      ...(process.env.NEXT_PUBLIC_FB_APP_ID
        ? { 'fb:app_id': process.env.NEXT_PUBLIC_FB_APP_ID }
        : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await ProductService.getBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  return <ProductDetailClient slug={slug} />;
}
