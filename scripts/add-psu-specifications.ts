/**
 * Adds Power Supply specification definitions to the power-supply category.
 * Run: npx tsx scripts/add-psu-specifications.ts
 */
import { PrismaClient } from '@prisma/client';
import { PSU_SPEC_DEFINITIONS } from '../src/lib/psuSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
  let powerSupply = await prisma.category.findUnique({
    where: { slug: 'power-supply' },
  });

  if (!powerSupply) {
    const components = await prisma.category.findFirst({
      where: { slug: { in: ['components', 'component'] } },
    });
    powerSupply = await prisma.category.create({
      data: {
        name: 'Power Supply',
        slug: 'power-supply',
        description: 'PC Power Supply Units (PSU)',
        parentId: components?.id,
        level: components ? 1 : 0,
        order: 7,
        isActive: true,
      },
    });
    console.log('Created category power-supply');
  }

  let created = 0;
  let updated = 0;

  for (const spec of PSU_SPEC_DEFINITIONS) {
    const existing = await prisma.specificationDefinition.findUnique({
      where: {
        categoryId_key: { categoryId: powerSupply.id, key: spec.key },
      },
    });

    await prisma.specificationDefinition.upsert({
      where: {
        categoryId_key: { categoryId: powerSupply.id, key: spec.key },
      },
      update: {
        name: spec.name,
        dataType: spec.dataType,
        isFilterable: spec.isFilterable ?? false,
        isRequired: spec.isRequired ?? false,
        order: spec.order,
      },
      create: {
        categoryId: powerSupply.id,
        name: spec.name,
        key: spec.key,
        dataType: spec.dataType,
        isFilterable: spec.isFilterable ?? false,
        isRequired: spec.isRequired ?? false,
        order: spec.order,
      },
    });

    if (existing) updated++;
    else created++;
  }

  // Ensure PSU brands exist for CMS dropdown matching
  const { PSU_BRANDS } = await import('../src/lib/psuSpecDefinitions');
  let brandsCreated = 0;
  for (const brand of PSU_BRANDS) {
    const existing = await prisma.brand.findFirst({
      where: { OR: [{ slug: brand.slug }, { name: { equals: brand.label, mode: 'insensitive' } }] },
    });
    if (!existing) {
      await prisma.brand.create({
        data: {
          name: brand.label,
          slug: brand.slug,
          isActive: true,
        },
      });
      brandsCreated++;
    }
  }

  console.log(
    `✅ PSU specs: ${created} created, ${updated} updated (${PSU_SPEC_DEFINITIONS.length} total); brands created: ${brandsCreated}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
