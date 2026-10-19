import { PrismaClient } from '@prisma/client';
import { productSeoFields, seoDescriptionWasSpecDump, seoFieldNeedsFill } from '../src/lib/seo/catalogSeo';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      shortDescription: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      brand: { select: { name: true } },
      category: { select: { name: true } },
      specifications: {
        where: { specificationDefinition: { key: 'warranty' } },
        select: { value: true },
        take: 1,
      },
    },
  });

  let updated = 0;
  const chunkSize = 40;
  for (let index = 0; index < products.length; index += chunkSize) {
    const chunk = products.slice(index, index + chunkSize);
    const writes = chunk.flatMap((product) => {
      const generated = productSeoFields({
        name: product.name,
        brand: product.brand.name,
        category: product.category.name,
        price: Number(product.price),
        shortDescription: product.shortDescription,
        warranty: product.specifications[0]?.value,
      });
      const data: { metaTitle?: string; metaDescription?: string; metaKeywords?: string } = {};
      if (seoFieldNeedsFill(product.metaTitle)) data.metaTitle = generated.metaTitle;
      if (
        seoFieldNeedsFill(product.metaDescription) ||
        seoDescriptionWasSpecDump(product.metaDescription, product.shortDescription) ||
        product.metaDescription?.includes('Warranty: No Warranty')
      ) {
        data.metaDescription = generated.metaDescription;
      }
      if (seoFieldNeedsFill(product.metaKeywords)) data.metaKeywords = generated.metaKeywords;
      if (Object.keys(data).length === 0) return [];
      return [prisma.product.update({ where: { id: product.id }, data })];
    });
    if (writes.length === 0) continue;
    await prisma.$transaction(writes);
    updated += writes.length;
  }

  const stillEmpty = await prisma.product.count({
    where: { OR: [{ metaTitle: null }, { metaTitle: '' }, { metaDescription: null }, { metaDescription: '' }] },
  });
  console.log(`updated=${updated} stillEmpty=${stillEmpty} total=${products.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
