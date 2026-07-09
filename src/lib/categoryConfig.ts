/**
 * Category Configuration
 * Defines the category hierarchy and category-specific specifications
 */

import { MOTHERBOARD_SPEC_DEFINITIONS } from '@/lib/motherboardSpecDefinitions';

// Main Categories with their Sub-Categories
export const categoryHierarchy: Record<string, { name: string; subCategories: { id: string; name: string; slug: string }[] }> = {
  processor: {
    name: 'Processor',
    subCategories: [
      { id: 'intel', name: 'Intel', slug: 'intel' },
      { id: 'amd', name: 'AMD', slug: 'amd' },
    ],
  },
  motherboard: {
    name: 'Motherboard',
    subCategories: [
      { id: 'intel-motherboard', name: 'Intel Motherboard', slug: 'intel-motherboard' },
      { id: 'amd-motherboard', name: 'AMD Motherboard', slug: 'amd-motherboard' },
    ],
  },
  graphics_card: {
    name: 'Graphics Card',
    subCategories: [
      { id: 'nvidia', name: 'NVIDIA', slug: 'nvidia' },
      { id: 'amd-gpu', name: 'AMD', slug: 'amd-gpu' },
    ],
  },
  ram: {
    name: 'RAM',
    subCategories: [
      { id: 'desktop-ram', name: 'Desktop RAM', slug: 'desktop-ram' },
      { id: 'laptop-ram', name: 'Laptop RAM', slug: 'laptop-ram' },
    ],
  },
  storage: {
    name: 'Storage',
    subCategories: [
      { id: 'ssd', name: 'SSD', slug: 'ssd' },
      { id: 'hdd', name: 'HDD', slug: 'hdd' },
      { id: 'nvme', name: 'NVMe', slug: 'nvme' },
    ],
  },
};

// Processor Specification Options based on the Techland reference image
export const processorSpecOptions = {
  // Brand-specific series
  intelProcessorModels: [
    'Intel Core i3',
    'Intel Core i5',
    'Intel Core i7',
    'Intel Core i9',
    'Intel Core Ultra 5',
    'Intel Core Ultra 7',
    'Intel Core Ultra 9',
    'Intel Pentium',
    'Intel Celeron',
    'Intel Xeon',
  ],
  
  amdProcessorModels: [
    'Ryzen 3',
    'Ryzen 5',
    'Ryzen 7',
    'Ryzen 9',
    'Ryzen Threadripper',
    'AMD Athlon',
    'AMD A-Series',
  ],
  
  // Number of Cores
  numberOfCores: [
    '2 Core',
    '4 Core',
    '6 Core',
    '8 Core',
    '10 Core',
    '12 Core',
    '14 Core',
    '16 Core',
    '20 Core',
    '24 Core',
    '28 Core',
    '32 Core',
    '64 Core',
  ],
  
  // Number of Threads
  numberOfThreads: [
    '2 Threads',
    '4 Threads',
    '6 Threads',
    '8 Threads',
    '12 Threads',
    '16 Threads',
    '20 Threads',
    '24 Threads',
    '28 Threads',
    '32 Threads',
    '48 Threads',
    '64 Threads',
    '128 Threads',
  ],
  
  // Socket Types
  intelSockets: [
    'LGA 1700',
    'LGA 1851',
    'FCLGA1851',
    'LGA 1200',
    'LGA 1151',
    'LGA 2066',
    'LGA 4677',
  ],
  
  amdSockets: [
    'AM5',
    'AM4',
    'sTRX4',
    'sWRX8',
    'TR4',
  ],
  
  // Generation/Series
  intelGenerations: [
    '14th Gen (Raptor Lake Refresh)',
    '13th Gen (Raptor Lake)',
    '12th Gen (Alder Lake)',
    '11th Gen (Rocket Lake)',
    '10th Gen (Comet Lake)',
    'Ultra Series 1',
    'Ultra Series 2',
  ],
  
  amdGenerations: [
    'Ryzen 9000 Series',
    'Ryzen 8000 Series',
    'Ryzen 7000 Series',
    'Ryzen 6000 Series',
    'Ryzen 5000 Series',
    'Ryzen 4000 Series',
    'Ryzen 3000 Series',
  ],
  
  // Cache Memory Sizes
  cacheSizes: [
    '6 MB',
    '8 MB',
    '12 MB',
    '16 MB',
    '18 MB',
    '20 MB',
    '24 MB',
    '25 MB',
    '30 MB',
    '32 MB',
    '33 MB',
    '36 MB',
    '64 MB',
    '96 MB',
    '128 MB',
  ],
  
  // TDP (Thermal Design Power)
  tdpOptions: [
    '35W',
    '45W',
    '55W',
    '65W',
    '80W',
    '95W',
    '105W',
    '125W',
    '150W',
    '170W',
    '180W',
    '253W',
    '350W',
  ],
  
  // Processor Features
  processorFeatures: [
    'Hyper-Threading',
    'Turbo Boost',
    'Turbo Boost Max 3.0',
    'Intel UHD Graphics',
    'Intel Iris Xe Graphics',
    'Intel Arc Graphics',
    'AMD Radeon Graphics',
    'Unlocked Multiplier',
    'DDR5 Support',
    'DDR4 Support',
    'PCIe 5.0 Support',
    'PCIe 4.0 Support',
    'AI Acceleration',
    'Thread Director',
    'E-cores',
    'P-cores',
    '3D V-Cache',
    'Precision Boost 2',
    'Precision Boost Overdrive',
    'AMD EXPO',
    'Intel XMP',
  ],
  
  // Integrated Graphics
  integratedGraphics: [
    'Intel UHD Graphics 730',
    'Intel UHD Graphics 770',
    'Intel Iris Xe Graphics',
    'Intel Arc Graphics',
    'AMD Radeon Graphics',
    'AMD Radeon RX Vega 7',
    'AMD Radeon RX Vega 8',
    'AMD Radeon RX Vega 11',
    'None (Discrete GPU Required)',
  ],
  
  // Memory Support
  memoryTypes: [
    'DDR4',
    'DDR5',
    'DDR4 + DDR5',
  ],
  
  maxMemorySpeeds: [
    'DDR4-2666',
    'DDR4-2933',
    'DDR4-3200',
    'DDR4-3600',
    'DDR5-4800',
    'DDR5-5200',
    'DDR5-5600',
    'DDR5-6000',
    'DDR5-6400',
    'DDR5-7200',
    'DDR5-8000',
  ],
};

