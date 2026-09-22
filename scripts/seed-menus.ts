/**
 * Seed a slim CMS mega menu (Component-focused).
 * Idempotent: skips if any MenuItem already exists.
 *
 * Usage: npx tsx scripts/seed-menus.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';
import { getComponentBrandFlyout } from '../src/lib/componentBrandMenu';
import { MONITOR_MENU_ITEMS } from '../src/lib/monitorMenuBrands';
import { ACCESSORIES_MENU_ITEMS } from '../src/lib/accessoriesMenuItems';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

type SeedChild = {
  name: string;
  slug: string;
  href?: string;
  hideArrow?: boolean;
  children?: SeedChild[];
};

function brandSeedChildren(subSlug: string): SeedChild[] {
  return (
    getComponentBrandFlyout(subSlug)?.map((b) => ({
      name: b.name,
      slug: b.slug,
      href: b.href ?? undefined,
    })) ?? []
  );
}

const COMPONENT_SUBS: SeedChild[] = [
  {
    name: 'Processor',
    slug: 'processor',
    children: [
      { name: 'Intel', slug: 'intel' },
      { name: 'AMD Ryzen', slug: 'amd-ryzen' },
    ],
  },
  { name: 'CPU Cooler', slug: 'cpu-cooler', children: brandSeedChildren('cpu-cooler') },
  {
    name: 'Motherboard',
    slug: 'motherboard',
    children: [
      { name: 'Intel Motherboard', slug: 'intel-motherboard' },
      { name: 'AMD Motherboard', slug: 'amd-motherboard' },
    ],
  },
  {
    name: 'Graphics Card',
    slug: 'graphics-card',
    children: [
      { name: 'NVIDIA', slug: 'nvidia' },
      { name: 'AMD', slug: 'amd-gpu' },
    ],
  },
  { name: 'RAM (Desktop)', slug: 'desktop-ram', children: brandSeedChildren('desktop-ram') },
  { name: 'RAM (Laptop)', slug: 'laptop-ram', children: brandSeedChildren('laptop-ram') },
  { name: 'Power Supply', slug: 'power-supply', children: brandSeedChildren('power-supply') },
  { name: 'Hard Disk Drive', slug: 'hdd' },
  { name: 'Portable Hard Disk Drive', slug: 'portable-hdd' },
  { name: 'SSD', slug: 'ssd', children: brandSeedChildren('ssd') },
  { name: 'Portable SSD', slug: 'portable-ssd' },
  { name: 'Casing', slug: 'computer-case', children: brandSeedChildren('computer-case') },
  { name: 'Casing Cooler', slug: 'casing-fan' },
  { name: 'Optical Disk Drive', slug: 'optical-disk-drive' },
  { name: 'Vertical GPU Holder', slug: 'gpu-vertical-mount' },
  { name: 'Water / Liquid Cooling', slug: 'liquid-cooling' },
  {
    name: 'Show All Component',
    slug: 'components-all',
    href: '/products?category=components',
    hideArrow: true,
  },
];

async function createChildren(
  parentId: string,
  parentLevel: number,
  items: SeedChild[]
) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const created = await prisma.menuItem.create({
      data: {
        name: item.name,
        slug: item.slug,
        parentId,
        level: parentLevel + 1,
        sortOrder: i,
        href: item.href ?? null,
        hideArrow: item.hideArrow ?? false,
        isVisible: true,
      },
    });
    if (item.children?.length) {
      await createChildren(created.id, created.level, item.children);
    }
  }
}

async function main() {
  const existing = await prisma.menuItem.count();
  if (existing > 0) {
    console.log(`Menu already has ${existing} items — skip seed.`);
    return;
  }

  console.log('Seeding slim mega menu...');

  const component = await prisma.menuItem.create({
    data: {
      name: 'Component',
      slug: 'components',
      parentId: null,
      level: 0,
      sortOrder: 0,
      isVisible: true,
    },
  });

  await createChildren(component.id, 0, COMPONENT_SUBS);

  const monitor = await prisma.menuItem.create({
    data: {
      name: 'Monitor',
      slug: 'monitor',
      parentId: null,
      level: 0,
      sortOrder: 1,
      isVisible: true,
    },
  });

  await createChildren(
    monitor.id,
    0,
    MONITOR_MENU_ITEMS.map((item) => ({
      name: item.name,
      slug: item.slug,
      href: item.href,
      hideArrow: item.hideArrow ?? true,
    }))
  );

  const accessories = await prisma.menuItem.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      parentId: null,
      level: 0,
      sortOrder: 2,
      isVisible: true,
    },
  });

  await createChildren(
    accessories.id,
    0,
    ACCESSORIES_MENU_ITEMS.map((item) => ({
      name: item.name,
      slug: item.slug,
      href: item.href,
      hideArrow: item.hideArrow ?? true,
    }))
  );

  console.log(
    `✅ Seeded menu: ${component.name}, ${monitor.name}, ${accessories.name} (+ brands)`
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
