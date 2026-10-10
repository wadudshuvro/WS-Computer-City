/**
 * Import Star Tech smart watches.
 * Prices, brand, specs, description, warranty, and images come from each product page.
 * Products with no verified price or brand are skipped.
 *
 * Run: npx tsx scripts/sync-startech-watches.ts
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient, StockStatus } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { WATCH_BRANDS, WATCH_LISTING_URL, watchListingHref } from '../src/lib/watchCatalog';
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
    const price =
      parsePrice(/itemprop="price"[^>]*content="([\d.]+)"/i.exec(card)?.[1]) ||
      parsePrice(/class="price-new"[^>]*>\s*([\d,]+)/i.exec(card)?.[1]);
    if (!price) continue;
    const compareAtPrice = parsePrice(/class="price-old"[^>]*>\s*([\d,]+)/i.exec(card)?.[1]);
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
      compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : null,
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

function parseSpecGroups(html: string): { title: string; rows: { name: string; value: string }[] }[] {
  const start = html.indexOf('id="specification"');
  if (start < 0) return [];
  const end = html.indexOf('</section>', start);
  const block = html.slice(start, end > start ? end : start + 30000);
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

function pipe(labels: string[]): string {
  const unique = [...new Set(labels)];
  return unique.length > 0 ? `|${unique.join('|')}|` : '';
}

function rowText(
  groups: { rows: { name: string; value: string }[] }[],
  namePattern: RegExp
): string {
  return groups
    .flatMap((group) => group.rows)
    .filter((row) => namePattern.test(row.name))
    .map((row) => row.value)
    .join(' ');
}

function watchFacets(
  groups: { title: string; rows: { name: string; value: string }[] }[],
  features: string[],
  description: string | null
): { key: string; value: string }[] {
  const specs: { key: string; value: string }[] = [];
  const useText = rowText(groups, /use for|gender|suitable/i);
  const use: string[] = [];
  if (/\bmale\b/i.test(useText)) use.push('Male');
  if (/\bfemale\b|\bwoman\b|\bladies\b/i.test(useText)) use.push('Female');
  if (/\bchild|\bkids?\b/i.test(useText)) use.push('Children');
  const useValue = pipe(use);
  if (useValue) specs.push({ key: 'watch_use', value: useValue });

  const dialText = rowText(groups, /dial|shape/i);
  const dial: string[] = [];
  if (/\bround\b/i.test(dialText)) dial.push('Round');
  if (/\bsquare\b/i.test(dialText)) dial.push('Square');
  if (/\bcurved\b/i.test(dialText)) dial.push('Curved');
  const dialValue = pipe(dial);
  if (dialValue) specs.push({ key: 'watch_dial', value: dialValue });

  const strapText = rowText(groups, /strap|band/i);
  const strap: string[] = [];
  if (/silicone/i.test(strapText)) strap.push('Silicone');
  if (/leather/i.test(strapText)) strap.push('Leather');
  if (/\bmetal\b/i.test(strapText)) strap.push('Metal');
  const strapValue = pipe(strap);
  if (strapValue) specs.push({ key: 'watch_strap', value: strapValue });

  const displayText = rowText(groups, /display/i);
  const display: string[] = [];
  if (/amoled/i.test(displayText)) display.push('AMOLED');
  else if (/\boled\b/i.test(displayText)) display.push('OLED');
  if (/\btft\b/i.test(displayText)) display.push('TFT');
  if (/\bips\b/i.test(displayText)) display.push('IPS');
  const displayValue = pipe(display);
  if (displayValue) specs.push({ key: 'watch_display', value: displayValue });

  const osText = rowText(groups, /^(os|operating system|compatibility)$/i);
  const os: string[] = [];
  if (/android|andriod/i.test(osText)) os.push('Android');
  if (/\bios\b|watchos|iphone/i.test(osText)) os.push('iOS');
  if (osText && os.length === 0) os.push('Others');
  const osValue = pipe(os);
  if (osValue) specs.push({ key: 'watch_os', value: osValue });

  const blob = [
    features.join('\n'),
    description || '',
    ...groups.flatMap((group) => group.rows.map((row) => `${row.name} ${row.value}`)),
  ].join('\n');
  const featureLabels: string[] = [];
  if (/heart\s*rate/i.test(blob)) featureLabels.push('Heart Rate Monitor');
  if (/spo2|sp02|oxygen/i.test(blob)) featureLabels.push('Oxygen Sensor (SpO2)');
  if (/\bgps\b/i.test(blob)) featureLabels.push('GPS');
  if (/call function|bluetooth call|\bcalling\b/i.test(blob)) featureLabels.push('Call Function');
  if (/\bpai\b/i.test(blob)) featureLabels.push('PAI');
  if (/waterproof|water resistant|\bip68\b|\bip67\b|\bipx\d/i.test(blob)) featureLabels.push('Waterproof');
  const featureValue = pipe(featureLabels);
  if (featureValue) specs.push({ key: 'watch_feature', value: featureValue });
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
  return unique.length > 0 ? unique.slice(0, 4) : thumbUrl ? [thumbUrl] : [];
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
  const price = pdpPrice || card.price;
  const specGroups = parseSpecGroups(html);
  const warranty =
    specGroups.flatMap((group) => group.rows).find((row) => row.name.toLowerCase() === 'warranty')?.value ||
    null;
  const features = parseKeyFeatures(html);
  const featureLines = features.length > 0 ? features : card.features;
  const description = parseDescription(html);
  const availability = /property="product:availability"[^>]*content="([^"]+)"/i.exec(html)?.[1] || '';
  const stockStatus: StockStatus = /out of stock/i.test(availability) || card.outOfStock
    ? 'OUT_OF_STOCK'
    : /pre-?order/i.test(availability)
      ? 'PRE_ORDER'
      : 'IN_STOCK';

  const brand = await ensureBrand(brandName);
  const specs = [
    ...(specGroups.length > 0 ? [{ key: 'spec_table', value: JSON.stringify(specGroups) }] : []),
    ...(warranty ? [{ key: 'warranty', value: warranty }] : []),
    ...watchFacets(specGroups, featureLines, description),
  ];

  const imageUrls = galleryUrls(html, card.thumbUrl);
  const localImages: { url: string; alt: string; order: number; isPrimary: boolean }[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const base = path.join(
      process.cwd(),
      'public',
      'uploads',
      'watches',
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
    if (existing.categoryId === categoryId) {
      await ProductService.update(existing.id, {
        price,
        compareAtPrice: card.compareAtPrice,
        stockStatus,
        shortDescription: featureLines.length ? featureLines.join('\n') : undefined,
        ...(description ? { description } : {}),
        brandId: brand.id,
        ...(specs.length > 0 ? { specifications: specs } : {}),
        ...(localImages.length > 0 ? { images: localImages } : {}),
      } as never);
    }
    return 'update';
  }

  const skuBase = card.slug.slice(0, 40).toUpperCase();
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
    compareAtPrice: card.compareAtPrice,
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
  const category = await prisma.category.upsert({
    where: { slug: 'watch' },
    update: { name: 'Watch', isActive: true, level: 0 },
    create: { name: 'Watch', slug: 'watch', level: 0, isActive: true },
  });

  let top = await prisma.menuItem.findFirst({ where: { slug: 'watch', level: 0 } });
  if (!top) {
    const sortOrder = await prisma.menuItem.count({ where: { parentId: null } });
    top = await prisma.menuItem.create({
      data: {
        name: 'Watch',
        slug: 'watch',
        level: 0,
        sortOrder,
        isVisible: true,
        href: watchListingHref(),
      },
    });
  } else {
    await prisma.menuItem.update({
      where: { id: top.id },
      data: { name: 'Watch', href: watchListingHref(), isVisible: true, hideArrow: false },
    });
  }

  for (let i = 0; i < WATCH_BRANDS.length; i++) {
    const brand = WATCH_BRANDS[i]!;
    const existing = await prisma.menuItem.findFirst({
      where: { parentId: top.id, slug: brand.slug },
    });
    const data = {
      name: brand.label,
      sortOrder: i,
      href: watchListingHref(brand.slug),
      hideArrow: true,
      isVisible: true,
    };
    if (existing) {
      await prisma.menuItem.update({ where: { id: existing.id }, data });
    } else {
      await prisma.menuItem.create({
        data: { ...data, slug: brand.slug, parentId: top.id, level: 1 },
      });
    }
  }

  const firstHtml = await fetchText(`${WATCH_LISTING_URL}?limit=90`);
  const pages = Math.min(pageCount(firstHtml), 80);
  console.log(`Smart Watch: ${pages} page(s)`);
  let created = 0;
  let updated = 0;
  let skipped = 0;
  for (let page = 1; page <= pages; page++) {
    const html = page === 1 ? firstHtml : await fetchText(`${WATCH_LISTING_URL}?limit=90&page=${page}`);
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