// Category-specific specification definitions
export interface SpecificationField {
  key: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'textarea';
  section?: string;
  options?: string[];
  unit?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  dependsOn?: {
    field: string;
    values: string[];
  };
}

export function groupSpecificationFieldsBySection(
  specs: SpecificationField[]
): { title: string; specs: SpecificationField[] }[] {
  const groups: { title: string; specs: SpecificationField[] }[] = [];
  const indexByTitle = new Map<string, number>();

  for (const spec of specs) {
    const title = spec.section || 'Specifications';
    const existingIndex = indexByTitle.get(title);

    if (existingIndex === undefined) {
      indexByTitle.set(title, groups.length);
      groups.push({ title, specs: [spec] });
    } else {
      groups[existingIndex].specs.push(spec);
    }
  }

  return groups;
}

export const processorSpecifications: SpecificationField[] = [
  {
    key: 'processor_model',
    name: 'Processor Model/Series',
    type: 'select',
    options: [...processorSpecOptions.intelProcessorModels, ...processorSpecOptions.amdProcessorModels],
    required: true,
    helpText: 'Select the processor family',
  },
  {
    key: 'model_number',
    name: 'Model Number',
    type: 'text',
    required: true,
    placeholder: 'e.g., i5-14600K, Ryzen 7 7800X3D',
    helpText: 'Full model name/number',
  },
  {
    key: 'number_of_cores',
    name: 'Number of Cores',
    type: 'select',
    options: processorSpecOptions.numberOfCores,
    required: true,
  },
  {
    key: 'number_of_threads',
    name: 'Number of Threads',
    type: 'select',
    options: processorSpecOptions.numberOfThreads,
    required: true,
  },
  {
    key: 'base_clock',
    name: 'Base Clock Speed',
    type: 'number',
    unit: 'GHz',
    required: true,
    placeholder: '3.5',
    helpText: 'Base frequency in GHz',
  },
  {
    key: 'boost_clock',
    name: 'Boost/Turbo Clock Speed',
    type: 'number',
    unit: 'GHz',
    required: true,
    placeholder: '5.3',
    helpText: 'Maximum turbo frequency in GHz',
  },
  {
    key: 'socket_type',
    name: 'Socket Type',
    type: 'select',
    options: [...processorSpecOptions.intelSockets, ...processorSpecOptions.amdSockets],
    required: true,
  },
  {
    key: 'generation',
    name: 'Generation/Series',
    type: 'select',
    options: [...processorSpecOptions.intelGenerations, ...processorSpecOptions.amdGenerations],
    required: true,
  },
  {
    key: 'cache_size',
    name: 'Total Cache (L3)',
    type: 'select',
    options: processorSpecOptions.cacheSizes,
    required: false,
  },
  {
    key: 'l2_cache',
    name: 'L2 Cache',
    type: 'text',
    placeholder: 'e.g., 20 MB',
    required: false,
  },
  {
    key: 'tdp',
    name: 'TDP (Thermal Design Power)',
    type: 'select',
    options: processorSpecOptions.tdpOptions,
    required: true,
  },
  {
    key: 'integrated_graphics',
    name: 'Integrated Graphics',
    type: 'select',
    options: processorSpecOptions.integratedGraphics,
    required: false,
  },
  {
    key: 'memory_type',
    name: 'Memory Type Support',
    type: 'select',
    options: processorSpecOptions.memoryTypes,
    required: false,
  },
  {
    key: 'max_memory_speed',
    name: 'Max Memory Speed',
    type: 'select',
    options: processorSpecOptions.maxMemorySpeeds,
    required: false,
  },
  {
    key: 'max_memory_size',
    name: 'Max Memory Size',
    type: 'text',
    placeholder: 'e.g., 128 GB',
    required: false,
  },
  {
    key: 'pcie_version',
    name: 'PCIe Version',
    type: 'select',
    options: ['PCIe 4.0', 'PCIe 5.0', 'PCIe 5.0 (x16) + PCIe 4.0'],
    required: false,
  },
  {
    key: 'processor_features',
    name: 'Processor Features',
    type: 'multiselect',
    options: processorSpecOptions.processorFeatures,
    required: false,
    helpText: 'Select all applicable features',
  },
  {
    key: 'unlocked',
    name: 'Unlocked for Overclocking',
    type: 'boolean',
    required: false,
    helpText: 'K/X series processors with unlocked multiplier',
  },
  {
    key: 'cooler_included',
    name: 'Cooler Included',
    type: 'boolean',
    required: false,
    helpText: 'Does it come with a stock cooler?',
  },
  {
    key: 'warranty',
    name: 'Warranty',
    type: 'text',
    placeholder: 'e.g., 3 Years',
    required: false,
  },
];

