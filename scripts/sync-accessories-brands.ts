/**
 * Sync Accessories brand flyout children onto Accessories mega-menu items.
 *
 * Usage: npx tsx scripts/sync-accessories-brands.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import {
  ACCESSORIES_BRAND_PARENT_SLUGS,
  getAccessoriesBrandFlyout,
} from '../src/lib/accessoriesBrandMenu';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
  const accessoriesTop = await prisma.menuItem.findFirst({
    where: { slug: 'accessories', level: 0 },
  });

  if (!accessoriesTop) {
    throw new Error('Top menu "Accessories" not found. Run db:sync-accessories-menu first.');
  }

  let created = 0;
  let updatedParents = 0;

  for (const parentSlug of ACCESSORIES_BRAND_PARENT_SLUGS) {
    const parent = await prisma.menuItem.findFirst({
      where: {
        slug: parentSlug,
        level: 1,
        parentId: accessoriesTop.id,
      },
      include: { children: true },
    });

    if (!parent) {
      console.log(`Skip ${parentSlug}: parent menu item not found`);
      continue;
    }

    // Ensure chevron shows (same as Component brand parents)
    if (parent.hideArrow) {
      await prisma.menuItem.update({
        where: { id: parent.id },
        data: { hideArrow: false },
      });
      updatedParents += 1;
    }

    const brands = getAccessoriesBrandFlyout(parentSlug);
    if (!brands?.length) continue;

    const existingBySlug = new Map(parent.children.map((c) => [c.slug, c]));
    let sortOrder = 0;

    for (const brand of brands) {
      const existing = existingBySlug.get(brand.slug);
      if (existing) {
        await prisma.menuItem.update({
          where: { id: existing.id },
          data: {
            name: brand.name,
            sortOrder,
            href: brand.href,
            isVisible: true,
            hideArrow: false,
            level: 2,
          },
        });
      } else {
        await prisma.menuItem.create({
          data: {
            name: brand.name,
            slug: brand.slug,
            parentId: parent.id,
            level: 2,
            sortOrder,
            href: brand.href,
            isVisible: true,
            hideArrow: false,
          },
        });
        created += 1;
      }
      sortOrder += 1;
    }

    console.log(`${parentSlug}: ${brands.length} brands synced`);
  }

  console.log(
    `✅ Accessories brands done. created=${created}, parentsUnhid=${updatedParents}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
