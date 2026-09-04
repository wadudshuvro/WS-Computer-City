/**
 * Category Configuration
 * Defines the category hierarchy and category-specific specifications
 */

import { MOTHERBOARD_SPEC_DEFINITIONS } from '@/lib/motherboardSpecDefinitions';
import { RAM_SPEC_DEFINITIONS } from '@/lib/ramSpecDefinitions';
import { GPU_SPEC_DEFINITIONS } from '@/lib/gpuSpecDefinitions';
import { PSU_SPEC_DEFINITIONS } from '@/lib/psuSpecDefinitions';
import { SSD_SPEC_DEFINITIONS } from '@/lib/ssdSpecDefinitions';
import { CASING_SPEC_DEFINITIONS } from '@/lib/casingSpecDefinitions';
import { CPU_COOLER_SPEC_DEFINITIONS } from '@/lib/cpuCoolerSpecDefinitions';

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
  power_supply: {
    name: 'Power Supply',
    subCategories: [],
  },
  storage: {
    name: 'Storage',
    subCategories: [
      { id: 'ssd', name: 'SSD', slug: 'ssd' },
      { id: 'hdd', name: 'HDD', slug: 'hdd' },
      { id: 'nvme', name: 'NVMe', slug: 'nvme' },
    ],
  },
  computer_case: {
    name: 'Computer Casing',
    subCategories: [],
  },
  cpu_cooler: {
    name: 'CPU Cooler',
    subCategories: [],
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
      groups[existingIndex]!.specs.push(spec);
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

// GPU Specification Options (chipset model lists + shared extras)
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
};

export const motherboardSpecifications: SpecificationField[] = MOTHERBOARD_SPEC_DEFINITIONS.map(
  (spec) => ({
    key: spec.key,
    name: spec.name,
    section: spec.section,
    type: spec.multiline
      ? 'textarea'
      : spec.dataType === 'NUMBER'
        ? 'number'
        : spec.options
          ? 'select'
          : 'text',
    required: spec.isRequired,
    placeholder: spec.placeholder,
    options: spec.options,
  })
);

export const ramSpecifications: SpecificationField[] = RAM_SPEC_DEFINITIONS.map((spec) => ({
  key: spec.key,
  name: spec.name,
  section: spec.section,
  type: spec.multiline
    ? 'textarea'
    : spec.options
      ? 'select'
      : spec.dataType === 'NUMBER'
        ? 'number'
        : 'text',
  required: spec.isRequired,
  placeholder: spec.placeholder,
  options: spec.options,
}));

export const psuSpecifications: SpecificationField[] = PSU_SPEC_DEFINITIONS.map((spec) => ({
  key: spec.key,
  name: spec.name,
  section: spec.section,
  type:
    spec.formType ||
    (spec.dataType === 'NUMBER' ? 'number' : spec.options ? 'select' : 'text'),
  required: spec.isRequired,
  placeholder: spec.placeholder,
  options: spec.options,
  helpText: spec.helpText,
}));

export const ssdSpecifications: SpecificationField[] = SSD_SPEC_DEFINITIONS.map((spec) => ({
  key: spec.key,
  name: spec.name,
  section: spec.section,
  type:
    spec.formType ||
    (spec.dataType === 'NUMBER' ? 'number' : spec.options ? 'select' : 'text'),
  required: spec.isRequired,
  placeholder: spec.placeholder,
  options: spec.options,
  helpText: spec.helpText,
}));

export const casingSpecifications: SpecificationField[] = CASING_SPEC_DEFINITIONS.map((spec) => ({
  key: spec.key,
  name: spec.name,
  section: spec.section,
  type:
    spec.formType ||
    (spec.dataType === 'NUMBER' ? 'number' : spec.options ? 'select' : 'text'),
  required: spec.isRequired,
  placeholder: spec.placeholder,
  options: spec.options,
  helpText: spec.helpText,
}));

export const cpuCoolerSpecifications: SpecificationField[] = CPU_COOLER_SPEC_DEFINITIONS.map((spec) => ({
  key: spec.key,
  name: spec.name,
  section: spec.section,
  type:
    spec.formType ||
    (spec.dataType === 'NUMBER' ? 'number' : spec.options ? 'select' : 'text'),
  required: spec.isRequired,
  placeholder: spec.placeholder,
  options: spec.options,
  helpText: spec.helpText,
}));

// GPU Specifications — mapped from shared seed definitions (Star Tech filter fields included)
export const gpuSpecifications: SpecificationField[] = GPU_SPEC_DEFINITIONS.map((spec) => ({
  key: spec.key,
  name: spec.name,
  section: spec.section,
  type:
    spec.formType ||
    (spec.dataType === 'NUMBER' ? 'number' : spec.options ? 'select' : 'text'),
  required: spec.isRequired,
  placeholder: spec.placeholder,
  options: spec.options,
  unit: spec.unit,
  helpText: spec.helpText,
}));

// Helper function to get GPU specifications by brand
export function getGpuSpecsForBrand(brand: 'nvidia' | 'amd-gpu'): SpecificationField[] {
  return gpuSpecifications.map((spec) => {
    if (spec.key === 'gpu_chipset') {
      return {
        ...spec,
        type: 'select',
        options:
          brand === 'nvidia' ? gpuSpecOptions.nvidiaChipsets : gpuSpecOptions.amdChipsets,
      };
    }
    if (spec.key === 'cuda_cores') {
      return {
        ...spec,
        name: brand === 'nvidia' ? 'CUDA Cores (Nvidia)' : 'Stream Processors (AMD)',
      };
    }
    return spec;
  });
}

// SSD brand labels for legacy callers — canonical list: SSD_BRANDS in ssdSpecDefinitions.ts
export const ssdBrands = [
  'TEAM', 'Colorful', 'MiPhi', 'Corsair', 'Kingston', 'Western Digital', 'Lexar', 'Transcend',
  'Seagate', 'AITC', 'Netac', 'OCPC', 'OSCOO', 'Addlink', 'KingBank', 'ADATA', 'Samsung', 'HP',
  'Gigabyte', 'Dahua', 'PNY', 'TwinMOS', 'Apacer', 'Patriot', 'Biostar', 'Acer', 'Kingspec',
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
export type MainCategorySlug =
  | 'processor'
  | 'motherboard'
  | 'graphics_card'
  | 'ram'
  | 'power_supply'
  | 'storage'
  | 'computer_case'
  | 'cpu_cooler';

/** Maps database category slugs (with hyphens) to form hierarchy main keys */
const DB_SLUG_TO_MAIN: Record<string, MainCategorySlug> = {
  processor: 'processor',
  motherboard: 'motherboard',
  'graphics-card': 'graphics_card',
  ram: 'ram',
  'desktop-ram': 'ram',
  'laptop-ram': 'ram',
  'power-supply': 'power_supply',
  psu: 'power_supply',
  storage: 'storage',
  ssd: 'storage',
  hdd: 'storage',
  nvme: 'storage',
  'computer-case': 'computer_case',
  casing: 'computer_case',
  case: 'computer_case',
  'cpu-cooler': 'cpu_cooler',
  cooler: 'cpu_cooler',
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
  power_supply: 'power-supply',
  storage: 'ssd',
  computer_case: 'computer-case',
  cpu_cooler: 'cpu-cooler',
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
    case 'ram':
      return ramSpecifications;
    case 'power_supply':
      return psuSpecifications;
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
    case 'computer_case':
      return casingSpecifications;
    case 'cpu_cooler':
      return cpuCoolerSpecifications;
    default:
      return [];
  }
}
