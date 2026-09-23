/**
 * Import GPUs from docs/imports/gpu-cms-import.csv
 * STOCK rows with numeric price + warranty + gpu_chipset.
 *
 * Run: npx tsx scripts/import-gpu-csv.ts
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { GPU_MANUFACTURER_BRANDS } from '../src/lib/gpuFilterOptions';
import { GPU_SPEC_DEFINITIONS } from '../src/lib/gpuSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const SPEC_KEYS = [
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

const BRAND_LABELS: Record<string, string> = Object.fromEntries(
  GPU_MANUFACTURER_BRANDS.map((b) => [b.value, b.label])
);

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

function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/,/g, '').replace(/৳/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function ensureGpuSpecs(categoryId: string) {
  for (const spec of GPU_SPEC_DEFINITIONS) {
    await prisma.specificationDefinition.upsert({
      where: { categoryId_key: { categoryId, key: spec.key } },
      update: {
        name: spec.name,
        dataType: spec.dataType,
        isRequired: Boolean(spec.isRequired),
        isFilterable: Boolean(spec.isFilterable),
        order: spec.order,
      },
      create: {
        categoryId,
        key: spec.key,
        name: spec.name,
        dataType: spec.dataType,
        isRequired: Boolean(spec.isRequired),
        isFilterable: Boolean(spec.isFilterable),
        order: spec.order,
      },
    });
  }
}

async function ensureBrand(slug: string) {
  const existing = await prisma.brand.findUnique({ where: { slug } });
  if (existing) return existing;
  const name =
    BRAND_LABELS[slug] ||
    slug
      .split('-')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  return prisma.brand.create({
    data: { name, slug, isActive: true },
  });
}

async function main() {
  const csvPath = path.join(process.cwd(), 'docs/imports/gpu-cms-import.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Missing ${csvPath}. Run scrape + build-gpu-import-excel.ts first.`);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  console.log(`Parsed ${rows.length} CSV rows`);

  const graphicsCard = await prisma.category.findUnique({ where: { slug: 'graphics-card' } });
  const nvidia = await prisma.category.findUnique({ where: { slug: 'nvidia' } });
  const amdGpu = await prisma.category.findUnique({ where: { slug: 'amd-gpu' } });
  if (!graphicsCard) throw new Error('Category slug "graphics-card" not found');

  for (const cat of [graphicsCard, nvidia, amdGpu]) {
    if (cat) await ensureGpuSpecs(cat.id);
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    if ((row.stock_decision || '').trim().toUpperCase() !== 'STOCK') {
      skipped++;
      continue;
    }
    const sku = row.sku?.trim().toUpperCase();
    const slug = row.slug?.trim();
    const name = row.name?.trim();
    if (!sku || !slug || !name) {
      skipped++;
      continue;
    }
    const price = parsePrice(row.price);
    if (price == null) {
      console.warn(`SKIP ${sku}: no numeric price`);
      skipped++;
      continue;
    }

    const existing = await prisma.product.findFirst({
      where: { OR: [{ sku }, { slug }] },
      select: { id: true, sku: true, slug: true },
    });
    if (existing) {
      console.log(`SKIP existing ${existing.sku} / ${existing.slug}`);
      skipped++;
      continue;
    }

    const brandSlug = (row.brand_slug || '').trim().toLowerCase();
    if (!brandSlug) {
      console.warn(`SKIP ${sku}: missing brand_slug`);
      skipped++;
      continue;
    }
    const brand = await ensureBrand(brandSlug);

    const categorySlug = (row.category_slug || 'graphics-card').trim().toLowerCase();
    const category =
      categorySlug === 'nvidia'
        ? nvidia || graphicsCard
        : categorySlug === 'amd-gpu'
          ? amdGpu || graphicsCard
          : graphicsCard;

    const warranty = (row.warranty || '').trim() || '3 Years';
    const gpuChipset = (row.gpu_chipset || '').trim();
    if (!gpuChipset) {
      console.warn(`SKIP ${sku}: missing gpu_chipset`);
      skipped++;
      continue;
    }

    const specifications = SPEC_KEYS.filter((key) => String(row[key] || '').trim() !== '').map(
      (key) => ({ key, value: String(row[key]).trim() })
    );
    if (!specifications.some((s) => s.key === 'warranty')) {
      specifications.push({ key: 'warranty', value: warranty });
    }

    try {
      const product = await ProductService.create({
        name,
        slug,
        sku,
        shortDescription: row.shortDescription?.trim() || null,
        description: row.description?.trim() || null,
        price,
        compareAtPrice: parsePrice(row.compareAtPrice),
        costPrice: parsePrice(row.costPrice),
        stockStatus: (row.stockStatus as 'IN_STOCK') || 'IN_STOCK',
        stockQuantity: parseInt(row.stockQuantity || '0', 10) || 0,
        lowStockAlert: parseInt(row.lowStockAlert || '5', 10) || 5,
        categoryId: category.id,
        brandId: brand.id,
        metaTitle: row.metaTitle?.trim() || null,
        metaDescription: row.metaDescription?.trim() || null,
        metaKeywords: row.metaKeywords?.trim() || null,
        isFeatured: row.isFeatured === 'true',
        isActive: row.isActive !== 'false',
        images: [
          {
            url: row.image_url?.trim() || `/uploads/gpus/${slug}.jpg`,
            alt: row.image_alt?.trim() || name,
            order: 0,
            isPrimary: true,
          },
        ],
        specifications,
      } as never);

      console.log(`CREATED ${sku} → ${product?.slug} @ ৳${price} (${category.slug} / ${brand.slug})`);
      created++;
    } catch (err) {
      failed++;
      console.error(`FAIL ${sku}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone. created=${created} skipped=${skipped} failed=${failed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
