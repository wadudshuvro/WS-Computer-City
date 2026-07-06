import { PrismaClient, StockStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper to ensure connection
async function ensureConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function main() {
  console.log('🌱 Starting database seed...');
  
  await ensureConnection();

  // 1. Create Admin User
  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wscomputercity.com' },
    update: {},
    create: {
      email: 'admin@wscomputercity.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Create Brands
  console.log('Creating brands...');
  
  // Core brands
  const coreBrands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'intel' },
      update: {},
      create: {
        name: 'Intel',
        slug: 'intel',
        description: 'Leading processor manufacturer',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'amd' },
      update: {},
      create: {
        name: 'AMD',
        slug: 'amd',
        description: 'Advanced Micro Devices',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'nvidia' },
      update: {},
      create: {
        name: 'NVIDIA',
        slug: 'nvidia',
        description: 'Graphics card leader',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'samsung' },
      update: {},
      create: {
        name: 'Samsung',
        slug: 'samsung',
        description: 'Memory and storage solutions',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'asus' },
      update: {},
      create: {
        name: 'ASUS',
        slug: 'asus',
        description: 'Computer hardware and electronics',
        isActive: true,
      },
    }),
  ]);

  // SSD Brands - from Tech Land reference
  const ssdBrandsList = [
    { name: 'Corsair', slug: 'corsair', description: 'Gaming peripherals and components' },
    { name: 'Kingston', slug: 'kingston', description: 'Memory and storage products' },
    { name: 'Team', slug: 'team', description: 'Memory and storage solutions' },
    { name: 'XOC', slug: 'xoc', description: 'Storage solutions' },
    { name: 'MiPhi', slug: 'miphi', description: 'Storage products' },
    { name: 'OSCOO', slug: 'oscoo', description: 'SSD manufacturer' },
    { name: 'Lexar', slug: 'lexar', description: 'Memory and storage products' },
    { name: 'MSI', slug: 'msi', description: 'Gaming hardware manufacturer' },
    { name: 'SanDisk', slug: 'sandisk', description: 'Flash storage solutions' },
    { name: 'Seagate', slug: 'seagate', description: 'Data storage solutions' },
    { name: 'Adata', slug: 'adata', description: 'Memory and storage manufacturer' },
    { name: 'Ocpc', slug: 'ocpc', description: 'Gaming hardware' },
    { name: 'Western Digital', slug: 'western-digital', description: 'Storage solutions' },
    { name: 'Aitc', slug: 'aitc', description: 'Storage products' },
    { name: 'Acer', slug: 'acer', description: 'Computer hardware' },
    { name: 'Transcend', slug: 'transcend', description: 'Memory and storage' },
    { name: 'Crucial', slug: 'crucial', description: 'Memory and storage by Micron' },
    { name: 'Apacer', slug: 'apacer', description: 'Digital storage solutions' },
    { name: 'Colorful', slug: 'colorful', description: 'Graphics cards and storage' },
    { name: 'KingSpec', slug: 'kingspec', description: 'SSD manufacturer' },
    { name: 'Netac', slug: 'netac', description: 'Flash memory products' },
    { name: 'PNY', slug: 'pny', description: 'Memory and storage products' },
    { name: 'Twinmos', slug: 'twinmos', description: 'Memory solutions' },
    { name: 'Pc Power', slug: 'pc-power', description: 'Computer components' },
    { name: 'Biwintech', slug: 'biwintech', description: 'Storage solutions' },
    { name: 'Kingbox', slug: 'kingbox', description: 'Storage products' },
    { name: 'GIGABYTE', slug: 'gigabyte', description: 'Computer hardware manufacturer' },
    { name: 'NCX', slug: 'ncx', description: 'Storage products' },
    { name: 'Orico', slug: 'orico', description: 'Digital accessories' },
    { name: 'HP', slug: 'hp', description: 'Computing and printing solutions' },
    { name: 'King Super', slug: 'king-super', description: 'Storage products' },
    { name: 'Addlink', slug: 'addlink', description: 'Memory and storage' },
    { name: 'NEO FORZA', slug: 'neo-forza', description: 'Memory and storage' },
    { name: 'Hikvision', slug: 'hikvision', description: 'Security and storage' },
    { name: 'Patriot', slug: 'patriot', description: 'Memory and storage' },
    { name: 'Ramsta', slug: 'ramsta', description: 'Storage solutions' },
    { name: 'Redragon', slug: 'redragon', description: 'Gaming peripherals' },
    { name: 'Kimtigo', slug: 'kimtigo', description: 'Memory products' },
    { name: 'AGI', slug: 'agi', description: 'Storage solutions' },
    { name: 'Revenger', slug: 'revenger', description: 'Gaming storage' },
    { name: 'Dahua', slug: 'dahua', description: 'Security and storage' },
    { name: 'LENOVO', slug: 'lenovo', description: 'Computing solutions' },
    { name: 'Smart', slug: 'smart', description: 'Storage products' },
    { name: 'Walton', slug: 'walton', description: 'Electronics manufacturer' },
    { name: 'Suneest', slug: 'suneest', description: 'Storage products' },
    { name: 'Kingbank', slug: 'kingbank', description: 'Memory products' },
  ];

  // Create SSD brands in batches to avoid connection issues
  console.log('Creating SSD brands...');
  for (const brand of ssdBrandsList) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: {
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        isActive: true,
      },
    });
  }

  const brands = coreBrands;
  console.log('✅ Brands created:', coreBrands.length + ssdBrandsList.length);

  // 3. Create Category Structure
  console.log('Creating categories...');
  
  // Root categories
  const desktopPC = await prisma.category.upsert({
    where: { slug: 'desktop-pc' },
    update: {},
    create: {
      name: 'Desktop PC',
      slug: 'desktop-pc',
      description: 'Complete desktop computer systems',
      level: 0,
      order: 1,
      isActive: true,
    },
  });

  const components = await prisma.category.upsert({
    where: { slug: 'components' },
    update: {},
    create: {
      name: 'Components',
      slug: 'components',
      description: 'Computer components and parts',
      level: 0,
      order: 2,
      isActive: true,
    },
  });

  const laptop = await prisma.category.upsert({
    where: { slug: 'laptop' },
    update: {},
    create: {
      name: 'Laptop',
      slug: 'laptop',
      description: 'Laptops and notebooks',
      level: 0,
      order: 3,
      isActive: true,
    },
  });

  // Sub-categories under Components
  const processor = await prisma.category.upsert({
    where: { slug: 'processor' },
    update: {},
    create: {
      name: 'Processor',
      slug: 'processor',
      description: 'CPUs and processors',
      parentId: components.id,
      level: 1,
      order: 1,
      isActive: true,
    },
  });

  // Intel Sub-category under Processor
  const intelProcessor = await prisma.category.upsert({
    where: { slug: 'intel' },
    update: {},
    create: {
      name: 'Intel',
      slug: 'intel',
      description: 'Intel Processors',
      parentId: processor.id,
      level: 2,
      order: 1,
      isActive: true,
    },
  });

  // AMD Sub-category under Processor
  const amdProcessor = await prisma.category.upsert({
    where: { slug: 'amd' },
    update: {},
    create: {
      name: 'AMD',
      slug: 'amd',
      description: 'AMD Processors',
      parentId: processor.id,
      level: 2,
      order: 2,
      isActive: true,
    },
  });

  const graphicsCard = await prisma.category.upsert({
    where: { slug: 'graphics-card' },
    update: {},
    create: {
      name: 'Graphics Card',
      slug: 'graphics-card',
      description: 'GPUs and graphics cards',
      parentId: components.id,
      level: 1,
      order: 2,
      isActive: true,
    },
  });

  // NVIDIA Sub-category under Graphics Card
  const nvidiaGpu = await prisma.category.upsert({
    where: { slug: 'nvidia' },
    update: {},
    create: {
      name: 'NVIDIA',
      slug: 'nvidia',
      description: 'NVIDIA Graphics Cards',
      parentId: graphicsCard.id,
      level: 2,
      order: 1,
      isActive: true,
    },
  });

  // AMD Sub-category under Graphics Card
  const amdGpu = await prisma.category.upsert({
    where: { slug: 'amd-gpu' },
    update: {},
    create: {
      name: 'AMD',
      slug: 'amd-gpu',
      description: 'AMD Graphics Cards',
      parentId: graphicsCard.id,
      level: 2,
      order: 2,
      isActive: true,
    },
  });

  const ssd = await prisma.category.upsert({
    where: { slug: 'ssd' },
    update: {},
    create: {
      name: 'SSD',
      slug: 'ssd',
      description: 'Solid State Drives',
      parentId: components.id,
      level: 1,
      order: 3,
      isActive: true,
    },
  });

  const ram = await prisma.category.upsert({
    where: { slug: 'ram' },
    update: {},
    create: {
      name: 'RAM',
      slug: 'ram',
      description: 'Memory modules',
      parentId: components.id,
      level: 1,
      order: 4,
      isActive: true,
    },
  });

  console.log('✅ Categories created');

  // 4. Create Specification Definitions for Intel Processor Sub-Category
  console.log('Creating specification definitions...');
  
  // Create all processor specification definitions that match filterConfig keys
  const intelProcessorSpecs = await Promise.all([
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'socket_type' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'CPU Socket',
        key: 'socket_type',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 1,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'number_of_cores' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Number Of Cores',
        key: 'number_of_cores',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 2,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'number_of_threads' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Number Of Threads',
        key: 'number_of_threads',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 3,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'base_clock' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Base Frequency',
        key: 'base_clock',
        dataType: 'NUMBER',
        unit: 'GHz',
        isFilterable: false,
        isRequired: true,
        order: 4,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'boost_clock' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Maximum Turbo Frequency',
        key: 'boost_clock',
        dataType: 'NUMBER',
        unit: 'GHz',
        isFilterable: false,
        isRequired: false,
        order: 5,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'cache_size' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Cache',
        key: 'cache_size',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 6,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'tdp' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'TDP (Thermal Design Power)',
        key: 'tdp',
        dataType: 'TEXT',
        isFilterable: false,
        isRequired: true,
        order: 7,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'processor_model' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Processor Brand',
        key: 'processor_model',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 8,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'model_number' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Processor Model',
        key: 'model_number',
        dataType: 'TEXT',
        isFilterable: false,
        isRequired: true,
        order: 9,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'generation' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Processor Series',
        key: 'generation',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 10,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'memory_type' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Memory Type',
        key: 'memory_type',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: false,
        order: 11,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'max_memory_speed' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Max Memory Speed',
        key: 'max_memory_speed',
        dataType: 'TEXT',
        isFilterable: false,
        isRequired: false,
        order: 12,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'max_memory_size' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Max. Memory Size',
        key: 'max_memory_size',
        dataType: 'TEXT',
        isFilterable: false,
        isRequired: false,
        order: 13,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: intelProcessor.id, 
          key: 'integrated_graphics' 
        } 
      },
      update: {},
      create: {
        categoryId: intelProcessor.id,
        name: 'Processor Graphics',
        key: 'integrated_graphics',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: false,
        order: 14,
      },
    }),
  ]);
  
  // Create Specification Definitions for AMD Processor Sub-Category (same keys for filter sync)
  const amdProcessorSpecs = await Promise.all([
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'socket_type' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'CPU Socket',
        key: 'socket_type',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 1,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'number_of_cores' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Number Of Cores',
        key: 'number_of_cores',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 2,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'number_of_threads' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Number Of Threads',
        key: 'number_of_threads',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 3,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'base_clock' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Base Frequency',
        key: 'base_clock',
        dataType: 'NUMBER',
        unit: 'GHz',
        isFilterable: false,
        isRequired: true,
        order: 4,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'boost_clock' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Maximum Turbo Frequency',
        key: 'boost_clock',
        dataType: 'NUMBER',
        unit: 'GHz',
        isFilterable: false,
        isRequired: false,
        order: 5,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'cache_size' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Cache',
        key: 'cache_size',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 6,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'tdp' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'TDP (Thermal Design Power)',
        key: 'tdp',
        dataType: 'TEXT',
        isFilterable: false,
        isRequired: true,
        order: 7,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'processor_model' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Processor Brand',
        key: 'processor_model',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 8,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'model_number' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Processor Model',
        key: 'model_number',
        dataType: 'TEXT',
        isFilterable: false,
        isRequired: true,
        order: 9,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'generation' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Processor Series',
        key: 'generation',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 10,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'memory_type' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Memory Type',
        key: 'memory_type',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: false,
        order: 11,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'max_memory_speed' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Max Memory Speed',
        key: 'max_memory_speed',
        dataType: 'TEXT',
        isFilterable: false,
        isRequired: false,
        order: 12,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'max_memory_size' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Max. Memory Size',
        key: 'max_memory_size',
        dataType: 'TEXT',
        isFilterable: false,
        isRequired: false,
        order: 13,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: amdProcessor.id, 
          key: 'integrated_graphics' 
        } 
      },
      update: {},
      create: {
        categoryId: amdProcessor.id,
        name: 'Processor Graphics',
        key: 'integrated_graphics',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: false,
        order: 14,
      },
    }),
  ]);

  console.log('✅ Intel processor specification definitions created:', intelProcessorSpecs.length);
  console.log('✅ AMD processor specification definitions created:', amdProcessorSpecs.length);

  // Create Specification Definitions for Graphics Card Category
  const gpuSpecs = await Promise.all([
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: graphicsCard.id, 
          key: 'gpu_chipset' 
        } 
      },
      update: {},
      create: {
        categoryId: graphicsCard.id,
        name: 'GPU Chipset',
        key: 'gpu_chipset',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 1,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: graphicsCard.id, 
          key: 'memory_size' 
        } 
      },
      update: {},
      create: {
        categoryId: graphicsCard.id,
        name: 'Memory Size',
        key: 'memory_size',
        dataType: 'NUMBER',
        unit: 'GB',
        isFilterable: true,
        isRequired: true,
        order: 2,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: graphicsCard.id, 
          key: 'memory_type' 
        } 
      },
      update: {},
      create: {
        categoryId: graphicsCard.id,
        name: 'Memory Type',
        key: 'memory_type',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 3,
      },
    }),
  ]);

  // Create Specification Definitions for SSD Category
  const ssdSpecs = await Promise.all([
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: ssd.id, 
          key: 'capacity' 
        } 
      },
      update: {},
      create: {
        categoryId: ssd.id,
        name: 'Capacity',
        key: 'capacity',
        dataType: 'NUMBER',
        unit: 'GB',
        isFilterable: true,
        isRequired: true,
        order: 1,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: ssd.id, 
          key: 'interface' 
        } 
      },
      update: {},
      create: {
        categoryId: ssd.id,
        name: 'Interface',
        key: 'interface',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 2,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: ssd.id, 
          key: 'read_speed' 
        } 
      },
      update: {},
      create: {
        categoryId: ssd.id,
        name: 'Read Speed',
        key: 'read_speed',
        dataType: 'NUMBER',
        unit: 'MB/s',
        isFilterable: false,
        isRequired: false,
        order: 3,
      },
    }),
  ]);

  // Create Specification Definitions for RAM Category
  const ramSpecs = await Promise.all([
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: ram.id, 
          key: 'capacity' 
        } 
      },
      update: {},
      create: {
        categoryId: ram.id,
        name: 'Capacity',
        key: 'capacity',
        dataType: 'NUMBER',
        unit: 'GB',
        isFilterable: true,
        isRequired: true,
        order: 1,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: ram.id, 
          key: 'memory_type' 
        } 
      },
      update: {},
      create: {
        categoryId: ram.id,
        name: 'Memory Type',
        key: 'memory_type',
        dataType: 'TEXT',
        isFilterable: true,
        isRequired: true,
        order: 2,
      },
    }),
    prisma.specificationDefinition.upsert({
      where: { 
        categoryId_key: { 
          categoryId: ram.id, 
          key: 'speed' 
        } 
      },
      update: {},
      create: {
        categoryId: ram.id,
        name: 'Speed',
        key: 'speed',
        dataType: 'NUMBER',
        unit: 'MHz',
        isFilterable: true,
        isRequired: true,
        order: 3,
      },
    }),
  ]);

  console.log('✅ All specification definitions created');

  // 5. Create Sample Products
  console.log('Creating sample products...');

  const intelBrand = brands.find(b => b.slug === 'intel')!;
  const amdBrand = brands.find(b => b.slug === 'amd')!;

  // Intel Core i5-12400F - with filter-compatible values
  const i5Product = await prisma.product.create({
    data: {
      name: 'Intel Core i5-12400F 6 Core 12 Thread 12th Gen Processor',
      slug: 'intel-core-i5-12400f',
      sku: 'PROC-INTEL-12400F',
      description: 'The Intel Core i5-12400F Desktop Processor comes with 6 cores and 12 threads. It has an 18MB Intel Smart Cache and the total L2 Cache is 7.5MB. This processor comes with a maximum turbo frequency of 4.40 GHz, and the processor base frequency is 2.50 GHz. It supports up to DDR5 4800 MT/s and DDR4 3200 MT/s memory types with a maximum memory size of 128 GB.',
      shortDescription: '6 Cores, 12 Threads, up to 4.4 GHz, LGA1700 Socket',
      price: 24100,
      compareAtPrice: 27390,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 50,
      categoryId: intelProcessor.id,
      brandId: intelBrand.id,
      metaTitle: 'Intel Core i5-12400F Processor Price in Bangladesh',
      metaDescription: 'Buy Intel Core i5-12400F 6 Core 12 Thread 12th Gen Processor at best price in Bangladesh. In stock and ready to ship.',
      isFeatured: true,
      isActive: true,
      publishedAt: new Date(),
      images: {
        create: [
          {
            url: 'https://placehold.co/600x600/4169E1/FFFFFF/png?text=Intel+i5-12400F',
            alt: 'Intel Core i5-12400F',
            order: 0,
            isPrimary: true,
          },
        ],
      },
      specifications: {
        create: [
          {
            specificationDefinitionId: intelProcessorSpecs[0].id, // socket_type
            value: 'LGA 1700', // Match filter option exactly
          },
          {
            specificationDefinitionId: intelProcessorSpecs[1].id, // number_of_cores
            value: '6 Core', // Match filter option exactly
          },
          {
            specificationDefinitionId: intelProcessorSpecs[2].id, // number_of_threads
            value: '12 Threads', // Match filter option exactly
          },
          {
            specificationDefinitionId: intelProcessorSpecs[3].id, // base_clock
            value: '2.5',
          },
          {
            specificationDefinitionId: intelProcessorSpecs[4].id, // boost_clock
            value: '4.4',
          },
          {
            specificationDefinitionId: intelProcessorSpecs[5].id, // cache_size
            value: '18 MB', // Match filter option exactly
          },
          {
            specificationDefinitionId: intelProcessorSpecs[6].id, // tdp
            value: '65W',
          },
          {
            specificationDefinitionId: intelProcessorSpecs[7].id, // processor_model
            value: 'Intel Core i5', // Match filter option exactly
          },
          {
            specificationDefinitionId: intelProcessorSpecs[8].id, // model_number
            value: 'Core i5-12400F',
          },
          {
            specificationDefinitionId: intelProcessorSpecs[9].id, // generation
            value: '12th Gen (Alder Lake)', // Match filter option exactly
          },
          {
            specificationDefinitionId: intelProcessorSpecs[10].id, // memory_type
            value: 'DDR5',
          },
          {
            specificationDefinitionId: intelProcessorSpecs[11].id, // max_memory_speed
            value: 'DDR5-4800',
          },
          {
            specificationDefinitionId: intelProcessorSpecs[12].id, // max_memory_size
            value: '128 GB',
          },
        ],
      },
    },
  });

  // AMD Ryzen 5 5600X - with filter-compatible values
  const ryzenProduct = await prisma.product.create({
    data: {
      name: 'AMD Ryzen 5 5600X 6 Core 12 Thread Desktop Processor',
      slug: 'amd-ryzen-5-5600x',
      sku: 'PROC-AMD-5600X',
      description: 'AMD Ryzen 5 5600X Desktop Processor comes with 6 cores and 12 threads. This 5th Generation processor has a base clock speed of 3.7 GHz and a maximum boost clock of up to 4.6 GHz. It features 35MB of combined cache and supports DDR4 memory.',
      shortDescription: '6 Cores, 12 Threads, up to 4.6 GHz, AM4 Socket',
      price: 22500,
      compareAtPrice: 25000,
      stockStatus: StockStatus.IN_STOCK,
      stockQuantity: 30,
      categoryId: amdProcessor.id,
      brandId: amdBrand.id,
      metaTitle: 'AMD Ryzen 5 5600X Processor Price in Bangladesh',
      metaDescription: 'Buy AMD Ryzen 5 5600X 6 Core 12 Thread Processor at best price in Bangladesh.',
      isFeatured: true,
      isActive: true,
      publishedAt: new Date(),
      images: {
        create: [
          {
            url: 'https://placehold.co/600x600/FF6B00/FFFFFF/png?text=AMD+5600X',
            alt: 'AMD Ryzen 5 5600X',
            order: 0,
            isPrimary: true,
          },
        ],
      },
      specifications: {
        create: [
          {
            specificationDefinitionId: amdProcessorSpecs[0].id, // socket_type
            value: 'AM4', // Match filter option exactly
          },
          {
            specificationDefinitionId: amdProcessorSpecs[1].id, // number_of_cores
            value: '6 Core', // Match filter option exactly
          },
          {
            specificationDefinitionId: amdProcessorSpecs[2].id, // number_of_threads
            value: '12 Threads', // Match filter option exactly
          },
          {
            specificationDefinitionId: amdProcessorSpecs[3].id, // base_clock
            value: '3.7',
          },
          {
            specificationDefinitionId: amdProcessorSpecs[4].id, // boost_clock
            value: '4.6',
          },
          {
            specificationDefinitionId: amdProcessorSpecs[5].id, // cache_size
            value: '32 MB', // Match filter option exactly
          },
          {
            specificationDefinitionId: amdProcessorSpecs[6].id, // tdp
            value: '65W',
          },
          {
            specificationDefinitionId: amdProcessorSpecs[7].id, // processor_model
            value: 'Ryzen 5', // Match filter option exactly
          },
          {
            specificationDefinitionId: amdProcessorSpecs[8].id, // model_number
            value: 'Ryzen 5 5600X',
          },
          {
            specificationDefinitionId: amdProcessorSpecs[9].id, // generation
            value: 'Ryzen 5000 Series', // Match filter option exactly
          },
          {
            specificationDefinitionId: amdProcessorSpecs[10].id, // memory_type
            value: 'DDR4',
          },
          {
            specificationDefinitionId: amdProcessorSpecs[11].id, // max_memory_speed
            value: 'DDR4-3200',
          },
          {
            specificationDefinitionId: amdProcessorSpecs[12].id, // max_memory_size
            value: '128 GB',
          },
        ],
      },
    },
  });

  console.log('✅ Sample products created:', 2);

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📝 Admin Login Credentials:');
  console.log('   Email:', admin.email);
  console.log('   Password: admin123');
  console.log('');
  console.log('🔗 Next steps:');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Visit: http://localhost:3000');
  console.log('   3. Admin panel: http://localhost:3000/admin/login');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
