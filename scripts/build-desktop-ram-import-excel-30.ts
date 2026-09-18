/**
 * Build a 30-row Desktop RAM Excel/CSV for the first CMS batch.
 * Run: npx tsx scripts/build-desktop-ram-import-excel-30.ts
 */
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import {
  RAM_BRANDS,
  RAM_FEATURE_OPTIONS,
  RAM_SIZE_OPTIONS,
  RAM_SPEED_OPTIONS,
  RAM_TYPE_OPTIONS,
} from '../src/lib/ramSpecDefinitions';

type ListedRam = {
  name: string;
  url: string;
  page: number;
  price?: number | null;
  compareAtPrice?: number | null;
};

const OUT_DIR = path.join(process.cwd(), 'docs/imports');
const LIST_JSON = path.join(OUT_DIR, 'startech-desktop-ram-list.json');
const OUT_XLSX = path.join(OUT_DIR, 'desktop-ram-cms-import-30.xlsx');
const OUT_CSV = path.join(OUT_DIR, 'desktop-ram-cms-import-30.csv');
const OUT_IMPORT_CSV = path.join(OUT_DIR, 'desktop-ram-cms-import.csv');

const SPEC_KEYS = [
  'memory_type',
  'speed',
  'latency',
  'capacity',
  'voltage',
  'other_features',
  'color',
  'ram_features',
  'warranty',
] as const;

const BASE_HEADERS = [
  'stock_decision',
  'name',
  'slug',
  'sku',
  'brand_slug',
  'category_slug',
  'shortDescription',
  'description',
  'price',
  'compareAtPrice',
  'costPrice',
  'stockStatus',
  'stockQuantity',
  'lowStockAlert',
  'isFeatured',
  'isActive',
  'image_url',
  'image_alt',
  'metaTitle',
  'metaDescription',
  'metaKeywords',
  'source_list_url',
] as const;

const HEADERS = [...BASE_HEADERS, ...SPEC_KEYS] as const;

function guessBrandSlug(name: string): string {
  const n = name.toLowerCase();
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

function guessMemoryType(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('ddr5')) return 'DDR5';
  if (n.includes('ddr3')) return 'DDR3';
  if (n.includes('ddr4')) return 'DDR4';
  return '';
}

function guessSpeed(name: string): string {
  const m = name.match(/\b(1600|2400|2666|3200|3600|3733|4000|4600|4800|5200|5600|6000|6200|6400|6800|7000|7200|8000)\s*(mhz)?\b/i);
  if (!m) return '';
  const candidate = `${m[1]} MHz`;
  return RAM_SPEED_OPTIONS.includes(candidate) ? candidate : '';
}

function guessCapacity(name: string): string {
  // Prefer kit totals like 32GB (2x16), 16GB, 8GB
  const kit = name.match(/\b(\d+)\s*gb\s*\(\s*\d+\s*[x×]\s*\d+\s*gb\s*\)/i);
  if (kit) {
    const candidate = `${kit[1]}GB`;
    return RAM_SIZE_OPTIONS.includes(candidate) ? candidate : '';
  }
  const single = name.match(/\b(4|8|16|24|32|48|64|128)\s*gb\b/i);
  if (!single) return '';
  const candidate = `${single[1]}GB`;
  return RAM_SIZE_OPTIONS.includes(candidate) ? candidate : '';
}

function guessRamFeatures(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('argb')) return 'ARGB';
  if (/\brgb\b/.test(n)) return 'RGB RAM';
  if (n.includes('heatsink') || n.includes('heat sink') || n.includes('heat spreader')) return 'Heatsink';
  return '';
}

function guessColor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('white')) return 'White';
  if (n.includes('black')) return 'Black';
  if (n.includes('silver')) return 'Silver';
  if (n.includes('red')) return 'Red';
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
    .replace(/desktop|ram|memory/gi, ' ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase()
    .slice(0, 40);
  if (brandPart && core.startsWith(`${brandPart}-`)) core = core.slice(brandPart.length + 1);
  return `RAM-${brandPart}-${core || index}`.replace(/-+/g, '-');
}

function ensureUnique(values: string[], value: string, index: number): string {
  let out = value;
  if (!values.includes(out)) {
    values.push(out);
    return out;
  }
  let n = 2;
  while (values.includes(`${value}-${n}`)) n++;
  out = `${value}-${n}`;
  values.push(out);
  return out;
}

