/**
 * Build a 30-row motherboard Excel for the first CMS batch.
 * Run: npx tsx scripts/build-motherboard-import-excel-30.ts
 */
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

type ListedMb = { name: string; url: string; page: number };

const OUT_DIR = path.join(process.cwd(), 'docs/imports');
const LIST_JSON = path.join(OUT_DIR, 'startech-motherboard-list.json');
const OUT_XLSX = path.join(OUT_DIR, 'motherboard-cms-import-30.xlsx');
const OUT_CSV = path.join(OUT_DIR, 'motherboard-cms-import-30.csv');

const SPEC_KEYS = [
  'supported_cpu',
  'chipset',
  'memory_size',
  'memory_type',
  'storage_slots',
  'graphics',
  'audio',
  'ports_connectors',
  'special_features',
  'form_factor',
  'expansion_slots',
  'warranty',
] as const;

const BASE_HEADERS = [
  'stock_decision',
  'name',
  'slug',
  'sku',
  'brand_slug',
  'category_slug',
  'processor_type',
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

/** Prefer current mainstream models across brands / Intel+AMD. Exact name match from listing. */
const PREFERRED_NAMES = [
  'MSI PRO H610M-E DDR4 mATX Motherboard',
  'MSI PRO H610M-G DDR4 Micro-ATX Motherboard',
  'MSI PRO H610M-G DDR5 mATX Motherboard',
  'MSI PRO A620M-E AMD AM5 mATX Motherboard',
  'MSI A520M-A Pro AM4 AMD Micro-ATX Motherboard',
  'MSI B550M-A PRO DDR4 AMD AM4 Micro ATX Motherboard',
  'Asus PRIME A520M-R AM4 micro ATX Motherboard',
  'Asus Prime A520M-K AM4 Micro-ATX AMD Motherboard',
  'ASUS PRIME H610M-F D4 R2.0 DDR4 LGA1700 mATX Motherboard',
  'ASUS PRIME H610M-R D4 DDR4 LGA1700 mATX Motherboard',
  'ASUS PRIME H610M-R DDR5 LGA1700 mATX Motherboard',
  'Asus PRIME A520M-A II AM4 micro ATX Motherboard',
  'GIGABYTE A520M K V2 AM4 Micro ATX Motherboard',
  'GIGABYTE B450M K AMD AM4 Micro ATX Motherboard',
  'GIGABYTE H610M K DDR4 Micro ATX Motherboard',
  'GIGABYTE H610M H DDR4 Micro ATX Motherboard',
  'GIGABYTE H610M K DDR5 Micro ATX Motherboard',
  'GIGABYTE A620M H AM5 Micro-ATX Motherboard',
  'ASRock A520M-HVS AMD AM4 Micro ATX Motherboard',
  'ASROCK H610M-H2/M.2 14th, 13th and 12th Gen mATX DDR5 Motherboard',
  'Colorful BATTLE-AX H610M-E WIFI V20 mATX Motherboard',
  'Gigabyte A520M DS3H V2 Micro-ATX DDR4 AMD AM4 Motherboard',
  'Gigabyte B450M DS3H V3 AMD AM4 Micro ATX Motherboard',
  'MSI PRO H610M-S DDR4 II mATX Motherboard',
  'ASUS PRIME H510M-K R2.0 10th and 11th Gen Micro-ATX Motherboard',
  'GIGABYTE H610M H V3 DDR4 Micro ATX Motherboard',
  'GIGABYTE H610M H DDR5 mATX Motherboard',
  'MSI PRO H610M-S DDR4 m-ATX Motherboard',
  'MSI PRO H610M-E mATX Motherboard',
  'Gigabyte H410M H 10th Gen Micro ATX Motherboard',
];

function guessMaker(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('gigabyte') || n.startsWith('ga-')) return 'gigabyte';
  if (n.includes('asrock')) return 'asrock';
  if (n.includes('asus') || n.includes('rog ') || n.includes('tuf ')) return 'asus';
  if (/\bprime\b/i.test(name) && !n.includes('msi')) return 'asus';
  if (n.includes('msi')) return 'msi';
  if (n.includes('colorful') || n.includes('battle-ax')) return 'colorful';
  if (n.includes('xenthra')) return 'xenthra';
  if (n.includes('biostar')) return 'biostar';
  if (n.includes('nzxt')) return 'nzxt';
  return '';
}

