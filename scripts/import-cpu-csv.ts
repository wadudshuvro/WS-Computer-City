/**
 * Import processors from docs/imports/cpu-processors-import-template.csv
 * Run: npx tsx scripts/import-cpu-csv.ts
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

/** Placeholder BDT prices — user will fix in CMS */
const PLACEHOLDER_PRICES: Record<string, { price: number; compareAtPrice?: number }> = {
  'CPU-I5-14600K': { price: 35500, compareAtPrice: 38000 },
  'CPU-R7-7800X3D': { price: 48500, compareAtPrice: 52000 },
  'CPU-U7-265K': { price: 52000, compareAtPrice: 56000 },
  'CPU-R5-7600': { price: 24500, compareAtPrice: 26500 },
  'CPU-I7-14700K': { price: 48500, compareAtPrice: 52000 },
  'CPU-R9-7950X': { price: 65000, compareAtPrice: 70000 },
  'CPU-I3-14100': { price: 15500, compareAtPrice: 17000 },
  'CPU-R5-5600': { price: 12500, compareAtPrice: 14000 },
};

const SPEC_KEYS = [
  'processor_model',
  'model_number',
  'number_of_cores',
  'number_of_threads',
  'base_clock',
  'boost_clock',
  'socket_type',
  'generation',
  'cache_size',
  'l2_cache',
  'tdp',
  'integrated_graphics',
  'memory_type',
  'max_memory_speed',
  'max_memory_size',
  'pcie_version',
  'processor_features',
  'unlocked',
  'cooler_included',
  'warranty',
] as const;

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

/** Minimal CSV line parser supporting quoted fields with commas */
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

async function ensureProcessorSpecs(categoryId: string) {
  const { processorSpecifications } = await import('../src/lib/categoryConfig');
  for (let i = 0; i < processorSpecifications.length; i++) {
    const spec = processorSpecifications[i]!;
    const dataType =
      spec.type === 'number'
        ? 'NUMBER'
        : spec.type === 'boolean'
          ? 'BOOLEAN'
          : spec.type === 'select' || spec.type === 'multiselect'
            ? 'SELECT'
            : 'TEXT';
    await prisma.specificationDefinition.upsert({
      where: { categoryId_key: { categoryId, key: spec.key } },
      update: {
        name: spec.name,
        dataType,
        unit: spec.unit ?? null,
        isRequired: Boolean(spec.required),
        order: i + 1,
      },
      create: {
        categoryId,
        key: spec.key,
        name: spec.name,
        dataType,
        unit: spec.unit ?? null,
        isRequired: Boolean(spec.required),
        isFilterable: false,
        order: i + 1,
      },
    });
  }
}

async function main() {
  const csvPath = path.join(process.cwd(), 'docs/imports/cpu-processors-import-template.csv');
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  console.log(`Parsed ${rows.length} CSV rows`);

  const processorCat = await prisma.category.findUnique({ where: { slug: 'processor' } });
  if (!processorCat) throw new Error('Category slug "processor" not found');

  const intelBrand = await prisma.brand.findFirst({
    where: { OR: [{ slug: 'intel' }, { name: { equals: 'Intel', mode: 'insensitive' } }] },
  });
  const amdBrand = await prisma.brand.findFirst({
    where: { OR: [{ slug: 'amd' }, { name: { equals: 'AMD', mode: 'insensitive' } }] },
  });
  if (!intelBrand || !amdBrand) {
    throw new Error(`Brands missing: intel=${!!intelBrand} amd=${!!amdBrand}`);
  }

  // Specs on processor + brand child cats (intel/amd) so resolve works either way
  await ensureProcessorSpecs(processorCat.id);
  for (const slug of ['intel', 'amd'] as const) {
    const child = await prisma.category.findUnique({ where: { slug } });
    if (child) await ensureProcessorSpecs(child.id);
  }

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const sku = row.sku?.trim().toUpperCase();
    const slug = row.slug?.trim();
    if (!sku || !slug) {
      console.warn('Skip row missing sku/slug');
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

    const pricing = PLACEHOLDER_PRICES[sku];
    if (!pricing) {
      console.warn(`SKIP ${sku}: no placeholder price mapped`);
      skipped++;
      continue;
    }

    const brandSlug = row.brand_slug?.trim().toLowerCase();
    const brandId = brandSlug === 'amd' ? amdBrand.id : intelBrand.id;

    // Prefer brand child category (intel/amd) when present so listing filters match existing catalog
    const brandCat = await prisma.category.findUnique({ where: { slug: brandSlug === 'amd' ? 'amd' : 'intel' } });
    const categoryId = brandCat?.parentId === processorCat.id ? brandCat.id : processorCat.id;

    const specifications = SPEC_KEYS.filter((key) => {
      const v = row[key];
      return v !== undefined && String(v).trim() !== '';
    }).map((key) => ({
      key,
      value: String(row[key]).trim(),
    }));

    if (!specifications.some((s) => s.key === 'warranty')) {
      specifications.push({ key: 'warranty', value: '3 Years' });
    }

    const imageUrl = row.image_url?.trim() || '/uploads/processors/placeholder.jpg';

    try {
      const product = await ProductService.create({
        name: row.name.trim(),
        slug,
        sku,
        shortDescription: row.shortDescription?.trim() || null,
        description: row.description?.trim() || null,
        price: pricing.price,
        compareAtPrice: pricing.compareAtPrice ?? null,
        costPrice: null,
        stockStatus: (row.stockStatus as any) || 'IN_STOCK',
        stockQuantity: parseInt(row.stockQuantity || '0', 10) || 0,
        lowStockAlert: parseInt(row.lowStockAlert || '5', 10) || 5,
        categoryId,
        brandId,
        metaTitle: row.metaTitle?.trim() || null,
        metaDescription: row.metaDescription?.trim() || null,
        metaKeywords: row.metaKeywords?.trim() || null,
        isFeatured: row.isFeatured === 'true',
        isActive: row.isActive !== 'false',
        images: [
          {
            url: imageUrl,
            alt: row.image_alt?.trim() || row.name.trim(),
            order: 0,
            isPrimary: true,
          },
        ],
        specifications,
      } as any);

      console.log(`CREATED ${sku} → ${product?.slug} @ ৳${pricing.price} (${categoryId === processorCat.id ? 'processor' : brandSlug})`);
      created++;
    } catch (err) {
      console.error(`FAIL ${sku}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone. created=${created} skipped=${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
