/**
 * Quick fix script to move products to correct categories
 * Run with: npx tsx scripts/fix-product-category.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Starting product category fix...\n');

  try {
    // 1. First, let's see all categories
    console.log('📂 Current categories in database:');
    const categories = await prisma.category.findMany({
      orderBy: [{ level: 'asc' }, { order: 'asc' }],
      include: { parent: true },
    });
    
    categories.forEach(cat => {
      const indent = '  '.repeat(cat.level);
      const parentInfo = cat.parent ? ` (under ${cat.parent.name})` : '';
      console.log(`${indent}- ${cat.name} [${cat.slug}] ID: ${cat.id}${parentInfo}`);
    });

    // 2. Find Graphics Card category
    let graphicsCardCategory = await prisma.category.findFirst({
      where: { slug: 'graphics-card' },
    });

    if (!graphicsCardCategory) {
      console.log('\n⚠️ Graphics Card category not found. Creating it...');
      
      // Find Components category first
      const componentsCategory = await prisma.category.findFirst({
        where: { slug: 'components' },
      });

      if (!componentsCategory) {
        console.log('❌ Components category not found. Please run the seed first.');
        return;
      }

      graphicsCardCategory = await prisma.category.create({
        data: {
          name: 'Graphics Card',
          slug: 'graphics-card',
          description: 'GPUs and graphics cards',
          parentId: componentsCategory.id,
          level: 1,
          order: 2,
          isActive: true,
        },
      });
      console.log('✅ Graphics Card category created');
    }

    // 3. Find or create NVIDIA subcategory
    let nvidiaCategory = await prisma.category.findFirst({
      where: { slug: 'nvidia' },
    });

    if (!nvidiaCategory) {
      console.log('\n⚠️ NVIDIA category not found. Creating it...');
      nvidiaCategory = await prisma.category.create({
        data: {
          name: 'NVIDIA',
          slug: 'nvidia',
          description: 'NVIDIA Graphics Cards',
          parentId: graphicsCardCategory.id,
          level: 2,
          order: 1,
          isActive: true,
        },
      });
      console.log('✅ NVIDIA category created with ID:', nvidiaCategory.id);
    } else {
      console.log('\n✅ NVIDIA category exists with ID:', nvidiaCategory.id);
    }

    // 4. Find or create AMD GPU subcategory
    let amdGpuCategory = await prisma.category.findFirst({
      where: { slug: 'amd-gpu' },
    });

    if (!amdGpuCategory) {
      console.log('\n⚠️ AMD GPU category not found. Creating it...');
      amdGpuCategory = await prisma.category.create({
        data: {
          name: 'AMD',
          slug: 'amd-gpu',
          description: 'AMD Graphics Cards',
          parentId: graphicsCardCategory.id,
          level: 2,
          order: 2,
          isActive: true,
        },
      });
      console.log('✅ AMD GPU category created with ID:', amdGpuCategory.id);
    } else {
      console.log('✅ AMD GPU category exists with ID:', amdGpuCategory.id);
    }

    // 5. List all products
    console.log('\n📦 Current products in database:');
    const products = await prisma.product.findMany({
      include: { category: true, brand: true },
    });

    if (products.length === 0) {
      console.log('No products found in database.');
    } else {
      products.forEach(p => {
        console.log(`- ${p.name}`);
        console.log(`  ID: ${p.id}`);
        console.log(`  Category: ${p.category.name} [${p.category.slug}]`);
        console.log(`  Brand: ${p.brand.name}`);
        console.log('');
      });
    }

    // 6. Find GPU products that are in wrong category
    const gpuKeywords = ['rtx', 'gtx', 'geforce', 'radeon', 'rx ', 'gpu', 'graphics'];
    const misplacedGpuProducts = products.filter(p => {
      const nameLC = p.name.toLowerCase();
      const isGpuProduct = gpuKeywords.some(kw => nameLC.includes(kw));
      const inGpuCategory = p.category.slug === 'nvidia' || 
                           p.category.slug === 'amd-gpu' || 
                           p.category.slug === 'graphics-card';
      return isGpuProduct && !inGpuCategory;
    });

    if (misplacedGpuProducts.length > 0) {
      console.log('\n🔄 Found GPU products in wrong categories:');
      for (const product of misplacedGpuProducts) {
        console.log(`- ${product.name} (currently in ${product.category.name})`);
        
        // Determine correct category based on brand/name
        const nameLC = product.name.toLowerCase();
        const brandLC = product.brand.name.toLowerCase();
        
        let correctCategoryId: string;
        let correctCategoryName: string;
        
        if (brandLC.includes('nvidia') || nameLC.includes('geforce') || nameLC.includes('rtx') || nameLC.includes('gtx')) {
          correctCategoryId = nvidiaCategory.id;
          correctCategoryName = 'NVIDIA';
        } else if (brandLC.includes('amd') || nameLC.includes('radeon') || nameLC.includes('rx ')) {
          correctCategoryId = amdGpuCategory.id;
          correctCategoryName = 'AMD GPU';
        } else {
          // Default to NVIDIA category for generic GPU products
          correctCategoryId = nvidiaCategory.id;
          correctCategoryName = 'NVIDIA';
        }

        // Update the product
        await prisma.product.update({
          where: { id: product.id },
          data: { categoryId: correctCategoryId },
        });
        
        console.log(`  ✅ Moved to ${correctCategoryName} category`);
      }
    } else {
      console.log('\n✅ No misplaced GPU products found.');
    }

    // 7. Show final state
    console.log('\n📊 Final product distribution by category:');
    const updatedProducts = await prisma.product.findMany({
      include: { category: true },
    });
    
    const categoryCount: Record<string, number> = {};
    updatedProducts.forEach(p => {
      const catName = p.category.name;
      categoryCount[catName] = (categoryCount[catName] || 0) + 1;
    });
    
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`- ${cat}: ${count} product(s)`);
    });

    console.log('\n✅ Fix completed successfully!');
    console.log('\n🔄 Please refresh your browser to see the changes.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
