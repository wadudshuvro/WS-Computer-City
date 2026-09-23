/**
 * Adds comprehensive GPU specification definitions to the graphics-card category.
 * Run: npm run db:add-gpu-specs
 */
import { PrismaClient } from '@prisma/client';
import { GPU_SPEC_DEFINITIONS } from '../src/lib/gpuSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
  const slugs = ['graphics-card', 'nvidia', 'amd-gpu'];
  const categories = await prisma.category.findMany({
    where: { slug: { in: slugs } },
  });

  if (categories.length === 0) {
    console.error('❌ graphics-card category not found. Run npm run db:seed first.');
    process.exit(1);
  }

  let created = 0;
  let updated = 0;

  for (const category of categories) {
    for (const spec of GPU_SPEC_DEFINITIONS) {
      const existing = await prisma.specificationDefinition.findUnique({
        where: {
          categoryId_key: { categoryId: category.id, key: spec.key },
        },
      });

      await prisma.specificationDefinition.upsert({
        where: {
          categoryId_key: { categoryId: category.id, key: spec.key },
        },
        update: {
          name: spec.name,
          dataType: spec.dataType,
          unit: spec.unit,
          isFilterable: spec.isFilterable ?? false,
          isRequired: spec.isRequired ?? false,
          order: spec.order,
        },
        create: {
          categoryId: category.id,
          name: spec.name,
          key: spec.key,
          dataType: spec.dataType,
          unit: spec.unit,
          isFilterable: spec.isFilterable ?? false,
          isRequired: spec.isRequired ?? false,
          order: spec.order,
        },
      });

      if (existing) updated++;
      else created++;
    }
  }

  console.log(
    `✅ GPU specifications: ${created} created, ${updated} updated across ${categories.map((c) => c.slug).join(', ')}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
