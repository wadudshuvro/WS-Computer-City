/**
 * Build motherboard CMS Excel + CSV import files from the Star Tech model checklist.
 *
 * Inputs:
 *   docs/imports/startech-motherboard-list.json  (from scrape-startech-motherboard-list.ts)
 *
 * Outputs:
 *   docs/imports/motherboard-cms-import.xlsx
 *   docs/imports/motherboard-cms-import.csv
 *
 * Run: npx tsx scripts/build-motherboard-import-excel.ts
 *
 * Spec / description / price / image columns are left for the agent to fill from
 * manufacturer datasheets + your shop pricing (do not paste Star Tech PDP copy).
 */
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

type ListedMb = { name: string; url: string; page: number };

const OUT_DIR = path.join(process.cwd(), 'docs/imports');
const LIST_JSON = path.join(OUT_DIR, 'startech-motherboard-list.json');
const OUT_XLSX = path.join(OUT_DIR, 'motherboard-cms-import.xlsx');
const OUT_CSV = path.join(OUT_DIR, 'motherboard-cms-import.csv');

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

/** CMS motherboard brands are maker+platform: msi-intel, asus-amd, … */
function guessBrandSlug(name: string, processorType: 'Intel' | 'AMD' | ''): string {
  const maker = guessMaker(name);
  if (!maker) return '';
  if (maker === 'xenthra' || maker === 'biostar' || maker === 'nzxt') return maker;
  if (processorType === 'Intel') return `${maker}-intel`;
  if (processorType === 'AMD') return `${maker}-amd`;
  return maker;
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

function guessFormFactor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('mini itx') || n.includes('mini-itx') || n.includes('itx')) return 'Mini ITX';
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
  // Avoid MB-XENTHRA-XENTHRA-...
  if (brandPart && core.startsWith(`${brandPart}-`)) {
    core = core.slice(brandPart.length + 1);
  }
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
  const formFactor = guessFormFactor(item.name);
  const memoryType = guessMemoryType(item.name);
  const shortDescription = `${item.name} - fill your own short pitch before publish.`.slice(0, 500);

  const row: Record<string, string> = {
    stock_decision: 'REVIEW',
    name: item.name,
    slug,
    sku,
    brand_slug: brandSlug,
    category_slug: categorySlug,
    processor_type: processorType,
    shortDescription,
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
    memory_type: memoryType,
    storage_slots: '',
    graphics: '',
    audio: '',
    ports_connectors: '',
    special_features: '',
    form_factor: formFactor,
    expansion_slots: '',
    warranty: '3 Years',
  };
  return row;
}

async function main() {
  if (!fs.existsSync(LIST_JSON)) {
    throw new Error(`Missing ${LIST_JSON}. Run: npx tsx scripts/scrape-startech-motherboard-list.ts`);
  }

  const list = JSON.parse(fs.readFileSync(LIST_JSON, 'utf8')) as ListedMb[];
  const usedSlugs: string[] = [];
  const usedSkus: string[] = [];
  const rows = list.map((item, i) => buildRow(item, i + 1, usedSlugs, usedSkus));

  // CSV
  const csvLines = [
    HEADERS.join(','),
    ...rows.map((row) => HEADERS.map((h) => csvEscape(row[h] ?? '')).join(',')),
  ];
  fs.writeFileSync(OUT_CSV, csvLines.join('\n'), 'utf8');

  // Excel
  const wb = new ExcelJS.Workbook();
  wb.creator = 'LogicBay BD';
  wb.created = new Date();

  const sheet = wb.addWorksheet('Motherboard Import', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  sheet.addRow([...HEADERS]);
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFDBEAFE' },
  };

  for (const row of rows) {
    sheet.addRow(HEADERS.map((h) => row[h] ?? ''));
  }

  // Reasonable column widths
  const widthFor: Record<string, number> = {
    stock_decision: 14,
    name: 55,
    slug: 40,
    sku: 28,
    brand_slug: 12,
    category_slug: 18,
    processor_type: 12,
    shortDescription: 40,
    description: 40,
    price: 22,
    source_list_url: 45,
    supported_cpu: 35,
    ports_connectors: 30,
    expansion_slots: 30,
    warranty: 12,
  };
  HEADERS.forEach((h, i) => {
    sheet.getColumn(i + 1).width = widthFor[h] ?? 16;
  });

  // Instructions sheet
  const help = wb.addWorksheet('Agent Instructions');
  const helpLines = [
    ['Motherboard CMS Excel — agent fill + import'],
    [''],
    ['1. Set stock_decision = STOCK for rows you actually sell; SKIP for the rest.'],
    ['2. Fill price with your BDT price (replace REPLACE_WITH_YOUR_PRICE).'],
    ['3. Fill ALL motherboard CMS specification columns from manufacturer datasheets.'],
    ['4. warranty is required (default 3 Years — adjust per product).'],
    ['5. Use your own image under /uploads/motherboards/… (do not hotlink competitor CDNs).'],
    ['6. Write your own shortDescription / description (do not paste Star Tech PDP copy).'],
    ['7. brand_slug must exist in CMS (msi-intel, msi-amd, asus-intel, asus-amd, asrock-*, gigabyte-*, colorful-*).'],
    ['8. category_slug: intel-motherboard | amd-motherboard | motherboard'],
    ['9. After fill: npx tsx scripts/import-motherboard-csv.ts'],
    ['10. Import only processes stock_decision=STOCK rows with a numeric price.'],
    ['11. Do NOT copy Star Tech product descriptions, prices, or images into this sheet.'],
    [''],
    ['Spec keys:'],
    ...SPEC_KEYS.map((k) => [k]),
  ];
  helpLines.forEach((line) => help.addRow(line));
  help.getColumn(1).width = 100;

  await wb.xlsx.writeFile(OUT_XLSX);
  console.log(`Wrote ${rows.length} rows:`);
  console.log(`  ${OUT_XLSX}`);
  console.log(`  ${OUT_CSV}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
