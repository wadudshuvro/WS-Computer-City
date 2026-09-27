/**
 * Sync in-stock Star Tech motherboards into LogicBay BD CMS:
 *  - scrape listing (filter_status=7)
 *  - skip duplicates (slug / normalized name / unique model + brand)
 *  - create missing products with PDP specs
 *  - update prices, featured bullets, and spec fields on existing matches
 *  - download PDP images → public/uploads/motherboards/
 *
 * Run: npx tsx scripts/sync-startech-motherboards.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { PrismaClient, StockStatus } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { MOTHERBOARD_SPEC_DEFINITIONS } from '../src/lib/motherboardSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const LIST_BASE = 'https://www.startech.com.bd/component/motherboard?filter_status=7&limit=90';
const OUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'motherboards');
const LIST_JSON = path.join(process.cwd(), 'docs/imports/startech-motherboard-instock.json');

const SPEC_KEYS = [
  'supported_cpu',
  'chipset',
  'memory_size',
  'memory_type',
  'storage_slots',
  'graphics',
  'audio',
  'ports_connectors',
  'special_features',
  'form_factor',
  'expansion_slots',
  'warranty',
] as const;

const BRAND_LABELS: Record<string, string> = {
  'msi-intel': 'MSI (Intel)',
  'msi-amd': 'MSI (AMD)',
  'asrock-intel': 'ASRock (Intel)',
  'asrock-amd': 'ASRock (AMD)',
  'asus-intel': 'ASUS (Intel)',
  'asus-amd': 'ASUS (AMD)',
  'gigabyte-intel': 'GIGABYTE (Intel)',
  'gigabyte-amd': 'GIGABYTE (AMD)',
  'colorful-intel': 'Colorful (Intel)',
  'colorful-amd': 'Colorful (AMD)',
  xenthra: 'XENTHRA',
  biostar: 'Biostar',
  nzxt: 'NZXT',
  maxsun: 'MAXSUN',
};

const PLATFORM_BRANDS = new Set(['gigabyte', 'msi', 'asus', 'asrock', 'colorful']);

type ScrapedMb = {
  name: string;
  slug: string;
  productUrl: string;
  price: number;
  compareAtPrice: number | null;
  thumbUrl: string | null;
  features: string[];
};

type ExistingMb = {
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
  brand: { slug: string } | null;
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
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/motherboard/g, '')
    .replace(/micro[-\s]?atx|mini[-\s]?itx|extended[-\s]?atx|\bmatx\b|\beatx\b|\batx\b/g, '')
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

function guessBrandBase(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('gigabyte') || n.startsWith('ga-')) return 'gigabyte';
  if (n.includes('asrock')) return 'asrock';
  if (n.includes('asus') || /\brog\b|\bprime\b|\btuf\b|\bproart\b/.test(n)) return 'asus';
  if (n.includes('msi') || /\bmag\b|\bmpg\b|\bmeg\b/.test(n)) return 'msi';
  if (n.includes('colorful') || n.includes('battle-ax') || n.includes('battle ax')) return 'colorful';
  if (n.includes('xenthra')) return 'xenthra';
  if (n.includes('biostar')) return 'biostar';
  if (n.includes('nzxt')) return 'nzxt';
  if (n.includes('maxsun')) return 'maxsun';
  return slugify(name.split(/\s+/)[0] || 'motherboard');
}

function guessProcessorType(text: string): 'Intel' | 'AMD' | '' {
  const n = text.toLowerCase();
  if (/\bam[45]\b|\bam5\b|\bryzen\b|\bamd\b|\btr5\b|\btrx50\b/.test(n)) return 'AMD';
  if (
    /\blga\b|\bintel\b|\b14th\b|\b13th\b|\b12th\b|\b11th\b|\b10th\b|\b9th\b|\b8th\b|\b7th\b|\b6th\b|\b4th\b/.test(
      n
    )
  ) {
    return 'Intel';
  }
  if (/\b(?:a520|a620|b450|b550|b650|b850|x570|x670|x870)\b/.test(n)) return 'AMD';
  if (
    /\b(?:h81|h110|h310|h410|h510|h610|h810|b360|b460|b560|b660|b760|b860|z390|z490|z590|z690|z790|z890|w680|w790)\b/.test(
      n
    )
  ) {
    return 'Intel';
  }
  return '';
}

function brandSlugFor(name: string, extraText = ''): string {
  const base = guessBrandBase(name);
  const ptype = guessProcessorType(`${name} ${extraText}`);
  if (PLATFORM_BRANDS.has(base) && ptype) return `${base}-${ptype.toLowerCase()}`;
  return base;
}

function extractModelKeys(name: string): string[] {
  const n = name.toLowerCase();
  const keys = new Set<string>();

  for (const m of n.matchAll(/\bxn-[a-z0-9-]+/g)) keys.add(m[0]);
  for (const m of n.matchAll(/\b[abzhxw]\d{3}[a-z0-9]*(?:-[a-z0-9]+)+/g)) keys.add(m[0]);

  const spaced = n.match(/\b([abzhxw]\d{3}[a-z]?)\s+([a-z0-9]+(?:\s+v\d+)?)/);
  if (spaced) keys.add(`${spaced[1]}-${spaced[2].replace(/\s+/g, '-')}`);

  const compact = n.match(/\b([abzhxw]\d{3}[a-z]{1,6})\b/g);
  if (compact) {
    for (const c of compact) {
      if (c.length >= 6) keys.add(c);
    }
  }

  return [...keys].filter((k) => k.length >= 5);
}

function hasExactToken(haystack: string, token: string): boolean {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(haystack);
}

function distinctiveFlags(name: string, slug: string): {
  wifi: 'none' | 'wifi' | 'wifi6e' | 'wifi7';
  memory: 'none' | 'ddr4' | 'ddr5';
  white: boolean;
  extras: string[];
} {
  const text = `${name} ${slug}`.toLowerCase();
  const wifi = /wifi\s*7|wifi7/.test(text)
    ? 'wifi7'
    : /wifi\s*6e|wifi6e/.test(text)
      ? 'wifi6e'
      : /wifi|\bax\b/.test(text)
        ? 'wifi'
        : 'none';
  const memory = /ddr5/.test(text) ? 'ddr5' : /ddr4|\bd4\b/.test(text) ? 'ddr4' : 'none';
  const white = /(?:^|-)w(?:-|$)|white/.test(slug.toLowerCase()) || /\bwhite\b/.test(name.toLowerCase());
  const extras: string[] = [];
  for (const flag of ['btf', 'csm', 'ice', 'argb', 'plus', 'neo', 'max', 'v2', 'v3', 'ii', 'ax']) {
    if (new RegExp(`(^|[^a-z0-9])${flag}([^a-z0-9]|$)`).test(text)) extras.push(flag);
  }
  return { wifi, memory, white, extras };
}

function flagsCompatible(
  a: ReturnType<typeof distinctiveFlags>,
  b: ReturnType<typeof distinctiveFlags>
): boolean {
  if (a.wifi !== b.wifi) return false;
  if (a.white !== b.white) return false;
  if (a.memory !== 'none' && b.memory !== 'none' && a.memory !== b.memory) return false;
  const extraA = new Set(a.extras);
  const extraB = new Set(b.extras);
  for (const flag of ['v2', 'v3', 'ii', 'btf', 'csm', 'ice', 'argb', 'neo', 'plus', 'ax']) {
    if (extraA.has(flag) !== extraB.has(flag)) return false;
  }
  return true;
}

const GENERIC_SLUG_BITS = new Set([
  'motherboard',
  'amd',
  'intel',
  'am4',
  'am5',
  'tr5',
  'matx',
  'atx',
  'itx',
  'micro',
  'mini',
  'extended',
  'lga1150',
  'lga1151',
  'lga1200',
  'lga1700',
  'lga1851',
  '10th',
  '11th',
  '12th',
  '13th',
  '14th',
  'gen',
  'and',
]);

function slugRemainderIsGeneric(existingSlug: string, itemSlug: string): boolean {
  const existing = existingSlug.replace(/-motherboard$/, '');
  const item = itemSlug.replace(/-motherboard$/, '');
  if (existing === item) return true;
  if (!existing.startsWith(`${item}-`)) return false;
  const rest = existing.slice(item.length + 1).split('-').filter(Boolean);
  return rest.every((bit) => GENERIC_SLUG_BITS.has(bit) || /^\d+$/.test(bit));
}

function longestModelKey(name: string, slug = ''): string {
  const keys = extractModelKeys(name);
  return keys.sort((a, b) => b.length - a.length)[0] || '';
}

function slugCore(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/-motherboard$/, '')
    .replace(/-m-2-/g, '-m2-')
    .replace(/-m-2$/, '-m2')
    .split('-')
    .filter(
      (bit) =>
        !GENERIC_SLUG_BITS.has(bit) &&
        !['ddr4', 'ddr5'].includes(bit) &&
        !/^\d+$/.test(bit) &&
        !/^lga\d+$/.test(bit)
    )
    .join('-');
}

function skuFromSlug(slug: string, brandSlug: string, index: number): string {
  const brand = brandSlug.replace(/-(intel|amd)$/, '').toUpperCase() || 'MB';
  const core = slug
    .replace(/^(gigabyte|msi|asus|asrock|colorful|xenthra|biostar|nzxt)-/, '')
    .replace(/-motherboard.*$/, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36);
  return `MB-${brand}-${core || index}`.replace(/-+/g, '-').slice(0, 48);
}

function parseListingHtml(html: string): ScrapedMb[] {
  const items: ScrapedMb[] = [];
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

    const productUrl = absoluteUrl(href);
    if (!productUrl.includes('startech.com.bd')) continue;
    if (productUrl.includes('/component/motherboard')) continue;

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

function specsFromFeatures(features: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const feature of features) {
    const colon = feature.indexOf(':');
    if (colon === -1) continue;
    const label = feature.slice(0, colon).toLowerCase().trim();
    const value = feature.slice(colon + 1).trim();
    if (!value) continue;
    if (label.includes('supported cpu') || label === 'cpu' || label === 'processor') {
      out.supported_cpu = value;
    } else if (label.includes('chipset')) {
      out.chipset = value;
    } else if (label.includes('ram') || label.includes('memory')) {
      const ddr = value.match(/ddr[345]/i);
      if (ddr) out.memory_type = ddr[0].toUpperCase();
      const gb = value.match(/(\d+)\s*gb/i);
      if (gb) out.memory_size = `${gb[1]}GB`;
    } else if (label.includes('graphics') || label.includes('output')) {
      out.graphics = value;
    } else if (label.includes('form')) {
      out.form_factor = value;
    } else if (label.includes('warrant')) {
      out.warranty = value;
    } else if (label.includes('feature') || label.includes('storage') || label.includes('m.2')) {
      out.special_features = [out.special_features, value].filter(Boolean).join('\n');
    }
  }
  return out;
}

function inferChipset(name: string, ptype: string): string {
  const m = name.match(/\b([ABZHWX][0-9]{3}[A-Z]?)\b/i);
  if (!m) return '';
  const chip = m[1]!.toUpperCase();
  if (ptype === 'AMD') return `AMD ${chip}`;
  if (ptype === 'Intel') return `Intel ${chip}`;
  return chip;
}

function inferFormFactor(name: string): string {
  const n = name.toLowerCase();
  if (/mini[-\s]?itx|\bmitx\b/.test(n)) return 'Mini ITX';
  if (/extended[-\s]?atx|\beatx\b/.test(n)) return 'Extended ATX';
  if (/micro[-\s]?atx|\bmatx\b/.test(n)) return 'Micro ATX';
  if (/\batx\b/.test(n)) return 'ATX';
  return '';
}

function inferMemoryType(text: string): string {
  const m = text.match(/\bDDR([345])\b/i);
  return m ? `DDR${m[1]}` : '';
}

function parseSpecTable(html: string): Record<string, string> {
  const out: Record<string, string> = {};
  const ports: string[] = [];
  const expansions: string[] = [];
  let section = '';

  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  for (const row of html.matchAll(trRe)) {
    const cells = [...row[1]!.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) =>
      stripTags(c[1]!)
    );
    if (cells.length === 1 && cells[0] && cells[0].length < 60) {
      section = cells[0].toLowerCase();
      continue;
    }
    if (cells.length < 2) continue;
    const label = cells[0]!;
    const value = cells.slice(1).join(' ').trim();
    if (!label || !value) {
      if (label && !value) section = label.toLowerCase();
      continue;
    }
    if (value.length > 700 && !/warrant/i.test(label)) continue;

    const l = label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

    if (l === 'supported cpu' || l === 'cpu' || l === 'processor' || l === 'cpu socket') {
      out.supported_cpu = value;
    } else if (l === 'chipset') {
      out.chipset = value;
    } else if (l === 'form factor') {
      out.form_factor = value;
    } else if (l === 'maximum memory' || l === 'max memory' || l === 'memory size') {
      out.memory_size = value;
    } else if (l === 'type' && section.includes('memory')) {
      out.memory_type = value.match(/DDR[345]/i)?.[0]?.toUpperCase() || value;
    } else if (l === 'slots' && section.includes('memory') && !out.memory_size) {
      out.memory_size = value;
    } else if (l === 'graphics' || l === 'graphics output') {
      out.graphics = value;
    } else if (l === 'audio') {
      out.audio = out.audio ? `${out.audio}\n${value}` : value;
    } else if (l === 'supported storage' || l === 'storage' || l === 'raid') {
      out.storage_slots = out.storage_slots ? `${out.storage_slots}\n${value}` : value;
    } else if (l === 'pci' || l === 'expansion slots' || l === 'pcie') {
      expansions.push(`${label}: ${value}`);
    } else if (l === 'manufacturing warranty' || l === 'warranty') {
      out.warranty = value;
    } else if (l === 'special features') {
      out.special_features = value;
    } else if (
      /hdmi|d.?sub|usb|lan|internal i|tpm|displayport|type c|wifi|rj.?45/.test(l)
    ) {
      ports.push(`${label}: ${value}`);
    }
  }

  if (expansions.length) out.expansion_slots = expansions.join('\n');
  if (ports.length) out.ports_connectors = ports.join('\n');
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

async function ensureMotherboardSpecs(categoryId: string) {
  for (const spec of MOTHERBOARD_SPEC_DEFINITIONS) {
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
  const name =
    BRAND_LABELS[slug] ||
    slug
      .split('-')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  return prisma.brand.create({ data: { name, slug, isActive: true } });
}

function makerOf(slug: string): string {
  return slug.replace(/-(intel|amd)$/i, '').toLowerCase();
}

function findExisting(
  item: ScrapedMb,
  existing: ExistingMb[],
  bySlug: Map<string, ExistingMb>,
  byNorm: Map<string, ExistingMb>
): ExistingMb | null {
  const direct = bySlug.get(item.slug);
  if (direct) return direct;

  const slugHit = existing.find((p) => slugRemainderIsGeneric(p.slug, item.slug));
  if (slugHit) return slugHit;

  const coreHit = existing.filter((p) => slugCore(p.slug) === slugCore(item.slug));
  if (coreHit.length === 1) return coreHit[0]!;

  const norm = byNorm.get(normalizeName(item.name));
  if (norm && flagsCompatible(distinctiveFlags(item.name, item.slug), distinctiveFlags(norm.name, norm.slug))) {
    return norm;
  }

  const itemKey = longestModelKey(item.name);
  const brand = guessBrandBase(item.name);
  const itemFlags = distinctiveFlags(item.name, item.slug);
  if (!itemKey) return null;

  const matches = existing.filter((p) => {
    if (makerOf(p.brand?.slug || '') !== brand && !p.name.toLowerCase().includes(brand)) {
      return false;
    }
    if (!flagsCompatible(itemFlags, distinctiveFlags(p.name, p.slug))) return false;
    return longestModelKey(p.name) === itemKey;
  });

  if (matches.length === 1) return matches[0]!;
  if (matches.length > 1) {
    return (
      matches.find((p) => slugRemainderIsGeneric(p.slug, item.slug)) ||
      matches.find((p) => slugCore(p.slug) === slugCore(item.slug)) ||
      null
    );
  }
  return null;
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
    if (fs.existsSync(abs)) return `/uploads/motherboards/${slug}${ext}`;
  }
  return null;
}

async function scrapeListing(): Promise<ScrapedMb[]> {
  console.log('Fetching Star Tech in-stock motherboard listing…');
  const first = await fetchText(LIST_BASE);
  const { total, pages } = detectTotalPages(first, 90);
  console.log(`Listing reports ${total || '?'} products across ${pages} page(s)`);

  const all: ScrapedMb[] = [];
  const seen = new Set<string>();
  const add = (items: ScrapedMb[]) => {
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
  console.log(`Parsed ${scraped.length} in-stock motherboards`);

  if (scraped.length < 80) {
    throw new Error(
      `Too few products parsed (${scraped.length}). Expected ~217 in-stock boards.`
    );
  }

  fs.writeFileSync(LIST_JSON, JSON.stringify(scraped, null, 2), 'utf8');
  console.log(`Wrote ${LIST_JSON}`);

  const motherboardCat = await prisma.category.findUnique({ where: { slug: 'motherboard' } });
  const intelMb = await prisma.category.findUnique({ where: { slug: 'intel-motherboard' } });
  const amdMb = await prisma.category.findUnique({ where: { slug: 'amd-motherboard' } });
  if (!motherboardCat) throw new Error('Category slug "motherboard" not found');

  for (const cat of [motherboardCat, intelMb, amdMb]) {
    if (cat) await ensureMotherboardSpecs(cat.id);
  }

  const existingProducts = (await prisma.product.findMany({
    where: {
      OR: [
        { categoryId: motherboardCat.id },
        { category: { parentId: motherboardCat.id } },
        { category: { slug: { in: ['motherboard', 'intel-motherboard', 'amd-motherboard'] } } },
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
      brand: { select: { slug: true } },
    },
  })) as ExistingMb[];

  console.log(`Existing CMS motherboards: ${existingProducts.length}`);

  const bySlug = new Map(existingProducts.map((p) => [p.slug, p]));
  const byNorm = new Map(existingProducts.map((p) => [normalizeName(p.name), p]));

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let imagesOk = 0;
  let imageFail = 0;
  let specFail = 0;

  for (const [index, item] of scraped.entries()) {
    const extra = item.features.join(' ');
    let ptype = guessProcessorType(`${item.name} ${extra}`);
    const brandSlug = brandSlugFor(item.name, extra);
    const brand = await ensureBrand(brandSlug);
    const category =
      ptype === 'Intel' && intelMb ? intelMb : ptype === 'AMD' && amdMb ? amdMb : motherboardCat;

    let product = findExisting(item, existingProducts, bySlug, byNorm);

    let pdpHtml = '';
    try {
      pdpHtml = await fetchText(item.productUrl);
      await sleep(200);
    } catch (err) {
      console.warn(
        `PDP fail ${item.slug}:`,
        err instanceof Error ? err.message : err
      );
    }

    const pdpFeatures = pdpHtml ? parsePdpKeyFeatures(pdpHtml) : [];
    const features = item.features.length ? item.features : pdpFeatures;
    const tableSpecs = pdpHtml ? parseSpecTable(pdpHtml) : {};
    if (!ptype) ptype = guessProcessorType(`${item.name} ${features.join(' ')} ${tableSpecs.supported_cpu || ''}`);

    const inferred: Record<string, string> = {};
    const chip = inferChipset(item.name, ptype);
    if (chip) inferred.chipset = chip;
    const ff = inferFormFactor(item.name) || inferFormFactor(tableSpecs.form_factor || '');
    if (ff) inferred.form_factor = ff;
    const mem = inferMemoryType(`${item.name} ${features.join(' ')} ${tableSpecs.memory_type || ''}`);
    if (mem) inferred.memory_type = mem;
    if (tableSpecs.supported_cpu) inferred.supported_cpu = tableSpecs.supported_cpu;
    if (!inferred.supported_cpu && ptype) {
      inferred.supported_cpu =
        ptype === 'AMD'
          ? 'AMD Ryzen processors (see manufacturer CPU support list)'
          : 'Intel Core processors (see manufacturer CPU support list)';
    }

    const specifications = mergeSpecs(specsFromFeatures(features), tableSpecs, inferred);

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
      try {
        await upsertSpecs(product.id, product.categoryId, specifications);
      } catch (err) {
        specFail++;
        console.warn(
          `SPEC fail ${product.slug}:`,
          err instanceof Error ? err.message : err
        );
      }
      updated++;
      console.log(`UPDATE ${product.slug} ← ${item.slug} @ ৳${item.price}`);
    } else {
      let slug = item.slug;
      let n = 2;
      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${item.slug}-${n++}`;
      }
      let sku = skuFromSlug(item.slug, brandSlug, index + 1);
      n = 2;
      while (await prisma.product.findUnique({ where: { sku } })) {
        sku = `${skuFromSlug(item.slug, brandSlug, index + 1)}-${n++}`.slice(0, 48);
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
          categoryId: category.id,
          brandId: brand.id,
          metaTitle: `${item.name} Price in Bangladesh | LogicBay BD`,
          metaDescription: `Buy ${item.name} at ৳${item.price.toLocaleString()} from LogicBay BD.`,
          metaKeywords: null,
          isFeatured: false,
          isActive: true,
          images: [
            {
              url: item.thumbUrl || '/uploads/motherboards/placeholder.jpg',
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
          categoryId: category.id,
          brandId: brand.id,
          shortDescription: features.length ? features.join('\n') : null,
          images: [],
          brand: { slug: brandSlug },
        };
        existingProducts.push(product);
        bySlug.set(slug, product);
        byNorm.set(normalizeName(item.name), product);
        created++;
        console.log(`CREATED ${sku} ${slug} @ ৳${item.price} (${category.slug} / ${brandSlug})`);
      } catch (err) {
        skipped++;
        console.error(`FAIL create ${item.name}:`, err instanceof Error ? err.message : err);
        continue;
      }
    }

    if (!product?.id) continue;

    const alreadyLocal =
      product.images?.some((i) => i.url?.startsWith('/uploads/motherboards/')) ||
      localImageExists(product.slug);

    if (alreadyLocal && product.images?.some((i) => i.url?.startsWith('/uploads/motherboards/'))) {
      imagesOk++;
    } else {
      try {
        let imageUrl = item.thumbUrl;
        if (pdpHtml) imageUrl = extractMainImageUrl(pdpHtml) || imageUrl;
        if (!imageUrl) throw new Error('no image url');
        const { buffer, ext } = await downloadBest(imageUrl);
        const filename = `${product.slug}${ext}`;
        fs.writeFileSync(path.join(OUT_DIR, filename), buffer);
        const localPath = `/uploads/motherboards/${filename}`;
        await upsertLocalImage(product.id, localPath, item.name);
        imagesOk++;
        console.log(`  IMG ${localPath}`);
      } catch (err) {
        imageFail++;
        console.warn(
          `  IMG fail ${product.slug}:`,
          err instanceof Error ? err.message : err
        );
      }
    }

    await sleep(150);
  }

  const finalCount = await prisma.product.count({
    where: {
      OR: [
        { categoryId: motherboardCat.id },
        { category: { parentId: motherboardCat.id } },
        { category: { slug: { in: ['motherboard', 'intel-motherboard', 'amd-motherboard'] } } },
      ],
    },
  });

  console.log(
    `\nDone. scraped=${scraped.length} created=${created} updated=${updated} failedCreate=${skipped} imagesOk=${imagesOk} imageFail=${imageFail} specFail=${specFail}`
  );
  console.log(`CMS motherboard products now: ${finalCount}`);
  console.log(`Images: ${OUT_DIR}`);
  console.log('Edit any board in Admin → Products; specs persist in PostgreSQL.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
