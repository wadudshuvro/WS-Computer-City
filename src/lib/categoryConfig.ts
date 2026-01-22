/**
 * Category Configuration
 * Defines the category hierarchy and category-specific specifications
 */

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
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
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

// Map of main category to specification definitions
export type MainCategorySlug = 'processor' | 'motherboard' | 'graphics_card' | 'ram' | 'storage';

export function getSpecificationsForCategory(mainCategory: MainCategorySlug, subCategory?: string): SpecificationField[] {
  switch (mainCategory) {
    case 'processor':
      if (subCategory === 'intel' || subCategory === 'amd') {
        return getProcessorSpecsForBrand(subCategory);
      }
      return processorSpecifications;
    // Add more category-specific specs here as needed
    default:
      return [];
  }
}
