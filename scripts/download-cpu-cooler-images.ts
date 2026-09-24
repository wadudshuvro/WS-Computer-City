/**
 * Download up to 3 DISTINCT CPU cooler PDP views → public/uploads/cpu-coolers/
 * (left / right / top when Star Tech has them). Never pad with copies.
 *
 * Run: npx tsx scripts/download-cpu-cooler-images.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import type { ListedCooler } from './scrape-startech-cpu-cooler-list';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const OUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'cpu-coolers');
const LIST_JSON = path.join(process.cwd(), 'docs/imports/startech-cpu-cooler-list.json');

function request(
  url: string,
  headers: Record<string, string>,
  redirects = 0
): Promise<{ status: number; headers: http.IncomingHttpHeaders; buffer: Buffer }> {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        request(next, headers, redirects + 1).then(resolve, reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () =>
        resolve({
          status: res.statusCode || 0,
          headers: res.headers,
          buffer: Buffer.concat(chunks),
        })
      );
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error(`Timeout ${url}`));
    });
  });
}

async function fetchBuffer(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await request(url, {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    Referer: 'https://www.startech.com.bd/',
  });
  if (res.status !== 200) throw new Error(`HTTP ${res.status} for ${url}`);
  return { buffer: res.buffer, contentType: String(res.headers['content-type'] || '') };
}

async function fetchText(url: string): Promise<string> {
  const res = await request(url, {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml',
  });
  if (res.status !== 200) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.buffer.toString('utf8');
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function extFrom(url: string, contentType: string): string {
  if (/webp/i.test(contentType) || /\.webp(\?|$)/i.test(url)) return 'webp';
  if (/png/i.test(contentType) || /\.png(\?|$)/i.test(url)) return 'png';
  return 'jpg';
}

function localName(slug: string, index: number, ext: string): string {
  return index === 0 ? `${slug}.${ext}` : `${slug}-${index + 1}.${ext}`;
}

function absUrl(raw: string): string {
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('/')) return `https://www.startech.com.bd${raw}`;
  return raw;
}

function isJunkImage(url: string): boolean {
  return /\/logo\.(png|jpg|webp)|\/ads\/|banner|placeholder|mymensingh|gazipur/i.test(url);
}

/** Same photo at 74x74 / 228x228 / 500x500 collapses to one key. */
function viewKey(url: string): string {
  return url
    .split('?')[0]!
    .replace(/https?:\/\/[^/]+/i, '')
    .replace(/\/image\/cache\//i, '/image/')
    .replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1')
    .toLowerCase();
}

function productFolder(url: string): string | null {
  const m = url.match(/\/image\/(?:cache\/)?catalog\/(.+)\/[^/]+$/i);
  return m ? m[1]!.toLowerCase() : null;
}

function prefer500(url: string): string {
  if (/-\d+x\d+\.[a-z0-9]+$/i.test(url)) {
    return url.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '-500x500$1');
  }
  return url.replace(/(\.[a-z0-9]+)$/i, '-500x500$1');
}

function addView(map: Map<string, string>, url?: string | null, folderHint?: string | null) {
  if (!url || isJunkImage(url)) return;
  const abs = absUrl(url);
  const folder = productFolder(abs);
  if (folderHint && folder && folder !== folderHint) return;
  const key = viewKey(abs);
  const sized = prefer500(abs);
  const prev = map.get(key);
  if (!prev || /500x500/.test(abs) || /500x500/.test(sized)) {
    map.set(key, /500x500/.test(abs) ? abs : sized);
  }
}

function parseGalleryFromHtml(html: string, folderHint?: string | null): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of html.matchAll(
    /(?:data-zoom-image|data-large|data-src|href|src)=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi
  )) {
    addView(map, m[1], folderHint);
  }
  return map;
}

function deriveSiblingViews(seed: string): string[] {
  const out: string[] = [seed];
  const as500 = prefer500(seed);
  out.push(as500);
  if (/-0?1(-\d+x\d+)?\.[a-z0-9]+$/i.test(seed)) {
    for (const n of ['01', '02', '03', '04']) {
      const next = seed
        .replace(/-0?1-(\d+x\d+)(\.[a-z0-9]+)$/i, `-${n}-$1$2`)
        .replace(/-0?1(\.[a-z0-9]+)$/i, `-${n}$1`);
      out.push(next, prefer500(next));
    }
  }
  return out;
}