function guessProcessorType(name: string): 'Intel' | 'AMD' | '' {
  const n = name.toLowerCase();
  if (/\bam[45]\b|\bryzen\b|\bamd\b|\btrx\b|\btr5\b/.test(n)) return 'AMD';
  if (/\ba[456][25]0|\bb[456][25]0|\bx[567]70|\bx870|\ba620/.test(n)) return 'AMD';
  if (/\blga\b|\bintel\b|\b14th\b|\b13th\b|\b12th\b|\b11th\b|\b10th\b|\b9th\b|\b8th\b|\b7th\b|\b6th\b|\b4th\b/.test(n))
    return 'Intel';
  if (/\bh[45678]\d{2}|\bz[679]\d{2}|\bb[678]\d{2}|\bw[678]\d{2}/.test(n)) return 'Intel';
  return '';
}

function guessBrandSlug(name: string, processorType: 'Intel' | 'AMD' | ''): string {
  const maker = guessMaker(name);
  if (!maker) return '';
  if (maker === 'xenthra' || maker === 'biostar' || maker === 'nzxt') return maker;
  if (processorType === 'Intel') return `${maker}-intel`;
  if (processorType === 'AMD') return `${maker}-amd`;
  return maker;
}

function guessFormFactor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('mini itx') || n.includes('mini-itx') || /\bitx\b/.test(n)) return 'Mini ITX';
  if (n.includes('e-atx') || n.includes('extended atx')) return 'Extended ATX';
  if (n.includes('matx') || n.includes('m-atx') || n.includes('micro atx') || n.includes('micro-atx'))
    return 'Micro ATX';
  if (/\batx\b/.test(n)) return 'ATX';
  return '';
}

