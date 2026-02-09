/**
 * Move RTX 4080 products to NVIDIA subcategory
 * Run with: npx tsx scripts/move-to-nvidia.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Moving GPU products to correct subcategories...\n');

  try {
    // Find NVIDIA category
    const nvidiaCategory = await prisma.category.findFirst({
      where: { slug: 'nvidia' },
    });

    if (!nvidiaCategory) {
      console.log('❌ NVIDIA category not found!');
      return;
    }

    console.log('✅ Found NVIDIA category:', nvidiaCategory.id);

    // Find all products in graphics-card parent category that should be in NVIDIA
    const graphicsCardCategory = await prisma.category.findFirst({
      where: { slug: 'graphics-card' },
    });

    if (!graphicsCardCategory) {
      console.log('❌ Graphics Card category not found!');
      return;
    }

    // Find products that are NVIDIA GPUs but in wrong category
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { categoryId: graphicsCardCategory.id },
          { 
            name: { contains: 'RTX', mode: 'insensitive' }
          },
          { 
            name: { contains: 'GTX', mode: 'insensitive' }
          },
          { 
            name: { contains: 'GeForce', mode: 'insensitive' }
          },
        ],
      },
      include: { category: true, brand: true },
    });

    console.log(`\n📦 Found ${products.length} potential NVIDIA GPU products:`);

    for (const product of products) {
      const isNvidiaProduct = 
        product.name.toLowerCase().includes('rtx') ||
        product.name.toLowerCase().includes('gtx') ||
        product.name.toLowerCase().includes('geforce') ||
        product.brand.name.toLowerCase() === 'nvidia';

      if (isNvidiaProduct && product.categoryId !== nvidiaCategory.id) {
        console.log(`\n- ${product.name}`);
        console.log(`  Current category: ${product.category.name} [${product.category.slug}]`);
        console.log(`  Moving to: NVIDIA [nvidia]`);

        await prisma.product.update({
          where: { id: product.id },
          data: { categoryId: nvidiaCategory.id },
        });

        console.log(`  ✅ Moved successfully!`);
      } else if (product.categoryId === nvidiaCategory.id) {
        console.log(`\n- ${product.name}`);
        console.log(`  ✅ Already in NVIDIA category`);
      }
    }

    // Verify final state
    console.log('\n\n📊 Final state:');
    const nvidiaProducts = await prisma.product.findMany({
      where: { categoryId: nvidiaCategory.id },
      include: { category: true },
    });

    console.log(`\nNVIDIA category now has ${nvidiaProducts.length} product(s):`);
    nvidiaProducts.forEach(p => {
      console.log(`  - ${p.name}`);
    });

    console.log('\n✅ Done! Refresh your browser to see the changes.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
