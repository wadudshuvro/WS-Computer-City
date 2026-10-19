/**
 * Re-read the specification table from each product's saved Star Tech URL and
 * store it with line breaks intact. Only the `spec_table` row is written.
 * Price, images, other specs and CMS text are not touched.
 *
 * `spec_table` has one definition per category, so each product is written under
 * the definition that belongs to its own category.
 *
 * Run:
 *   npx tsx scripts/refresh-spec-tables.ts watch --dry-run --limit 3
 *   npx tsx scripts/refresh-spec-tables.ts watch
 *
 * One request at a time, 1.5 s apart. A failed product is logged and skipped.
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { parseSpecGroups } from './lib/specHtml';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const args = process.argv.slice(2);
const categorySlug = args.find((a) => !a.startsWith('--'));
const dryRun = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : 0;
const DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'text/html',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function main() {
  if (!categorySlug) {
    console.log('Usage: npx tsx scripts/refresh-spec-tables.ts <category-slug> [--dry-run] [--limit N]');
    return;
  }

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) throw new Error(`Unknown category "${categorySlug}"`);
  const definition = await prisma.specificationDefinition.findFirst({
    where: { key: 'spec_table', categoryId: category.id },
  });
  if (!definition) throw new Error(`No spec_table definition for category "${categorySlug}".`);

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, sourceUrl: { not: null } },
    select: {
      id: true,
      slug: true,
      sourceUrl: true,
      specifications: {
        where: { specificationDefinitionId: definition.id },
        select: { value: true },
      },
    },
    orderBy: { slug: 'asc' },
    ...(limit > 0 ? { take: limit } : {}),
  });
  console.log(`${products.length} product(s) in "${categorySlug}"${dryRun ? ' (dry run)' : ''}`);

  let updated = 0;
  let same = 0;
  let failed = 0;
  for (const [index, product] of products.entries()) {
    try {
      const groups = parseSpecGroups(await fetchHtml(product.sourceUrl!));
      if (groups.length === 0) {
        console.log(`SKIP ${product.slug}: no specification table on the page`);
        failed++;
      } else {
        const value = JSON.stringify(groups);
        if (product.specifications[0]?.value === value) {
          same++;
        } else {
          if (!dryRun) {
            await prisma.productSpecification.upsert({
              where: {
                productId_specificationDefinitionId: {
                  productId: product.id,
                  specificationDefinitionId: definition.id,
                },
              },
              update: { value },
              create: { productId: product.id, specificationDefinitionId: definition.id, value },
            });
          }
          updated++;
        }
      }
    } catch (error) {
      failed++;
      console.log(`SKIP ${product.slug}: ${(error as Error).message}`);
    }
    if ((index + 1) % 20 === 0) {
      console.log(`progress ${index + 1}/${products.length} updated=${updated} same=${same} failed=${failed}`);
    }
    await sleep(DELAY_MS);
  }
  console.log(`done updated=${updated} unchanged=${same} failed=${failed}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
