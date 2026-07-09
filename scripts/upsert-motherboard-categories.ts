import { PrismaClient } from '@prisma/client';
import { MOTHERBOARD_SPEC_DEFINITIONS } from '../src/lib/motherboardSpecDefinitions';

const prisma = new PrismaClient();

async function main() {
  const components = await prisma.category.findFirst({ where: { slug: 'components' } });
  if (!components) {
    throw new Error('Components category not found. Run npm run db:seed first.');
  }

  const motherboard = await prisma.category.upsert({
    where: { slug: 'motherboard' },
    update: { name: 'Motherboard', order: 2, parentId: components.id, isActive: true },
    create: {
      name: 'Motherboard',
      slug: 'motherboard',
      description: 'Intel and AMD motherboards',
      parentId: components.id,
      level: 1,
      order: 2,
      isActive: true,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'intel-motherboard' },
    update: { parentId: motherboard.id, isActive: true },
    create: {
      name: 'Intel Motherboard',
      slug: 'intel-motherboard',
      description: 'Intel chipset motherboards',
      parentId: motherboard.id,
      level: 2,
      order: 1,
      isActive: true,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'amd-motherboard' },
    update: { parentId: motherboard.id, isActive: true },
    create: {
      name: 'AMD Motherboard',
      slug: 'amd-motherboard',
      description: 'AMD chipset motherboards',
      parentId: motherboard.id,
      level: 2,
      order: 2,
      isActive: true,
    },
  });

  for (const spec of MOTHERBOARD_SPEC_DEFINITIONS) {
    await prisma.specificationDefinition.upsert({
      where: {
        categoryId_key: {
          categoryId: motherboard.id,
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
        categoryId: motherboard.id,
        name: spec.name,
        key: spec.key,
        dataType: spec.dataType,
        isFilterable: spec.isFilterable ?? false,
        isRequired: spec.isRequired ?? false,
        order: spec.order,
      },
    });
  }

  console.log('✅ Motherboard categories ready:', motherboard.name);
  console.log('✅ Motherboard specification definitions ready:', MOTHERBOARD_SPEC_DEFINITIONS.length);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
