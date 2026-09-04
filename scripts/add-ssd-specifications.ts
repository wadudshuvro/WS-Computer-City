/**
 * Adds SSD specification definitions to the ssd category.
 * Run: npx tsx scripts/add-ssd-specifications.ts
 */
import { PrismaClient } from '@prisma/client';
import { SSD_BRANDS, SSD_SPEC_DEFINITIONS } from '../src/lib/ssdSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
  let ssd = await prisma.category.findUnique({ where: { slug: 'ssd' } });

  if (!ssd) {
    const components = await prisma.category.findFirst({
      where: { slug: { in: ['components', 'component'] } },
    });
    ssd = await prisma.category.create({
      data: {
        name: 'SSD',
        slug: 'ssd',
        description: 'Solid State Drives',
        parentId: components?.id,
        level: components ? 1 : 0,
        order: 8,
        isActive: true,
      },
    });
    console.log('Created category ssd');
  }

  let created = 0;
  let updated = 0;

  for (const spec of SSD_SPEC_DEFINITIONS) {
    const existing = await prisma.specificationDefinition.findUnique({
      where: {
        categoryId_key: { categoryId: ssd.id, key: spec.key },
      },
    });

    await prisma.specificationDefinition.upsert({
      where: {
        categoryId_key: { categoryId: ssd.id, key: spec.key },
      },
      update: {
        name: spec.name,
        dataType: spec.dataType,
        isFilterable: spec.isFilterable ?? false,
        isRequired: spec.isRequired ?? false,
        order: spec.order,
      },
      create: {
        categoryId: ssd.id,
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

  let brandsCreated = 0;
  for (const brand of SSD_BRANDS) {
    const existing = await prisma.brand.findFirst({
      where: {
        OR: [{ slug: brand.slug }, { name: { equals: brand.label, mode: 'insensitive' } }],
      },
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
    `✅ SSD specs: ${created} created, ${updated} updated (${SSD_SPEC_DEFINITIONS.length} total); brands created: ${brandsCreated}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
