/**
 * Apply Star Tech listing/PDP prices onto motherboard CMS import CSVs,
 * then update matching products already in PostgreSQL.
 *
 * Prerequisite: npx tsx scripts/scrape-startech-motherboard-list.ts
 * Run: npx tsx scripts/fill-motherboard-prices-from-startech.ts
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const OUT_DIR = path.join(process.cwd(), 'docs/imports');
const LIST_JSON = path.join(OUT_DIR, 'startech-motherboard-list.json');
const CSV_IMPORT = path.join(OUT_DIR, 'motherboard-cms-import.csv');
const CSV_30 = path.join(OUT_DIR, 'motherboard-cms-import-30.csv');
const XLSX_30 = path.join(OUT_DIR, 'motherboard-cms-import-30.xlsx');
const XLSX = path.join(OUT_DIR, 'motherboard-cms-import.xlsx');

type ListedMb = {
  name: string;
  url: string;
  price: number | null;
  compareAtPrice: number | null;
};

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

function parseMoney(text: string): number | null {
  if (!text) return null;
  const m = String(text).replace(/,/g, '').match(/(\d+)(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 && n < 10_000_000 ? n : null;
}

function extractOfficialPdpPrice(html: string): {
  price: number | null;
  compareAtPrice: number | null;
} {
  const cell =
    /class=["']product-info-data product-price["'][^>]*>([\s\S]*?)<\/td>/i.exec(html)?.[1] || '';
  const cellText = cell.replace(/<[^>]+>/g, ' ').trim();
  const fromCell = parseMoney(cellText);
  const meta =
    /itemprop=["']price["'][^>]*content=["']([^"']+)["']/i.exec(html)?.[1] ||
    /content=["']([^"']+)["'][^>]*itemprop=["']price["']/i.exec(html)?.[1];
  const price = fromCell || parseMoney(meta || '');
  const priceOld = /class=["']price-old["'][^>]*>([\s\S]*?)<\/span>/i.exec(html)?.[1];
  return { price, compareAtPrice: parseMoney(priceOld || '') };
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function csvEscape(v: string): string {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

async function writeCsvAndXlsx(
  headers: string[],
  rows: string[][],
  csvPath: string,
  xlsxPath: string,
  sheetName: string
) {
  const csvBody = [headers.join(','), ...rows.map((c) => c.map(csvEscape).join(','))].join('\n');
  fs.writeFileSync(csvPath, csvBody, 'utf8');

  const wb = new ExcelJS.Workbook();
  wb.creator = 'LogicBay BD';
  const sheet = wb.addWorksheet(sheetName, { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.addRow([...headers]);
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFDBEAFE' },
  };
  for (const cols of rows) sheet.addRow(cols);
  headers.forEach((h, i) => {
    sheet.getColumn(i + 1).width =
      h === 'name' || h === 'description' || h === 'shortDescription'
        ? 45
        : h === 'source_list_url' || h === 'slug'
          ? 40
          : 14;
  });
  await wb.xlsx.writeFile(xlsxPath);
}

async function fillCsvFile(
  csvPath: string,
  byUrl: Map<string, ListedMb>,
  byName: Map<string, ListedMb>
): Promise<{ headers: string[]; rows: string[][]; filled: number; missing: string[] }> {
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  const headers = parseCsvLine(lines[0]!);
  const priceIdx = headers.indexOf('price');
  const compareIdx = headers.indexOf('compareAtPrice');
  const urlIdx = headers.indexOf('source_list_url');
  const nameIdx = headers.indexOf('name');
  if (priceIdx < 0 || urlIdx < 0 || nameIdx < 0) {
    throw new Error(`${csvPath} missing price/source_list_url/name`);
  }

  let filled = 0;
  const missing: string[] = [];
  const rows: string[][] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]!);
    while (cols.length < headers.length) cols.push('');
    const url = (cols[urlIdx] || '').toLowerCase().replace(/\/$/, '');
    const name = (cols[nameIdx] || '').trim().toLowerCase();
    let match = byUrl.get(url) || byName.get(name);

    if (match?.price == null && url) {
      process.stdout.write(`PDP fallback: ${cols[nameIdx]}… `);
      try {
        await sleep(350);
        const html = await fetchText(cols[urlIdx]!);
        const pdp = extractOfficialPdpPrice(html);
        if (pdp.price != null) {
          match = {
            name: cols[nameIdx]!,
            url: cols[urlIdx]!,
            price: pdp.price,
            compareAtPrice: pdp.compareAtPrice,
          };
          console.log(`৳${pdp.price}`);
        } else {
          console.log('NONE');
        }
      } catch (e) {
        console.log('FAIL', e instanceof Error ? e.message : e);
      }
    }

    if (match?.price != null) {
      cols[priceIdx] = String(match.price);
      if (compareIdx >= 0) {
        cols[compareIdx] = match.compareAtPrice != null ? String(match.compareAtPrice) : '';
      }
      filled++;
      console.log(`OK  ${cols[nameIdx]} → ৳${match.price}`);
    } else {
      missing.push(cols[nameIdx] || `row ${i}`);
      console.warn(`MISS ${cols[nameIdx]}`);
    }
    rows.push(cols);
  }

  return { headers, rows, filled, missing };
}

async function updateDbPrices(headers: string[], rows: string[][]) {
  const priceIdx = headers.indexOf('price');
  const compareIdx = headers.indexOf('compareAtPrice');
  const skuIdx = headers.indexOf('sku');
  const slugIdx = headers.indexOf('slug');
  const nameIdx = headers.indexOf('name');

  let updated = 0;
  let notFound = 0;

  for (const cols of rows) {
    const price = Number(cols[priceIdx]);
    if (!Number.isFinite(price) || price <= 0) continue;
    const sku = (cols[skuIdx] || '').trim().toUpperCase();
    const slug = (cols[slugIdx] || '').trim();
    const product = await prisma.product.findFirst({
      where: { OR: [{ sku }, { slug }] },
      select: { id: true, sku: true, price: true },
    });
    if (!product) {
      notFound++;
      console.warn(`DB MISS ${sku || slug}`);
      continue;
    }
    const compareAt =
      compareIdx >= 0 && cols[compareIdx] && Number(cols[compareIdx]) > 0
        ? Number(cols[compareIdx])
        : null;
    await prisma.product.update({
      where: { id: product.id },
      data: {
        price,
        compareAtPrice: compareAt,
      },
    });
    updated++;
    console.log(
      `DB  ${cols[nameIdx]} ৳${product.price} → ৳${price}${compareAt ? ` (was ৳${compareAt})` : ''}`
    );
  }

  return { updated, notFound };
}

async function main() {
  if (!fs.existsSync(LIST_JSON)) {
    throw new Error(`Missing ${LIST_JSON}. Run scrape first.`);
  }
  if (!fs.existsSync(CSV_IMPORT)) {
    throw new Error(`Missing ${CSV_IMPORT}`);
  }

  const list = JSON.parse(fs.readFileSync(LIST_JSON, 'utf8')) as ListedMb[];
  const byUrl = new Map<string, ListedMb>();
  const byName = new Map<string, ListedMb>();
  for (const item of list) {
    byUrl.set(item.url.toLowerCase().replace(/\/$/, ''), item);
    byName.set(item.name.trim().toLowerCase(), item);
  }

  console.log('\n=== Filling motherboard-cms-import.csv ===');
  const importFilled = await fillCsvFile(CSV_IMPORT, byUrl, byName);
  await writeCsvAndXlsx(
    importFilled.headers,
    importFilled.rows,
    CSV_IMPORT,
    XLSX,
    'Motherboard Import'
  );

  if (fs.existsSync(CSV_30)) {
    console.log('\n=== Filling motherboard-cms-import-30.csv ===');
    const batch30 = await fillCsvFile(CSV_30, byUrl, byName);
    await writeCsvAndXlsx(batch30.headers, batch30.rows, CSV_30, XLSX_30, 'Motherboard 30');
  }

  console.log('\n=== Updating DB prices ===');
  const db = await updateDbPrices(importFilled.headers, importFilled.rows);

  console.log(`\nCSV filled: ${importFilled.filled}/${importFilled.rows.length}`);
  if (importFilled.missing.length) {
    console.log('Still missing Star Tech price:');
    importFilled.missing.forEach((n) => console.log(`  - ${n}`));
  }
  console.log(`DB updated: ${db.updated}, not found: ${db.notFound}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
