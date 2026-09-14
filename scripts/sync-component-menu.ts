/**
 * Ensure Component mega-menu level-1 items match Star Tech order/list.
 * Does not delete brand flyouts; only creates missing subs and reorders.
 *
 * Usage: npx tsx scripts/sync-component-menu.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');

const prisma = new PrismaClient();

/** Star Tech Component dropdown order (level 1 only). */
const COMPONENT_SUBS: Array<{
  name: string;
  slug: string;
  href?: string;
  hideArrow?: boolean;
}> = [
  { name: 'Processor', slug: 'processor' },
  { name: 'CPU Cooler', slug: 'cpu-cooler' },
  { name: 'Motherboard', slug: 'motherboard' },
  { name: 'Graphics Card', slug: 'graphics-card' },
  { name: 'RAM (Desktop)', slug: 'desktop-ram' },
  { name: 'RAM (Laptop)', slug: 'laptop-ram' },
  { name: 'Power Supply', slug: 'power-supply' },
  { name: 'Hard Disk Drive', slug: 'hdd' },
  { name: 'Portable Hard Disk Drive', slug: 'portable-hdd' },
  { name: 'SSD', slug: 'ssd' },
  { name: 'Portable SSD', slug: 'portable-ssd' },
  { name: 'Casing', slug: 'computer-case' },
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

async function main() {
  const component = await prisma.menuItem.findFirst({
    where: { slug: 'components', level: 0 },
  });

  if (!component) {
    throw new Error('Top menu "Component" (slug=components) not found. Run db:seed-menus first.');
  }

  let created = 0;
  let updated = 0;

  for (let i = 0; i < COMPONENT_SUBS.length; i++) {
    const item = COMPONENT_SUBS[i]!;
    const existing = await prisma.menuItem.findFirst({
      where: {
        parentId: component.id,
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
          href: item.href ?? existing.href,
          hideArrow: item.hideArrow ?? existing.hideArrow,
          isVisible: true,
        },
      });
      updated += 1;
    } else {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          slug: item.slug,
          parentId: component.id,
          level: 1,
          sortOrder: i,
          href: item.href ?? null,
          hideArrow: item.hideArrow ?? false,
          isVisible: true,
        },
      });
      created += 1;
    }
  }

  const after = await prisma.menuItem.findMany({
    where: { parentId: component.id, level: 1 },
    orderBy: { sortOrder: 'asc' },
    select: { name: true, slug: true, sortOrder: true },
  });

  console.log(`✅ Component menu synced. created=${created}, updated=${updated}`);
  console.log(after.map((r) => `${r.sortOrder}. ${r.name}`).join('\n'));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