// Helper function to get specifications by sub-category (Intel or AMD)
export function getProcessorSpecsForBrand(brand: 'intel' | 'amd'): SpecificationField[] {
  return processorSpecifications.map(spec => {
    // Filter options based on brand for relevant fields
    if (spec.key === 'processor_model') {
      return {
        ...spec,
        options: brand === 'intel' 
          ? processorSpecOptions.intelProcessorModels 
          : processorSpecOptions.amdProcessorModels,
      };
    }
    if (spec.key === 'socket_type') {
      return {
        ...spec,
        options: brand === 'intel' 
          ? processorSpecOptions.intelSockets 
          : processorSpecOptions.amdSockets,
      };
    }
    if (spec.key === 'generation') {
      return {
        ...spec,
        options: brand === 'intel' 
          ? processorSpecOptions.intelGenerations 
          : processorSpecOptions.amdGenerations,
      };
    }
    return spec;
  });
}

// GPU Specification Options
export const gpuSpecOptions = {
  nvidiaChipsets: [
    'GeForce RTX 5090',
    'GeForce RTX 5080',
    'GeForce RTX 5070 Ti',
    'GeForce RTX 5070',
    'GeForce RTX 5060 Ti',
    'GeForce RTX 5060',
    'GeForce RTX 5050',
    'GeForce RTX 4090',
    'GeForce RTX 4080 Super',
    'GeForce RTX 4080',
    'GeForce RTX 4070 Ti Super',
    'GeForce RTX 4070 Ti',
    'GeForce RTX 4070 Super',
    'GeForce RTX 4070',
    'GeForce RTX 4060 Ti',
    'GeForce RTX 4060',
    'GeForce RTX 3090 Ti',
    'GeForce RTX 3090',
    'GeForce RTX 3080 Ti',
    'GeForce RTX 3080',
    'GeForce RTX 3070 Ti',
    'GeForce RTX 3070',
    'GeForce RTX 3060 Ti',
    'GeForce RTX 3060',
    'GeForce RTX 3050',
    'GeForce GTX 1660 Super',
    'GeForce GTX 1660',
    'GeForce GTX 1650',
  ],

  amdChipsets: [
    'Radeon RX 9070 XT',
    'Radeon RX 9070',
    'Radeon RX 7900 XTX',
    'Radeon RX 7900 XT',
    'Radeon RX 7900 GRE',
    'Radeon RX 7800 XT',
    'Radeon RX 7700 XT',
    'Radeon RX 7600 XT',
    'Radeon RX 7600',
    'Radeon RX 6950 XT',
    'Radeon RX 6900 XT',
    'Radeon RX 6800 XT',
    'Radeon RX 6800',
    'Radeon RX 6750 XT',
    'Radeon RX 6700 XT',
    'Radeon RX 6650 XT',
    'Radeon RX 6600 XT',
    'Radeon RX 6600',
    'Radeon RX 6500 XT',
    'Radeon RX 6400',
  ],

  memoryTypes: [
    'GDDR7',
    'GDDR6X',
    'GDDR6',
    'GDDR5X',
    'GDDR5',
    'HBM3',
    'HBM2e',
  ],

  memorySizes: [
    '4 GB',
    '6 GB',
    '8 GB',
    '10 GB',
    '12 GB',
    '16 GB',
    '20 GB',
    '24 GB',
    '32 GB',
    '48 GB',
  ],

  busWidths: [
    '64-bit',
    '96-bit',
    '128-bit',
    '192-bit',
    '256-bit',
    '320-bit',
    '384-bit',
    '512-bit',
  ],

  coolingTypes: [
    'Single Fan',
    'Dual Fan',
    'Triple Fan',
    'Blower Style',
    'Hybrid (Air + AIO)',
    'Liquid Cooled',
  ],

  outputPorts: [
    'HDMI 2.1',
    'HDMI 2.0',
    'DisplayPort 2.1',
    'DisplayPort 1.4a',
    'DisplayPort 1.4',
    'USB-C (DisplayPort Alt Mode)',
    'DVI-D',
  ],

  features: [
    'Ray Tracing',
    'DLSS 3',
    'DLSS 2',
    'FSR 3',
    'FSR 2',
    'AV1 Encoding',
    'NVENC',
    'VCE',
    'G-Sync Compatible',
    'FreeSync Premium Pro',
    'FreeSync Premium',
    'FreeSync',
    'RGB Lighting',
    'ARGB Lighting',
    'Zero RPM Mode',
    'Dual BIOS',
    'Metal Backplate',
    'PCIe 5.0',
    'PCIe 4.0',
    'DirectX 12 Ultimate',
    'Vulkan',
    'OpenGL 4.6',
  ],

  powerConnectors: [
    '12VHPWR (16-pin)',
    '12V-2x6',
    '8-pin x3',
    '8-pin x2',
    '8-pin + 6-pin',
    '8-pin',
    '6-pin x2',
    '6-pin',
    'No External Power',
  ],

  tdpOptions: [
    '75W',
    '100W',
    '120W',
    '150W',
    '170W',
    '200W',
    '220W',
    '250W',
    '285W',
    '300W',
    '320W',
    '350W',
    '450W',
    '575W',
  ],
};

