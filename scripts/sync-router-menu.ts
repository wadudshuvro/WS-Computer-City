/**
 * Add Networking → Router (first item) and the router brand flyout.
 * Usage: npx tsx scripts/sync-router-menu.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { ROUTER_BRANDS } from '../src/lib/routerCatalog';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

async function main() {
  let networking = await prisma.menuItem.findFirst({
    where: { slug: 'networking', level: 0 },
  });
  if (!networking) {
    const topCount = await prisma.menuItem.count({ where: { parentId: null } });
    networking = await prisma.menuItem.create({
      data: {
        name: 'Networking',
        slug: 'networking',
        parentId: null,
        level: 0,
        sortOrder: topCount,
        href: '/products?category=networking&sub=router',
        isVisible: true,
        hideArrow: false,
      },
    });
  } else {
    networking = await prisma.menuItem.update({
      where: { id: networking.id },
      data: { href: '/products?category=networking&sub=router', isVisible: true, name: 'Networking' },
    });
  }

  let router = await prisma.menuItem.findFirst({
    where: { parentId: networking.id, slug: 'router', level: 1 },
  });
  if (!router) {
    router = await prisma.menuItem.create({
      data: {
        name: 'Router',
        slug: 'router',
        parentId: networking.id,
        level: 1,
        sortOrder: 0,
        href: '/products?category=networking&sub=router',
        isVisible: true,
        hideArrow: false,
      },
    });
  } else {
    router = await prisma.menuItem.update({
      where: { id: router.id },
      data: {
        name: 'Router',
        sortOrder: 0,
        href: '/products?category=networking&sub=router',
        isVisible: true,
        hideArrow: false,
      },
    });
  }

  for (let index = 0; index < ROUTER_BRANDS.length; index++) {
    const brand = ROUTER_BRANDS[index]!;
    const href = `/products?category=networking&sub=router&brand=${brand.slug}`;
    const existing = await prisma.menuItem.findFirst({
      where: { parentId: router.id, slug: brand.slug, level: 2 },
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
          parentId: router.id,
          level: 2,
          sortOrder: index,
          href,
          hideArrow: true,
          isVisible: true,
        },
      });
    }
  }

  console.log(`Networking menu ready. brands=${ROUTER_BRANDS.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