function csvEscape(v: string): string {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function pickThirty(list: ListedRam[]): ListedRam[] {
  const picked: ListedRam[] = [];
  const seen = new Set<string>();
  const brandBuckets: Record<string, ListedRam[]> = {};

  for (const item of list) {
    const brand = guessBrandSlug(item.name);
    if (!brand) continue; // only brands we can map to RAM_BRANDS
    (brandBuckets[brand] ||= []).push(item);
  }

  // Prefer well-known brands first for a balanced starter batch
  const preferredOrder = [
    'kingston',
    'corsair',
    'g-skill',
    'team',
    'adata',
    'crucial',
    'lexar',
    'patriot',
    'pny',
    'gigabyte',
    'apacer',
    'twinmos',
    'hiksemi',
    'netac',
    'geil',
    'ocpc',
    'aitc',
    'kimtigo',
    'colorful',
    'oscoo',
    'kingbank',
    'lexar',
    'pny',
  ];

  const makers = preferredOrder.filter((m) => (brandBuckets[m] || []).length > 0);
  // Append any remaining brands
  for (const m of Object.keys(brandBuckets)) {
    if (!makers.includes(m)) makers.push(m);
  }

  let i = 0;
  while (picked.length < 30 && makers.length) {
    const maker = makers[i % makers.length]!;
    const bucket = brandBuckets[maker]!;
    const next = bucket.shift();
    if (!next) {
      makers.splice(i % makers.length, 1);
      continue;
    }
    const key = next.url.toLowerCase();
    if (seen.has(key)) {
      i++;
      continue;
    }
    seen.add(key);
    picked.push(next);
    i++;
  }

  return picked.slice(0, 30);
}

function buildRow(item: ListedRam, index: number, usedSlugs: string[], usedSkus: string[]) {
  const brandSlug = guessBrandSlug(item.name);
  const memoryType = guessMemoryType(item.name);
  const speed = guessSpeed(item.name);
  const capacity = guessCapacity(item.name);
  const ramFeatures = guessRamFeatures(item.name);
  const color = guessColor(item.name);
  const slug = ensureUnique(usedSlugs, slugify(item.name) || `desktop-ram-${index}`, index);
  const sku = ensureUnique(usedSkus, skuFromName(item.name, brandSlug, index), index);

  return {
    stock_decision: 'STOCK',
    name: item.name,
    slug,
    sku,
    brand_slug: brandSlug,
    category_slug: 'desktop-ram',
    shortDescription: `${item.name} - fill your own short pitch before publish.`.slice(0, 500),
    description: '',
    price: item.price != null ? String(item.price) : 'REPLACE_WITH_YOUR_PRICE',
    compareAtPrice: item.compareAtPrice != null ? String(item.compareAtPrice) : '',
    costPrice: '',
    stockStatus: 'IN_STOCK',
    stockQuantity: '0',
    lowStockAlert: '5',
    isFeatured: 'false',
    isActive: 'true',
    image_url: `/uploads/ram/${slug}.jpg`,
    image_alt: item.name,
    metaTitle: `Buy ${item.name} in Bangladesh | LogicBay BD`.slice(0, 120),
    metaDescription: `${item.name}. Check price and warranty at LogicBay BD.`.slice(0, 320),
    metaKeywords: `desktop ram, ${brandSlug}, ${memoryType}, ${capacity}, ${speed}`.toLowerCase().slice(0, 200),
    source_list_url: item.url,
    memory_type: memoryType,
    speed,
    latency: '',
    capacity,
    voltage: '',
    other_features: '',
    color,
    ram_features: ramFeatures,
    warranty: 'Lifetime',
  } as Record<string, string>;
}

async function main() {
  if (!fs.existsSync(LIST_JSON)) {
    throw new Error(`Missing ${LIST_JSON}. Run: npx tsx scripts/scrape-startech-desktop-ram-list.ts`);
  }

  const list = JSON.parse(fs.readFileSync(LIST_JSON, 'utf8')) as ListedRam[];
  const selected = pickThirty(list);
  if (selected.length < 30) {
    console.warn(`Warning: only ${selected.length} products available (wanted 30).`);
  }

  const usedSlugs: string[] = [];
  const usedSkus: string[] = [];
  const rows = selected.map((item, i) => buildRow(item, i + 1, usedSlugs, usedSkus));

  const csvBody = [
    HEADERS.join(','),
    ...rows.map((row) => HEADERS.map((h) => csvEscape(row[h] ?? '')).join(',')),
  ].join('\n');

  fs.writeFileSync(OUT_CSV, csvBody, 'utf8');
  // Same content ready for import script default path (after prices filled)
  fs.writeFileSync(OUT_IMPORT_CSV, csvBody, 'utf8');

  const wb = new ExcelJS.Workbook();
  wb.creator = 'LogicBay BD';
  const sheet = wb.addWorksheet('Desktop RAM 30', { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.addRow([...HEADERS]);
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFDBEAFE' },
  };
  for (const row of rows) sheet.addRow(HEADERS.map((h) => row[h] ?? ''));
  HEADERS.forEach((h, i) => {
    sheet.getColumn(i + 1).width =
      h === 'name' ? 55 : h === 'source_list_url' || h === 'slug' ? 40 : h === 'shortDescription' ? 40 : 16;
  });

  // Data validation helpers
  const help = wb.addWorksheet('Notes');
  [
    ['30 Desktop RAM batch for LogicBay BD CMS'],
    ['stock_decision is STOCK for all rows in this batch.'],
    ['Prices come from Star Tech listing cards when available; confirm before import.'],
    ['Do NOT copy Star Tech PDP body text or product images.'],
    ['Import file: docs/imports/desktop-ram-cms-import.csv'],
    ['Import command: npx tsx scripts/import-desktop-ram-csv.ts'],
    [''],
    ['SELECT memory_type:', RAM_TYPE_OPTIONS.join(' | ')],
    ['SELECT speed:', RAM_SPEED_OPTIONS.join(' | ')],
    ['SELECT capacity:', RAM_SIZE_OPTIONS.join(' | ')],
    ['SELECT ram_features:', RAM_FEATURE_OPTIONS.join(' | ')],
    ['Brand slugs:', RAM_BRANDS.map((b) => b.slug).join(', ')],
    [''],
    ...selected.map((s, i) => [`${i + 1}. ${s.name}`]),
  ].forEach((line) => help.addRow(line));
  help.getColumn(1).width = 100;

  await wb.xlsx.writeFile(OUT_XLSX);

  console.log(`Wrote ${rows.length} desktop RAM products:`);
  rows.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${r.name}`));
  console.log(`\n  ${OUT_XLSX}`);
  console.log(`  ${OUT_CSV}`);
  console.log(`  ${OUT_IMPORT_CSV}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
