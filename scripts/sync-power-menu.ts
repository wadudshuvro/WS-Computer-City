/**
 * Add the Star Tech Power menu: UPS and the other power categories, plus UPS brands.
 * Usage: npx tsx scripts/sync-power-menu.ts
 */
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const UPS_BRANDS = [
  'MaxGreen',
  'Digital X',
  'Prolink',
  'Apollo',
  'KSTAR',
  'MARSIVA',
  'Power Pac',
  'Power Guard',
  'Must',
  'KENSON',
  'Dahua',
];

const POWER_ITEMS: Array<{ name: string; slug: string; brands?: boolean }> = [
  { name: 'UPS', slug: 'ups', brands: true },
  { name: 'Online UPS', slug: 'online-ups' },
  { name: 'Mini UPS', slug: 'mini-ups' },
  { name: 'Portable Power Station', slug: 'portable-power-station' },
  { name: 'IPS', slug: 'ips' },
  { name: 'UPS Battery', slug: 'ups-battery' },
  { name: 'Voltage Stabilizer', slug: 'voltage-stabilizer' },
  { name: 'Solar Inverter', slug: 'solar-inverter' },
  { name: 'Solar Panel', slug: 'solar-panel' },
  { name: 'Solar Battery', slug: 'solar-battery' },
  { name: 'Solar Package', slug: 'solar-package' },
  { name: 'Load Calculator', slug: 'load-calculator' },
  { name: 'Show All Power', slug: 'power-all' },
];

function brandSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  let power = await prisma.menuItem.findFirst({ where: { slug: 'power', level: 0 } });
  if (!power) {
    const after = await prisma.menuItem.findFirst({ where: { slug: 'monitor', level: 0 } });
    const sortOrder = (after?.sortOrder ?? 0) + 1;
    await prisma.menuItem.updateMany({
      where: { parentId: null, sortOrder: { gte: sortOrder } },
      data: { sortOrder: { increment: 1 } },
    });
    power = await prisma.menuItem.create({
      data: { name: 'Power', slug: 'power', level: 0, sortOrder, isVisible: true },
    });
  }

  for (let i = 0; i < POWER_ITEMS.length; i++) {
    const item = POWER_ITEMS[i]!;
    const href =
      item.slug === 'power-all'
        ? '/products?category=power'
        : `/products?category=power&sub=${item.slug}`;
    const existing = await prisma.menuItem.findFirst({
      where: { parentId: power.id, slug: item.slug, level: 1 },
    });
    const row = existing
      ? await prisma.menuItem.update({
          where: { id: existing.id },
          data: { name: item.name, sortOrder: i, href, hideArrow: !item.brands, isVisible: true },
        })
      : await prisma.menuItem.create({
          data: {
            name: item.name,
            slug: item.slug,
            parentId: power.id,
            level: 1,
            sortOrder: i,
            href,
            hideArrow: !item.brands,
            isVisible: true,
          },
        });

    if (!item.brands) continue;
    for (let b = 0; b < UPS_BRANDS.length; b++) {
      const name = UPS_BRANDS[b]!;
      const slug = `ups-${brandSlug(name)}`;
      const brandHref = `/products?category=power&sub=ups&brand=${brandSlug(name)}`;
      const child = await prisma.menuItem.findFirst({ where: { parentId: row.id, slug, level: 2 } });
      if (child) {
        await prisma.menuItem.update({
          where: { id: child.id },
          data: { name, sortOrder: b, href: brandHref, hideArrow: true, isVisible: true },
        });
      } else {
        await prisma.menuItem.create({
          data: {
            name,
            slug,
            parentId: row.id,
            level: 2,
            sortOrder: b,
            href: brandHref,
            hideArrow: true,
            isVisible: true,
          },
        });
      }
    }
  }
  console.log('Power menu ready');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
