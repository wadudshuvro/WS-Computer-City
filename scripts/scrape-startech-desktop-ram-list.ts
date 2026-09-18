/**
 * Build a Desktop RAM model checklist from Star Tech category listing pages.
 * Collects product titles, listing URLs, and listing-card prices
 * (not PDP body text / images).
 *
 * Run: npx tsx scripts/scrape-startech-desktop-ram-list.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { RAM_BRANDS } from '../src/lib/ramSpecDefinitions';

const BASE = 'https://www.startech.com.bd/component/ram';
const OUT_DIR = path.join(process.cwd(), 'docs/imports');
const OUT_JSON = path.join(OUT_DIR, 'startech-desktop-ram-list.json');
const OUT_CSV = path.join(OUT_DIR, 'desktop-ram-models-checklist.csv');

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchText(res.headers.location).then(resolve, reject);
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
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

type ListedRam = {
  name: string;
  url: string;
  page: number;
  price: number | null;
  compareAtPrice: number | null;
};

function parseMoney(text: string): number | null {
  if (!text) return null;
  // Keep integer taka; do not strip "." from "7900.00" into "790000"
  const m = String(text).replace(/,/g, '').match(/(\d+)(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 && n < 10_000_000 ? n : null;
}

function parseListingPage(html: string, page: number): ListedRam[] {
  const items: ListedRam[] = [];
  // Split on product cards so price stays tied to the same item
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
    // Skip obvious laptop / SO-DIMM kits if Star Tech mixes them on /ram
    const lower = name.toLowerCase();
    if (lower.includes('laptop') || lower.includes('so-dimm') || lower.includes('sodimm')) {
      continue;
    }
    const url = href.startsWith('http') ? href : `https://www.startech.com.bd${href}`;

    const priceBlock = /class=["']p-item-price["'][^>]*>([\s\S]*?)<\/div>/i.exec(card)?.[1] || '';
    const priceNew = /class=["']price-new["'][^>]*>([\s\S]*?)<\/span>/i.exec(priceBlock)?.[1];
    const priceOld = /class=["']price-old["'][^>]*>([\s\S]*?)<\/span>/i.exec(priceBlock)?.[1];
    // Some cards show a single bare amount inside p-item-price
    const barePrice = !priceNew
      ? stripTags(priceBlock).match(/[\d,]+৳/)?.[0]
      : null;
    const price = parseMoney(priceNew || barePrice || '');
    const compareAtPrice = parseMoney(priceOld || '');

    items.push({ name, url, page, price, compareAtPrice });
  }
  return items;
}

function detectTotalPages(html: string): number {
  const showing = html.match(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/i);
  if (showing) {
    const total = Number(showing[1]);
    return Math.max(1, Math.ceil(total / 20));
  }
  const pages = [...html.matchAll(/[?&]page=(\d+)/gi)].map((x) => Number(x[1]));
  return pages.length ? Math.max(...pages) : 1;
}

function guessBrandSlug(name: string): string {
  const n = name.toLowerCase();
  // Longer / specific labels first
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
  return '';
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function skuFromName(name: string, brand: string, index: number): string {
  const brandPart = (brand || 'RAM').toUpperCase().replace(/[^A-Z0-9]/g, '');
  let core = name
    .replace(/desktop|ram|memory|ddr[345]|mhz|gb\b/gi, ' ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase()
    .slice(0, 36);
  if (brandPart && core.startsWith(`${brandPart}-`)) core = core.slice(brandPart.length + 1);
  return `RAM-${brandPart}-${core || index}`.replace(/-+/g, '-');
}

function csvEscape(v: string): string {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Fetching page 1…');
  const first = await fetchText(BASE);
  const totalPages = detectTotalPages(first);
  console.log(`Detected ${totalPages} pages`);

  const all: ListedRam[] = [];
  const seen = new Set<string>();

  const add = (items: ListedRam[]) => {
    for (const item of items) {
      const key = item.url.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      all.push(item);
    }
  };

  add(parseListingPage(first, 1));
  console.log(`Page 1: ${all.length} unique so far`);

  for (let page = 2; page <= totalPages; page++) {
    await sleep(400);
    const url = `${BASE}?page=${page}`;
    process.stdout.write(`Fetching page ${page}/${totalPages}… `);
    try {
      const html = await fetchText(url);
      const before = all.length;
      add(parseListingPage(html, page));
      console.log(`+${all.length - before} (total ${all.length})`);
    } catch (err) {
      console.log('FAIL', err instanceof Error ? err.message : err);
    }
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(all, null, 2), 'utf8');

  const withPrice = all.filter((x) => x.price != null).length;
  console.log(`Prices found on listing cards: ${withPrice}/${all.length}`);

  const header = [
    'list_order',
    'name',
    'brand_slug',
    'suggested_slug',
    'suggested_sku',
    'source_list_url',
    'price',
    'compareAtPrice',
    'stock_decision',
    'notes',
  ];
  const lines = [header.join(',')];
  all.forEach((item, i) => {
    const brand = guessBrandSlug(item.name);
    lines.push(
      [
        String(i + 1),
        item.name,
        brand,
        slugify(item.name),
        skuFromName(item.name, brand, i + 1),
        item.url,
        item.price != null ? String(item.price) : '',
        item.compareAtPrice != null ? String(item.compareAtPrice) : '',
        'REVIEW',
        '',
      ]
        .map(csvEscape)
        .join(',')
    );
  });
  fs.writeFileSync(OUT_CSV, lines.join('\n'), 'utf8');

  console.log(`\nWrote ${all.length} desktop RAM listings:`);
  console.log(`  ${OUT_JSON}`);
  console.log(`  ${OUT_CSV}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
