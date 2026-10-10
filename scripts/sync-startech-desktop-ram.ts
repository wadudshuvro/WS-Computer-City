/**
 * Sync in-stock Star Tech desktop RAM into LogicBay BD CMS:
 *  - scrape listing (filter_status=7)
 *  - skip duplicates (slug / normalized name)
 *  - create missing products with PDP specs
 *  - update prices, feature bullets, specs on existing matches
 *  - download PDP images → public/uploads/ram/
 *
 * Run: npx tsx scripts/sync-startech-desktop-ram.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { PrismaClient, StockStatus } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { RAM_BRANDS, RAM_SPEC_DEFINITIONS } from '../src/lib/ramSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const LIST_BASE = 'https://www.startech.com.bd/component/ram?filter_status=7&limit=90';
const OUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'ram');
const LIST_JSON = path.join(process.cwd(), 'docs/imports/startech-desktop-ram-instock.json');

const SPEC_KEYS = [
  'capacity',
  'memory_type',
  'speed',
  'latency',
  'voltage',
  'power_consumption',
  'pin_count',
  'ram_features',
  'other_features',
  'color',
  'warranty',
] as const;

type ScrapedRam = {
  name: string;
  slug: string;
  productUrl: string;
  price: number;
  compareAtPrice: number | null;
  thumbUrl: string | null;
  features: string[];
};

type ExistingRam = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: unknown;
  compareAtPrice: unknown;
  categoryId: string;
  brandId: string | null;
  shortDescription: string | null;
  images: { id: string; url: string; isPrimary: boolean }[];
};

function fetchText(url: string, redirects = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          fetchText(next, redirects + 1).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      }
    );
    req.on('error', reject);
    req.setTimeout(45000, () => {
      req.destroy();
      reject(new Error(`Timeout ${url}`));
    });
  });
}

function fetchBuffer(url: string, redirects = 0): Promise<{ buffer: Buffer; contentType: string }> {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          Referer: 'https://www.startech.com.bd/',
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          fetchBuffer(next, redirects + 1).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            buffer: Buffer.concat(chunks),
            contentType: String(res.headers['content-type'] || ''),
          })
        );
      }
    );
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error(`Timeout ${url}`));
    });
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/g\.skill/gi, 'g-skill')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/desktop\s*ram/g, '')
    .replace(/g\.skill/g, 'gskill')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePrice(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) && n > 0 && n < 10_000_000 ? n : null;
}

function absoluteUrl(href: string): string {
  if (href.startsWith('//')) return `https:${href}`;
  if (href.startsWith('/')) return `https://www.startech.com.bd${href}`;
  return href;
}

function slugFromUrl(url: string): string {
  try {
    const pathName = new URL(url).pathname.replace(/\/$/, '');
    const last = pathName.split('/').filter(Boolean).pop() || '';
    return slugify(last);
  } catch {
    return '';
  }
}

function guessBrandSlug(name: string): string {
  const n = name.toLowerCase();
  const ordered = [...RAM_BRANDS].sort((a, b) => b.label.length - a.label.length);
  for (const b of ordered) {
    const label = b.label.toLowerCase();
    const slug = b.slug.toLowerCase();
    if (n.includes(label) || n.includes(slug.replace(/-/g, ' ')) || n.includes(slug)) {
      return b.slug;
    }
  }
  if (n.includes('g.skill') || n.includes('gskill') || n.includes('g skill')) return 'g-skill';
  if (n.includes('teamgroup') || n.includes('t-force') || n.includes('t force')) return 'team';
  if (n.includes('kingston') || n.includes('fury ')) return 'kingston';
  if (n.includes('corsair') || n.includes('vengeance')) return 'corsair';
  return slugify(name.split(/\s+/)[0] || 'ram');
}

function skuFromSlug(slug: string, index: number): string {
  const core = slug
    .replace(/-desktop-ram.*$/, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return `RAM-${core || index}`.replace(/-+/g, '-').slice(0, 48);
}

function parseListingHtml(html: string): ScrapedRam[] {
  const items: ScrapedRam[] = [];
  const seen = new Set<string>();
  const cards = html.split(/class=["']p-item["']/i).slice(1);

  for (const card of cards) {
    const nameMatch =
      /class=["']p-item-name["'][^>]*>\s*<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i.exec(
        card
      );
    const urlMeta = /itemprop="url"[^>]*content="([^"]+)"/i.exec(card)?.[1];
    const nameMeta = /itemprop="name"[^>]*content="([^"]+)"/i.exec(card)?.[1];

    const href = (urlMeta || nameMatch?.[1] || '').trim();
    const name = stripTags(nameMeta || nameMatch?.[2] || '');
    if (!href || !name || name.length < 6) continue;

    const lower = name.toLowerCase();
    if (lower.includes('laptop') || lower.includes('so-dimm') || lower.includes('sodimm')) {
      continue;
    }

    const productUrl = absoluteUrl(href);
    if (!productUrl.includes('startech.com.bd')) continue;
    if (productUrl.includes('/component/ram')) continue;

    let slug = slugFromUrl(productUrl);
    if (!slug) slug = slugify(name);
    if (seen.has(slug) || seen.has(productUrl)) continue;
    seen.add(slug);
    seen.add(productUrl);

    const metaPrice = /itemprop="price"[^>]*content="([\d.]+)"/i.exec(card)?.[1];
    const priceNew = /class="price-new"[^>]*>\s*([\d,]+)\s*৳/i.exec(card)?.[1];
    const priceOld = /class="price-old"[^>]*>\s*([\d,]+)\s*৳/i.exec(card)?.[1];
    const singlePrice = /class="p-item-price"[^>]*>\s*([\d,]+)\s*৳/i.exec(card)?.[1];

    let price =
      (metaPrice ? Math.round(parseFloat(metaPrice)) : null) ||
      parsePrice(priceNew || '') ||
      parsePrice(singlePrice || '');
    if (!price || price <= 0) continue;

    const compareAtPrice = parsePrice(priceOld || '');
    const finalCompare = compareAtPrice && compareAtPrice > price ? compareAtPrice : null;

    const imgMatch =
      /class="p-item-img"[\s\S]*?<img[^>]+src="([^"]+)"/i.exec(card) ||
      /itemprop="image"[^>]*src="([^"]+)"/i.exec(card) ||
      /src="(https:\/\/www\.startech\.com\.bd\/image\/[^"]+)"/i.exec(card);
    const thumbUrl = imgMatch?.[1] ? absoluteUrl(imgMatch[1]) : null;

    const shortBlock =
      /class="short-description"[^>]*>\s*<ul>([\s\S]*?)<\/ul>/i.exec(card)?.[1] || '';
    const features = [...shortBlock.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((li) => stripTags(li[1]!))
      .filter(Boolean);

    items.push({
      name,
      slug,
      productUrl,
      price,
      compareAtPrice: finalCompare,
      thumbUrl,
      features,
    });
  }

  return items;
}

function detectTotalPages(html: string, perPage: number): { total: number; pages: number } {
  const showing = html.match(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/i);
  if (showing) {
    const total = Number(showing[1]);
    return { total, pages: Math.max(1, Math.ceil(total / perPage)) };
  }
  const pages = [...html.matchAll(/[?&]page=(\d+)/gi)].map((x) => Number(x[1]));
  return { total: 0, pages: pages.length ? Math.max(...pages) : 1 };
}

function extractMainImageUrl(html: string): string | null {
  const patterns = [
    /class=["']main-img["'][^>]*src=["']([^"']+)["']/i,
    /src=["']([^"']+)["'][^>]*class=["'][^"']*main-img[^"']*["']/i,
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<img[^>]*src=["'](https?:\/\/[^"']*\/image\/(?:cache\/)?catalog\/[^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m?.[1]) return absoluteUrl(m[1].trim());
  }
  return null;
}

function upgradeImageUrl(url: string): string[] {
  const candidates = [url];
  if (/-500x500\./i.test(url)) {
    candidates.unshift(url.replace(/-500x500\./i, '-800x800.'));
    candidates.push(url.replace(/-500x500\./i, '-1000x1000.'));
  }
  if (/-228x228\./i.test(url)) {
    candidates.unshift(url.replace(/-228x228\./i, '-800x800.'));
    candidates.push(url.replace(/-228x228\./i, '-500x500.'));
  }
  const noCache = url
    .replace('/image/cache/catalog/', '/image/catalog/')
    .replace(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i, '.$1');
  if (noCache !== url) candidates.push(noCache);
  return [...new Set(candidates)];
}

function extFrom(url: string, contentType: string): string {
  try {
    const fromUrl = path.extname(new URL(url).pathname).toLowerCase();
    if (fromUrl && fromUrl.length <= 5) return fromUrl;
  } catch {
    /* ignore */
  }
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  return '.jpg';
}

