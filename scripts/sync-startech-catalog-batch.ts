/**
 * Star Tech in-stock catalog import for laptop RAM, portable hard disks, and PC cases.
 * Usage: npx tsx scripts/sync-startech-catalog-batch.ts laptop-ram|portable-hdd|casing
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { PrismaClient, StockStatus } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

type Kind = 'laptop-ram' | 'portable-hdd' | 'casing';

const CONFIG: Record<
  Kind,
  { listing: string; categorySlug: string; categoryName: string; folder: string; sku: string }
> = {
  'laptop-ram': {
    listing: 'https://www.startech.com.bd/component/laptop-ram?filter_status=7&limit=90',
    categorySlug: 'laptop-ram',
    categoryName: 'Laptop RAM',
    folder: 'laptop-ram',
    sku: 'LRAM',
  },
  'portable-hdd': {
    listing: 'https://www.startech.com.bd/portable-hard-disk-drive?filter_status=7&limit=90',
    categorySlug: 'portable-hdd',
    categoryName: 'Portable Hard Disk Drive',
    folder: 'portable-hdd',
    sku: 'PHDD',
  },
  casing: {
    listing: 'https://www.startech.com.bd/component/casing?filter_status=7&limit=90',
    categorySlug: 'computer-case',
    categoryName: 'Casing',
    folder: 'casings',
    sku: 'CASE',
  },
};

type Card = {
  name: string;
  slug: string;
  productUrl: string;
  price: number;
  compareAtPrice: number | null;
  features: string[];
  thumbUrl: string | null;
  outOfStock: boolean;
  preOrder: boolean;
  upcoming: boolean;
};

async function fetchText(url: string): Promise<string> {
  let last = 'HTTP error';
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
      redirect: 'follow',
    });
    if (res.status === 429) {
      last = 'HTTP 429';
      await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }
  throw new Error(last);
}

function stripTags(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
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
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function slugFromUrl(url: string): string {
  const part = new URL(url).pathname.split('/').filter(Boolean).pop() || '';
  return part.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

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
    const price =
      parsePrice(/itemprop="price"[^>]*content="([\d.]+)"/i.exec(card)?.[1]) ||
      parsePrice(/class="price-new"[^>]*>\s*([\d,]+)/i.exec(card)?.[1]) ||
      0;
    const oldPrice = parsePrice(/class="price-old"[^>]*>\s*([\d,]+)/i.exec(card)?.[1]);
    const shortBlock = /class="short-description"[\s\S]*?<ul>([\s\S]*?)<\/ul>/i.exec(card)?.[1] || '';
    const features = [...shortBlock.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((li) => stripTags(li[1] || ''))
      .filter(Boolean);
    items.push({
      name,
      slug,
      productUrl,
      price,
      compareAtPrice: oldPrice && oldPrice > price ? oldPrice : null,
      features,
      thumbUrl: /itemprop="image"[^>]*src="([^"]+)"/i.exec(card)?.[1] || null,
      outOfStock: /out of stock/i.test(card),
      preOrder: /pre\s*order/i.test(card),
      upcoming: /up\s*coming/i.test(card),
    });
  }
  return items;
}

function pageCount(html: string): number {
  const total = Number(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/i.exec(html)?.[1] || 0);
  return total > 0 ? Math.ceil(total / 90) : 1;
}

function parseSpecGroups(html: string) {
  const start = html.indexOf('id="specification"');
  if (start < 0) return [] as { title: string; rows: { name: string; value: string }[] }[];
  const end = html.indexOf('</section>', start);
  const block = html.slice(start, end > start ? end : start + 40000);
  const groups: { title: string; rows: { name: string; value: string }[] }[] = [];
  for (const part of block.split(/<thead>/i).slice(1)) {
    const title = stripTags(/heading-row[^>]*>([\s\S]*?)<\/td>/i.exec(part)?.[1] || '');
    const rows: { name: string; value: string }[] = [];
    for (const row of part.matchAll(/<td\s+class="name">([\s\S]*?)<\/td>\s*<td\s+class="value">([\s\S]*?)<\/td>/gi)) {
      const name = stripTags(row[1] || '');
      const value = stripTags(row[2] || '');
      if (name && value) rows.push({ name, value });
    }
    if (title && rows.length) groups.push({ title, rows });
  }
  return groups;
}

function parseKeyFeatures(html: string): string[] {
  const block = /class="short-description"[\s\S]*?<ul>([\s\S]*?)<\/ul>/i.exec(html)?.[1] || '';
  return [...block.matchAll(/<li(?![^>]*view-more)[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripTags(match[1] || ''))
    .filter((line) => line && !/view more info/i.test(line));
}

function galleryUrls(html: string, thumbUrl: string | null): string[] {
  const folder = thumbUrl?.match(/\/catalog\/(.+\/)[^/]+$/)?.[1];
  const found = [...html.matchAll(/src="(https:\/\/www\.startech\.com\.bd\/image\/cache\/catalog\/[^"]+)"/g)]
    .map((match) => match[1])
    .filter((url): url is string => Boolean(url && (!folder || url.includes(`/catalog/${folder}`))));
  const byBase = new Map<string, { url: string; score: number }>();
  for (const url of found) {
    const base = url.replace(/-\d+x\d+(?=\.)/i, '');
    const score = /-500x500/i.test(url) ? 3 : /-228x228/i.test(url) ? 2 : 1;
    const prev = byBase.get(base);
    if (!prev || score > prev.score) byBase.set(base, { url, score });
  }
  const photos = [...byBase.values()].map((item) => item.url).slice(0, 6);
  return photos.length > 0 ? photos : thumbUrl ? [thumbUrl] : [];
}

function imageCandidates(url: string): string[] {
  const ext = path.extname(new URL(url).pathname);
  const stem = url.replace(/-\d+x\d+(?=\.)/i, '').replace(new RegExp(`${ext}$`, 'i'), '');
  return [...new Set([`${stem}-800x800${ext}`, `${stem}-500x500${ext}`, url])];
}

async function downloadImage(url: string, basePath: string): Promise<string | null> {
  for (const candidate of imageCandidates(url)) {
    try {
      const res = await fetch(candidate, {
        headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.startech.com.bd/' },
        redirect: 'follow',
      });
      if (!res.ok) continue;
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 800) continue;
      const ext = path.extname(new URL(candidate).pathname).toLowerCase() || '.jpg';
      const file = `${basePath}${ext}`;
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

function findRow(groups: { rows: { name: string; value: string }[] }[], pattern: RegExp) {
  return groups.flatMap((group) => group.rows).find((row) => pattern.test(row.name))?.value || '';
}

function laptopSpecs(name: string, features: string[], groups: { rows: { name: string; value: string }[] }[]) {
  const text = `${name} ${features.join(' ')} ${groups.flatMap((g) => g.rows).map((r) => `${r.name} ${r.value}`).join(' ')}`;
  const capacity = text.match(/(\d+)\s*GB/i)?.[0]?.replace(/\s+/g, '').toUpperCase() || '';
  const type = /DDR5/i.test(text) ? 'DDR5' : /DDR4/i.test(text) ? 'DDR4' : /DDR3/i.test(text) ? 'DDR3' : '';
  const mhz = text.match(/(\d{3,5})\s*(?:MHz|MT\/s)/i)?.[1];
  const speed = mhz ? `${mhz} MHz` : '';
  const latency = findRow(groups, /latency|cas/i) || features.find((line) => /latency/i.test(line))?.split(':').pop()?.trim() || '';
  const warranty = findRow(groups, /warranty/i) || 'No Warranty';
  return [
    capacity ? { key: 'capacity', value: capacity } : null,
    type ? { key: 'memory_type', value: type } : null,
    speed ? { key: 'speed', value: speed } : null,
    latency ? { key: 'latency', value: latency } : null,
    { key: 'warranty', value: warranty },
  ].filter((row): row is { key: string; value: string } => Boolean(row));
}

function portableCapacity(text: string): string | null {
  const tb = Number(text.match(/(\d+(?:\.\d+)?)\s*TB/i)?.[1] || 0);
  const gb = tb ? tb * 1024 : Number(text.match(/(\d+(?:\.\d+)?)\s*GB/i)?.[1] || 0);
  if (!gb) return null;
  if (gb <= 1024) return '512GB to 1TB';
  if (gb <= 4096) return '2TB to 4TB';
  if (gb <= 10240) return '5TB to 10TB';
  if (gb <= 20480) return '11TB to 20TB';
  return '21TB to Above';
}

function portableWeight(text: string): string | null {
  const kg = Number(text.match(/(\d+(?:\.\d+)?)\s*kg\b/i)?.[1] || 0);
  const grams = kg ? kg * 1000 : Number(text.match(/(\d+(?:\.\d+)?)\s*g\b/i)?.[1] || 0);
  if (!grams) return null;
  if (grams <= 150) return 'Up to 150g';
  if (grams <= 200) return '150g to 200g';
  if (grams <= 400) return '201g to 400g';
  if (grams <= 500) return '401g to 500g';
  return 'Above 500g';
}

function portableSpecs(name: string, features: string[], groups: { rows: { name: string; value: string }[] }[]) {
  const text = `${name} ${features.join(' ')} ${groups.flatMap((g) => g.rows).map((r) => `${r.name} ${r.value}`).join(' ')}`;
  const materialText = findRow(groups, /material|housing|body/i) || text;
  const material = /aluminum|aluminium/i.test(materialText)
    ? 'Aluminum'
    : /rubber/i.test(materialText)
      ? 'Plastic-Rubber'
      : /plastic/i.test(materialText)
        ? 'Plastic'
        : '';
  const warranty = findRow(groups, /warranty/i) || 'No Warranty';
  return [
    portableCapacity(text) ? { key: 'capacity', value: portableCapacity(text)! } : null,
    portableWeight(text) ? { key: 'weight', value: portableWeight(text)! } : null,
    material ? { key: 'external_material', value: material } : null,
    { key: 'warranty', value: warranty },
    { key: 'spec_table', value: JSON.stringify(groups) },
  ].filter((row): row is { key: string; value: string } => Boolean(row));
}

function matchOption(raw: string, options: readonly string[]): string {
  const lower = raw.toLowerCase();
  return [...options].sort((a, b) => b.length - a.length).find((option) => lower.includes(option.toLowerCase())) || '';
}

function casingSpecs(groups: { rows: { name: string; value: string }[] }[]) {
  const color = matchOption(findRow(groups, /color/i), ['Black', 'White', 'Pink', 'Blue', 'Silver', 'Grey']);
  const caseType = matchOption(findRow(groups, /^type$|form factor|case type/i), [
    'Full Tower',
    'Mid Tower',
    'Mini Tower',
    'Micro Tower',
    'Desktop',
  ]);
  const board = findRow(groups, /motherboard/i);
  const sideRow = groups
    .flatMap((group) => group.rows)
    .find((row) => /side panel|tempered glass|window/i.test(`${row.name} ${row.value}`));
  const side = sideRow && !/^n\/?a$/i.test(sideRow.value) ? `${sideRow.name} ${sideRow.value}` : '';
  const psuRaw = findRow(groups, /power supply|^psu$/i);
  const psu = /without|not included|no psu|^no\b/i.test(psuRaw)
    ? 'No'
    : /\d+\s*w|included|with power|^yes\b/i.test(psuRaw)
      ? 'Yes'
      : '';
  const dimension = findRow(groups, /dimension/i);
  const featureText = groups
    .flatMap((group) => group.rows)
    .map((row) => `${row.name} ${row.value}`)
    .join(' ');
  const features = ['RGB', 'ARGB', 'Glass Side Panel'].filter((feature) =>
    feature === 'Glass Side Panel' ? /tempered glass|glass side/i.test(featureText) && !/tempered glass panel n\/?a/i.test(featureText) : new RegExp(feature, 'i').test(featureText)
  );
  const warranty = findRow(groups, /warranty/i) || 'No Warranty';
  return [
    color ? { key: 'color', value: color } : null,
    caseType ? { key: 'case_type', value: caseType } : null,
    board ? { key: 'motherboard_type', value: board } : null,
    side ? { key: 'side_panel', value: side } : null,
    psu ? { key: 'psu_included', value: psu } : null,
    dimension ? { key: 'dimension', value: dimension } : null,
    features.length ? { key: 'special_features', value: features.join(', ') } : null,
    { key: 'warranty', value: warranty },
    { key: 'spec_table', value: JSON.stringify(groups) },
  ].filter((row): row is { key: string; value: string } => Boolean(row));
}

const BRAND_SLUGS: Record<string, string> = {
  'western digital': 'western-digital',
  wd: 'western-digital',
  'g.skill': 'g-skill',
  gskill: 'g-skill',
  'team group': 'team',
  teamgroup: 'team',
  team: 'team',
  '1st player': '1stplayer',
  'pc power': 'pc-power',
  'value top': 'value-top',
  'value-top': 'value-top',
  't wolf': 't-wolf',
  't-wolf': 't-wolf',
  twolf: 't-wolf',
  'golden field': 'golden-field',
  'cooler master': 'cooler-master',
};

async function ensureBrand(name: string) {
  const alias = BRAND_SLUGS[name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()];
  const slug = alias || slugifyBrand(name);
  const existing = await prisma.brand.findFirst({
    where: { OR: [{ slug }, { name: { equals: name, mode: 'insensitive' } }] },
  });
  if (existing) return existing;
  return prisma.brand.create({ data: { name, slug, isActive: true } });
}

async function importCard(kind: Kind, card: Card, categoryId: string) {
  const cfg = CONFIG[kind];
  const html = await fetchText(card.productUrl);
  const brandName = /property="product:brand"[^>]*content="([^"]+)"/i.exec(html)?.[1]?.trim();
  if (!brandName) return 'skip';
  const price = parsePrice(/property="product:price:amount"[^>]*content="([\d.]+)"/i.exec(html)?.[1]) || card.price;
  if (!price) return 'skip';
  const groups = parseSpecGroups(html);
  const features = parseKeyFeatures(html);
  const featureLines = features.length ? features : card.features;
  const availability = /property="product:availability"[^>]*content="([^"]+)"/i.exec(html)?.[1] || '';
  const stockStatus: StockStatus = /out of stock/i.test(availability) || card.outOfStock
    ? 'OUT_OF_STOCK'
    : /pre-?order/i.test(availability) || card.preOrder
      ? 'PRE_ORDER'
      : /up\s*coming/i.test(availability) || card.upcoming
        ? 'UPCOMING'
        : 'IN_STOCK';
  const specs =
    kind === 'laptop-ram'
      ? laptopSpecs(card.name, featureLines, groups)
      : kind === 'portable-hdd'
        ? portableSpecs(card.name, featureLines, groups)
        : casingSpecs(groups);
  const brand = await ensureBrand(brandName);
  const imageUrls = galleryUrls(html, card.thumbUrl);
  const localImages: { url: string; alt: string; order: number; isPrimary: boolean }[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const base = path.join(process.cwd(), 'public', 'uploads', cfg.folder, i === 0 ? card.slug : `${card.slug}-${i + 1}`);
    const saved = await downloadImage(imageUrls[i]!, base);
    if (saved) localImages.push({ url: saved, alt: card.name, order: i, isPrimary: i === 0 });
  }
  const existing = await prisma.product.findUnique({ where: { slug: card.slug } });
  const compareAtPrice = card.compareAtPrice && card.compareAtPrice > price ? card.compareAtPrice : undefined;
  const payload = {
    price,
    ...(compareAtPrice ? { compareAtPrice } : {}),
    stockStatus,
    shortDescription: featureLines.length ? featureLines.join('\n') : undefined,
    brandId: brand.id,
    categoryId,
    specifications: specs,
    ...(localImages.length ? { images: localImages } : {}),
  };
  if (existing) {
    await ProductService.update(existing.id, payload as never);
    await prisma.productListing.upsert({
      where: { productId_categoryId: { productId: existing.id, categoryId } },
      update: {},
      create: { productId: existing.id, categoryId },
    });
    return 'update';
  }
  const sku = `${cfg.sku}-${crypto.createHash('sha1').update(card.slug).digest('hex').slice(0, 12)}`.toUpperCase();
  const created = await ProductService.create({
    name: card.name,
    slug: card.slug,
    sku,
    shortDescription: featureLines.join('\n') || null,
    description: featureLines.length
      ? `<ul>${featureLines.map((line) => `<li>${line.replace(/</g, '')}</li>`).join('')}</ul>`
      : null,
    price,
    compareAtPrice: compareAtPrice ?? null,
    stockStatus,
    stockQuantity: 0,
    categoryId,
    brandId: brand.id,
    isActive: true,
    images: localImages,
    specifications: specs,
  } as never);
  await prisma.productListing.upsert({
    where: { productId_categoryId: { productId: created.id, categoryId } },
    update: {},
    create: { productId: created.id, categoryId },
  });
  return 'create';
}

async function main() {
  const kind = process.argv[2] as Kind;
  const cfg = CONFIG[kind];
  if (!cfg) {
    console.error('Usage: npx tsx scripts/sync-startech-catalog-batch.ts laptop-ram|portable-hdd|casing');
    process.exit(1);
  }
  const parent = await prisma.category.findFirst({ where: { slug: 'components' } });
  const category = await prisma.category.upsert({
    where: { slug: cfg.categorySlug },
    update: { name: cfg.categoryName, isActive: true },
    create: {
      name: cfg.categoryName,
      slug: cfg.categorySlug,
      level: parent ? 1 : 0,
      isActive: true,
      parentId: parent?.id,
    },
  });
  const first = await fetchText(cfg.listing);
  const pages = Math.min(pageCount(first), 20);
  console.log(`${kind}: ${pages} page(s)`);
  let created = 0;
  let updated = 0;
  let skipped = 0;
  for (let page = 1; page <= pages; page++) {
    const html = page === 1 ? first : await fetchText(`${cfg.listing}&page=${page}`);
    for (const card of parseListing(html)) {
      try {
        const result = await importCard(kind, card, category.id);
        if (result === 'create') created++;
        else if (result === 'update') updated++;
        else skipped++;
      } catch (error) {
        skipped++;
        const message = (error as Error).message.split('\n')[0];
        console.log(`SKIP ${card.slug}: ${message}`);
      }
    }
    console.log(`page ${page} created=${created} updated=${updated} skipped=${skipped}`);
  }
  console.log(`done ${kind} created=${created} updated=${updated} skipped=${skipped}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
