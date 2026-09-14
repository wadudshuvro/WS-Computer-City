/**
 * Sync brand flyout children onto Component menu items in CMS
 * (Desktop RAM, Laptop RAM, PSU, SSD, Casing, CPU Cooler).
 *
 * Usage: npx tsx scripts/sync-menu-brands.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { getComponentBrandFlyout, COMPONENT_BRAND_PARENT_SLUGS } from '../src/lib/componentBrandMenu';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
  let created = 0;

  for (const parentSlug of COMPONENT_BRAND_PARENT_SLUGS) {
    const parent = await prisma.menuItem.findFirst({
      where: { slug: parentSlug, level: 1 },
      include: { children: true },
    });

    if (!parent) {
      console.log(`Skip ${parentSlug}: parent menu item not found`);
      continue;
    }

    const brands = getComponentBrandFlyout(parentSlug);
    if (!brands?.length) continue;

    const existingSlugs = new Set(parent.children.map((c) => c.slug));
    let sortOrder = parent.children.length;

    for (const brand of brands) {
      if (existingSlugs.has(brand.slug)) continue;

      await prisma.menuItem.create({
        data: {
          name: brand.name,
          slug: brand.slug,
          parentId: parent.id,
          level: 2,
          sortOrder: sortOrder++,
          href: brand.href,
          isVisible: true,
          hideArrow: false,
        },
      });
      created += 1;
    }

    console.log(
      `${parentSlug}: ${parent.children.length} existing, synced brands (added this run as needed)`
    );
  }

  console.log(`✅ Done. Created ${created} brand menu item(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
