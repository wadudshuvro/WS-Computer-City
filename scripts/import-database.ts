/**
 * Import products/categories/brands/specs from the latest backups/export-*.json
 * Used when SQL restore is unavailable. Prefer SQL via npm run db:restore.
 */
import { PrismaClient, Prisma } from '@prisma/client';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface ExportFile {
  exportedAt?: string;
  counts?: Record<string, number>;
  data: {
    users?: Array<{
      id: string;
      email: string;
      name: string | null;
      role: string;
      createdAt: string;
      updatedAt: string;
    }>;
    categories: Array<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
      parentId: string | null;
      level: number;
      order: number;
      createdAt?: string;
      updatedAt?: string;
    }>;
    brands: Array<{
      id: string;
      name: string;
      slug: string;
      logo: string | null;
      description: string | null;
      isActive: boolean;
      createdAt?: string;
      updatedAt?: string;
    }>;
    specificationDefinitions: Array<{
      id: string;
      categoryId: string;
      name: string;
      key: string;
      dataType: string;
      unit: string | null;
      isFilterable: boolean;
      isRequired: boolean;
      order: number;
    }>;
    products: Array<{
      id: string;
      name: string;
      slug: string;
      sku: string;
      description: string | null;
      shortDescription: string | null;
      price: string | number;
      compareAtPrice: string | number | null;
      costPrice: string | number | null;
      stockStatus: string;
      stockQuantity: number;
      lowStockAlert: number;
      categoryId: string;
      brandId: string;
      metaTitle: string | null;
      metaDescription: string | null;
      metaKeywords: string | null;
      isFeatured: boolean;
      isActive: boolean;
      publishedAt: string | null;
      images?: Array<{
        id?: string;
        url: string;
        alt: string | null;
        order: number;
        isPrimary: boolean;
      }>;
      specifications?: Array<{
        id?: string;
        value: string;
        specificationDefinitionId?: string;
        specificationDefinition?: { id: string; key: string };
      }>;
    }>;
  };
}

function findLatestJsonExport(backupsDir: string): string | null {
  if (!existsSync(backupsDir)) return null;
  const files = readdirSync(backupsDir)
    .filter((f) => f.startsWith('export-') && f.endsWith('.json'))
    .sort()
    .reverse();
  return files.length > 0 ? join(backupsDir, files[0]) : null;
}

function toDecimal(value: string | number | null | undefined): Prisma.Decimal | null {
  if (value === null || value === undefined || value === '') return null;
  return new Prisma.Decimal(value);
}

async function main() {
  const backupsDir = join(process.cwd(), 'backups');
  const exportPath = findLatestJsonExport(backupsDir);

  if (!exportPath) {
    console.error('❌ No export-*.json found in backups/');
    process.exit(1);
  }

  console.log(`📥 Importing from: ${exportPath}`);
  const raw = JSON.parse(readFileSync(exportPath, 'utf-8')) as ExportFile;
  const { categories, brands, specificationDefinitions, products } = raw.data;

  // Categories: parents (no parentId) first, then by level
  const sortedCategories = [...categories].sort((a, b) => {
    if (!a.parentId && b.parentId) return -1;
    if (a.parentId && !b.parentId) return 1;
    return (a.level ?? 0) - (b.level ?? 0);
  });

  for (const cat of sortedCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        parentId: cat.parentId,
        level: cat.level,
        order: cat.order,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        parentId: cat.parentId,
        level: cat.level,
        order: cat.order,
      },
    });
  }
  console.log(`✅ Categories: ${sortedCategories.length}`);

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      update: {
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description,
        isActive: brand.isActive,
      },
      create: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description,
        isActive: brand.isActive,
      },
    });
  }
  console.log(`✅ Brands: ${brands.length}`);

  for (const def of specificationDefinitions) {
    await prisma.specificationDefinition.upsert({
      where: { id: def.id },
      update: {
        categoryId: def.categoryId,
        name: def.name,
        key: def.key,
        dataType: def.dataType as 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT',
        unit: def.unit,
        isFilterable: def.isFilterable,
        isRequired: def.isRequired,
        order: def.order,
      },
      create: {
        id: def.id,
        categoryId: def.categoryId,
        name: def.name,
        key: def.key,
        dataType: def.dataType as 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT',
        unit: def.unit,
        isFilterable: def.isFilterable,
        isRequired: def.isRequired,
        order: def.order,
      },
    });
  }
  console.log(`✅ Spec definitions: ${specificationDefinitions.length}`);

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        shortDescription: product.shortDescription,
        price: toDecimal(product.price)!,
        compareAtPrice: toDecimal(product.compareAtPrice),
        costPrice: toDecimal(product.costPrice),
        stockStatus: product.stockStatus as 'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER' | 'UPCOMING' | 'DISCONTINUED',
        stockQuantity: product.stockQuantity,
        lowStockAlert: product.lowStockAlert,
        categoryId: product.categoryId,
        brandId: product.brandId,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        publishedAt: product.publishedAt ? new Date(product.publishedAt) : null,
      },
      create: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        shortDescription: product.shortDescription,
        price: toDecimal(product.price)!,
        compareAtPrice: toDecimal(product.compareAtPrice),
        costPrice: toDecimal(product.costPrice),
        stockStatus: product.stockStatus as 'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER' | 'UPCOMING' | 'DISCONTINUED',
        stockQuantity: product.stockQuantity,
        lowStockAlert: product.lowStockAlert,
        categoryId: product.categoryId,
        brandId: product.brandId,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        publishedAt: product.publishedAt ? new Date(product.publishedAt) : null,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    if (product.images && product.images.length > 0) {
      await prisma.productImage.createMany({
        data: product.images.map((img, index) => ({
          productId: product.id,
          url: img.url,
          alt: img.alt,
          order: img.order ?? index,
          isPrimary: img.isPrimary ?? index === 0,
        })),
      });
    }

    await prisma.productSpecification.deleteMany({ where: { productId: product.id } });
    const specs =
      product.specifications
        ?.map((s) => ({
          productId: product.id,
          specificationDefinitionId:
            s.specificationDefinitionId || s.specificationDefinition?.id || '',
          value: s.value,
        }))
        .filter((s) => s.specificationDefinitionId && s.value) ?? [];

    if (specs.length > 0) {
      await prisma.productSpecification.createMany({ data: specs });
    }
  }
  console.log(`✅ Products: ${products.length}`);

  console.log('✅ JSON import complete. Restart npm run dev if it is running.');
}

main()
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
