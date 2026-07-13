import { PrismaClient } from '@prisma/client';
import { RAM_BRANDS, RAM_SPEC_DEFINITIONS } from '../src/lib/ramSpecDefinitions';

const prisma = new PrismaClient();

async function main() {
  const components = await prisma.category.findFirst({ where: { slug: 'components' } });
  if (!components) {
    throw new Error('Components category not found. Run npm run db:seed first.');
  }

  const ram = await prisma.category.upsert({
    where: { slug: 'ram' },
    update: { name: 'RAM', order: 5, parentId: components.id, isActive: true },
    create: {
      name: 'RAM',
      slug: 'ram',
      description: 'Memory modules',
      parentId: components.id,
      level: 1,
      order: 5,
      isActive: true,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'desktop-ram' },
    update: { parentId: ram.id, isActive: true },
    create: {
      name: 'Desktop RAM',
      slug: 'desktop-ram',
      description: 'Desktop DDR4 and DDR5 memory',
      parentId: ram.id,
      level: 2,
      order: 1,
      isActive: true,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'laptop-ram' },
    update: { parentId: ram.id, isActive: true },
    create: {
      name: 'Laptop RAM',
      slug: 'laptop-ram',
      description: 'Laptop SO-DIMM memory',
      parentId: ram.id,
      level: 2,
      order: 2,
      isActive: true,
    },
  });

  for (const brand of RAM_BRANDS) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.label },
      create: {
        name: brand.label,
        slug: brand.slug,
        description: `${brand.label} memory`,
        isActive: true,
      },
    });
  }

  for (const spec of RAM_SPEC_DEFINITIONS) {
    await prisma.specificationDefinition.upsert({
      where: {
        categoryId_key: {
          categoryId: ram.id,
          key: spec.key,
        },
      },
      update: {
        name: spec.name,
        dataType: spec.dataType,
        isFilterable: spec.isFilterable ?? false,
        isRequired: spec.isRequired ?? false,
        order: spec.order,
      },
      create: {
        categoryId: ram.id,
        name: spec.name,
        key: spec.key,
        dataType: spec.dataType,
        isFilterable: spec.isFilterable ?? false,
        isRequired: spec.isRequired ?? false,
        order: spec.order,
      },
    });
  }

  console.log('✅ Desktop RAM categories, brands, and spec definitions ready');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
