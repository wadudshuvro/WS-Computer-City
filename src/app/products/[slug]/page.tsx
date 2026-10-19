import { notFound, permanentRedirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductService } from '@/services/product.service';

type PageProps = { params: Promise<{ slug: string }> };

export const metadata = {
  robots: { index: false, follow: true },
};

/** Old product URLs permanently move to /{category}/{product}. */
export default async function LegacyProductRedirect({ params }: PageProps) {
  const { slug } = await params;
  const product = await ProductService.getBySlug(slug);
  if (product?.isActive) {
    permanentRedirect(`/${product.category.slug}/${product.slug}`);
  }
  const redirect = await prisma.productRedirect.findUnique({ where: { fromPath: `/products/${slug}` } });
  if (redirect) permanentRedirect(redirect.toPath);
  notFound();
}
