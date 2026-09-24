/**
 * Decode HTML entities in CPU cooler spec values.
 * Run: npx tsx scripts/backfill-cpu-cooler-html-specs.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

async function main() {
  const rows = await prisma.productSpecification.findMany({
    where: {
      product: {
        isActive: true,
        category: { slug: { in: ['cpu-cooler', 'cpu-coolers', 'cooler'] } },
      },
      value: { contains: '&' },
    },
  });
  let updated = 0;
  for (const row of rows) {
    const next = decodeHtmlEntities(row.value);
    if (next === row.value) continue;
    await prisma.productSpecification.update({
      where: { id: row.id },
      data: { value: next },
    });
    updated++;
  }
  console.log(`Decoded ${updated} cooler spec values`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