export const motherboardSpecifications: SpecificationField[] = MOTHERBOARD_SPEC_DEFINITIONS.map(
  (spec) => ({
    key: spec.key,
    name: spec.name,
    section: spec.section,
    type: spec.multiline ? 'textarea' : spec.dataType === 'NUMBER' ? 'number' : 'text',
    required: spec.isRequired,
    placeholder: spec.placeholder,
  })
);

// GPU Specifications (matches TechLand grouped specification layout)
export const gpuSpecifications: SpecificationField[] = [
  {
    key: 'memory_size',
    name: 'Memory Size',
    type: 'select',
    options: gpuSpecOptions.memorySizes,
    required: true,
  },
  {
    key: 'bus_type',
    name: 'Bus Type',
    type: 'text',
    placeholder: 'e.g., 28 Gbps',
    required: false,
  },
  {
    key: 'memory_type',
    name: 'Memory Type',
    type: 'select',
    options: gpuSpecOptions.memoryTypes,
    required: true,
  },
  {
    key: 'memory_clock',
    name: 'Memory Clock',
    type: 'text',
    placeholder: 'e.g., 2595 MHz',
    required: false,
  },
  {
    key: 'memory_bus',
    name: 'Memory Bus (Bit)',
    type: 'select',
    options: gpuSpecOptions.busWidths.map((w) => w.replace('-bit', ' bit')),
    required: false,
  },
  {
    key: 'resolution',
    name: 'Resolution',
    type: 'text',
    placeholder: 'e.g., 7680x4320',
    required: false,
  },
  {
    key: 'multi_display',
    name: 'Multi Display',
    type: 'number',
    placeholder: '4',
    required: false,
  },
  {
    key: 'gpu_chipset',
    name: 'GPU Chipset',
    type: 'select',
    options: [...gpuSpecOptions.nvidiaChipsets, ...gpuSpecOptions.amdChipsets],
    required: true,
    helpText: 'Select the GPU model',
  },
  {
    key: 'cuda_cores',
    name: 'CUDA Cores (Nvidia)',
    type: 'number',
    required: false,
    placeholder: '3840',
    helpText: 'CUDA cores for NVIDIA, Stream Processors for AMD',
  },
  {
    key: 'pci_express',
    name: 'Interface (PCI Express)',
    type: 'select',
    options: ['PCI-E 3.0', 'PCI-E 4.0', 'PCI-E 5.0'],
    required: false,
  },
  {
    key: 'directx',
    name: 'DirectX',
    type: 'select',
    options: ['DirectX 12 API', 'DirectX 12 Ultimate', 'DirectX 11'],
    required: false,
  },
  {
    key: 'opengl',
    name: 'OpenGL',
    type: 'select',
    options: ['4.6', '4.5', '4.4'],
    required: false,
  },
  {
    key: 'recommended_psu',
    name: 'Recommended Power',
    type: 'text',
    placeholder: 'e.g., 550W',
    required: false,
  },
  {
    key: 'display_port',
    name: 'DisplayPort',
    type: 'text',
    placeholder: 'e.g., DisplayPort 2.1b *3',
    required: false,
  },
  {
    key: 'power_connector',
    name: 'Power Connector',
    type: 'select',
    options: gpuSpecOptions.powerConnectors,
    required: false,
  },
  {
    key: 'hdmi',
    name: 'HDMI',
    type: 'text',
    placeholder: 'e.g., HDMI 2.1b *1',
    required: false,
  },
  {
    key: 'dimension',
    name: 'Dimension',
    type: 'text',
    placeholder: 'e.g., L=281 W=117 H=40',
    required: false,
  },
  {
    key: 'warranty',
    name: 'Warranty',
    type: 'text',
    placeholder: 'e.g., 3 Years',
    required: false,
  },
];

