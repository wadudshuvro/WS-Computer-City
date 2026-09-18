/**
 * Apply Star Tech listing-card prices onto the Desktop RAM 30-batch CSV/XLSX
 * by matching source_list_url (does not change product selection).
 *
 * Prerequisite: npx tsx scripts/scrape-startech-desktop-ram-list.ts
 * Run: npx tsx scripts/fill-desktop-ram-prices-from-startech.ts
 */
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const OUT_DIR = path.join(process.cwd(), 'docs/imports');
const LIST_JSON = path.join(OUT_DIR, 'startech-desktop-ram-list.json');
const CSV_30 = path.join(OUT_DIR, 'desktop-ram-cms-import-30.csv');
const CSV_IMPORT = path.join(OUT_DIR, 'desktop-ram-cms-import.csv');
const XLSX_30 = path.join(OUT_DIR, 'desktop-ram-cms-import-30.xlsx');

type ListedRam = {
  name: string;
  url: string;
  price: number | null;
  compareAtPrice: number | null;
};

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
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function csvEscape(v: string): string {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

async function main() {
  if (!fs.existsSync(LIST_JSON)) {
    throw new Error(`Missing ${LIST_JSON}. Run scrape first.`);
  }
  if (!fs.existsSync(CSV_30)) {
    throw new Error(`Missing ${CSV_30}`);
  }

  const list = JSON.parse(fs.readFileSync(LIST_JSON, 'utf8')) as ListedRam[];
  const byUrl = new Map<string, ListedRam>();
  const byName = new Map<string, ListedRam>();
  for (const item of list) {
    byUrl.set(item.url.toLowerCase().replace(/\/$/, ''), item);
    byName.set(item.name.trim().toLowerCase(), item);
  }

  const raw = fs.readFileSync(CSV_30, 'utf8');
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  const headers = parseCsvLine(lines[0]!);
  const priceIdx = headers.indexOf('price');
  const compareIdx = headers.indexOf('compareAtPrice');
  const urlIdx = headers.indexOf('source_list_url');
  const nameIdx = headers.indexOf('name');
  if (priceIdx < 0 || urlIdx < 0 || nameIdx < 0) {
    throw new Error('CSV missing price / source_list_url / name columns');
  }

  let filled = 0;
  let missing: string[] = [];
  const rows: string[][] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]!);
    while (cols.length < headers.length) cols.push('');
    const url = (cols[urlIdx] || '').toLowerCase().replace(/\/$/, '');
    const name = (cols[nameIdx] || '').trim().toLowerCase();
    const match = byUrl.get(url) || byName.get(name);
    if (match?.price != null) {
      cols[priceIdx] = String(match.price);
      if (compareIdx >= 0) {
        cols[compareIdx] = match.compareAtPrice != null ? String(match.compareAtPrice) : '';
      }
      filled++;
      console.log(`OK  ${cols[nameIdx]} → ৳${match.price}${match.compareAtPrice ? ` (was ৳${match.compareAtPrice})` : ''}`);
    } else {
      missing.push(cols[nameIdx] || `row ${i}`);
      console.warn(`MISS ${cols[nameIdx]} — no listing price (OOS or not found)`);
    }
    rows.push(cols);
  }

  const csvBody = [
    headers.join(','),
    ...rows.map((cols) => cols.map(csvEscape).join(',')),
  ].join('\n');
  fs.writeFileSync(CSV_30, csvBody, 'utf8');
  fs.writeFileSync(CSV_IMPORT, csvBody, 'utf8');

  const wb = new ExcelJS.Workbook();
  wb.creator = 'LogicBay BD';
  const sheet = wb.addWorksheet('Desktop RAM 30', { views: [{ state: 'frozen', ySplit: 1 }] });
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
      h === 'name' ? 55 : h === 'source_list_url' || h === 'slug' ? 40 : h === 'shortDescription' ? 40 : 16;
  });
  const help = wb.addWorksheet('Notes');
  [
    ['30 Desktop RAM batch for LogicBay BD CMS'],
    ['Prices filled from Star Tech category listing cards (price-new / price-old).'],
    ['compareAtPrice = Star Tech strikethrough (price-old) when present.'],
    ['Do NOT copy Star Tech PDP body text or images.'],
    ['Import only after confirming prices: npx tsx scripts/import-desktop-ram-csv.ts'],
  ].forEach((r) => help.addRow(r));
  await wb.xlsx.writeFile(XLSX_30);

  console.log(`\nFilled ${filled}/${rows.length} prices`);
  if (missing.length) {
    console.log('Still missing price:');
    missing.forEach((n) => console.log(`  - ${n}`));
  }
  console.log(`Updated:\n  ${CSV_30}\n  ${CSV_IMPORT}\n  ${XLSX_30}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