function candidatesFor(url: string): string[] {
  const out: string[] = [];
  const add = (u?: string) => {
    if (u && !isJunkImage(u) && !out.includes(u)) out.push(u);
  };
  add(prefer500(url));
  add(url);
  add(url.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '-228x228$1'));
  add(url.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1'));
  add(
    url
      .replace('/image/cache/catalog/', '/image/catalog/')
      .replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1')
  );
  if (/\.webp(\?|$)/i.test(url)) add(url.replace(/\.webp/i, '.jpg'));
  if (/\.jpg(\?|$)/i.test(url)) add(url.replace(/\.jpg/i, '.webp'));
  return out;
}

async function downloadFirstWorking(
  urls: string[]
): Promise<{ buffer: Buffer; contentType: string; url: string } | null> {
  for (const url of urls) {
    try {
      const result = await fetchBuffer(url);
      if (result.buffer.length > 1200) return { ...result, url };
    } catch {
      // try next
    }
  }
  return null;
}

async function upsertImages(productId: string, urls: string[], name: string) {
  await prisma.productImage.deleteMany({ where: { productId } });
  await prisma.productImage.createMany({
    data: urls.map((url, order) => ({
      productId,
      url,
      alt: name,
      order,
      isPrimary: order === 0,
    })),
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const list = JSON.parse(fs.readFileSync(LIST_JSON, 'utf8')) as ListedCooler[];
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const bySlug = new Map(list.map((i) => [i.slug, i]));
  const byName = new Map(list.map((i) => [i.name.toLowerCase(), i]));
  const byNorm = new Map(list.map((i) => [norm(i.name), i]));

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: { in: ['cpu-cooler', 'cpu-coolers', 'cooler'] } },
    },
    include: { images: true },
  });

  let ok = 0;
  let fail = 0;
  let with3 = 0;
  let with2 = 0;
  let with1 = 0;

  for (const product of products) {
    const listed =
      bySlug.get(product.slug) ||
      byName.get(product.name.toLowerCase()) ||
      byNorm.get(norm(product.name));
    const folder = listed?.listingImageUrl ? productFolder(listed.listingImageUrl) : null;
    const views = new Map<string, string>();

    if (listed?.url) {
      try {
        await sleep(180);
        const html = await fetchText(listed.url);
        for (const [k, v] of parseGalleryFromHtml(html, folder)) views.set(k, v);
      } catch (err) {
        console.warn(
          `  PDP fetch fail ${product.slug}:`,
          err instanceof Error ? err.message : err
        );
      }
    }

    if (listed?.listingImageUrl) {
      for (const extra of deriveSiblingViews(listed.listingImageUrl)) {
        addView(views, extra, folder);
      }
    }
    for (const extra of listed?.imageUrls || []) addView(views, extra, folder);

    if (!views.size) {
      console.warn(`FAIL ${product.slug}: no distinct gallery views`);
      fail++;
      continue;
    }

    const hashes = new Set<string>();
    const localUrls: string[] = [];
    for (const src of views.values()) {
      if (localUrls.length >= 3) break;
      const got = await downloadFirstWorking(candidatesFor(src));
      if (!got) continue;
      const hash = crypto.createHash('sha256').update(got.buffer).digest('hex');
      if (hashes.has(hash)) continue;
      hashes.add(hash);
      const ext = extFrom(got.url, got.contentType);
      const file = localName(product.slug, localUrls.length, ext);
      fs.writeFileSync(path.join(OUT_DIR, file), got.buffer);
      localUrls.push(`/uploads/cpu-coolers/${file}`);
    }

    if (!localUrls.length) {
      fail++;
      console.warn(`FAIL ${product.slug}: downloads empty`);
      continue;
    }

    await upsertImages(product.id, localUrls, product.name);
    ok++;
    if (localUrls.length >= 3) with3++;
    else if (localUrls.length === 2) with2++;
    else with1++;
    console.log(`OK ${product.slug} (${localUrls.length} distinct views)`);
  }

  const files = fs.readdirSync(OUT_DIR).filter((f) => !f.startsWith('.'));
  console.log(
    `\nDone. products ok=${ok} fail=${fail}; distinct 3/2/1=${with3}/${with2}/${with1}; files on disk=${files.length}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