// Helper function to get GPU specifications by brand
export function getGpuSpecsForBrand(brand: 'nvidia' | 'amd-gpu'): SpecificationField[] {
  return gpuSpecifications.map(spec => {
    if (spec.key === 'gpu_chipset') {
      return {
        ...spec,
        options: brand === 'nvidia' 
          ? gpuSpecOptions.nvidiaChipsets 
          : gpuSpecOptions.amdChipsets,
      };
    }
    // For NVIDIA, show CUDA/Tensor cores labels; for AMD, show Stream Processors
    if (spec.key === 'cuda_cores') {
      return {
        ...spec,
        name: brand === 'nvidia' ? 'CUDA Cores (Nvidia)' : 'Stream Processors (AMD)',
      };
    }
    return spec;
  });
}

// SSD Brand Options (from Tech Land reference)
export const ssdBrands = [
  'Corsair',
  'Kingston',
  'Samsung',
  'Team',
  'XOC',
  'MiPhi',
  'OSCOO',
  'Lexar',
  'MSI',
  'SanDisk',
  'Seagate',
  'Adata',
  'Ocpc',
  'Western Digital',
  'Aitc',
  'Acer',
  'Transcend',
  'Crucial',
  'Apacer',
  'Colorful',
  'KingSpec',
  'Netac',
  'PNY',
  'Twinmos',
  'Pc Power',
  'Biwintech',
  'Kingbox',
  'GIGABYTE',
  'NCX',
  'Orico',
  'HP',
  'King Super',
  'Addlink',
  'NEO FORZA',
  'Hikvision',
  'Patriot',
  'Ramsta',
  'Redragon',
  'Kimtigo',
  'AGI',
  'Revenger',
  'Dahua',
  'LENOVO',
  'Smart',
  'Walton',
  'Suneest',
  'Kingbank',
];

