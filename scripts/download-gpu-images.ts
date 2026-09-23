/**
 * Download GPU PDP images → public/uploads/gpus/
 * and point each product's primary image at the local path.
 *
 * Run: npx tsx scripts/download-gpu-images.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const OUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'gpus');
const CSV_ALL = path.join(process.cwd(), 'docs/imports/gpu-cms-import.csv');
const LIST_JSON = path.join(process.cwd(), 'docs/imports/startech-gpu-list.json');

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
          reject(new Error(`HTTP ${res.statusCode}`));
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
      reject(new Error('Timeout'));
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
  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? '';
    });
    return row;
  });
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
      } else inQuotes = !inQuotes;
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
    .replace(/graphics?\s*card/g, '')
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
    /itemprop=["']image["'][^>]*src=["']([^"']+)["']/i,
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
  if (/-\d+x\d+\./i.test(url)) {
    candidates.unshift(url.replace(/-\d+x\d+\./i, '-800x800.'));
    candidates.push(url.replace(/-\d+x\d+\./i, '-500x500.'));
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
      data: { productId, url: localPath, alt, order: 0, isPrimary: true },
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
  const listingImageByUrl = new Map<string, string>();

  if (fs.existsSync(CSV_ALL)) {
    for (const row of parseCsv(fs.readFileSync(CSV_ALL, 'utf8'))) {
      const url = row.source_list_url?.trim();
      if (!url) continue;
      if (row.slug?.trim()) bySlug.set(row.slug.trim().toLowerCase(), url);
      if (row.name?.trim()) byName.set(normalizeName(row.name), url);
    }
  }

  if (fs.existsSync(LIST_JSON)) {
    const list = JSON.parse(fs.readFileSync(LIST_JSON, 'utf8')) as Array<{
      name: string;
      url: string;
      listingImageUrl?: string | null;
    }>;
    for (const item of list) {
      if (!item.name || !item.url) continue;
      const key = normalizeName(item.name);
      if (!byName.has(key)) byName.set(key, item.url);
      if (item.listingImageUrl) listingImageByUrl.set(item.url.toLowerCase(), item.listingImageUrl);
    }
  }

  return { bySlug, byName, listingImageByUrl };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { bySlug, byName, listingImageByUrl } = buildSourceMaps();

  const products = await prisma.product.findMany({
    where: {
      category: { slug: { in: ['graphics-card', 'nvidia', 'amd-gpu'] } },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      images: { select: { url: true } },
    },
    orderBy: { name: 'asc' },
  });

  console.log(`Found ${products.length} GPU products`);
  let ok = 0;
  let failed = 0;

  for (const product of products) {
    const pdpUrl =
      bySlug.get(product.slug.toLowerCase()) ||
      byName.get(normalizeName(product.name)) ||
      null;
    process.stdout.write(`${product.slug} … `);
    try {
      let imageUrl: string | null = null;
      if (pdpUrl) {
        const html = await fetchText(pdpUrl);
        imageUrl = extractMainImageUrl(html);
        if (!imageUrl) imageUrl = listingImageByUrl.get(pdpUrl.toLowerCase()) || null;
      }
      if (!imageUrl) throw new Error(pdpUrl ? 'no main image' : 'no source URL');

      const { buffer, ext, usedUrl } = await downloadBest(imageUrl);
      const filename = `${product.slug}${ext}`;
      fs.writeFileSync(path.join(OUT_DIR, filename), buffer);
      await upsertLocalImage(product.id, `/uploads/gpus/${filename}`, product.name);
      console.log(`OK (${Math.round(buffer.length / 1024)}KB)`);
      ok++;
    } catch (err) {
      failed++;
      console.log(`FAIL ${err instanceof Error ? err.message : err}`);
    }
    await sleep(300);
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
