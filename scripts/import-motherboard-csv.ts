/**
 * Import motherboards from docs/imports/motherboard-cms-import.csv
 * (export the Excel sheet as CSV, or use the generated CSV).
 *
 * Only rows with stock_decision=STOCK and a numeric price are imported.
 *
 * Run: npx tsx scripts/import-motherboard-csv.ts
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { MOTHERBOARD_SPEC_DEFINITIONS } from '../src/lib/motherboardSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

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

const BRAND_LABELS: Record<string, string> = {
  'msi-intel': 'MSI (Intel)',
  'msi-amd': 'MSI (AMD)',
  'asrock-intel': 'ASRock (Intel)',
  'asrock-amd': 'ASRock (AMD)',
  'asus-intel': 'ASUS (Intel)',
  'asus-amd': 'ASUS (AMD)',
  'gigabyte-intel': 'GIGABYTE (Intel)',
  'gigabyte-amd': 'GIGABYTE (AMD)',
  'colorful-intel': 'Colorful (Intel)',
  'colorful-amd': 'Colorful (AMD)',
  xenthra: 'XENTHRA',
  biostar: 'Biostar',
  nzxt: 'NZXT',
};

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

async function ensureMotherboardSpecs(categoryId: string) {
  for (const spec of MOTHERBOARD_SPEC_DEFINITIONS) {
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

async function main() {
  const csvPath = path.join(process.cwd(), 'docs/imports/motherboard-cms-import.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Missing ${csvPath}. Run: npx tsx scripts/build-motherboard-import-excel.ts`);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  console.log(`Parsed ${rows.length} CSV rows`);

  const motherboardCat = await prisma.category.findUnique({ where: { slug: 'motherboard' } });
  const intelMb = await prisma.category.findUnique({ where: { slug: 'intel-motherboard' } });
  const amdMb = await prisma.category.findUnique({ where: { slug: 'amd-motherboard' } });
  if (!motherboardCat) throw new Error('Category slug "motherboard" not found');

  for (const cat of [motherboardCat, intelMb, amdMb]) {
    if (cat) await ensureMotherboardSpecs(cat.id);
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
    const brand = await ensureBrand(brandSlug);

    const categorySlug = (row.category_slug || 'motherboard').trim().toLowerCase();
    const category =
      categorySlug === 'intel-motherboard'
        ? intelMb
        : categorySlug === 'amd-motherboard'
          ? amdMb
          : motherboardCat;
    if (!category) {
      console.warn(`SKIP ${sku}: category ${categorySlug} missing`);
      skipped++;
      continue;
    }

    const requiredSpecs = ['supported_cpu', 'chipset', 'warranty'] as const;
    const missingRequired = requiredSpecs.filter((key) => !String(row[key] || '').trim());
    if (missingRequired.length) {
      console.warn(`SKIP ${sku}: missing required spec(s): ${missingRequired.join(', ')}`);
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
    const imageUrl = row.image_url?.trim() || '/uploads/motherboards/placeholder.jpg';

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
  console.log('Tip: only STOCK rows with price + supported_cpu + chipset + warranty are imported.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
