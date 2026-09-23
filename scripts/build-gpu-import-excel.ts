/**
 * Build GPU CMS import CSV/XLSX from Star Tech listing JSON.
 * Uses listing titles + card bullets (not PDP body copy).
 *
 * Run: npx tsx scripts/build-gpu-import-excel.ts
 */
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { GPU_MANUFACTURER_BRANDS, GPU_MEMORY_SIZE_OPTIONS } from '../src/lib/gpuFilterOptions';

const OUT_DIR = path.join(process.cwd(), 'docs/imports');
const LIST_JSON = path.join(OUT_DIR, 'startech-gpu-list.json');
const OUT_CSV = path.join(OUT_DIR, 'gpu-cms-import.csv');
const OUT_XLSX = path.join(OUT_DIR, 'gpu-cms-import.xlsx');

type ListedGpu = {
  name: string;
  url: string;
  price: number | null;
  compareAtPrice: number | null;
  bullets: string[];
  listingImageUrl: string | null;
};

const HEADERS = [
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
  'memory_size',
  'memory_type',
  'engine_clock',
  'memory_clock',
  'resolution',
  'gpu_chipset',
  'chipset_series',
  'pci_express',
  'port_types',
  'warranty',
] as const;

function csvEscape(v: string): string {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function skuFromName(name: string, brand: string, index: number): string {
  const brandPart = (brand || 'GPU').toUpperCase().replace(/[^A-Z0-9]/g, '');
  let core = name
    .replace(/graphics?\s*card|geforce|radeon|nvidia|amd|intel/gi, ' ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase()
    .slice(0, 36);
  if (brandPart && core.startsWith(`${brandPart}-`)) core = core.slice(brandPart.length + 1);
  return `GPU-${brandPart}-${core || index}`.replace(/-+/g, '-');
}

function ensureUnique(used: string[], value: string, index: number): string {
  let next = value;
  let i = 2;
  while (used.includes(next)) {
    next = `${value}-${i++}`.slice(0, 90);
  }
  used.push(next);
  return next || `gpu-${index}`;
}

function guessBrandSlug(name: string): string {
  const n = name.toLowerCase();
  const ordered = [...GPU_MANUFACTURER_BRANDS]
    .filter((b) => b.value !== 'nvidia')
    .sort((a, b) => b.label.length - a.label.length);
  for (const b of ordered) {
    if (n.includes(b.label.toLowerCase()) || n.includes(` ${b.value} `) || n.startsWith(`${b.value} `)) {
      return b.value;
    }
    if (n.includes(b.value) && b.value.length > 3) return b.value;
  }
  if (n.includes('gigabyte') || n.startsWith('gv-')) return 'gigabyte';
  if (n.includes('colorful') || n.includes('battle-ax')) return 'colorful';
  if (n.includes('abit')) return 'abit';
  if (n.includes('afox')) return 'afox';
  return '';
}

function guessChipset(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('intel') || n.includes('arc ')) return 'Intel Arc';
  if (n.includes('radeon') || n.includes('rx ') || n.includes('amd')) return 'AMD Radeon';
  return 'NVIDIA GeForce';
}

function guessSeries(name: string): string {
  const n = name.toLowerCase();
  if (/\brtx\s*50\d{2}|\brtx\s*5\d{3}/i.test(n)) return 'RTX 5000';
  if (/\brtx\s*40\d{2}|\brtx\s*4\d{3}/i.test(n)) return 'RTX 4000';
  if (/\brtx\s*30\d{2}|\brtx\s*3\d{3}/i.test(n)) return 'RTX 3000';
  if (/\bgtx\s*16\d{2}/i.test(n)) return 'GTX 1600';
  if (/\bgt\s*10\d{2}/i.test(n)) return 'GT 1000';
  if (/\bgt\s*[67]\d{2}/i.test(n)) return 'GT 700';
  if (/\brx\s*9\d{3}/i.test(n)) return 'RX 9000';
  if (/\brx\s*8\d{3}/i.test(n)) return 'RX 8000';
  if (/\brx\s*7\d{3}/i.test(n)) return 'RX 7000';
  if (/\brx\s*6\d{3}/i.test(n)) return 'RX 6000';
  if (/\brx\s*5\d{2}\b|\br7\s*350|\brx\s*580|\brx\s*550/i.test(n)) return 'RX 500';
  if (/\barc\s*a/i.test(n)) return 'Arc A';
  return '';
}

function categoryFromChipset(chipset: string): string {
  if (chipset === 'AMD Radeon') return 'amd-gpu';
  if (chipset === 'NVIDIA GeForce') return 'nvidia';
  return 'graphics-card';
}

function normalizeMemorySize(raw: string): string {
  const compact = raw.replace(/\s+/g, '').toUpperCase();
  if (/1024MB/.test(compact)) return '1GB';
  if (/2048MB/.test(compact)) return '2GB';
  if (/3072MB/.test(compact)) return '3GB';
  if (/4096MB/.test(compact)) return '4GB';
  if (/6144MB/.test(compact)) return '6GB';
  if (/8192MB/.test(compact)) return '8GB';
  const gb = compact.match(/(\d+)\s*GB/);
  if (gb) {
    const label = `${gb[1]}GB`;
    if (GPU_MEMORY_SIZE_OPTIONS.some((o) => o.value === label) || label === '3GB') return label;
    return label;
  }
  return '';
}

function guessMemoryType(text: string): string {
  const t = text.toUpperCase();
  if (t.includes('GDDR7')) return 'GDDR7';
  if (t.includes('GDDR6X')) return 'GDDR6X';
  if (t.includes('GDDR6')) return 'GDDR6';
  if (t.includes('GDDR5')) return 'GDDR5';
  if (t.includes('GDDR4')) return 'GDDR4';
  if (t.includes('GDDR3') || /\bDDR3\b/.test(t)) return 'GDDR3';
  return '';
}

function parseBullets(name: string, bullets: string[]) {
  const blob = `${name}\n${bullets.join('\n')}`;
  let memory_size = '';
  let memory_type = guessMemoryType(blob);
  let engine_clock = '';
  let memory_clock = '';
  let resolution = '';
  let port_types = '';

  for (const bullet of bullets) {
    const video = /video\s*memory\s*:\s*(.+)/i.exec(bullet);
    if (video) {
      memory_size = memory_size || normalizeMemorySize(video[1]!);
      memory_type = memory_type || guessMemoryType(video[1]!);
    }
    const engine = /engine\s*clock\s*:\s*([^,]+)/i.exec(bullet);
    if (engine) engine_clock = engine[1]!.trim();
    const memClock = /memory\s*clock\s*:\s*(.+)/i.exec(bullet);
    if (memClock) memory_clock = memClock[1]!.trim();
    const res = /resolution\s*:\s*(.+)/i.exec(bullet);
    if (res) resolution = res[1]!.replace(/\s+/g, ' ').trim();
    const iface = /interface\s*:\s*(.+)/i.exec(bullet);
    if (iface) port_types = iface[1]!.replace(/\s+/g, ' ').trim();
  }

  if (!memory_size) memory_size = normalizeMemorySize(name);
  if (!memory_type) memory_type = guessMemoryType(name);

  return { memory_size, memory_type, engine_clock, memory_clock, resolution, port_types };
}

function buildShortDescription(parsed: ReturnType<typeof parseBullets>, bullets: string[]): string {
  const fromBullets = bullets.slice(0, 4).map((b) => b.replace(/\s+/g, ' ').trim()).filter(Boolean);
  if (fromBullets.length) return fromBullets.join(' • ');
  const lines: string[] = [];
  const mem = [parsed.memory_size, parsed.memory_type].filter(Boolean).join(' ');
  if (mem) lines.push(`Video Memory: ${mem}`);
  if (parsed.engine_clock) {
    lines.push(
      parsed.memory_clock
        ? `Engine Clock: ${parsed.engine_clock}, Memory Clock: ${parsed.memory_clock}`
        : `Engine Clock: ${parsed.engine_clock}`
    );
  }
  if (parsed.resolution) lines.push(`Resolution: ${parsed.resolution}`);
  if (parsed.port_types) lines.push(`Interface: ${parsed.port_types}`);
  return lines.join(' • ');
}

async function main() {
  if (!fs.existsSync(LIST_JSON)) {
    throw new Error(`Missing ${LIST_JSON}. Run: npx tsx scripts/scrape-startech-gpu-list.ts`);
  }
  const list = JSON.parse(fs.readFileSync(LIST_JSON, 'utf8')) as ListedGpu[];
  const usedSlugs: string[] = [];
  const usedSkus: string[] = [];

  const rows = list.map((item, i) => {
    const brandSlug = guessBrandSlug(item.name);
    const gpu_chipset = guessChipset(item.name);
    const chipset_series = guessSeries(item.name);
    const parsed = parseBullets(item.name, item.bullets || []);
    const slug = ensureUnique(usedSlugs, slugify(item.name) || `gpu-${i + 1}`, i + 1);
    const sku = ensureUnique(usedSkus, skuFromName(item.name, brandSlug, i + 1), i + 1);
    const shortDescription = buildShortDescription(parsed, item.bullets || []);

    return {
      stock_decision: item.price != null ? 'STOCK' : 'REVIEW',
      name: item.name,
      slug,
      sku,
      brand_slug: brandSlug,
      category_slug: categoryFromChipset(gpu_chipset),
      shortDescription,
      description: '',
      price: item.price != null ? String(item.price) : '',
      compareAtPrice: item.compareAtPrice != null ? String(item.compareAtPrice) : '',
      costPrice: '',
      stockStatus: 'IN_STOCK',
      stockQuantity: '0',
      lowStockAlert: '5',
      isFeatured: 'false',
      isActive: 'true',
      image_url: `/uploads/gpus/${slug}.jpg`,
      image_alt: item.name,
      metaTitle: `Buy ${item.name} in Bangladesh | LogicBay BD`.slice(0, 120),
      metaDescription: `${item.name}. Check price and warranty at LogicBay BD.`.slice(0, 320),
      metaKeywords: `graphics card, ${brandSlug}, ${gpu_chipset}, ${parsed.memory_size}`.toLowerCase(),
      source_list_url: item.url,
      memory_size: parsed.memory_size,
      memory_type: parsed.memory_type,
      engine_clock: parsed.engine_clock,
      memory_clock: parsed.memory_clock,
      resolution: parsed.resolution,
      gpu_chipset,
      chipset_series,
      pci_express: '',
      port_types: parsed.port_types,
      warranty: '3 Years',
    } as Record<string, string>;
  });

  const csvBody = [
    HEADERS.join(','),
    ...rows.map((row) => HEADERS.map((h) => csvEscape(row[h] ?? '')).join(',')),
  ].join('\n');
  fs.writeFileSync(OUT_CSV, csvBody, 'utf8');

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet('Graphics Cards', { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.addRow([...HEADERS]);
  sheet.getRow(1).font = { bold: true };
  for (const row of rows) sheet.addRow(HEADERS.map((h) => row[h] ?? ''));
  await wb.xlsx.writeFile(OUT_XLSX);

  const stock = rows.filter((r) => r.stock_decision === 'STOCK').length;
  console.log(`Wrote ${rows.length} GPU rows (${stock} STOCK with price)`);
  console.log(`  ${OUT_CSV}`);
  console.log(`  ${OUT_XLSX}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
