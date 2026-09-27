/**
 * Writes official Intel/AMD specs onto every processor so CMS + PDP match.
 * Does not overwrite an existing warranty value.
 * Run: npx tsx scripts/backfill-processor-official-specs.ts
 */
import { DataType, PrismaClient } from '@prisma/client';
import { PROCESSOR_OFFICIAL_SPECS } from '../src/lib/processorOfficialSpecs';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: { in: ['processor', 'intel', 'amd', 'amd-ryzen'] } },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      categoryId: true,
      category: { select: { slug: true } },
    },
  });

  let updated = 0;
  let skipped = 0;
  const missing: string[] = [];

  for (const product of products) {
    const specMap = PROCESSOR_OFFICIAL_SPECS[product.slug];
    if (!specMap) {
      missing.push(`${product.slug} (${product.name})`);
      skipped++;
      continue;
    }

    const existingWarranty = await prisma.productSpecification.findFirst({
      where: {
        productId: product.id,
        specificationDefinition: { key: 'warranty' },
      },
      select: { value: true },
    });

    for (const [key, value] of Object.entries(specMap)) {
      if (!value) continue;
      let definition = await prisma.specificationDefinition.findUnique({
        where: { categoryId_key: { categoryId: product.categoryId, key } },
      });
      if (!definition) {
        definition = await prisma.specificationDefinition.create({
          data: {
            categoryId: product.categoryId,
            key,
            name: key.replace(/_/g, ' '),
            dataType: DataType.TEXT,
            isRequired: false,
            isFilterable: false,
            order: 99,
          },
        });
      }

      const existing = await prisma.productSpecification.findUnique({
        where: {
          productId_specificationDefinitionId: {
            productId: product.id,
            specificationDefinitionId: definition.id,
          },
        },
      });

      if (existing) {
        await prisma.productSpecification.update({
          where: { id: existing.id },
          data: { value },
        });
      } else {
        await prisma.productSpecification.create({
          data: {
            productId: product.id,
            specificationDefinitionId: definition.id,
            value,
          },
        });
      }
    }

    if (existingWarranty?.value && !specMap.warranty) {
      // keep current warranty
    }

    updated++;
    console.log(`UPDATED ${product.slug}`);
  }

  console.log(`\nDone. updated=${updated} skipped=${skipped}`);
  if (missing.length) {
    console.log('No official spec map for:');
    for (const row of missing) console.log(`  - ${row}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
