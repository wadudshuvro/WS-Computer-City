/**
 * Fix processor sync edge cases after Star Tech import.
 */
import { PrismaClient, StockStatus } from '@prisma/client';
import { ProductService } from '../src/services/product.service';
import { loadEnvValue } from './load-env';
import fs from 'fs';
import path from 'path';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

async function main() {
  const list = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'docs/imports/startech-processor-list.json'), 'utf8')
  ) as Array<{
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    productUrl: string;
    thumbUrl: string | null;
  }>;

  // 1) Restore i3-14100 price from Star Tech list
  const i314100 = list.find((x) => x.slug.includes('i3-14100'));
  if (i314100) {
    const p = await prisma.product.findUnique({ where: { slug: 'intel-core-i3-14100' } });
    if (p) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          price: i314100.price,
          compareAtPrice: i314100.compareAtPrice,
          stockStatus: StockStatus.IN_STOCK,
        },
      });
      console.log(`Fixed intel-core-i3-14100 → ৳${i314100.price}`);
    }
  }

  // 2) Ensure Ryzen 3 4100 exists
  const r34100 = list.find((x) => /ryzen-3-4100/i.test(x.slug) || /Ryzen 3 4100/i.test(x.name));
  if (r34100) {
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: r34100.slug },
          { slug: { contains: 'ryzen-3-4100' } },
          { name: { contains: 'Ryzen 3 4100', mode: 'insensitive' } },
        ],
      },
    });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          price: r34100.price,
          compareAtPrice: r34100.compareAtPrice,
          stockStatus: StockStatus.IN_STOCK,
        },
      });
      console.log(`Updated existing Ryzen 3 4100 ${existing.slug} → ৳${r34100.price}`);
    } else {
      const processorCat = await prisma.category.findUnique({ where: { slug: 'processor' } });
      const amdBrand = await prisma.brand.findFirst({ where: { slug: 'amd' } });
      const amdCat =
        (await prisma.category.findUnique({ where: { slug: 'amd' } })) ||
        (await prisma.category.findUnique({ where: { slug: 'amd-ryzen' } }));
      if (!processorCat || !amdBrand) throw new Error('processor/amd missing');

      const categoryId =
        amdCat?.parentId === processorCat.id ? amdCat.id : processorCat.id;

      const localImg = `/uploads/processors/${r34100.slug}.jpg`;
      const created = await ProductService.create({
        name: r34100.name,
        slug: r34100.slug,
        sku: 'CPU-A-RYZEN34100',
        price: r34100.price,
        compareAtPrice: r34100.compareAtPrice,
        stockStatus: 'IN_STOCK',
        stockQuantity: 10,
        lowStockAlert: 3,
        categoryId,
        brandId: amdBrand.id,
        isFeatured: false,
        isActive: true,
        images: [
          {
            url: r34100.thumbUrl || localImg,
            alt: r34100.name,
            order: 0,
            isPrimary: true,
          },
        ],
        specifications: [{ key: 'warranty', value: '03 Years' }],
      } as any);
      console.log(`Created missing ${created.slug} @ ৳${r34100.price}`);
    }
  }

  // 3) If duplicate 14th-gen i3-14100 exists alongside short slug, keep both but align prices
  const dup = await prisma.product.findUnique({
    where: { slug: 'intel-core-i3-14100-14th-gen-processor' },
  });
  if (dup && i314100) {
    await prisma.product.update({
      where: { id: dup.id },
      data: { price: i314100.price, compareAtPrice: i314100.compareAtPrice },
    });
    console.log(`Aligned duplicate ${dup.slug} price`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