function guessMemoryType(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('ddr5')) return 'DDR5';
  if (n.includes('ddr3')) return 'DDR3';
  if (n.includes('ddr4')) return 'DDR4';
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
  const brandPart = (brand || 'MB').toUpperCase().replace(/[^A-Z0-9]/g, '');
  let core = name
    .replace(/motherboard/gi, '')
    .replace(/micro[-\s]?atx|m-?atx|mini[-\s]?itx|extended atx|\batx\b/gi, '')
    .replace(/amd|intel|ddr[345]|wifi\d*|wifi/gi, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase();
  if (brandPart && core.startsWith(`${brandPart}-`)) core = core.slice(brandPart.length + 1);
  core = core.slice(0, 36);
  return `MB-${brandPart}-${core || index}`.replace(/-+/g, '-');
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

function pickThirty(list: ListedMb[]): ListedMb[] {
  const byName = new Map(list.map((x) => [x.name.toLowerCase(), x]));
  const picked: ListedMb[] = [];
  const seen = new Set<string>();

  for (const preferred of PREFERRED_NAMES) {
    const hit = byName.get(preferred.toLowerCase());
    if (!hit) continue;
    const key = hit.url.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(hit);
    if (picked.length >= 30) return picked;
  }

  // Fill remaining with a brand-balanced scan of the full list
  const brandBuckets: Record<string, ListedMb[]> = {};
  for (const item of list) {
    if (seen.has(item.url.toLowerCase())) continue;
    const maker = guessMaker(item.name) || 'other';
    (brandBuckets[maker] ||= []).push(item);
  }
  const makers = Object.keys(brandBuckets);
  let i = 0;
  while (picked.length < 30 && makers.length) {
    const maker = makers[i % makers.length]!;
    const bucket = brandBuckets[maker]!;
    const next = bucket.shift();
    if (!next) {
      makers.splice(i % makers.length, 1);
      continue;
    }
    seen.add(next.url.toLowerCase());
    picked.push(next);
    i++;
  }
  return picked.slice(0, 30);
}

function buildRow(item: ListedMb, index: number, usedSlugs: string[], usedSkus: string[]) {
  const processorType = guessProcessorType(item.name);
  const maker = guessMaker(item.name);
  const brandSlug = guessBrandSlug(item.name, processorType);
  const categorySlug =
    processorType === 'AMD'
      ? 'amd-motherboard'
      : processorType === 'Intel'
        ? 'intel-motherboard'
        : 'motherboard';
  const slug = ensureUnique(usedSlugs, slugify(item.name) || `motherboard-${index}`, index);
  const sku = ensureUnique(usedSkus, skuFromName(item.name, maker, index), index);

  return {
    stock_decision: 'STOCK',
    name: item.name,
    slug,
    sku,
    brand_slug: brandSlug,
    category_slug: categorySlug,
    processor_type: processorType,
    shortDescription: `${item.name} - fill your own short pitch before publish.`.slice(0, 500),
    description: '',
    price: 'REPLACE_WITH_YOUR_PRICE',
    compareAtPrice: '',
    costPrice: '',
    stockStatus: 'IN_STOCK',
    stockQuantity: '0',
    lowStockAlert: '5',
    isFeatured: 'false',
    isActive: 'true',
    image_url: '/uploads/motherboards/placeholder.jpg',
    image_alt: item.name,
    metaTitle: `Buy ${item.name} in Bangladesh | LogicBay BD`.slice(0, 120),
    metaDescription: `${item.name}. Check price and warranty at LogicBay BD.`.slice(0, 320),
    metaKeywords: `motherboard ${maker} ${item.name}`.toLowerCase().slice(0, 200),
    source_list_url: item.url,
    supported_cpu: '',
    chipset: '',
    memory_size: '',
    memory_type: guessMemoryType(item.name),
    storage_slots: '',
    graphics: '',
    audio: '',
    ports_connectors: '',
    special_features: '',
    form_factor: guessFormFactor(item.name),
    expansion_slots: '',
    warranty: '3 Years',
  } as Record<string, string>;
}

async function main() {
  const list = JSON.parse(fs.readFileSync(LIST_JSON, 'utf8')) as ListedMb[];
  const selected = pickThirty(list);
  if (selected.length !== 30) {
    throw new Error(`Expected 30 products, got ${selected.length}`);
  }

  const usedSlugs: string[] = [];
  const usedSkus: string[] = [];
  const rows = selected.map((item, i) => buildRow(item, i + 1, usedSlugs, usedSkus));

  fs.writeFileSync(
    OUT_CSV,
    [HEADERS.join(','), ...rows.map((row) => HEADERS.map((h) => csvEscape(row[h] ?? '')).join(','))].join(
      '\n'
    ),
    'utf8'
  );

  const wb = new ExcelJS.Workbook();
  wb.creator = 'LogicBay BD';
  const sheet = wb.addWorksheet('Motherboard 30', { views: [{ state: 'frozen', ySplit: 1 }] });
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

  const help = wb.addWorksheet('Notes');
  [
    ['30 motherboard batch for LogicBay BD CMS'],
    ['stock_decision is already STOCK for all 30 rows.'],
    ['Fill price + supported_cpu + chipset (+ other specs) before import.'],
    ['Then: copy/overwrite docs/imports/motherboard-cms-import.csv from this CSV, or point import at this file.'],
    ['Import: npx tsx scripts/import-motherboard-csv.ts  (expects motherboard-cms-import.csv by default)'],
    [''],
    ...selected.map((s, i) => [`${i + 1}. ${s.name}`]),
  ].forEach((line) => help.addRow(line));
  help.getColumn(1).width = 90;

  await wb.xlsx.writeFile(OUT_XLSX);

  console.log(`Wrote ${rows.length} motherboards:`);
  rows.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${r.name}`));
  console.log(`\n  ${OUT_XLSX}`);
  console.log(`  ${OUT_CSV}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
