/**
 * Download Motherboard PDP images → public/uploads/motherboards/
 * and point each product's primary image at the local path.
 *
 * Matches DB products to Star Tech PDP URLs via:
 *   1) docs/imports/motherboard-cms-import-30.csv (slug / name)
 *   2) docs/imports/motherboard-cms-import.csv
 *   3) docs/imports/startech-motherboard-list.json (name)
 *
 * Run: npx tsx scripts/download-motherboard-images.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const OUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'motherboards');
const CSV_30 = path.join(process.cwd(), 'docs/imports/motherboard-cms-import-30.csv');
const CSV_ALL = path.join(process.cwd(), 'docs/imports/motherboard-cms-import.csv');
const LIST_JSON = path.join(process.cwd(), 'docs/imports/startech-motherboard-list.json');

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

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]!);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]!);
    if (cols.every((c) => !c.trim())) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/motherboard/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMainImageUrl(html: string): string | null {
  const patterns = [
    /class=["']main-img["'][^>]*src=["']([^"']+)["']/i,
    /src=["']([^"']+)["'][^>]*class=["'][^"']*main-img[^"']*["']/i,
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<img[^>]*src=["'](https?:\/\/[^"']*\/image\/(?:cache\/)?catalog\/[^"']*motherboard[^"']+)["']/i,
    /<img[^>]*src=["'](https?:\/\/[^"']*\/image\/(?:cache\/)?catalog\/[^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m?.[1]) {
      let url = m[1].trim();
      if (url.startsWith('//')) url = `https:${url}`;
      if (url.startsWith('/')) url = `https://www.startech.com.bd${url}`;
      return url;
    }
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
  const fromUrl = path.extname(new URL(url).pathname).toLowerCase();
  if (fromUrl && fromUrl.length <= 5) return fromUrl;
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  return '.jpg';
}

async function downloadBest(imageUrl: string): Promise<{ buffer: Buffer; ext: string; usedUrl: string }> {
  let lastErr: unknown;
  for (const candidate of upgradeImageUrl(imageUrl)) {
    try {
      const { buffer, contentType } = await fetchBuffer(candidate);
      if (buffer.length < 1000) throw new Error('file too small');
      return { buffer, ext: extFrom(candidate, contentType), usedUrl: candidate };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function upsertLocalImage(productId: string, localPath: string, alt: string) {
  const existing = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { order: 'asc' },
  });

  if (existing.length === 0) {
    await prisma.productImage.create({
      data: {
        productId,
        url: localPath,
        alt,
        order: 0,
        isPrimary: true,
      },
    });
    return;
  }

  const primary = existing.find((i) => i.isPrimary) || existing[0]!;
  await prisma.productImage.update({
    where: { id: primary.id },
    data: { url: localPath, alt, isPrimary: true },
  });
}

function buildSourceMaps() {
  const bySlug = new Map<string, string>();
  const byName = new Map<string, string>();

  const addCsv = (file: string) => {
    if (!fs.existsSync(file)) return;
    for (const row of parseCsv(fs.readFileSync(file, 'utf8'))) {
      const url = row.source_list_url?.trim();
      if (!url) continue;
      if (row.slug?.trim()) bySlug.set(row.slug.trim().toLowerCase(), url);
      if (row.name?.trim()) byName.set(normalizeName(row.name), url);
    }
  };

  addCsv(CSV_30);
  addCsv(CSV_ALL);

  if (fs.existsSync(LIST_JSON)) {
    const list = JSON.parse(fs.readFileSync(LIST_JSON, 'utf8')) as Array<{ name: string; url: string }>;
    for (const item of list) {
      if (!item.name || !item.url) continue;
      const key = normalizeName(item.name);
      if (!byName.has(key)) byName.set(key, item.url);
    }
  }

  return { bySlug, byName };
}

function resolvePdpUrl(
  product: { slug: string; name: string },
  bySlug: Map<string, string>,
  byName: Map<string, string>
): string | null {
  const fromSlug = bySlug.get(product.slug.toLowerCase());
  if (fromSlug) return fromSlug;

  const exact = byName.get(normalizeName(product.name));
  if (exact) return exact;

  // Fuzzy: slug contained in known names, or name tokens
  const n = normalizeName(product.name);
  for (const [key, url] of byName) {
    if (key.includes(n) || n.includes(key)) return url;
  }

  // Last resort: if current image is already a Star Tech CDN URL, keep using PDP from slug guess
  return null;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { bySlug, byName } = buildSourceMaps();

  const products = await prisma.product.findMany({
    where: {
      category: { slug: { in: ['motherboard', 'intel-motherboard', 'amd-motherboard'] } },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      images: { select: { url: true } },
    },
    orderBy: { name: 'asc' },
  });

  console.log(`Found ${products.length} motherboard products`);

  let ok = 0;
  let failed = 0;

  for (const product of products) {
    let pdpUrl = resolvePdpUrl(product, bySlug, byName);

    // If product already has a Star Tech image URL, extract PDP-less download from that
    const existingUrl = product.images[0]?.url || '';
    const existingIsRemote =
      existingUrl.startsWith('https://www.startech.com.bd/image/') ||
      existingUrl.includes('startech.com.bd/image/');

    process.stdout.write(`${product.slug} … `);

    try {
      let imageUrl: string | null = null;

      if (pdpUrl) {
        const html = await fetchText(pdpUrl);
        imageUrl = extractMainImageUrl(html);
      }

      if (!imageUrl && existingIsRemote) {
        imageUrl = existingUrl.replace(/-500x500\./i, '-800x800.');
      }

      if (!imageUrl) throw new Error(pdpUrl ? 'no main image on PDP' : 'no source_list_url match');

      const { buffer, ext, usedUrl } = await downloadBest(imageUrl);
      const filename = `${product.slug}${ext}`;
      fs.writeFileSync(path.join(OUT_DIR, filename), buffer);

      const localPath = `/uploads/motherboards/${filename}`;
      await upsertLocalImage(product.id, localPath, product.name);

      console.log(`OK (${Math.round(buffer.length / 1024)}KB) ← ${usedUrl}`);
      ok++;
    } catch (err) {
      failed++;
      console.log(`FAIL ${err instanceof Error ? err.message : err}`);
    }

    await sleep(350);
  }

  console.log(`\nDone. ok=${ok} failed=${failed}`);
  console.log(`Images in: ${OUT_DIR}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