async function downloadBest(imageUrl: string): Promise<{ buffer: Buffer; ext: string }> {
  let lastErr: unknown;
  for (const candidate of upgradeImageUrl(imageUrl)) {
    try {
      const { buffer, contentType } = await fetchBuffer(candidate);
      if (buffer.length < 1000) throw new Error('file too small');
      return { buffer, ext: extFrom(candidate, contentType) };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function upsertLocalImage(productId: string, localPath: string, alt: string) {
  const existing = await prisma.productImage.findMany({ where: { productId } });
  const primary = existing.find((i) => i.isPrimary) || existing[0];
  if (primary) {
    await prisma.productImage.update({
      where: { id: primary.id },
      data: { url: localPath, alt, isPrimary: true },
    });
    for (const img of existing) {
      if (img.id !== primary.id && img.isPrimary) {
        await prisma.productImage.update({ where: { id: img.id }, data: { isPrimary: false } });
      }
    }
  } else {
    await prisma.productImage.create({
      data: { productId, url: localPath, alt, order: 0, isPrimary: true },
    });
  }
}

function normalizeSpeed(raw: string): string {
  const m = raw.match(/(\d+)\s*(?:mhz|mt\/s)?/i);
  if (!m) return raw.trim();
  const mhz = `${m[1]} MHz`;
  return mhz;
}

function normalizeCapacity(raw: string): string {
  const m = raw.match(/(\d+)\s*GB/i);
  if (!m) return raw.trim();
  return `${m[1]}GB`;
}

function specsFromFeatures(features: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const feature of features) {
    const colon = feature.indexOf(':');
    if (colon === -1) continue;
    const label = feature.slice(0, colon).toLowerCase().trim();
    const value = feature.slice(colon + 1).trim();
    if (!value) continue;
    if (label.includes('capacit') || label === 'memory size' || label === 'size') {
      out.capacity = normalizeCapacity(value);
    } else if (label.includes('type') || label.includes('frequency') && /ddr/i.test(value)) {
      const ddr = value.match(/DDR[345]/i);
      if (ddr) out.memory_type = ddr[0].toUpperCase();
      const speed = value.match(/(\d+)\s*mhz/i);
      if (speed) out.speed = normalizeSpeed(speed[0]);
    } else if (label.includes('speed') || label.includes('frequency') || label.includes('bus')) {
      out.speed = normalizeSpeed(value);
    } else if (label.includes('latency') || label.includes('cas')) {
      out.latency = value.replace(/^CL/i, '').trim();
      if (/^\d/.test(out.latency) && !out.latency.toUpperCase().startsWith('CL')) {
        // keep as-is (19-19-19-43 or CL30...)
      }
    } else if (label.includes('voltage')) {
      const v = value.match(/[\d.]+\s*V/i);
      out.voltage = v ? v[0].replace(/\s+/g, '') : value;
      const lat = value.match(/(\d+-\d+-\d+(?:-\d+)?)/);
      if (lat && !out.latency) out.latency = lat[1]!;
    } else if (label.includes('form') || label.includes('pin')) {
      const pin = value.match(/(\d+)\s*-?\s*pin/i);
      if (pin) out.pin_count = `${pin[1]} Pin`;
    } else if (label.includes('warrant')) {
      out.warranty = value;
    }
  }
  return out;
}

function inferFromName(name: string): Record<string, string> {
  const out: Record<string, string> = {};
  const ddr = name.match(/DDR([345])/i);
  if (ddr) out.memory_type = `DDR${ddr[1]}`;
  const cap = name.match(/(\d+)\s*GB/i);
  if (cap) out.capacity = `${cap[1]}GB`;
  const speed = name.match(/(\d{4,5})\s*Mhz/i) || name.match(/(\d{4,5})\s*MHz/i);
  if (speed) out.speed = normalizeSpeed(speed[0]);
  if (/rgb|argb/i.test(name)) out.ram_features = /argb/i.test(name) ? 'ARGB' : 'RGB RAM';
  return out;
}

function parseSpecTable(html: string): Record<string, string> {
  const out: Record<string, string> = {};
  const otherBits: string[] = [];

  for (const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1]!.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) =>
      stripTags(c[1]!)
    );
    if (cells.length < 2) continue;
    const label = cells[0]!;
    const value = cells.slice(1).join(' ').trim();
    if (!label || !value || value.length > 500) continue;
    const l = label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

    if (l === 'type' || l === 'memory type') {
      const ddr = value.match(/DDR[345]/i);
      out.memory_type = ddr ? ddr[0].toUpperCase() : value;
    } else if (l === 'capacity' || l === 'memory size' || l === 'size') {
      out.capacity = normalizeCapacity(value);
    } else if (l === 'frequency' || l === 'bus speed' || l === 'speed') {
      out.speed = normalizeSpeed(value);
    } else if (l === 'latency' || l === 'cas latency') {
      out.latency = value;
    } else if (l === 'operating voltage' || l === 'voltage') {
      const v = value.match(/[\d.]+\s*V/i);
      out.voltage = v ? v[0].replace(/\s+/g, '') : value;
    } else if (l === 'power consumption' || l === 'power') {
      out.power_consumption = value;
    } else if (l === 'pin' || l === 'number of pin' || l === 'number of pins') {
      const pin = value.match(/(\d+)/);
      out.pin_count = pin ? `${pin[1]} Pin` : value;
    } else if (l === 'lighting effect' || l === 'rgb' || l === 'led') {
      out.ram_features = /argb/i.test(value) ? 'ARGB' : /rgb/i.test(value) ? 'RGB RAM' : value;
    } else if (l === 'color' || l === 'colour') {
      out.color = value;
    } else if (l === 'warranty' || l === 'manufacturing warranty') {
      out.warranty = value;
    } else if (
      /xmp|expo|heatsink|profile|speed rating|pc\d|software|tested/i.test(l) ||
      /xmp|expo|heatsink|pc\d/i.test(value)
    ) {
      otherBits.push(`${label}: ${value}`);
    }
  }

  if (otherBits.length) out.other_features = otherBits.join('\n');
  return out;
}

