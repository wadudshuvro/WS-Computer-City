/**
 * Add the UPS brand flyout under Power -> UPS.
 * Usage: npx tsx scripts/sync-ups-menu.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { UPS_BRANDS } from '../src/lib/upsCatalog';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const UPS_HREF = '/products?category=power&sub=ups';

async function main() {
  const power = await prisma.menuItem.findFirst({ where: { slug: 'power', level: 0 } });
  if (!power) throw new Error('Power top menu item not found');

  let ups = await prisma.menuItem.findFirst({ where: { parentId: power.id, slug: 'ups' } });
  if (!ups) {
    const count = await prisma.menuItem.count({ where: { parentId: power.id } });
    ups = await prisma.menuItem.create({
      data: {
        name: 'UPS',
        slug: 'ups',
        parentId: power.id,
        level: 1,
        sortOrder: count,
        href: UPS_HREF,
        isVisible: true,
        hideArrow: false,
      },
    });
  } else {
    ups = await prisma.menuItem.update({
      where: { id: ups.id },
      data: { href: UPS_HREF, isVisible: true, hideArrow: false },
    });
  }

  for (let index = 0; index < UPS_BRANDS.length; index++) {
    const brand = UPS_BRANDS[index]!;
    const href = `${UPS_HREF}&brand=${brand.slug}`;
    const existing = await prisma.menuItem.findFirst({
      where: { parentId: ups.id, slug: brand.slug, level: 2 },
    });
    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { name: brand.label, sortOrder: index, href, hideArrow: true, isVisible: true },
      });
    } else {
      await prisma.menuItem.create({
        data: {
          name: brand.label,
          slug: brand.slug,
          parentId: ups.id,
          level: 2,
          sortOrder: index,
          href,
          hideArrow: true,
          isVisible: true,
        },
      });
    }
  }
  console.log(`UPS menu ready. brands=${UPS_BRANDS.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
