/**
 * Sync Monitor mega-menu brand + type children (Star Tech list).
 *
 * Usage: npx tsx scripts/sync-monitor-menu.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { MONITOR_MENU_ITEMS } from '../src/lib/monitorMenuBrands';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

async function main() {
  let monitor = await prisma.menuItem.findFirst({
    where: { slug: 'monitor', level: 0 },
  });

  if (!monitor) {
    const topCount = await prisma.menuItem.count({ where: { parentId: null } });
    monitor = await prisma.menuItem.create({
      data: {
        name: 'Monitor',
        slug: 'monitor',
        parentId: null,
        level: 0,
        sortOrder: topCount,
        isVisible: true,
      },
    });
    console.log('Created top menu Monitor');
  }

  let created = 0;
  let updated = 0;

  for (let i = 0; i < MONITOR_MENU_ITEMS.length; i++) {
    const item = MONITOR_MENU_ITEMS[i]!;
    const existing = await prisma.menuItem.findFirst({
      where: {
        parentId: monitor.id,
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
          parentId: monitor.id,
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
    `✅ Monitor menu synced. created=${created}, updated=${updated}, total=${MONITOR_MENU_ITEMS.length}`
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
