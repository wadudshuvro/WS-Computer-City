/**
 * Set AMD processor generation + type from the model in the product name
 * (Ryzen 3 3200G → Ryzen 3000 Series / Ryzen 3) so Series sidebar filters work.
 *
 * Run: npx tsx scripts/backfill-amd-processor-series.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { inferAmdSeriesFromName } from '../src/lib/processorFilterMappings';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

async function upsertSpec(
  productId: string,
  categoryId: string,
  key: string,
  value: string
) {
  const def = await prisma.specificationDefinition.findUnique({
    where: { categoryId_key: { categoryId, key } },
  });
  if (!def) {
    console.warn(`  skip ${key}: no spec definition on category ${categoryId}`);
    return false;
  }
  await prisma.productSpecification.upsert({
    where: {
      productId_specificationDefinitionId: {
        productId,
        specificationDefinitionId: def.id,
      },
    },
    update: { value },
    create: {
      productId,
      specificationDefinitionId: def.id,
      value,
    },
  });
  return true;
}

async function main() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { category: { slug: { in: ['amd', 'amd-ryzen'] } } },
        { brand: { slug: 'amd' }, category: { slug: { in: ['processor', 'amd', 'amd-ryzen'] } } },
      ],
    },
    include: {
      brand: { select: { slug: true } },
      specifications: {
        include: { specificationDefinition: { select: { key: true } } },
      },
    },
    orderBy: { name: 'asc' },
  });

  let updated = 0;
  for (const product of products) {
    const inferred = inferAmdSeriesFromName(product.name);
    if (!inferred) {
      console.log(`SKIP (no model) ${product.slug}`);
      continue;
    }

    const currentGen = product.specifications.find(
      (s) => s.specificationDefinition.key === 'generation'
    )?.value;
    const currentModel = product.specifications.find(
      (s) => s.specificationDefinition.key === 'processor_model'
    )?.value;

    const generationToWrite =
      inferred.generation && (!currentGen || !/Ryzen \d000 Series/i.test(currentGen))
        ? inferred.generation
        : null;
    const modelToWrite = inferred.processorModel && !currentModel ? inferred.processorModel : null;

    if (!generationToWrite && !modelToWrite) {
      console.log(`OK ${product.slug} gen=${currentGen} model=${currentModel}`);
      continue;
    }

    if (generationToWrite) {
      await upsertSpec(product.id, product.categoryId, 'generation', generationToWrite);
    }
    if (modelToWrite) {
      await upsertSpec(product.id, product.categoryId, 'processor_model', modelToWrite);
    }
    updated++;
    console.log(
      `SET ${product.slug} gen=${generationToWrite || currentGen} model=${modelToWrite || currentModel}`
    );
  }

  console.log(`\nUpdated ${updated} / ${products.length} AMD processors`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
