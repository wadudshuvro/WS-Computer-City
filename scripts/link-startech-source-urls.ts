/**
 * Fill empty sourceUrl values from the product slug.
 * Slugs were copied from Star Tech paths. This does not match products by name.
 * Usage: npx tsx scripts/link-startech-source-urls.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { SOURCE_SITE } from '../src/lib/priceSync/fetchSourcePrice';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { OR: [{ sourceUrl: null }, { sourceUrl: '' }] },
    select: { id: true, slug: true },
  });
  let linked = 0;
  for (const product of products) {
    if (!product.slug) continue;
    await prisma.product.update({
      where: { id: product.id },
      data: { sourceUrl: `${SOURCE_SITE}/${product.slug}` },
    });
    linked++;
  }
  console.log(`Linked ${linked} product(s). A 404 during sync will not change that product's price.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
