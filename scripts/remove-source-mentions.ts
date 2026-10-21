/**
 * Remove another retailer's name (and its store-specific marketing lines) from stored product text.
 * Touches only: products.description, products.shortDescription, meta fields, and specification values.
 * Run: npx tsx scripts/remove-source-mentions.ts --dry-run   (preview counts)
 *      npx tsx scripts/remove-source-mentions.ts             (apply)
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { stripSourceFromHtml, stripSourceFromSpec, stripSourceFromText } from './lib/stripSourceMentions';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();
const dry = process.argv.includes('--dry-run');
const PATTERN = 'star ?tech';

async function main() {
  const products = await prisma.$queryRawUnsafe<
    { id: string; description: string | null; shortDescription: string | null; metaTitle: string | null; metaDescription: string | null }[]
  >(
    `select id, description, "shortDescription", "metaTitle", "metaDescription" from products
     where description ~* $1 or "shortDescription" ~* $1 or "metaTitle" ~* $1 or "metaDescription" ~* $1`,
    PATTERN
  );

  if (!dry) {
    // Safety copy outside the repo so the old text can be restored if needed.
    const backup = path.join(os.tmpdir(), `pre-source-cleanup-${Date.now()}.json`);
    fs.writeFileSync(backup, JSON.stringify(products));
    console.log(`safety copy: ${backup}`);
  }

  let changed = 0;
  let emptied = 0;
  for (const row of products) {
    const description = row.description ? stripSourceFromHtml(row.description) : row.description;
    const shortDescription = row.shortDescription ? stripSourceFromText(row.shortDescription) : row.shortDescription;
    const metaTitle = row.metaTitle ? stripSourceFromText(row.metaTitle) : row.metaTitle;
    const metaDescription = row.metaDescription ? stripSourceFromText(row.metaDescription) : row.metaDescription;
    if (row.description && !description) emptied++;
    changed++;
    if (dry) continue;
    await prisma.product.update({
      where: { id: row.id },
      data: { description, shortDescription, metaTitle, metaDescription },
    });
  }
  console.log(`products ${dry ? 'would change' : 'changed'}: ${changed} (descriptions left empty: ${emptied})`);

  const specs = await prisma.$queryRawUnsafe<{ id: string; value: string }[]>(
    `select id, value from product_specifications where value ~* $1`,
    PATTERN
  );
  let specChanged = 0;
  for (const spec of specs) {
    const value = stripSourceFromSpec(spec.value);
    if (value === spec.value) continue;
    specChanged++;
    if (dry) continue;
    await prisma.productSpecification.update({ where: { id: spec.id }, data: { value } });
  }
  console.log(`specifications ${dry ? 'would change' : 'changed'}: ${specChanged} of ${specs.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
