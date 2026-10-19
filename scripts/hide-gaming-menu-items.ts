import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

async function main() {
  const top = await prisma.menuItem.findFirst({ where: { slug: 'gaming', level: 0 } });
  if (!top) {
    console.log('No Gaming menu row');
    return;
  }
  const result = await prisma.menuItem.updateMany({
    where: { parentId: top.id, slug: { in: ['gaming-keyboard', 'gaming-mouse', 'gaming-headphone'] } },
    data: { isVisible: false },
  });
  console.log(`hidden=${result.count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
