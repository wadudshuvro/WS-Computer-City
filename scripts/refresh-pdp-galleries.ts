/**
 * Replace product photos with the full-size Star Tech PDP gallery.
 * Usage: npx tsx scripts/refresh-pdp-galleries.ts motherboard|gpu|casing
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const kind = process.argv[2] || '';
const categorySlugs =
  kind === 'gpu'
    ? ['graphics-card', 'nvidia', 'amd-gpu']
    : kind === 'casing'
      ? ['computer-case', 'casing', 'case']
      : ['motherboard', 'intel-motherboard', 'amd-motherboard'];
const folder = kind === 'gpu' ? 'gpus' : kind === 'casing' ? 'casings' : 'motherboards';
const listFiles =
  kind === 'gpu'
    ? ['docs/imports/gpu-cms-import.csv', 'docs/imports/startech-gpu-list.json']
    : kind === 'casing'
      ? []
      : [
          'docs/imports/motherboard-cms-import-30.csv',
          'docs/imports/motherboard-cms-import.csv',
          'docs/imports/startech-motherboard-list.json',
        ];

async function fetchText(url: string): Promise<string> {
  let last = 'HTTP error';
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
      redirect: 'follow',
    });
    if (res.status === 429) {
      last = 'HTTP 429';
      await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }
  throw new Error(last);
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = split(lines[0]!);
  return lines.slice(1).map((line) => {
    const cols = split(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = cols[index] || '';
    });
    return row;
  });
}

function split(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function sourceMaps() {
  const bySlug = new Map<string, string>();
  const byName = new Map<string, string>();
  for (const file of listFiles) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    if (file.endsWith('.json')) {
      const list = JSON.parse(fs.readFileSync(full, 'utf8')) as Array<{ name?: string; url?: string }>;
      for (const item of list) {
        if (item.name && item.url && !byName.has(normalize(item.name))) byName.set(normalize(item.name), item.url);
      }
    } else {
      for (const row of parseCsv(fs.readFileSync(full, 'utf8'))) {
        const url = row.source_list_url?.trim();
        if (!url) continue;
        if (row.slug) bySlug.set(row.slug.trim().toLowerCase(), url);
        if (row.name) byName.set(normalize(row.name), url);
      }
    }
  }
  return { bySlug, byName };
}

function galleryUrls(html: string): string[] {
  const found = [...html.matchAll(/src="(https:\/\/www\.startech\.com\.bd\/image\/cache\/catalog\/[^"]+)"/g)].map(
    (match) => match[1]!
  );
  const byBase = new Map<string, { url: string; score: number }>();
  for (const url of found) {
    if (/logo|icon|banner|payment|svg/i.test(url)) continue;
    const base = url.replace(/-\d+x\d+(?=\.)/i, '');
    const size = Number(/-(\d+)x\d+(?=\.)/i.exec(url)?.[1] || 400);
    const prev = byBase.get(base);
    if (!prev || size > prev.score) byBase.set(base, { url, score: size });
  }
  return [...byBase.values()].map((item) => item.url).slice(0, 6);
}

function largerCandidates(url: string): string[] {
  const ext = path.extname(new URL(url).pathname);
  const stem = url.replace(/-\d+x\d+(?=\.)/i, '').replace(new RegExp(`${ext}$`, 'i'), '');
  return [...new Set([`${stem}-800x800${ext}`, `${stem}-500x500${ext}`, url])];
}

async function download(url: string, fileBase: string): Promise<string | null> {
  for (const candidate of largerCandidates(url)) {
    try {
      const res = await fetch(candidate, {
        headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.startech.com.bd/' },
        redirect: 'follow',
      });
      if (!res.ok) continue;
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 4000) continue;
      const meta = await sharp(buffer).metadata();
      if (!meta.width || meta.width < 400) continue;
      const ext = path.extname(new URL(candidate).pathname).toLowerCase() || '.jpg';
      const file = `${fileBase}${ext}`;
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, buffer);
      return `/uploads/${folder}/${path.basename(file)}`;
    } catch {
      continue;
    }
  }
  return null;
}

async function main() {
  const maps = sourceMaps();
  const products = await prisma.product.findMany({
    where: { category: { slug: { in: categorySlugs } } },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  });
  console.log(`${kind}: ${products.length} products`);
  let ok = 0;
  for (const product of products) {
    const pdp =
      maps.bySlug.get(product.slug.toLowerCase()) ||
      maps.byName.get(normalize(product.name)) ||
      `https://www.startech.com.bd/${product.slug}`;
    try {
      const html = await fetchText(pdp);
      const urls = galleryUrls(html);
      if (urls.length === 0) throw new Error('no gallery');
      const images: { url: string; alt: string; order: number; isPrimary: boolean }[] = [];
      for (let i = 0; i < urls.length; i++) {
        const base = path.join(
          process.cwd(),
          'public',
          'uploads',
          folder,
          i === 0 ? product.slug : `${product.slug}-${i + 1}`
        );
        const saved = await download(urls[i]!, base);
        if (saved) images.push({ url: saved, alt: product.name, order: i, isPrimary: i === 0 });
      }
      if (images.length === 0) throw new Error('download failed');
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productImage.createMany({
        data: images.map((image) => ({ productId: product.id, ...image })),
      });
      ok++;
      console.log(`${product.slug} ${images.length}`);
    } catch (error) {
      console.log(`SKIP ${product.slug}: ${(error as Error).message}`);
    }
  }
  console.log(`done ${kind} updated=${ok}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
