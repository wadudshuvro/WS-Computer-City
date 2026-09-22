/**
 * Sync Accessories mega-menu children (Star Tech list).
 *
 * Usage: npx tsx scripts/sync-accessories-menu.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { ACCESSORIES_MENU_ITEMS } from '../src/lib/accessoriesMenuItems';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
  let accessories = await prisma.menuItem.findFirst({
    where: { slug: 'accessories', level: 0 },
  });

  if (!accessories) {
    const topCount = await prisma.menuItem.count({ where: { parentId: null } });
    accessories = await prisma.menuItem.create({
      data: {
        name: 'Accessories',
        slug: 'accessories',
        parentId: null,
        level: 0,
        sortOrder: topCount,
        isVisible: true,
      },
    });
    console.log('Created top menu Accessories');
  }

  let created = 0;
  let updated = 0;

  for (let i = 0; i < ACCESSORIES_MENU_ITEMS.length; i++) {
    const item = ACCESSORIES_MENU_ITEMS[i]!;
    const existing = await prisma.menuItem.findFirst({
      where: {
        parentId: accessories.id,
        slug: item.slug,
        level: 1,
      },
    });

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          sortOrder: i,
          href: item.href,
          hideArrow: item.hideArrow ?? true,
          isVisible: true,
        },
      });
      updated += 1;
    } else {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          slug: item.slug,
          parentId: accessories.id,
          level: 1,
          sortOrder: i,
          href: item.href,
          hideArrow: item.hideArrow ?? true,
          isVisible: true,
        },
      });
      created += 1;
    }
  }

  console.log(
    `✅ Accessories menu synced. created=${created}, updated=${updated}, total=${ACCESSORIES_MENU_ITEMS.length}`
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