// SSD Specification Options
export const ssdSpecOptions = {
  // Form Factors
  formFactors: [
    '2.5 inch SATA',
    'M.2 2280',
    'M.2 2242',
    'M.2 2230',
    'mSATA',
    'U.2',
    'PCIe Add-in Card',
  ],

  // Interface Types
  interfaces: [
    'SATA III (6Gb/s)',
    'NVMe PCIe 3.0 x4',
    'NVMe PCIe 4.0 x4',
    'NVMe PCIe 5.0 x4',
    'USB 3.0',
    'USB 3.1',
    'USB 3.2',
    'Thunderbolt 3',
    'Thunderbolt 4',
  ],

  // Capacities
  capacities: [
    '120 GB',
    '128 GB',
    '240 GB',
    '256 GB',
    '480 GB',
    '500 GB',
    '512 GB',
    '960 GB',
    '1 TB',
    '2 TB',
    '4 TB',
    '8 TB',
  ],

  // NAND Types
  nandTypes: [
    'TLC (Triple-Level Cell)',
    'QLC (Quad-Level Cell)',
    'MLC (Multi-Level Cell)',
    'SLC (Single-Level Cell)',
    '3D NAND TLC',
    '3D NAND QLC',
    '3D NAND MLC',
    'V-NAND',
  ],

  // Controller Brands
  controllers: [
    'Samsung',
    'Phison',
    'Silicon Motion',
    'Marvell',
    'Realtek',
    'Maxio',
    'InnoGrit',
    'Western Digital',
    'SanDisk',
    'Toshiba',
  ],

  // DRAM Cache Options
  dramCache: [
    'No DRAM (DRAM-less)',
    '256 MB DDR3',
    '512 MB DDR3',
    '512 MB DDR4',
    '1 GB DDR4',
    '2 GB DDR4',
    '4 GB DDR4',
    'HMB (Host Memory Buffer)',
  ],

  // Features
  features: [
    'Hardware Encryption (AES 256-bit)',
    'TRIM Support',
    'S.M.A.R.T. Support',
    'LDPC Error Correction',
    'Wear Leveling',
    'Bad Block Management',
    'Over-Provisioning',
    'Thermal Throttling',
    'Power Loss Protection',
    'SLC Caching',
    'Dynamic SLC Caching',
    'NVMe 1.4',
    'NVMe 2.0',
    'TCG Opal 2.0',
    'Heat Sink Included',
    'RGB Lighting',
  ],

  // Endurance (TBW)
  enduranceTBW: [
    '80 TBW',
    '100 TBW',
    '150 TBW',
    '200 TBW',
    '300 TBW',
    '400 TBW',
    '500 TBW',
    '600 TBW',
    '800 TBW',
    '1000 TBW',
    '1200 TBW',
    '1400 TBW',
    '2000 TBW',
    '2400 TBW',
    '3600 TBW',
  ],

  // Warranty Options
  warranties: [
    '1 Year',
    '2 Years',
    '3 Years',
    '5 Years',
    '10 Years',
    'Limited Lifetime',
  ],
};

