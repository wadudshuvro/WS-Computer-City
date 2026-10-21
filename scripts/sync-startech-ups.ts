/**
 * Import Star Tech UPS: photos, price, specification table (line by line), feature lines, warranty, and filter facets.
 * Run: npx tsx scripts/sync-startech-ups.ts
 */
import { stripSourceFromHtml } from './lib/stripSourceMentions';
import fs from 'fs';
import path from 'path';
import { PrismaClient, StockStatus } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { UPS_LISTING_URL } from '../src/lib/upsCatalog';
import { parseSpecGroups } from './lib/specHtml';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

function fetchText(url: string): Promise<string> {
  return fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'text/html',
    },
    redirect: 'follow',
  }).then(async (res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.text();
  });
}

function fetchBuffer(url: string): Promise<Buffer> {
  return fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'image/*,*/*',
      Referer: 'https://www.startech.com.bd/',
    },
    redirect: 'follow',
  }).then(async (res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  });
}

function stripTags(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(raw.replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function slugifyBrand(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function slugFromUrl(url: string): string {
  const part = new URL(url).pathname.split('/').filter(Boolean).pop() || '';
  return part
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

type Card = {
  name: string;
  slug: string;
  productUrl: string;
  price: number;
  compareAtPrice: number | null;
  features: string[];
  thumbUrl: string | null;
  outOfStock: boolean;
};

function parseListing(html: string): Card[] {
  const items: Card[] = [];
  const seen = new Set<string>();
  for (const card of html.split(/class=["']p-item["']/i).slice(1)) {
    const href =
      /itemprop="url"[^>]*content="([^"]+)"/i.exec(card)?.[1] ||
      /class=["']p-item-name["'][^>]*>\s*<a[^>]*href=["']([^"']+)["']/i.exec(card)?.[1];
    const name = stripTags(
      /itemprop="name"[^>]*content="([^"]+)"/i.exec(card)?.[1] ||
        /<span itemprop="name">([\s\S]*?)<\/span>/i.exec(card)?.[1] ||
        ''
    );
    if (!href || !name) continue;
    const productUrl = new URL(href, 'https://www.startech.com.bd').toString();
    const slug = slugFromUrl(productUrl);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const priceBlock = /class="p-item-price"[\s\S]*?<\/div>/i.exec(card)?.[0] || '';
    const takaPrices = [...priceBlock.matchAll(/([\d,]+)\s*৳/g)]
      .map((match) => parsePrice(match[1]))
      .filter((value): value is number => Boolean(value));
    const price =
      parsePrice(/itemprop="price"[^>]*content="([\d.]+)"/i.exec(card)?.[1]) ||
      parsePrice(/class="price-new"[^>]*>\s*([\d,]+)/i.exec(card)?.[1]) ||
      takaPrices[0] ||
      0;
    const oldPrice = parsePrice(/class="price-old"[^>]*>\s*([\d,]+)/i.exec(card)?.[1]);
    const compareAtPrice = oldPrice && oldPrice > price ? oldPrice : takaPrices.find((value) => value > price) || null;
    const shortBlock = /class="short-description"[\s\S]*?<ul>([\s\S]*?)<\/ul>/i.exec(card)?.[1] || '';
    const features = [...shortBlock.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((li) => stripTags(li[1] || ''))
      .filter(Boolean);
    const thumb = /itemprop="image"[^>]*src="([^"]+)"/i.exec(card)?.[1] || null;
    items.push({
      name,
      slug,
      productUrl,
      price,
      compareAtPrice,
      features,
      thumbUrl: thumb,
      outOfStock: /out of stock/i.test(card),
    });
  }
  return items;
}

function pageCount(html: string): number {
  const total = Number(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/i.exec(html)?.[1] || 0);
  if (total > 0) return Math.ceil(total / 90);
  return 1;
}

function parseDescription(html: string): string | null {
  const start = html.indexOf('class="full-description"');
  if (start < 0) return null;
  const from = html.indexOf('>', start);
  const end = html.indexOf('</section>', from);
  if (from < 0 || end < 0) return null;
  const clean = html
    .slice(from + 1, end)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
  const paragraphs = [...clean.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => stripTags(match[1] || ''))
    .filter(Boolean);
  const lines = paragraphs.length > 0 ? paragraphs : [stripTags(clean)].filter(Boolean);
  if (lines.length === 0) return null;
  return lines.map((line) => `<p>${line.replace(/</g, '')}</p>`).join('');
}

function parseKeyFeatures(html: string): string[] {
  const block = /class="short-description"[\s\S]*?<ul>([\s\S]*?)<\/ul>/i.exec(html)?.[1] || '';
  return [...block.matchAll(/<li(?![^>]*view-more)[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripTags(match[1] || ''))
    .filter((line) => line && !/view more info/i.test(line));
}


function imageCandidates(url: string): string[] {
  const list = [url];
  if (/-228x228\./i.test(url)) list.unshift(url.replace(/-228x228\./i, '-500x500.'));
  if (/-74x74\./i.test(url)) list.unshift(url.replace(/-74x74\./i, '-500x500.'));
  return list;
}

async function downloadImage(urls: string[], destBase: string): Promise<string | null> {
  for (const ext of ['webp', 'jpg', 'png']) {
    const existing = `${destBase}.${ext}`;
    if (fs.existsSync(existing) && fs.statSync(existing).size > 800) {
      const publicPath = existing.split(`${path.sep}public`)[1]?.replace(/\\/g, '/');
      if (publicPath) return publicPath;
    }
  }
  for (const url of urls) {
    try {
      const buffer = await fetchBuffer(url);
      if (buffer.length < 800) continue;
      const ext = /\.webp(\?|$)/i.test(url) ? 'webp' : /\.png(\?|$)/i.test(url) ? 'png' : 'jpg';
      const file = `${destBase}.${ext}`;
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, buffer);
      const publicPath = file.split(`${path.sep}public`)[1]?.replace(/\\/g, '/');
      return publicPath || null;
    } catch {
      continue;
    }
  }
  return null;
}

function galleryUrls(html: string, thumbUrl: string | null): string[] {
  const folder = thumbUrl?.match(/\/catalog\/(.+\/)[^/]+$/)?.[1];
  if (!folder) return thumbUrl ? [thumbUrl] : [];
  const found = [...html.matchAll(/src="(https:\/\/www\.startech\.com\.bd\/image\/cache\/catalog\/[^"]+)"/g)]
    .map((match) => match[1])
    .filter((url): url is string => Boolean(url && url.includes(`/catalog/${folder}`)));
  const unique = [...new Set(found)];
  const byBase = new Map<string, { url: string; score: number }>();
  for (const url of unique) {
    if (!url) continue;
    const base = url.replace(/-\d+x\d+(?=\.)/i, '');
    const score = /-500x500/i.test(url) ? 3 : /-228x228/i.test(url) ? 2 : 1;
    const prev = byBase.get(base);
    if (!prev || score > prev.score) byBase.set(base, { url, score });
  }
  const photos = [...byBase.values()].map((item) => item.url);
  return photos.length > 0 ? photos : thumbUrl ? [thumbUrl] : [];
}

type FacetMap = Map<string, Map<string, string[]>>;
const facetIndex: FacetMap = new Map();

const FACET_KEYS: Record<string, string> = {
  'Volt Ampere (VA)': 'ups_va',
  'Load Capacity (Watts)': 'ups_watt',
  'Body Material': 'ups_body',
};

function facetSpecs(slug: string): { key: string; value: string }[] {
  const out: { key: string; value: string }[] = [];
  for (const [key, bySlug] of facetIndex) {
    const labels = bySlug.get(slug);
    if (labels && labels.length > 0) out.push({ key, value: `|${labels.join('|')}|` });
  }
  return out;
}

/** Read each Star Tech filter option listing and remember which product slugs belong to it. */
async function buildFacetIndex(firstHtml: string) {
  for (const chunk of firstHtml.split('class="filter-group').slice(1)) {
    const title = stripTags(/<span>([^<]+)<\/span>/.exec(chunk)?.[1] || '');
    const key = FACET_KEYS[title];
    if (!key) continue;
    const bySlug = new Map<string, string[]>();
    for (const match of chunk.matchAll(/name="filter"\s+value="(\d+)"\s*\/>\s*<span>([^<]+)<\/span>/g)) {
      const label = stripTags(match[2] || '');
      const html = await fetchText(`${UPS_LISTING_URL}?filter=${match[1]}&limit=90`);
      for (const card of parseListing(html)) {
        const list = bySlug.get(card.slug) ?? [];
        if (!list.includes(label)) list.push(label);
        bySlug.set(card.slug, list);
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    facetIndex.set(key, bySlug);
    console.log(`facet ${key}: ${bySlug.size} products`);
  }
}

async function ensureBrand(name: string) {
  const slug = slugifyBrand(name);
  const existing = await prisma.brand.findFirst({
    where: { OR: [{ slug }, { name: { equals: name, mode: 'insensitive' } }] },
  });
  if (existing) return existing;
  return prisma.brand.create({ data: { name, slug, isActive: true } });
}

async function importCard(card: Card, categoryId: string) {
  let html = '';
  try {
    html = await fetchText(card.productUrl);
  } catch (error) {
    console.log(`SKIP pdp ${card.slug}: ${(error as Error).message}`);
    return 'skip';
  }

  const brandName = /property="product:brand"[^>]*content="([^"]+)"/i.exec(html)?.[1]?.trim();
  if (!brandName) {
    console.log(`SKIP no brand ${card.slug}`);
    return 'skip';
  }
  const pdpPrice = parsePrice(/property="product:price:amount"[^>]*content="([\d.]+)"/i.exec(html)?.[1]);
  const price = card.price || pdpPrice || 0;
  if (!price && !/up[- ]?coming/i.test(/property="product:availability"[^>]*content="([^"]+)"/i.exec(html)?.[1] || '')) {
    console.log(`SKIP no price ${card.slug}`);
    return 'skip';
  }
  const specGroups = parseSpecGroups(html);
  const warranty =
    specGroups.flatMap((group) => group.rows).find((row) => row.name.toLowerCase() === 'warranty')?.value ||
    null;
  const features = parseKeyFeatures(html);
  const featureLines = features.length > 0 ? features : card.features;
  const description = stripSourceFromHtml(parseDescription(html));
  const availability = /property="product:availability"[^>]*content="([^"]+)"/i.exec(html)?.[1] || '';
  const stockStatus: StockStatus = /out of stock/i.test(availability) || card.outOfStock
    ? 'OUT_OF_STOCK'
    : /pre-?order/i.test(availability)
      ? 'PRE_ORDER'
      : /up[- ]?coming/i.test(availability)
        ? 'UPCOMING'
      : 'IN_STOCK';

  const brand = await ensureBrand(brandName);
  const specs: { key: string; value: string }[] = [
    ...(specGroups.length > 0 ? [{ key: 'spec_table', value: JSON.stringify(specGroups) }] : []),
    ...(warranty ? [{ key: 'warranty', value: warranty }] : []),
    ...facetSpecs(card.slug),
  ];

  const imageUrls = galleryUrls(html, card.thumbUrl);
  const localImages: { url: string; alt: string; order: number; isPrimary: boolean }[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const base = path.join(
      process.cwd(),
      'public',
      'uploads',
      'ups',
      i === 0 ? card.slug : `${card.slug}-${i + 1}`
    );
    const saved = await downloadImage(imageCandidates(imageUrls[i]!), base);
    if (saved) localImages.push({ url: saved, alt: card.name, order: i, isPrimary: i === 0 });
  }

  const existing = await prisma.product.findUnique({ where: { slug: card.slug } });
  if (existing) {
    await prisma.productListing.upsert({
      where: { productId_categoryId: { productId: existing.id, categoryId } },
      update: {},
      create: { productId: existing.id, categoryId },
    });
    await ProductService.update(existing.id, {
      price,
      compareAtPrice: card.compareAtPrice,
      stockStatus,
      shortDescription: featureLines.length ? featureLines.join('\n') : undefined,
      ...(description ? { description } : {}),
      brandId: brand.id,
      sourceUrl: card.productUrl,
      ...(specs.length > 0 ? { specifications: specs } : {}),
      ...(localImages.length > 0 ? { images: localImages } : {}),
    } as never);
    return 'update';
  }

  const skuBase = card.slug.slice(0, 40).toUpperCase();
  let sku = skuBase;
  let n = 2;
  while (await prisma.product.findUnique({ where: { sku } })) {
    sku = `${skuBase}-${n++}`.slice(0, 48);
  }

  const created = (await ProductService.create({
    name: card.name,
    slug: card.slug,
    sku,
    shortDescription: featureLines.length ? featureLines.join('\n') : null,
    description:
      description ||
      (featureLines.length
        ? `<ul>${featureLines.map((feature) => `<li>${feature.replace(/</g, '')}</li>`).join('')}</ul>`
        : null),
    sourceUrl: card.productUrl,
    price,
    compareAtPrice: card.compareAtPrice,
    stockStatus,
    stockQuantity: 0,
    categoryId,
    brandId: brand.id,
    isActive: true,
    images: localImages,
    specifications: specs,
  } as never))!;

  await prisma.productListing.upsert({
    where: { productId_categoryId: { productId: created.id, categoryId } },
    update: {},
    create: { productId: created.id, categoryId },
  });
  return 'create';
}

async function main() {
  const power = await prisma.category.upsert({
    where: { slug: 'power' },
    update: { name: 'Power', isActive: true },
    create: { name: 'Power', slug: 'power', level: 0, isActive: true },
  });
  const category = await prisma.category.upsert({
    where: { slug: 'ups' },
    update: { name: 'UPS', isActive: true, level: 1, parentId: power.id },
    create: { name: 'UPS', slug: 'ups', level: 1, isActive: true, parentId: power.id },
  });

  const firstHtml = await fetchText(`${UPS_LISTING_URL}?limit=90`);
  const pages = Math.min(pageCount(firstHtml), 80);
  console.log(`UPS: ${pages} page(s)`);
  await buildFacetIndex(firstHtml);
  let created = 0;
  let updated = 0;
  let skipped = 0;
  for (let page = 1; page <= pages; page++) {
    const html = page === 1 ? firstHtml : await fetchText(`${UPS_LISTING_URL}?limit=90&page=${page}`);
    for (const card of parseListing(html)) {
      try {
        const result = await importCard(card, category.id);
        if (result === 'create') created++;
        else if (result === 'update') updated++;
        else skipped++;
      } catch (error) {
        skipped++;
        console.log(`SKIP ${card.slug}: ${(error as Error).message}`);
      }
      if ((created + updated + skipped) % 25 === 0) {
        console.log(`progress created=${created} updated=${updated} skipped=${skipped}`);
      }
    }
  }
  console.log(`done created=${created} updated=${updated} skipped=${skipped}`);
}


main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
