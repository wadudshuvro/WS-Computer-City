/**
 * Import CPU coolers from docs/imports/startech-cpu-cooler-list.json
 *
 * Run: npx tsx scripts/import-cpu-cooler-json.ts
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import {
  CPU_COOLER_BRANDS,
  CPU_COOLER_SPEC_DEFINITIONS,
  getCpuCoolerListingCardLines,
} from '../src/lib/cpuCoolerSpecDefinitions';
import { loadEnvValue } from './load-env';
import type { ListedCooler } from './scrape-startech-cpu-cooler-list';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const SPEC_KEYS = [
  'cooler_type',
  'fan_speed',
  'fan_speed_detail',
  'airflow',
  'noise_level',
  'air_pressure',
  'connector',
  'others',
  'dimension',
  'weight',
  'fan_size',
  'intel_sockets',
  'amd_sockets',
  'processor_type',
  'socket',
  'special_features',
  'warranty',
] as const;

function fanSpeedBucket(detail: string | undefined): string | null {
  if (!detail) return null;
  const nums = [...detail.matchAll(/(\d+)/g)].map((m) => Number(m[1]));
  const max = nums.length ? Math.max(...nums) : NaN;
  if (Number.isNaN(max)) return null;
  if (max <= 1500) return 'Up to 1500 RPM';
  if (max <= 2500) return '1500 RPM - 2500 RPM';
  return 'Above 2500 RPM';
}

function normalizeCoolerType(raw: string | undefined, name: string): string {
  const t = `${raw || ''} ${name}`.toLowerCase();
  if (t.includes('hybrid')) return 'Hybrid Liquid Cooler';
  if (t.includes('liquid') || t.includes('aio')) return 'Liquid Cooler';
  return 'Air Cooler';
}

function guessBrand(name: string): { slug: string; label: string } {
  const sorted = [...CPU_COOLER_BRANDS].sort((a, b) => b.label.length - a.label.length);
  const lower = name.toLowerCase();
  for (const b of sorted) {
    if (b.slug === 'xtreme' && !/\bxtreme\b/i.test(name)) continue;
    if (lower.includes(b.label.toLowerCase()) || lower.includes(b.slug.replace(/-/g, ' '))) {
      return b;
    }
  }
  if (/\barctic\b/i.test(name)) return { slug: 'arctic', label: 'ARCTIC' };
  if (/cooler\s*master/i.test(name)) return { slug: 'cooler-master', label: 'Cooler Master' };
  if (/1st\s*player|1stplayer/i.test(name)) return { slug: '1stplayer', label: '1STPLAYER' };
  if (/value[\s-]?top/i.test(name)) return { slug: 'value-top', label: 'Value-Top' };
  return { slug: 'value-top', label: 'Value-Top' };
}

function deriveSockets(item: ListedCooler): {
  processor_type: string;
  socket: string;
} {
  const intel = item.specs.intel_sockets || '';
  const amd = item.specs.amd_sockets || '';
  const blob = `${intel} ${amd} ${item.name} ${item.bullets.join(' ')}`;
  const types: string[] = [];
  if (/intel|lga/i.test(blob)) types.push('Intel');
  if (/amd|am\d|ryzen/i.test(blob)) types.push('AMD');
  return {
    processor_type: types.join(', ') || 'Intel, AMD',
    socket: [intel, amd].filter(Boolean).join(' / ') || blob.match(/LGA\s?\d+|AM\d/gi)?.join(' / ') || '',
  };
}

function specialFeatures(item: ListedCooler): string {
  const blob = `${item.name} ${item.bullets.join(' ')} ${Object.values(item.specs).join(' ')}`;
  const bits: string[] = [];
  if (/\bargb\b|addressable/i.test(blob)) bits.push('ARGB');
  else if (/\brgb\b/i.test(blob)) bits.push('RGB');
  return bits.join(', ');
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function skuFromSlug(slug: string): string {
  const raw = `COOL-${slug}`.toUpperCase().replace(/[^A-Z0-9-]/g, '-');
  return raw.slice(0, 48);
}

async function ensureSpecs(categoryId: string) {
  for (const spec of CPU_COOLER_SPEC_DEFINITIONS) {
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

async function ensureBrand(slug: string, label: string) {
  const existing = await prisma.brand.findFirst({
    where: { OR: [{ slug }, { name: { equals: label, mode: 'insensitive' } }] },
  });
  if (existing) return existing;
  return prisma.brand.create({ data: { name: label, slug, isActive: true } });
}

async function main() {
  const jsonPath = path.join(process.cwd(), 'docs/imports/startech-cpu-cooler-list.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Missing ${jsonPath}. Run scrape-startech-cpu-cooler-list.ts first.`);
  }
  const items = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as ListedCooler[];
  console.log(`Loaded ${items.length} scraped coolers`);

  let cooler = await prisma.category.findUnique({ where: { slug: 'cpu-cooler' } });
  if (!cooler) {
    const components = await prisma.category.findFirst({
      where: { slug: { in: ['components', 'component'] } },
    });
    cooler = await prisma.category.create({
      data: {
        name: 'CPU Cooler',
        slug: 'cpu-cooler',
        description: 'Air & liquid CPU coolers',
        parentId: components?.id,
        level: components ? 1 : 0,
        order: 2,
        isActive: true,
      },
    });
  }
  await ensureSpecs(cooler.id);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of items) {
    const slug = item.slug || skuFromSlug(item.name).toLowerCase();
    let sku = skuFromSlug(slug);

    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { slug },
          { sku },
          { name: { equals: item.name, mode: 'insensitive' } },
        ],
      },
      select: { id: true, slug: true, sku: true, categoryId: true },
    });
    if (existing) {
      const specs: Record<string, string> = {
        ...item.specs,
        cooler_type: item.specs.cooler_type || normalizeCoolerType(undefined, item.name),
        fan_speed: fanSpeedBucket(item.specs.fan_speed_detail) || '',
        processor_type: deriveSockets(item).processor_type,
        socket: deriveSockets(item).socket,
        special_features: specialFeatures(item),
        warranty: item.specs.warranty || '1 Year',
      };
      const specifications = SPEC_KEYS.filter((key) => String(specs[key] || '').trim()).map((key) => ({
        key,
        value: decodeHtmlEntities(String(specs[key]).trim()),
      }));
      const listingLines = getCpuCoolerListingCardLines((key) => specs[key] || null);
      try {
        await ProductService.update(existing.id, {
          ...(item.price ? { price: item.price, compareAtPrice: item.compareAtPrice } : {}),
          shortDescription: listingLines.join(' • ') || item.bullets.join(' • ') || undefined,
          specifications,
        } as never);
        console.log(`UPDATE ${existing.sku} specs=${specifications.length}`);
        created++;
      } catch (err) {
        failed++;
        console.error(`FAIL update ${existing.slug}:`, err instanceof Error ? err.message : err);
      }
      continue;
    }

    if (!item.price) {
      skipped++;
      continue;
    }

    let n = 2;
    while (await prisma.product.findUnique({ where: { sku } })) {
      sku = `${skuFromSlug(slug)}-${n++}`.slice(0, 48);
    }

    const brandInfo = guessBrand(item.name);
    const brand = await ensureBrand(brandInfo.slug, brandInfo.label);
    const derived = deriveSockets(item);
    const specs: Record<string, string> = {
      ...item.specs,
      cooler_type: item.specs.cooler_type || normalizeCoolerType(undefined, item.name),
      fan_speed: fanSpeedBucket(item.specs.fan_speed_detail) || '',
      processor_type: derived.processor_type,
      socket: derived.socket || item.specs.socket || '',
      special_features: specialFeatures(item),
      warranty: item.specs.warranty || '1 Year',
    };
    if (item.specs.cooler_type && !item.specs.cooler_type.toLowerCase().includes('cooler')) {
      specs.cooler_type = item.specs.cooler_type;
    }

    const specifications = SPEC_KEYS.filter((key) => String(specs[key] || '').trim()).map((key) => ({
      key,
      value: decodeHtmlEntities(String(specs[key]).trim()),
    }));
    const listingLines = getCpuCoolerListingCardLines((key) => specs[key] || null);

    const sourceImages = (item.imageUrls.length ? item.imageUrls : [item.listingImageUrl])
      .filter((u): u is string => Boolean(u) && !/\/logo\.(png|jpg|webp)/i.test(u));
    const images = sourceImages.map(
      (url, index) => ({
        url: `/uploads/cpu-coolers/${slug}${index === 0 ? '' : `-${index + 1}`}.jpg`,
        alt: item.name,
        order: index,
        isPrimary: index === 0,
      })
    );

    try {
      await ProductService.create({
        name: item.name,
        slug,
        sku,
        shortDescription: listingLines.join(' • ') || item.bullets.join(' • ') || null,
        description: null,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        costPrice: null,
        stockStatus: 'IN_STOCK',
        stockQuantity: 10,
        lowStockAlert: 3,
        categoryId: cooler.id,
        brandId: brand.id,
        metaTitle: `${item.name} Price in Bangladesh | LogicBay BD`,
        metaDescription: `Buy ${item.name} at ৳${item.price.toLocaleString()} from LogicBay BD.`,
        metaKeywords: null,
        isFeatured: false,
        isActive: true,
        images: images.length
          ? images.slice(0, 3)
          : [
              {
                url: `/uploads/cpu-coolers/${slug}.jpg`,
                alt: item.name,
                order: 0,
                isPrimary: true,
              },
            ],
        specifications,
      } as never);
      created++;
      console.log(`CREATED ${sku} @ ৳${item.price} (${brand.slug})`);
    } catch (err) {
      failed++;
      console.error(`FAIL ${slug}:`, err instanceof Error ? err.message : err);
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
