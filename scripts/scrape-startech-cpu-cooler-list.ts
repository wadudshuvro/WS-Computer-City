/**
 * Scrape Star Tech CPU Cooler listing (limit=90, all pages) then each PDP
 * for spec table + up to 3 gallery image URLs.
 *
 * Run: npx tsx scripts/scrape-startech-cpu-cooler-list.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const LIST_BASE = 'https://www.startech.com.bd/component/CPU-Cooler';
const OUT_DIR = path.join(process.cwd(), 'docs/imports');
const OUT_JSON = path.join(OUT_DIR, 'startech-cpu-cooler-list.json');

export type ListedCooler = {
  name: string;
  url: string;
  slug: string;
  page: number;
  price: number | null;
  compareAtPrice: number | null;
  bullets: string[];
  listingImageUrl: string | null;
  imageUrls: string[];
  specs: Record<string, string>;
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
    req.setTimeout(40000, () => {
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
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&times;/g, '×')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMoney(text: string): number | null {
  if (!text) return null;
  const m = String(text).replace(/,/g, '').match(/(\d+)(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 && n < 10_000_000 ? n : null;
}

function slugFromUrl(url: string): string {
  return url
    .replace(/^https?:\/\/www\.startech\.com\.bd\//, '')
    .replace(/\/$/, '')
    .split('/')
    .pop()!
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseListingPage(html: string, page: number): ListedCooler[] {
  const items: ListedCooler[] = [];
  const cards = html.split(/class=["']p-item["']/i).slice(1);
  for (const card of cards) {
    const nameMatch =
      /class=["']p-item-name["'][^>]*>\s*<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i.exec(
        card
      );
    if (!nameMatch) continue;
    const href = nameMatch[1]!.trim();
    const name = stripTags(nameMatch[2]!);
    if (!name || !href) continue;
    const url = href.startsWith('http') ? href : `https://www.startech.com.bd${href}`;

    const priceBlock = /class=["']p-item-price["'][^>]*>([\s\S]*?)<\/div>/i.exec(card)?.[1] || '';
    const priceNew = /class=["']price-new["'][^>]*>([\s\S]*?)<\/span>/i.exec(priceBlock)?.[1];
    const priceOld = /class=["']price-old["'][^>]*>([\s\S]*?)<\/span>/i.exec(priceBlock)?.[1];
    const barePrice = !priceNew ? stripTags(priceBlock).match(/[\d,]+৳/)?.[0] : null;
    const price = parseMoney(priceNew || barePrice || '');
    const compareAtPrice = parseMoney(priceOld || '');

    const bullets = [...card.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((m) => stripTags(m[1]!))
      .filter(Boolean)
      .slice(0, 6);

    const img =
      /itemprop=["']image["'][^>]*src=["']([^"']+)["']/i.exec(card)?.[1] ||
      /<img[^>]+src=["']([^"']+)["']/i.exec(card)?.[1] ||
      null;

    items.push({
      name,
      url,
      slug: slugFromUrl(url),
      page,
      price,
      compareAtPrice,
      bullets,
      listingImageUrl: img,
      imageUrls: img ? [img] : [],
      specs: {},
    });
  }
  return items;
}

function parseTotalPages(html: string): number {
  const showing = /Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/i.exec(html);
  if (showing) {
    const total = Number(showing[1]);
    return Math.max(1, Math.ceil(total / 90));
  }
  const last = [...html.matchAll(/[?&]page=(\d+)/gi)].map((m) => Number(m[1]));
  return last.length ? Math.max(...last) : 1;
}

const LABEL_TO_KEY: Record<string, string> = {
  type: 'cooler_type',
  'cooler type': 'cooler_type',
  'fan speed': 'fan_speed_detail',
  'rated speed': 'fan_speed_detail',
  'fan airflow': 'airflow',
  airflow: 'airflow',
  'air flow': 'airflow',
  'max. air flow': 'airflow',
  'max air flow': 'airflow',
  noise: 'noise_level',
  'noise level': 'noise_level',
  'fan noise': 'noise_level',
  'air pressure': 'air_pressure',
  'fan air pressure': 'air_pressure',
  connector: 'connector',
  'fan connector': 'connector',
  others: 'others',
  other: 'others',
  dimension: 'dimension',
  dimensions: 'dimension',
  weight: 'weight',
  intel: 'intel_sockets',
  'intel socket': 'intel_sockets',
  'intel sockets': 'intel_sockets',
  amd: 'amd_sockets',
  'amd socket': 'amd_sockets',
  'amd sockets': 'amd_sockets',
  warranty: 'warranty',
  'manufacturing warranty': 'warranty',
  'fan size': 'fan_size',
  'fan dimension': 'fan_size',
  'fan dimensions': 'fan_size',
  'bearing type': 'others',
};

function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[:：]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSpecTable(html: string): Record<string, string> {
  const specs: Record<string, string> = {};
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  for (const row of rows) {
    const cells = [...row[1]!.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) =>
      stripTags(c[1]!)
    );
    if (cells.length < 2) continue;
    const label = normalizeLabel(cells[0]!);
    const value = cells[1]!.trim();
    if (!label || !value || value.length > 240) continue;
    const key = LABEL_TO_KEY[label];
    if (key && !specs[key]) specs[key] = value;
  }
  return specs;
}

function galleryViewKey(url: string): string {
  return url
    .split('?')[0]!
    .replace(/https?:\/\/[^/]+/i, '')
    .replace(/\/image\/cache\//i, '/image/')
    .replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1')
    .toLowerCase();
}

function preferGalleryImage(url: string): string {
  if (/-\d+x\d+\.[a-z0-9]+$/i.test(url)) {
    return url.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '-500x500$1');
  }
  return url;
}

function parseGalleryImages(html: string): string[] {
  const byView = new Map<string, string>();
  const push = (raw: string) => {
    if (!raw || raw.startsWith('data:') || /\/logo\.(png|jpg|webp)|\/ads\//i.test(raw)) return;
    const abs = raw.startsWith('http')
      ? raw
      : raw.startsWith('//')
        ? `https:${raw}`
        : `https://www.startech.com.bd${raw}`;
    if (!/\/image\/(?:cache\/)?catalog\//i.test(abs)) return;
    if (!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(abs)) return;
    const key = galleryViewKey(abs);
    const sized = preferGalleryImage(abs);
    const prev = byView.get(key);
    if (!prev || /500x500/.test(abs)) byView.set(key, /500x500/.test(abs) ? abs : sized);
  };

  for (const m of html.matchAll(
    /(?:data-zoom-image|data-large|data-src|href|src)=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi
  )) {
    push(m[1]!);
  }
  for (const m of html.matchAll(/itemprop=["']image["'][^>]*src=["']([^"']+)["']/gi)) {
    push(m[1]!);
  }

  return [...byView.values()].slice(0, 4);
}

function save(items: ListedCooler[]) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(items, null, 2), 'utf8');
}

async function main() {
  const resumeOnly = process.argv.includes('--pdp');
  if (resumeOnly && fs.existsSync(OUT_JSON)) {
    const items = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8')) as ListedCooler[];
    console.log(`Resume PDP enrich for ${items.length} listings`);
    await enrichPdps(items);
    return;
  }

  console.log(`Listing: ${LIST_BASE}?limit=90`);
  const firstHtml = await fetchText(`${LIST_BASE}?limit=90`);
  const totalPages = parseTotalPages(firstHtml);
  console.log(`Detected ${totalPages} page(s)`);

  const byUrl = new Map<string, ListedCooler>();
  for (const item of parseListingPage(firstHtml, 1)) {
    byUrl.set(item.url, item);
  }
  console.log(`Page 1: ${byUrl.size}`);

  for (let page = 2; page <= totalPages; page++) {
    await sleep(400);
    const html = await fetchText(`${LIST_BASE}?limit=90&page=${page}`);
    const rows = parseListingPage(html, page);
    for (const item of rows) {
      if (!byUrl.has(item.url)) byUrl.set(item.url, item);
    }
    console.log(`Page ${page}: +${rows.length} (unique ${byUrl.size})`);
  }

  const items = [...byUrl.values()];
  save(items);
  await enrichPdps(items);
}

async function enrichPdps(items: ListedCooler[]) {
  let enriched = 0;
  let failed = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const realImages = (item.imageUrls || []).filter((u) => !/\/logo\.(png|jpg|webp)/i.test(u));
    if (Object.keys(item.specs || {}).length > 0 && realImages.length >= 3) {
      continue;
    }
    try {
      await sleep(280);
      const html = await fetchText(item.url);
      item.specs = parseSpecTable(html);
      const gallery = parseGalleryImages(html);
      item.imageUrls = (gallery.length ? gallery : item.imageUrls).slice(0, 3);
      if (!item.imageUrls.length && item.listingImageUrl) {
        item.imageUrls = [item.listingImageUrl];
      }
      enriched++;
      if ((i + 1) % 20 === 0 || i === items.length - 1) {
        save(items);
        console.log(
          `PDP ${i + 1}/${items.length} ${item.slug} specs=${Object.keys(item.specs).length} imgs=${item.imageUrls.length}`
        );
      }
    } catch (err) {
      failed++;
      console.warn(`FAIL PDP ${item.slug}:`, err instanceof Error ? err.message : err);
    }
  }

  save(items);
  const withPrice = items.filter((i) => i.price).length;
  const withSpecs = items.filter((i) => Object.keys(i.specs).length > 0).length;
  const with3 = items.filter((i) => i.imageUrls.length >= 3).length;
  console.log(
    `\nDone. ${items.length} listings, ${withPrice} priced, ${withSpecs} with specs, ${with3} with 3 images, ${failed} PDP fails`
  );
  console.log(`Wrote ${OUT_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