// SSD Specifications
export const ssdSpecifications: SpecificationField[] = [
  {
    key: 'ssd_brand',
    name: 'Brand',
    type: 'select',
    options: ssdBrands,
    required: true,
    helpText: 'Select the SSD manufacturer',
  },
  {
    key: 'capacity',
    name: 'Storage Capacity',
    type: 'select',
    options: ssdSpecOptions.capacities,
    required: true,
  },
  {
    key: 'form_factor',
    name: 'Form Factor',
    type: 'select',
    options: ssdSpecOptions.formFactors,
    required: true,
  },
  {
    key: 'interface',
    name: 'Interface',
    type: 'select',
    options: ssdSpecOptions.interfaces,
    required: true,
  },
  {
    key: 'nand_type',
    name: 'NAND Flash Type',
    type: 'select',
    options: ssdSpecOptions.nandTypes,
    required: false,
  },
  {
    key: 'controller',
    name: 'Controller',
    type: 'select',
    options: ssdSpecOptions.controllers,
    required: false,
  },
  {
    key: 'dram_cache',
    name: 'DRAM Cache',
    type: 'select',
    options: ssdSpecOptions.dramCache,
    required: false,
  },
  {
    key: 'read_speed',
    name: 'Sequential Read Speed',
    type: 'number',
    unit: 'MB/s',
    required: true,
    placeholder: '3500',
    helpText: 'Maximum sequential read speed',
  },
  {
    key: 'write_speed',
    name: 'Sequential Write Speed',
    type: 'number',
    unit: 'MB/s',
    required: true,
    placeholder: '3000',
    helpText: 'Maximum sequential write speed',
  },
  {
    key: 'random_read_iops',
    name: 'Random Read IOPS',
    type: 'text',
    placeholder: 'e.g., 500,000 IOPS',
    required: false,
  },
  {
    key: 'random_write_iops',
    name: 'Random Write IOPS',
    type: 'text',
    placeholder: 'e.g., 450,000 IOPS',
    required: false,
  },
  {
    key: 'endurance_tbw',
    name: 'Endurance (TBW)',
    type: 'select',
    options: ssdSpecOptions.enduranceTBW,
    required: false,
    helpText: 'Total Bytes Written rating',
  },
  {
    key: 'mtbf',
    name: 'MTBF (Mean Time Between Failures)',
    type: 'text',
    placeholder: 'e.g., 1.8 Million Hours',
    required: false,
  },
  {
    key: 'ssd_features',
    name: 'Features',
    type: 'multiselect',
    options: ssdSpecOptions.features,
    required: false,
    helpText: 'Select all applicable features',
  },
  {
    key: 'warranty',
    name: 'Warranty',
    type: 'select',
    options: ssdSpecOptions.warranties,
    required: false,
  },
];

// HDD Specification Options
export const hddSpecOptions = {
  capacities: [
    '500 GB',
    '1 TB',
    '2 TB',
    '3 TB',
    '4 TB',
    '6 TB',
    '8 TB',
    '10 TB',
    '12 TB',
    '14 TB',
    '16 TB',
    '18 TB',
    '20 TB',
    '22 TB',
    '24 TB',
  ],

  formFactors: [
    '3.5 inch',
    '2.5 inch',
  ],

  interfaces: [
    'SATA III (6Gb/s)',
    'SATA II (3Gb/s)',
    'SAS 12Gb/s',
    'SAS 6Gb/s',
  ],

  rpmSpeeds: [
    '5400 RPM',
    '5900 RPM',
    '7200 RPM',
    '10000 RPM',
    '15000 RPM',
  ],

  cacheSize: [
    '32 MB',
    '64 MB',
    '128 MB',
    '256 MB',
    '512 MB',
  ],

  usageTypes: [
    'Desktop',
    'Laptop',
    'NAS',
    'Surveillance',
    'Enterprise',
    'Gaming',
  ],
};

// HDD Specifications
export const hddSpecifications: SpecificationField[] = [
  {
    key: 'capacity',
    name: 'Storage Capacity',
    type: 'select',
    options: hddSpecOptions.capacities,
    required: true,
  },
  {
    key: 'form_factor',
    name: 'Form Factor',
    type: 'select',
    options: hddSpecOptions.formFactors,
    required: true,
  },
  {
    key: 'interface',
    name: 'Interface',
    type: 'select',
    options: hddSpecOptions.interfaces,
    required: true,
  },
  {
    key: 'rpm_speed',
    name: 'RPM Speed',
    type: 'select',
    options: hddSpecOptions.rpmSpeeds,
    required: true,
  },
  {
    key: 'cache_size',
    name: 'Cache Size',
    type: 'select',
    options: hddSpecOptions.cacheSize,
    required: false,
  },
  {
    key: 'usage_type',
    name: 'Designed For',
    type: 'select',
    options: hddSpecOptions.usageTypes,
    required: false,
  },
  {
    key: 'warranty',
    name: 'Warranty',
    type: 'text',
    placeholder: 'e.g., 2 Years',
    required: false,
  },
];

// Map of main category to specification definitions
export type MainCategorySlug = 'processor' | 'motherboard' | 'graphics_card' | 'ram' | 'storage';