function parsePdpKeyFeatures(html: string): string[] {
  const block =
    /class=["'][^"']*short-description[^"']*["'][^>]*>\s*<ul>([\s\S]*?)<\/ul>/i.exec(html)?.[1] ||
    /Key Features[\s\S]*?<ul>([\s\S]*?)<\/ul>/i.exec(html)?.[1] ||
    '';
  return [...block.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((li) => stripTags(li[1]!))
    .filter((t) => t && !/view more/i.test(t));
}

function mergeSpecs(
  ...sources: Array<Record<string, string | undefined>>
): { key: string; value: string }[] {
  const merged: Record<string, string> = {};
  for (const src of sources) {
    for (const key of SPEC_KEYS) {
      const val = (src[key] || '').trim();
      if (!val) continue;
      if (!merged[key] || val.length > merged[key]!.length) merged[key] = val;
    }
  }
  if (!merged.warranty) merged.warranty = 'No Warranty';
  return SPEC_KEYS.filter((k) => merged[k]).map((key) => ({ key, value: merged[key]! }));
}

async function ensureRamSpecs(categoryId: string) {
  for (const spec of RAM_SPEC_DEFINITIONS) {
    await prisma.specificationDefinition.upsert({
      where: { categoryId_key: { categoryId, key: spec.key } },
      update: {
        name: spec.name,
        dataType: spec.dataType,
        isRequired: Boolean(spec.isRequired),
        isFilterable: Boolean(spec.isFilterable),
        order: spec.order,
      },
      create: {
        categoryId,
        key: spec.key,
        name: spec.name,
        dataType: spec.dataType,
        isRequired: Boolean(spec.isRequired),
        isFilterable: Boolean(spec.isFilterable),
        order: spec.order,
      },
    });
  }
}

async function ensureBrand(slug: string) {
  const existing = await prisma.brand.findUnique({ where: { slug } });
  if (existing) return existing;
  const known = RAM_BRANDS.find((b) => b.slug === slug);
  const name =
    known?.label ||
    slug
      .split('-')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  return prisma.brand.create({ data: { name, slug, isActive: true } });
}

function findExisting(
  item: ScrapedRam,
  existing: ExistingRam[],
  bySlug: Map<string, ExistingRam>,
  byNorm: Map<string, ExistingRam>
): ExistingRam | null {
  const direct = bySlug.get(item.slug);
  if (direct) return direct;

  const noSuffix = item.slug.replace(/-desktop-ram$/, '');
  const slugHit = existing.find(
    (p) =>
      p.slug === noSuffix ||
      p.slug.replace(/-desktop-ram$/, '') === noSuffix ||
      (p.slug.startsWith(`${noSuffix}-`) &&
        normalizeName(p.name) === normalizeName(item.name))
  );
  if (slugHit) return slugHit;

  return byNorm.get(normalizeName(item.name)) || null;
}

async function upsertSpecs(
  productId: string,
  categoryId: string,
  specs: { key: string; value: string }[]
) {
  for (const spec of specs) {
    const value = spec.value.trim();
    if (!value) continue;
    const def = await prisma.specificationDefinition.findUnique({
      where: { categoryId_key: { categoryId, key: spec.key } },
    });
    if (!def) continue;
    const existing = await prisma.productSpecification.findFirst({
      where: { productId, specificationDefinitionId: def.id },
    });
    if (existing) {
      if (existing.value !== value) {
        await prisma.productSpecification.update({
          where: { id: existing.id },
          data: { value },
        });
      }
    } else {
      await prisma.productSpecification.create({
        data: {
          productId,
          specificationDefinitionId: def.id,
          value,
        },
      });
    }
  }
}

function localImageExists(slug: string): string | null {
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    const abs = path.join(OUT_DIR, `${slug}${ext}`);
    if (fs.existsSync(abs)) return `/uploads/ram/${slug}${ext}`;
  }
  return null;
}

async function scrapeListing(): Promise<ScrapedRam[]> {
  console.log('Fetching Star Tech in-stock desktop RAM listing…');
  const first = await fetchText(LIST_BASE);
  const { total, pages } = detectTotalPages(first, 90);
  console.log(`Listing reports ${total || '?'} products across ${pages} page(s)`);

  const all: ScrapedRam[] = [];
  const seen = new Set<string>();
  const add = (items: ScrapedRam[]) => {
    for (const item of items) {
      if (seen.has(item.productUrl) || seen.has(item.slug)) continue;
      seen.add(item.productUrl);
      seen.add(item.slug);
      all.push(item);
    }
  };

  add(parseListingHtml(first));
  console.log(`Page 1: ${all.length} unique`);

  for (let page = 2; page <= pages; page++) {
    await sleep(400);
    const url = `${LIST_BASE}&page=${page}`;
    process.stdout.write(`Fetching page ${page}/${pages}… `);
    try {
      const html = await fetchText(url);
      const before = all.length;
      add(parseListingHtml(html));
      console.log(`+${all.length - before} (total ${all.length})`);
    } catch (err) {
      console.log('FAIL', err instanceof Error ? err.message : err);
    }
  }

  return all;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(LIST_JSON), { recursive: true });

  const scraped = await scrapeListing();
  console.log(`Parsed ${scraped.length} in-stock desktop RAM products`);

  if (scraped.length < 30) {
    throw new Error(`Too few products parsed (${scraped.length}). Expected ~84 in-stock kits.`);
  }

  fs.writeFileSync(LIST_JSON, JSON.stringify(scraped, null, 2), 'utf8');
  console.log(`Wrote ${LIST_JSON}`);

  const desktopRam =
    (await prisma.category.findUnique({ where: { slug: 'desktop-ram' } })) ||
    (await prisma.category.findUnique({ where: { slug: 'ram' } }));
  if (!desktopRam) throw new Error('Category slug "desktop-ram" (or "ram") not found');

  await ensureRamSpecs(desktopRam.id);
  const ramParent = await prisma.category.findUnique({ where: { slug: 'ram' } });
  if (ramParent && ramParent.id !== desktopRam.id) await ensureRamSpecs(ramParent.id);

  const existingProducts = (await prisma.product.findMany({
    where: {
      OR: [
        { categoryId: desktopRam.id },
        { category: { slug: { in: ['desktop-ram', 'ram', 'ddr4-ram', 'ddr5-ram'] } } },
        { category: { parentId: desktopRam.id } },
        ...(ramParent ? [{ category: { parentId: ramParent.id } }] : []),
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      price: true,
      compareAtPrice: true,
      categoryId: true,
      brandId: true,
      shortDescription: true,
      images: { select: { id: true, url: true, isPrimary: true } },
    },
  })) as ExistingRam[];

  console.log(`Existing CMS desktop RAM: ${existingProducts.length}`);

  const bySlug = new Map(existingProducts.map((p) => [p.slug, p]));
  const byNorm = new Map(existingProducts.map((p) => [normalizeName(p.name), p]));

  let created = 0;
  let updated = 0;
  let failedCreate = 0;
  let imagesOk = 0;
  let imageFail = 0;

  for (const [index, item] of scraped.entries()) {
    const brandSlug = guessBrandSlug(item.name);
    const brand = await ensureBrand(brandSlug);
    let product = findExisting(item, existingProducts, bySlug, byNorm);

    let pdpHtml = '';
    try {
      pdpHtml = await fetchText(item.productUrl);
      await sleep(200);
    } catch (err) {
      console.warn(`PDP fail ${item.slug}:`, err instanceof Error ? err.message : err);
    }

    const pdpFeatures = pdpHtml ? parsePdpKeyFeatures(pdpHtml) : [];
    const features = item.features.length ? item.features : pdpFeatures;
    const tableSpecs = pdpHtml ? parseSpecTable(pdpHtml) : {};
    const specifications = mergeSpecs(
      specsFromFeatures(features),
      tableSpecs,
      inferFromName(item.name)
    );

    if (product) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          stockStatus: StockStatus.IN_STOCK,
          shortDescription: features.length ? features.join('\n') : product.shortDescription,
          isActive: true,
        },
      });
      await upsertSpecs(product.id, product.categoryId, specifications);
      updated++;
      console.log(`UPDATE ${product.slug} ← ${item.slug} @ ৳${item.price}`);
    } else {
      let slug = item.slug;
      let n = 2;
      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${item.slug}-${n++}`;
      }
      let sku = skuFromSlug(item.slug, index + 1);
      n = 2;
      while (await prisma.product.findUnique({ where: { sku } })) {
        sku = `${skuFromSlug(item.slug, index + 1)}-${n++}`.slice(0, 48);
      }

      try {
        const createdProduct = await ProductService.create({
          name: item.name,
          slug,
          sku,
          shortDescription: features.length ? features.join('\n') : null,
          description: features.length
            ? `<ul>${features.map((f) => `<li>${f.replace(/</g, '')}</li>`).join('')}</ul>`
            : null,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          costPrice: null,
          stockStatus: 'IN_STOCK',
          stockQuantity: 10,
          lowStockAlert: 3,
          categoryId: desktopRam.id,
          brandId: brand.id,
          metaTitle: `${item.name} Price in Bangladesh | LogicBay BD`,
          metaDescription: `Buy ${item.name} at ৳${item.price.toLocaleString()} from LogicBay BD.`,
          metaKeywords: null,
          isFeatured: false,
          isActive: true,
          images: [
            {
              url: item.thumbUrl || '/uploads/ram/placeholder.jpg',
              alt: item.name,
              order: 0,
              isPrimary: true,
            },
          ],
          specifications,
        } as any);

        product = {
          id: createdProduct.id,
          name: item.name,
          slug,
          sku,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          categoryId: desktopRam.id,
          brandId: brand.id,
          shortDescription: features.length ? features.join('\n') : null,
          images: [],
        };
        existingProducts.push(product);
        bySlug.set(slug, product);
        byNorm.set(normalizeName(item.name), product);
        created++;
        console.log(`CREATED ${sku} ${slug} @ ৳${item.price} (${brandSlug})`);
      } catch (err) {
        failedCreate++;
        console.error(`FAIL create ${item.name}:`, err instanceof Error ? err.message : err);
        continue;
      }
    }

    if (!product?.id) continue;

    const alreadyLocal =
      product.images?.some((i) => i.url?.startsWith('/uploads/ram/')) || localImageExists(product.slug);

    if (alreadyLocal && product.images?.some((i) => i.url?.startsWith('/uploads/ram/'))) {
      imagesOk++;
    } else {
      try {
        let imageUrl = item.thumbUrl;
        if (pdpHtml) imageUrl = extractMainImageUrl(pdpHtml) || imageUrl;
        if (!imageUrl) throw new Error('no image url');
        const { buffer, ext } = await downloadBest(imageUrl);
        const filename = `${product.slug}${ext}`;
        fs.writeFileSync(path.join(OUT_DIR, filename), buffer);
        const localPath = `/uploads/ram/${filename}`;
        await upsertLocalImage(product.id, localPath, item.name);
        imagesOk++;
        console.log(`  IMG ${localPath}`);
      } catch (err) {
        imageFail++;
        console.warn(`  IMG fail ${product.slug}:`, err instanceof Error ? err.message : err);
      }
    }

    await sleep(150);
  }

  const finalCount = await prisma.product.count({
    where: {
      OR: [
        { categoryId: desktopRam.id },
        { category: { slug: { in: ['desktop-ram', 'ram', 'ddr4-ram', 'ddr5-ram'] } } },
      ],
    },
  });

  console.log(
    `\nDone. scraped=${scraped.length} created=${created} updated=${updated} failedCreate=${failedCreate} imagesOk=${imagesOk} imageFail=${imageFail}`
  );
  console.log(`CMS desktop RAM products now: ${finalCount}`);
  console.log(`Images: ${OUT_DIR}`);
  console.log('Edit any kit in Admin → Products; specs persist in PostgreSQL.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
