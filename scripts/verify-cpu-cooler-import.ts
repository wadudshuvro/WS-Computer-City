/**
 * Verify CPU cooler catalog: 3 local images + spec keys on every product.
 * Run: npx tsx scripts/verify-cpu-cooler-import.ts
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const OUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'cpu-coolers');
const REQUIRED_SPEC_KEYS = [
  'cooler_type',
  'warranty',
  'intel_sockets',
  'amd_sockets',
  'fan_speed_detail',
  'airflow',
  'noise_level',
  'dimension',
];

async function main() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: { in: ['cpu-cooler', 'cpu-coolers', 'cooler'] } },
    },
    include: {
      images: { orderBy: { order: 'asc' } },
      specifications: { include: { specificationDefinition: true } },
    },
    orderBy: { name: 'asc' },
  });

  const files = fs.existsSync(OUT_DIR)
    ? fs.readdirSync(OUT_DIR).filter((f) => !f.startsWith('.'))
    : [];

  let missingLocal = 0;
  let missingFile = 0;
  let fewerThan3 = 0;
  const specMissing: Record<string, number> = {};
  for (const k of REQUIRED_SPEC_KEYS) specMissing[k] = 0;

  for (const p of products) {
    const local = p.images.filter((i) => i.url.startsWith('/uploads/cpu-coolers/'));
    if (local.length < 3) fewerThan3++;
    if (!local.length) missingLocal++;
    for (const img of local) {
      const file = path.join(process.cwd(), 'public', img.url.replace(/^\//, '').replace(/\//g, path.sep));
      if (!fs.existsSync(file)) missingFile++;
    }
    const keys = new Set(p.specifications.map((s) => s.specificationDefinition.key));
    for (const k of REQUIRED_SPEC_KEYS) {
      if (!keys.has(k) || !p.specifications.find((s) => s.specificationDefinition.key === k)?.value) {
        specMissing[k]!++;
      }
    }
  }

  const shortImages = products
    .filter((p) => p.images.filter((i) => i.url.startsWith('/uploads/cpu-coolers/')).length < 3)
    .map((p) => ({
      slug: p.slug,
      count: p.images.length,
      urls: p.images.map((i) => i.url),
    }));
  const sample = products[0];
  console.log(
    JSON.stringify(
      {
        products: products.length,
        filesOnDisk: files.length,
        fewerThan3Images: fewerThan3,
        missingLocalUrl: missingLocal,
        missingFileOnDisk: missingFile,
        specMissing,
        shortImages,
        sample: sample
          ? {
              name: sample.name,
              slug: sample.slug,
              images: sample.images.map((i) => i.url),
              specs: Object.fromEntries(
                sample.specifications.map((s) => [s.specificationDefinition.key, s.value])
              ),
            }
          : null,
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
