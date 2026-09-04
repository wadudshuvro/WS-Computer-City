/**
 * Adds Computer Casing specification definitions to the computer-case category.
 * Run: npx tsx scripts/add-casing-specifications.ts
 */
import { PrismaClient } from '@prisma/client';
import { CASING_BRANDS, CASING_SPEC_DEFINITIONS } from '../src/lib/casingSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
  let casing = await prisma.category.findUnique({ where: { slug: 'computer-case' } });

  if (!casing) {
    const components = await prisma.category.findFirst({
      where: { slug: { in: ['components', 'component'] } },
    });
    casing = await prisma.category.create({
      data: {
        name: 'Computer Case',
        slug: 'computer-case',
        description: 'PC chassis / computer casing',
        parentId: components?.id,
        level: components ? 1 : 0,
        order: 10,
        isActive: true,
      },
    });
    console.log('Created category computer-case');
  }

  let created = 0;
  let updated = 0;

  for (const spec of CASING_SPEC_DEFINITIONS) {
    const existing = await prisma.specificationDefinition.findUnique({
      where: {
        categoryId_key: { categoryId: casing.id, key: spec.key },
      },
    });

    await prisma.specificationDefinition.upsert({
      where: {
        categoryId_key: { categoryId: casing.id, key: spec.key },
      },
      update: {
        name: spec.name,
        dataType: spec.dataType,
        isFilterable: spec.isFilterable ?? false,
        isRequired: spec.isRequired ?? false,
        order: spec.order,
      },
      create: {
        categoryId: casing.id,
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
  for (const brand of CASING_BRANDS) {
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
    `✅ Casing specs: ${created} created, ${updated} updated (${CASING_SPEC_DEFINITIONS.length} total); brands created: ${brandsCreated}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
