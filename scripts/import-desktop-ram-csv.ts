/**
 * Import Desktop RAM from docs/imports/desktop-ram-cms-import.csv
 *
 * Only rows with stock_decision=STOCK, numeric price, and required specs
 * (memory_type, speed, capacity, warranty) are imported.
 *
 * Run: npx tsx scripts/import-desktop-ram-csv.ts
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import {
  RAM_BRANDS,
  RAM_FEATURE_OPTIONS,
  RAM_SIZE_OPTIONS,
  RAM_SPEED_OPTIONS,
  RAM_SPEC_DEFINITIONS,
  RAM_TYPE_OPTIONS,
} from '../src/lib/ramSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

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

const BRAND_LABELS: Record<string, string> = Object.fromEntries(
  RAM_BRANDS.map((b) => [b.slug, b.label])
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
  if (!cleaned || cleaned.toUpperCase() === 'REPLACE_WITH_YOUR_PRICE') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function ensureRamSpecs(categoryId: string) {
  for (const spec of RAM_SPEC_DEFINITIONS) {
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
    data: {
      name,
      slug,
      isActive: true,
    },
  });
}

function validateSelect(value: string, allowed: string[], field: string, sku: string): string | null {
  const v = value.trim();
  if (!v) return `${field} empty`;
  if (!allowed.includes(v)) return `${field}="${v}" not in allowed list`;
  return null;
}

async function main() {
  const csvPath = path.join(process.cwd(), 'docs/imports/desktop-ram-cms-import.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(
      `Missing ${csvPath}. Run scrape + build-desktop-ram-import-excel-30.ts, fill prices, then save CSV here.`
    );
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  console.log(`Parsed ${rows.length} CSV rows`);

  const desktopRam = await prisma.category.findUnique({ where: { slug: 'desktop-ram' } });
  const ramParent = await prisma.category.findUnique({ where: { slug: 'ram' } });
  if (!desktopRam) throw new Error('Category slug "desktop-ram" not found');

  for (const cat of [desktopRam, ramParent]) {
    if (cat) await ensureRamSpecs(cat.id);
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const decision = (row.stock_decision || '').trim().toUpperCase();
    if (decision !== 'STOCK') {
      skipped++;
      continue;
    }

    const sku = row.sku?.trim().toUpperCase();
    const slug = row.slug?.trim();
    const name = row.name?.trim();
    if (!sku || !slug || !name) {
      console.warn('SKIP row missing sku/slug/name');
      skipped++;
      continue;
    }

    const price = parsePrice(row.price);
    if (price == null) {
      console.warn(`SKIP ${sku}: set a numeric price before import`);
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
    if (!BRAND_LABELS[brandSlug] && !RAM_BRANDS.some((b) => b.slug === brandSlug)) {
      console.warn(`SKIP ${sku}: brand_slug "${brandSlug}" not in RAM_BRANDS (will still create brand)`);
    }
    const brand = await ensureBrand(brandSlug);

    const categorySlug = (row.category_slug || 'desktop-ram').trim().toLowerCase();
    const category = categorySlug === 'ram' ? ramParent || desktopRam : desktopRam;
    if (!category) {
      console.warn(`SKIP ${sku}: category missing`);
      skipped++;
      continue;
    }

    const memoryType = (row.memory_type || '').trim();
    const speed = (row.speed || '').trim();
    const capacity = (row.capacity || '').trim();
    const warranty = (row.warranty || '').trim();
    const ramFeatures = (row.ram_features || '').trim();

    const selectErrors = [
      validateSelect(memoryType, RAM_TYPE_OPTIONS, 'memory_type', sku),
      validateSelect(speed, RAM_SPEED_OPTIONS, 'speed', sku),
      validateSelect(capacity, RAM_SIZE_OPTIONS, 'capacity', sku),
      warranty ? null : 'warranty empty',
      ramFeatures ? validateSelect(ramFeatures, RAM_FEATURE_OPTIONS, 'ram_features', sku) : null,
    ].filter(Boolean);

    if (selectErrors.length) {
      console.warn(`SKIP ${sku}: ${selectErrors.join('; ')}`);
      skipped++;
      continue;
    }

    const specifications = SPEC_KEYS.filter((key) => String(row[key] || '').trim() !== '').map(
      (key) => ({
        key,
        value: String(row[key]).trim(),
      })
    );

    const compareRaw = parsePrice(row.compareAtPrice);
    const costRaw = parsePrice(row.costPrice);
    const imageUrl = row.image_url?.trim() || '/uploads/ram/placeholder.jpg';

    try {
      const product = await ProductService.create({
        name,
        slug,
        sku,
        shortDescription: row.shortDescription?.trim() || null,
        description: row.description?.trim() || null,
        price,
        compareAtPrice: compareRaw,
        costPrice: costRaw,
        stockStatus: (row.stockStatus as any) || 'IN_STOCK',
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
            url: imageUrl,
            alt: row.image_alt?.trim() || name,
            order: 0,
            isPrimary: true,
          },
        ],
        specifications,
      } as any);

      console.log(`CREATED ${sku} → ${product?.slug} @ ৳${price} (${category.slug} / ${brand.slug})`);
      created++;
    } catch (err) {
      failed++;
      console.error(`FAIL ${sku}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone. created=${created} skipped=${skipped} failed=${failed}`);
  console.log(
    'Tip: only STOCK rows with numeric price + memory_type + speed + capacity + warranty are imported.'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
