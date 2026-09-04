/**
 * Adds CPU Cooler specification definitions to the cpu-cooler category.
 * Run: npx tsx scripts/add-cpu-cooler-specifications.ts
 */
import { PrismaClient } from '@prisma/client';
import { CPU_COOLER_BRANDS, CPU_COOLER_SPEC_DEFINITIONS } from '../src/lib/cpuCoolerSpecDefinitions';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
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
    console.log('Created category cpu-cooler');
  }

  let created = 0;
  let updated = 0;

  for (const spec of CPU_COOLER_SPEC_DEFINITIONS) {
    const existing = await prisma.specificationDefinition.findUnique({
      where: {
        categoryId_key: { categoryId: cooler.id, key: spec.key },
      },
    });

    await prisma.specificationDefinition.upsert({
      where: {
        categoryId_key: { categoryId: cooler.id, key: spec.key },
      },
      update: {
        name: spec.name,
        dataType: spec.dataType,
        isFilterable: spec.isFilterable ?? false,
        isRequired: spec.isRequired ?? false,
        order: spec.order,
      },
      create: {
        categoryId: cooler.id,
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
  for (const brand of CPU_COOLER_BRANDS) {
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
    `✅ CPU Cooler specs: ${created} created, ${updated} updated (${CPU_COOLER_SPEC_DEFINITIONS.length} total); brands created: ${brandsCreated}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
