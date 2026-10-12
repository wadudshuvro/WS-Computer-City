import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

const preferred = [
  'watch',
  'earbuds',
  'earphone',
  'neckband',
  'monitor',
  'keyboard',
  'mouse',
  'graphics-card',
  'nvidia',
  'amd-gpu',
  'desktop-ram',
  'cpu-cooler',
  'motherboard',
  'ssd',
  'power-supply',
  'casing',
  'gaming',
];

async function main() {
  const existing = await prisma.product.count({ where: { topDealOrder: { not: null } } });
  if (existing >= 20) {
    console.log(`Top Deals already has ${existing} products.`);
    return;
  }

  const chosen: string[] = (
    await prisma.product.findMany({
      where: { topDealOrder: { not: null } },
      select: { id: true },
      orderBy: { topDealOrder: 'asc' },
    })
  ).map((product) => product.id);

  for (const slug of preferred) {
    if (chosen.length >= 20) break;
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: chosen },
        images: { some: {} },
        category: { OR: [{ slug }, { parent: { slug } }] },
      },
      take: 2,
      orderBy: { price: 'asc' },
      select: { id: true },
    });
    for (const row of rows) {
      if (chosen.length >= 20) break;
      chosen.push(row.id);
    }
  }

  if (chosen.length < 20) {
    const filler = await prisma.product.findMany({
      where: { isActive: true, id: { notIn: chosen }, images: { some: {} } },
      take: 20 - chosen.length,
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    for (const row of filler) chosen.push(row.id);
  }

  await prisma.$transaction(
    chosen.map((id, index) =>
      prisma.product.update({
        where: { id },
        data: { topDealOrder: index },
      })
    )
  );
  console.log(`Top Deals set to ${chosen.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