/** Maps database category slugs (with hyphens) to form hierarchy main keys */
const DB_SLUG_TO_MAIN: Record<string, MainCategorySlug> = {
  processor: 'processor',
  motherboard: 'motherboard',
  'graphics-card': 'graphics_card',
  ram: 'ram',
  'desktop-ram': 'ram',
  'laptop-ram': 'ram',
  'ddr4-ram': 'ram',
  'ddr5-ram': 'ram',
  storage: 'storage',
  ssd: 'storage',
  hdd: 'storage',
  nvme: 'storage',
};

/**
 * Resolve a database category slug to the form's main/sub category keys.
 * DB uses slugs like "graphics-card"; the form hierarchy uses "graphics_card".
 */
export function resolveCategoryFromDbSlug(
  categorySlug: string,
  parentSlug?: string | null
): { mainCategory: MainCategorySlug | ''; subCategory: string } {
  // Check if slug matches a known sub-category (e.g. nvidia, intel, desktop-ram)
  for (const [mainKey, mainValue] of Object.entries(categoryHierarchy)) {
    const subMatch = mainValue.subCategories.find(
      (s) => s.slug === categorySlug || s.id === categorySlug
    );
    if (subMatch) {
      return { mainCategory: mainKey as MainCategorySlug, subCategory: subMatch.id };
    }
  }

  // Direct match on hierarchy key (e.g. processor, graphics_card)
  if (categorySlug in categoryHierarchy) {
    return { mainCategory: categorySlug as MainCategorySlug, subCategory: '' };
  }

  // Alias map for parent-level DB slugs (e.g. graphics-card → graphics_card)
  const mainFromAlias = DB_SLUG_TO_MAIN[categorySlug];
  if (mainFromAlias) {
    return { mainCategory: mainFromAlias, subCategory: '' };
  }

  // Walk up to parent category
  if (parentSlug) {
    return resolveCategoryFromDbSlug(parentSlug);
  }

  return { mainCategory: '', subCategory: '' };
}

/** Infer NVIDIA/AMD GPU sub-category from chipset name when not stored on the product */
export function inferGpuSubCategory(
  subCategory: string,
  specs: Record<string, string | string[]>
): string {
  if (subCategory) return subCategory;
  const chipset = String(specs.gpu_chipset || '').toLowerCase();
  if (chipset.includes('geforce') || chipset.includes('rtx') || chipset.includes('gtx')) {
    return 'nvidia';
  }
  if (chipset.includes('radeon') || chipset.includes('rx')) {
    return 'amd-gpu';
  }
  return '';
}

/** Maps form main category keys to parent database category slugs */
const FORM_MAIN_TO_DB_PARENT_SLUG: Record<MainCategorySlug, string> = {
  processor: 'processor',
  motherboard: 'motherboard',
  graphics_card: 'graphics-card',
  ram: 'ram',
  storage: 'ssd',
};

/**
 * Resolve the database category slug for CMS forms from main/sub selection.
 * Prefers sub-category slug (e.g. intel-motherboard), falls back to parent (e.g. motherboard).
 */
export function resolveDbCategorySlugForForm(
  mainCategory: MainCategorySlug | '',
  subCategoryId?: string
): string | null {
  if (!mainCategory) return null;

  const hierarchy = categoryHierarchy[mainCategory];
  if (!hierarchy) return null;

  if (subCategoryId) {
    const sub = hierarchy.subCategories.find(
      (s) => s.id === subCategoryId || s.slug === subCategoryId
    );
    if (sub) return sub.slug;
  }

  return FORM_MAIN_TO_DB_PARENT_SLUG[mainCategory] ?? null;
}

export function getSpecificationsForCategory(mainCategory: MainCategorySlug, subCategory?: string): SpecificationField[] {
  switch (mainCategory) {
    case 'processor':
      if (subCategory === 'intel' || subCategory === 'amd') {
        return getProcessorSpecsForBrand(subCategory);
      }
      return processorSpecifications;
    case 'motherboard':
      return motherboardSpecifications;
    case 'graphics_card':
      if (subCategory === 'nvidia' || subCategory === 'amd-gpu') {
        return getGpuSpecsForBrand(subCategory);
      }
      return gpuSpecifications;
    case 'storage':
      if (subCategory === 'ssd' || subCategory === 'nvme') {
        return ssdSpecifications;
      }
      if (subCategory === 'hdd') {
        return hddSpecifications;
      }
      return ssdSpecifications; // Default to SSD specs for storage
    default:
      return [];
  }
}
