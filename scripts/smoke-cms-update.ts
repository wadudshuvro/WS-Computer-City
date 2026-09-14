/**
 * Smoke-test: CMS-style update must persist and be readable via getBySlug.
 * Run: npx tsx scripts/smoke-cms-update.ts
 */
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../src/services/product.service';

const prisma = new PrismaClient();
const MARKER = `CMS-SMOKE-${Date.now()}`;

async function main() {
  const product = await prisma.product.findFirst({
    where: { category: { slug: { in: ['intel', 'amd', 'processor'] } }, isActive: true },
    include: {
      images: true,
      specifications: { include: { specificationDefinition: true } },
      category: true,
      brand: true,
    },
  });

  if (!product) {
    throw new Error('No processor product found for smoke test');
  }

  const originalShort = product.shortDescription;
  const originalWarranty =
    product.specifications.find((s) => s.specificationDefinition.key === 'warranty')?.value ??
    '3 Years';

  const existingSpecPayload = product.specifications.map((s) => ({
    key: s.specificationDefinition.key,
    value: s.value,
  }));

  if (!existingSpecPayload.some((s) => s.key === 'warranty')) {
    existingSpecPayload.push({ key: 'warranty', value: originalWarranty });
  } else {
    const w = existingSpecPayload.find((s) => s.key === 'warranty')!;
    w.value = originalWarranty;
  }

  await ProductService.update(product.id, {
    shortDescription: MARKER,
    price: Number(product.price),
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    stockStatus: product.stockStatus,
    stockQuantity: product.stockQuantity,
    categoryId: product.categoryId,
    brandId: product.brandId,
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt || undefined,
      order: img.order,
      isPrimary: img.isPrimary,
    })),
    specifications: existingSpecPayload.map((s) =>
      s.key === 'warranty' ? { ...s, value: '03 Years' } : s
    ),
  } as any);

  const fromDb = await prisma.product.findUnique({
    where: { id: product.id },
    include: {
      specifications: { include: { specificationDefinition: true } },
    },
  });

  const fromSlug = await ProductService.getBySlug(product.slug);
  const warrantyDb = fromDb?.specifications.find(
    (s) => s.specificationDefinition.key === 'warranty'
  )?.value;
  const warrantySlug = fromSlug?.specifications.find(
    (s) => s.specificationDefinition.key === 'warranty'
  )?.value;

  const okShort = fromDb?.shortDescription === MARKER && fromSlug?.shortDescription === MARKER;
  const okWarranty = warrantyDb === '03 Years' && warrantySlug === '03 Years';

  console.log('Product:', product.name);
  console.log('shortDescription DB/API:', fromDb?.shortDescription, '/', fromSlug?.shortDescription);
  console.log('warranty DB/API:', warrantyDb, '/', warrantySlug);
  console.log(okShort && okWarranty ? 'PASS' : 'FAIL');

  // Restore short description marker (keep warranty as realistic value)
  await ProductService.update(product.id, {
    shortDescription: originalShort,
    specifications: existingSpecPayload.map((s) =>
      s.key === 'warranty' ? { ...s, value: '03 Years' } : s
    ),
  } as any);

  if (!okShort || !okWarranty) {
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
