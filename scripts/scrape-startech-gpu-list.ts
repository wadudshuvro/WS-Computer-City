/**
 * Scrape Star Tech Graphics Card listing pages (in-stock).
 * Collects titles, URLs, listing prices, card bullets, and listing thumbnails.
 *
 * Run: npx tsx scripts/scrape-startech-gpu-list.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const BASE = 'https://www.startech.com.bd/component/graphics-card';
const OUT_DIR = path.join(process.cwd(), 'docs/imports');
const OUT_JSON = path.join(OUT_DIR, 'startech-gpu-list.json');

export type ListedGpu = {
  name: string;
  url: string;
  page: number;
  price: number | null;
  compareAtPrice: number | null;
  bullets: string[];
  listingImageUrl: string | null;
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

function parseMoney(text: string): number | null {
  if (!text) return null;
  const m = String(text).replace(/,/g, '').match(/(\d+)(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 && n < 10_000_000 ? n : null;
}

function parseListingPage(html: string, page: number): ListedGpu[] {
  const items: ListedGpu[] = [];
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
      page,
      price,
      compareAtPrice,
      bullets,
      listingImageUrl: img,
    });
  }
  return items;
}

function detectTotalPages(html: string): number {
  const showing = html.match(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)/i);
  if (showing) {
    const total = Number(showing[1]);
    return Math.max(1, Math.ceil(total / 90));
  }
  const pages = [...html.matchAll(/[?&]page=(\d+)/gi)].map((x) => Number(x[1]));
  return pages.length ? Math.max(...pages) : 1;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const firstUrl = `${BASE}?filter_status=7&limit=90`;
  console.log('Fetching page 1…');
  const first = await fetchText(firstUrl);
  const totalPages = detectTotalPages(first);
  console.log(`Detected ${totalPages} pages`);

  const all: ListedGpu[] = [];
  const seen = new Set<string>();
  const add = (items: ListedGpu[]) => {
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
    const url = `${BASE}?filter_status=7&limit=90&page=${page}`;
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
  const priced = all.filter((x) => x.price != null).length;
  console.log(`\nWrote ${all.length} GPUs (${priced} with listing price)`);
  console.log(`  ${OUT_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
