/**
 * Adds comprehensive GPU specification definitions to the graphics-card category.
 * Run: npm run db:add-gpu-specs
 */
import { PrismaClient } from '@prisma/client';
import { GPU_SPEC_DEFINITIONS } from '../src/lib/gpuSpecDefinitions';

const prisma = new PrismaClient();

async function main() {
  const graphicsCard = await prisma.category.findUnique({
    where: { slug: 'graphics-card' },
  });

  if (!graphicsCard) {
    console.error('❌ graphics-card category not found. Run npm run db:seed first.');
    process.exit(1);
  }

  let created = 0;
  let updated = 0;

  for (const spec of GPU_SPEC_DEFINITIONS) {
    const existing = await prisma.specificationDefinition.findUnique({
      where: {
        categoryId_key: { categoryId: graphicsCard.id, key: spec.key },
      },
    });

    await prisma.specificationDefinition.upsert({
      where: {
        categoryId_key: { categoryId: graphicsCard.id, key: spec.key },
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
        categoryId: graphicsCard.id,
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

  console.log(`✅ GPU specifications: ${created} created, ${updated} updated (${GPU_SPEC_DEFINITIONS.length} total)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
