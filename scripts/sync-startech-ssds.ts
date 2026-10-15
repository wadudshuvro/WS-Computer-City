/**
 * Import Star Tech SSDs: photos, price, specification table, description, warranty, and filter facets.
 * Run: npx tsx scripts/sync-startech-ssds.ts
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient, StockStatus } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const LISTING_URL = 'https://www.startech.com.bd/ssd';

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
  preOrder: boolean;
  upcoming: boolean;
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
      preOrder: /pre\s*order/i.test(card),
      upcoming: /up\s*coming/i.test(card),
    });
  }
  return items;
}

function pageCount(html: string): number {
  const total = Number(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/i.exec(html)?.[1] || 0);
  if (total > 0) return Math.ceil(total / 90);
  return 1;
}

function parseSpecGroups(html: string): { title: string; rows: { name: string; value: string }[] }[] {
  const start = html.indexOf('id="specification"');
  if (start < 0) return [];
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
    if (title && rows.length > 0) groups.push({ title, rows });
  }
  return groups;
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
  const cut = clean.search(/<h2[^>]*>\s*Buy\b/i);
  const body = cut > 0 ? clean.slice(0, cut) : clean;
  const paragraphs = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => stripTags(match[1] || ''))
    .filter(Boolean);
  const lines = paragraphs.length > 0 ? paragraphs : [stripTags(body)].filter(Boolean);
  if (lines.length === 0) return null;
  return lines.map((line) => `<p>${line.replace(/</g, '')}</p>`).join('');
}

function parseKeyFeatures(html: string): string[] {
  const block = /class="short-description"[\s\S]*?<ul>([\s\S]*?)<\/ul>/i.exec(html)?.[1] || '';
  return [...block.matchAll(/<li(?![^>]*view-more)[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripTags(match[1] || ''))
    .filter((line) => line && !/view more info/i.test(line));
}

function speedBand(value: number): string | null {
  if (!value) return null;
  if (value <= 500) return 'Up to 500MB/s';
  if (value <= 800) return '500MB/s to 800MB/s';
  if (value <= 1000) return '801MB/s to 1000MB/s';
  return '1001MB/s & Above';
}

function allSpeeds(text: string): number[] {
  return [...text.replace(/,/g, '').matchAll(/(\d+(?:\.\d+)?)\s*(gb\/s|mb\/s)/gi)].map((match) => {
    const amount = Number(match[1]);
    return /gb\/s/i.test(match[2] || '') ? amount * 1000 : amount;
  });
}

function capacityBand(text: string): string | null {
  const tb = text.match(/(\d+(?:\.\d+)?)\s*TB/i);
  const gb = text.match(/(\d+(?:\.\d+)?)\s*GB/i);
  let gigabytes = 0;
  if (tb) gigabytes = Number(tb[1]) * 1000;
  else if (gb) gigabytes = Number(gb[1]);
  if (!gigabytes) return null;
  if (gigabytes <= 128) return '0 to 128GB';
  if (gigabytes <= 256) return '129GB to 256GB';
  if (gigabytes <= 512) return '257GB to 512GB';
  if (gigabytes <= 1024) return '513GB to 1TB';
  return 'Over 1TB';
}

function classifySsdFacets(input: {
  name: string;
  features: string[];
  groups: { title: string; rows: { name: string; value: string }[] }[];
}): { key: string; value: string }[] {
  const rows = input.groups.flatMap((group) => group.rows);
  const findRow = (pattern: RegExp) => rows.find((row) => pattern.test(row.name))?.value || '';
  const blob = `${input.name} ${input.features.join(' ')} ${rows.map((row) => `${row.name} ${row.value}`).join(' ')}`;

  const interfaceText = findRow(/interface/i) || blob;
  let interfaceValue: string | null = null;
  if (/nvme|pci-?e/i.test(interfaceText)) interfaceValue = 'PCI-E';
  else if (/sata/i.test(interfaceText)) interfaceValue = 'SATA';

  const capacity = capacityBand(findRow(/capacity/i) || `${input.name} ${input.features.join(' ')}`);

  const formText = findRow(/form\s*factor/i) || blob;
  const formFactor = /m\.?2|2280/i.test(formText) ? 'M.2' : /2\.5/.test(formText) ? '2.5 inches' : null;

  const genText = findRow(/generation|pcie|pci-e|nvme/i) || blob;
  const pcieGen = /gen\s*5|pcie?\s*5|5\.0/i.test(genText)
    ? 'Gen5'
    : /gen\s*4|pcie?\s*4|4\.0/i.test(genText)
      ? 'Gen4'
      : /gen\s*3|pcie?\s*3|3\.0/i.test(genText)
        ? 'Gen3'
        : null;

  const dramText = findRow(/dram/i) || input.features.join(' ');
  const dram = /dram-?\s*less|without dram/i.test(dramText) ? null : /with dram|dram cache|\bdram\b/i.test(dramText) ? 'With DRAM' : null;

  const techText = findRow(/technology|protocol/i) || blob;
  const technology = /nvme/i.test(techText) ? 'NVME' : /ahci/i.test(techText) ? 'AHCI' : interfaceValue === 'PCI-E' ? 'NVME' : interfaceValue === 'SATA' ? 'AHCI' : null;

  const speedText = `${rows.map((row) => `${row.name} ${row.value}`).join(' ')} ${input.features.join(' ')}`;
  const speeds = allSpeeds(speedText);
  const readBand = speedBand(speeds[0] || 0);
  const writeBand = speedBand(speeds[1] || 0);

  const specs: { key: string; value: string }[] = [];
  if (interfaceValue) specs.push({ key: 'interface', value: interfaceValue });
  if (capacity) specs.push({ key: 'capacity', value: capacity });
  if (formFactor) specs.push({ key: 'form_factor', value: formFactor });
  if (interfaceValue === 'PCI-E' && pcieGen) specs.push({ key: 'pcie_gen', value: pcieGen });
  if (dram) specs.push({ key: 'dram', value: dram });
  if (technology) specs.push({ key: 'technology', value: technology });
  if (readBand) specs.push({ key: 'read_speed', value: readBand });
  if (writeBand) specs.push({ key: 'write_speed', value: writeBand });
  return specs;
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

  const brandName =
    /property="product:brand"[^>]*content="([^"]+)"/i.exec(html)?.[1]?.trim() ||
    (/robot/i.test(card.name) ? 'ROBOT' : '');
  if (!brandName) {
    console.log(`SKIP no brand ${card.slug}`);
    return 'skip';
  }
  const pdpPrice = parsePrice(/property="product:price:amount"[^>]*content="([\d.]+)"/i.exec(html)?.[1]);
  const price = pdpPrice || card.price;
  if (!price) {
    console.log(`SKIP no price ${card.slug}`);
    return 'skip';
  }
  const specGroups = parseSpecGroups(html);
  const warranty =
    specGroups
      .flatMap((group) => group.rows)
      .find((row) => /warranty/i.test(row.name))?.value || null;
  const features = parseKeyFeatures(html);
  const featureLines = features.length > 0 ? features : card.features;
  const description = parseDescription(html);
  const availability = /property="product:availability"[^>]*content="([^"]+)"/i.exec(html)?.[1] || '';
  const stockStatus: StockStatus =
    /out of stock/i.test(availability) || card.outOfStock
      ? 'OUT_OF_STOCK'
      : /pre-?order/i.test(availability) || card.preOrder
        ? 'PRE_ORDER'
        : /up\s*coming/i.test(availability) || card.upcoming
          ? 'UPCOMING'
          : 'IN_STOCK';

  const brand = await ensureBrand(brandName);
  const specs = [
    ...(specGroups.length > 0 ? [{ key: 'spec_table', value: JSON.stringify(specGroups) }] : []),
    ...(warranty ? [{ key: 'warranty', value: warranty }] : []),
    ...classifySsdFacets({ name: card.name, features: featureLines, groups: specGroups }),
  ];

  const imageUrls = galleryUrls(html, card.thumbUrl);
  const localImages: { url: string; alt: string; order: number; isPrimary: boolean }[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const base = path.join(
      process.cwd(),
      'public',
      'uploads',
      'ssd',
      i === 0 ? card.slug : `${card.slug}-${i + 1}`
    );
    const saved = await downloadImage(imageCandidates(imageUrls[i]!), base);
    if (saved) localImages.push({ url: saved, alt: card.name, order: i, isPrimary: i === 0 });
  }

  const existing = await prisma.product.findUnique({ where: { slug: card.slug } });
  const compareAtPrice = card.compareAtPrice && card.compareAtPrice > price ? card.compareAtPrice : undefined;
  if (existing) {
    await prisma.product.update({
      where: { id: existing.id },
      data: { categoryId },
    });
    await prisma.productListing.upsert({
      where: { productId_categoryId: { productId: existing.id, categoryId } },
      update: {},
      create: { productId: existing.id, categoryId },
    });
    await ProductService.update(existing.id, {
      price,
      ...(compareAtPrice ? { compareAtPrice } : {}),
      stockStatus,
      shortDescription: featureLines.length ? featureLines.join('\n') : undefined,
      ...(description ? { description } : {}),
      brandId: brand.id,
      ...(specs.length > 0 ? { specifications: specs } : {}),
      ...(localImages.length > 0 ? { images: localImages } : {}),
    } as never);
    return 'update';
  }

  const skuBase = `SSD-${card.slug.slice(0, 36)}`.toUpperCase();
  let sku = skuBase;
  let n = 2;
  while (await prisma.product.findUnique({ where: { sku } })) {
    sku = `${skuBase}-${n++}`.slice(0, 48);
  }

  const created = await ProductService.create({
    name: card.name,
    slug: card.slug,
    sku,
    shortDescription: featureLines.length ? featureLines.join('\n') : null,
    description:
      description ||
      (featureLines.length
        ? `<ul>${featureLines.map((feature) => `<li>${feature.replace(/</g, '')}</li>`).join('')}</ul>`
        : null),
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
  const parent = await prisma.category.findFirst({ where: { slug: 'components' } });
  const category = await prisma.category.upsert({
    where: { slug: 'ssd' },
    update: { name: 'SSD', isActive: true },
    create: {
      name: 'SSD',
      slug: 'ssd',
      level: parent ? 1 : 0,
      isActive: true,
      parentId: parent?.id,
    },
  });

  const firstHtml = await fetchText(`${LISTING_URL}?limit=90`);
  const pages = Math.min(pageCount(firstHtml), 20);
  console.log(`SSD: ${pages} page(s)`);
  let created = 0;
  let updated = 0;
  let skipped = 0;
  for (let page = 1; page <= pages; page++) {
    const html = page === 1 ? firstHtml : await fetchText(`${LISTING_URL}?limit=90&page=${page}`);
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
      if ((created + updated + skipped) % 20 === 0) {
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
