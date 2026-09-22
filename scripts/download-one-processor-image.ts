import fs from 'fs';
import path from 'path';
import https from 'https';
import { PrismaClient } from '@prisma/client';
import { loadEnvValue } from './load-env';

process.env.DATABASE_URL = loadEnvValue('DATABASE_URL');
const prisma = new PrismaClient();

function get(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            Referer: 'https://www.startech.com.bd/',
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            get(res.headers.location.startsWith('http') ? res.headers.location : `https://www.startech.com.bd${res.headers.location}`)
              .then(resolve, reject);
            return;
          }
          const chunks: Buffer[] = [];
          res.on('data', (d) => chunks.push(d));
          res.on('end', () => resolve(Buffer.concat(chunks)));
        }
      )
      .on('error', reject);
  });
}

async function main() {
  const list = JSON.parse(
    fs.readFileSync('docs/imports/startech-processor-list.json', 'utf8')
  ) as Array<{ slug: string; thumbUrl: string | null; name: string }>;
  const item = list.find((x) => x.slug.includes('ryzen-3-4100'));
  const p = await prisma.product.findFirst({ where: { slug: { contains: 'ryzen-3-4100' } } });
  if (!p || !item?.thumbUrl) {
    console.log('missing product or thumb', !!p, !!item);
    return;
  }
  const url = item.thumbUrl.replace('-228x228.', '-800x800.');
  const buf = await get(url);
  const filename = `${p.slug}.jpg`;
  fs.writeFileSync(path.join('public/uploads/processors', filename), buf);
  const local = `/uploads/processors/${filename}`;
  const imgs = await prisma.productImage.findMany({ where: { productId: p.id } });
  if (imgs[0]) {
    await prisma.productImage.update({
      where: { id: imgs[0].id },
      data: { url: local, isPrimary: true, alt: item.name },
    });
  } else {
    await prisma.productImage.create({
      data: { productId: p.id, url: local, alt: item.name, order: 0, isPrimary: true },
    });
  }
  console.log('ok', local, buf.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
