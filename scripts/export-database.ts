import { PrismaClient } from '@prisma/client';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

function timestamp() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const backupsDir = join(process.cwd(), 'backups');
  if (!existsSync(backupsDir)) {
    mkdirSync(backupsDir, { recursive: true });
  }

  console.log('📤 Exporting database to JSON...');

  const [users, categories, brands, products, specificationDefinitions] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.category.findMany({
      include: { parent: { select: { id: true, slug: true } } },
    }),
    prisma.brand.findMany(),
    prisma.product.findMany({
      include: {
        brand: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        images: true,
        specifications: {
          include: {
            definition: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    }),
    prisma.specificationDefinition.findMany(),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    counts: {
      users: users.length,
      categories: categories.length,
      brands: brands.length,
      products: products.length,
      specificationDefinitions: specificationDefinitions.length,
    },
    data: {
      users,
      categories,
      brands,
      products,
      specificationDefinitions,
    },
  };

  const outputPath = join(backupsDir, `export-${timestamp()}.json`);
  writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');

  console.log(`✅ Export saved: ${outputPath}`);
  console.log(
    `   ${exportData.counts.products} products, ${exportData.counts.categories} categories, ${exportData.counts.brands} brands`
  );
}

main()
  .catch((error) => {
    console.error('❌ Export failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
