/**
 * Backfill processor card featured bullets from Star Tech listing
 * into product.shortDescription (newline-separated).
 *
 * Run: npx tsx scripts/backfill-processor-card-features.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const LIST_URL =
  'https://www.startech.com.bd/component/processor?filter_status=7&limit=90';
const OUT_JSON = path.join(
  process.cwd(),
  'docs/imports/startech-processor-features.json'
);

type FeatureRow = {
  slug: string;
  name: string;
  features: string[];
};

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html',
          },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        }
      )
      .on('error', reject);
  });
}

function slugFromUrl(url: string): string {
  return url
    .replace(/^https?:\/\/www\.startech\.com\.bd\//, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(rebox\)/gi, '')
    .replace(/desktop processor/gi, '')
    .replace(/processor/gi, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFeatures(html: string): FeatureRow[] {
  const rows: FeatureRow[] = [];
  const cardRe =
    /<div[^>]*class="p-item"[^>]*itemprop="itemListElement"[^>]*>([\s\S]*?)(?=<div[^>]*class="p-item"[^>]*itemprop="itemListElement"|$)/gi;

  for (const m of html.matchAll(cardRe)) {
    const card = m[1] || '';
    const url =
      /itemprop="url"[^>]*content="([^"]+)"/i.exec(card)?.[1] ||
      /href="(https:\/\/www\.startech\.com\.bd\/[^"]+)"/i.exec(card)?.[1];
    const name =
      /itemprop="name"[^>]*content="([^"]+)"/i.exec(card)?.[1] ||
      /itemprop="name"[^>]*>([^<]+)</i.exec(card)?.[1] ||
      '';

    const shortBlock =
      /class="short-description"[^>]*>\s*<ul>([\s\S]*?)<\/ul>/i.exec(card)?.[1] || '';
    const features = [...shortBlock.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((li) =>
        li[1]!
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .filter(Boolean);

    if (!url || features.length === 0) continue;
    rows.push({
      slug: slugFromUrl(url),
      name: name.trim(),
      features,
    });
  }
  return rows;
}

async function main() {
  console.log('Fetching Star Tech processor listing for featured bullets…');
  const html = await fetchText(LIST_URL);
  const rows = parseFeatures(html);
  console.log(`Parsed features for ${rows.length} products`);
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(rows, null, 2), 'utf8');

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { category: { slug: 'processor' } },
        { category: { parent: { slug: 'processor' } } },
        { category: { slug: { in: ['intel', 'amd', 'amd-ryzen'] } } },
      ],
    },
    select: { id: true, slug: true, name: true, shortDescription: true },
  });

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const byNorm = new Map(products.map((p) => [normalizeName(p.name), p]));

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    let product =
      bySlug.get(row.slug) ||
      byNorm.get(normalizeName(row.name)) ||
      products.find(
        (p) =>
          p.slug.includes(row.slug) ||
          row.slug.includes(p.slug) ||
          normalizeName(p.name) === normalizeName(row.name)
      );

    if (!product) {
      console.warn(`No DB match for ${row.slug}`);
      skipped++;
      continue;
    }

    const shortDescription = row.features.join('\n');
    if (product.shortDescription === shortDescription) {
      skipped++;
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { shortDescription },
    });
    updated++;
    console.log(`UPDATED ${product.slug} (${row.features.length} bullets)`);
  }

  console.log(`\nDone. updated=${updated} skipped=${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
