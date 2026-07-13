/**
 * Filter Configuration for Category Pages
 * Defines dynamic filters based on category specifications
 */

import {
  RAM_BRANDS,
  RAM_FEATURE_OPTIONS,
  RAM_SIZE_OPTIONS,
  RAM_SPEED_OPTIONS,
  RAM_TYPE_OPTIONS,
} from '@/lib/ramSpecDefinitions';
import {
  MOTHERBOARD_AMD_SOCKETS,
  MOTHERBOARD_FORM_FACTORS,
  MOTHERBOARD_INTEL_SOCKETS,
  MOTHERBOARD_MAKER_BRANDS,
  MOTHERBOARD_PROCESSOR_TYPES,
  MOTHERBOARD_RAM_TYPES,
  MOTHERBOARD_SPECIAL_FEATURES,
} from '@/lib/motherboardFilterOptions';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterDefinition {
  key: string;
  name: string;
  type: 'checkbox' | 'radio' | 'range' | 'search';
  options?: FilterOption[];
  unit?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  showClearButton?: boolean;
}

export type ProcessorBrand = 'intel' | 'amd';

const priceRangeFilter: FilterDefinition = {
  key: 'priceRange',
  name: 'Price Range',
  type: 'range',
  defaultExpanded: true,
};

const stockStatusFilter: FilterDefinition = {
  key: 'stockStatus',
  name: 'Availability',
  type: 'checkbox',
  defaultExpanded: true,
  options: [
    { value: 'IN_STOCK', label: 'In Stock' },
    { value: 'PRE_ORDER', label: 'Pre Order' },
    { value: 'UPCOMING', label: 'Up Coming' },
  ],
};

const intelGenerationFilter: FilterDefinition = {
  key: 'generation',
  name: 'Generation',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: 'Up to 9th Gen', label: 'Up to 9th Gen' },
    { value: '10th Gen', label: '10th Gen' },
    { value: '11th Gen', label: '11th Gen' },
    { value: '12th Gen', label: '12th Gen' },
    { value: '13th Gen', label: '13th Gen' },
    { value: '14th Gen', label: '14th Gen' },
  ],
};

const amdSeriesFilter: FilterDefinition = {
  key: 'generation',
  name: 'Series',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: '1000 Series', label: '1000 Series' },
    { value: '2000 Series', label: '2000 Series' },
    { value: '3000 Series', label: '3000 Series' },
    { value: '4000 Series', label: '4000 Series' },
    { value: '5000 Series', label: '5000 Series' },
    { value: '7000 Series', label: '7000 Series' },
    { value: '8000 Series', label: '8000 Series' },
    { value: '9000 Series', label: '9000 Series' },
  ],
};

const intelTypeFilter: FilterDefinition = {
  key: 'processor_model',
  name: 'Type',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: 'PDC', label: 'PDC' },
    { value: 'Core i3', label: 'Core i3' },
    { value: 'Core i5', label: 'Core i5' },
    { value: 'Core i7', label: 'Core i7' },
    { value: 'Core i9', label: 'Core i9' },
    { value: 'Core Ultra 5', label: 'Core Ultra 5' },
    { value: 'Core Ultra 7', label: 'Core Ultra 7' },
    { value: 'Core Ultra 9', label: 'Core Ultra 9' },
  ],
};

const amdTypeFilter: FilterDefinition = {
  key: 'processor_model',
  name: 'Type',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: 'Athlon', label: 'Athlon' },
    { value: 'Ryzen 3', label: 'Ryzen 3' },
    { value: 'Ryzen 5', label: 'Ryzen 5' },
    { value: 'Ryzen 7', label: 'Ryzen 7' },
    { value: 'Ryzen 9', label: 'Ryzen 9' },
    { value: 'Threadripper', label: 'Threadripper' },
  ],
};

const intelSocketFilter: FilterDefinition = {
  key: 'socket_type',
  name: 'Socket',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: 'LGA2011', label: 'LGA2011' },
    { value: 'LGA1155', label: 'LGA1155' },
    { value: 'LGA1200', label: 'LGA1200' },
    { value: 'LGA1700', label: 'LGA1700' },
    { value: 'LGA1851', label: 'LGA1851' },
  ],
};

const amdSocketFilter: FilterDefinition = {
  key: 'socket_type',
  name: 'Socket',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: 'AM4', label: 'AM4' },
    { value: 'AM5', label: 'AM5' },
    { value: 'TR4', label: 'TR4' },
  ],
};

const intelCoreFilter: FilterDefinition = {
  key: 'number_of_cores',
  name: 'Number of Core',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: '2', label: '2' },
    { value: '4', label: '4' },
    { value: '6', label: '6' },
    { value: '8', label: '8' },
    { value: '10', label: '10' },
    { value: '12', label: '12' },
    { value: '14', label: '14' },
    { value: '16', label: '16' },
    { value: '18', label: '18' },
  ],
};

const amdCoreFilter: FilterDefinition = {
  key: 'number_of_cores',
  name: 'Number of Core',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: '2', label: '2' },
    { value: '4', label: '4' },
    { value: '6', label: '6' },
    { value: '8', label: '8' },
    { value: '12', label: '12' },
    { value: '16', label: '16' },
    { value: '24', label: '24' },
    { value: '32', label: '32' },
    { value: '64', label: '64' },
  ],
};

const intelThreadFilter: FilterDefinition = {
  key: 'number_of_threads',
  name: 'Number of Thread',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: '4', label: '4' },
    { value: '8', label: '8' },
    { value: '10', label: '10' },
    { value: '12', label: '12' },
    { value: '14', label: '14' },
    { value: '16', label: '16' },
    { value: '18', label: '18' },
    { value: '20', label: '20' },
    { value: '24', label: '24' },
  ],
};

const amdThreadFilter: FilterDefinition = {
  key: 'number_of_threads',
  name: 'Number of Thread',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: '4', label: '4' },
    { value: '8', label: '8' },
    { value: '12', label: '12' },
    { value: '16', label: '16' },
    { value: '24', label: '24' },
    { value: '32', label: '32' },
    { value: '48', label: '48' },
    { value: '64', label: '64' },
    { value: '128', label: '128' },
  ],
};

const clockSpeedFilter: FilterDefinition = {
  key: 'base_clock',
  name: 'Clock Speed',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: 'Up to 2.4GHz', label: 'Up to 2.4GHz' },
    { value: '2.5GHz to 3.4GHz', label: '2.5GHz to 3.4GHz' },
    { value: '3.5GHz to 3.9GHz', label: '3.5GHz to 3.9GHz' },
    { value: '4.0GHz to 5.0GHz', label: '4.0GHz to 5.0GHz' },
    { value: 'Above 5.1GHz', label: 'Above 5.1GHz' },
  ],
};

const cacheFilter: FilterDefinition = {
  key: 'cache_size',
  name: 'Cache',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: '2MB to 8MB', label: '2MB to 8MB' },
    { value: '9MB to 12MB', label: '9MB to 12MB' },
    { value: '14MB to 30MB', label: '14MB to 30MB' },
    { value: '32MB & Above', label: '32MB & Above' },
  ],
};

export function getProcessorFilters(brand: ProcessorBrand): FilterDefinition[] {
  const isAmd = brand === 'amd';

  return [
    priceRangeFilter,
    stockStatusFilter,
    isAmd ? amdSeriesFilter : intelGenerationFilter,
    isAmd ? amdTypeFilter : intelTypeFilter,
    isAmd ? amdSocketFilter : intelSocketFilter,
    isAmd ? amdCoreFilter : intelCoreFilter,
    isAmd ? amdThreadFilter : intelThreadFilter,
    clockSpeedFilter,
    cacheFilter,
  ];
}

/** Intel processor filters (default legacy export) */
export const processorFilters: FilterDefinition[] = getProcessorFilters('intel');

export const PROCESSOR_BRAND_SPEC_FILTER_KEYS = [
  'generation',
  'processor_model',
  'socket_type',
  'number_of_cores',
  'number_of_threads',
  'base_clock',
  'cache_size',
] as const;

// Sort options for processor page
export const processorSortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name: A to Z' },
];

export const gpuSortOptions = processorSortOptions;

export type GpuChipsetBrand = 'nvidia' | 'amd';

export const GPU_MANUFACTURER_BRANDS = [
  { value: 'colorful', label: 'Colorful' },
  { value: 'inno3d', label: 'INNO3D' },
  { value: 'msi', label: 'MSI' },
  { value: 'asus', label: 'ASUS' },
  { value: 'pny', label: 'PNY' },
  { value: 'gigabyte', label: 'GIGABYTE' },
  { value: 'zotac', label: 'ZOTAC' },
  { value: 'manli', label: 'Manli' },
  { value: 'nvidia', label: 'NVIDIA' },
  { value: 'sapphire', label: 'Sapphire' },
  { value: 'powercolor', label: 'PowerColor' },
  { value: 'gunnir', label: 'GUNNIR' },
  { value: 'yeston', label: 'Yeston' },
  { value: 'arktek', label: 'ARKTEK' },
  { value: 'afox', label: 'AFOX' },
  { value: 'ocpc', label: 'OCPC' },
  { value: 'peladn', label: 'PELADN' },
  { value: 'maxsun', label: 'MAXSUN' },
  { value: 'unika', label: 'Unika' },
];

const gpuManufacturerFilter: FilterDefinition = {
  key: 'manufacturer',
  name: 'Brand',
  type: 'checkbox',
  defaultExpanded: false,
  showClearButton: true,
  options: GPU_MANUFACTURER_BRANDS,
};

const gpuChipsetFilter: FilterDefinition = {
  key: 'gpu_chipset',
  name: 'Chipset',
  type: 'checkbox',
  defaultExpanded: true,
  options: [
    { value: 'NVIDIA GeForce', label: 'NVIDIA GeForce' },
    { value: 'AMD Radeon', label: 'AMD Radeon' },
    { value: 'Intel Arc', label: 'Intel Arc' },
  ],
};

const gpuMemoryFilter: FilterDefinition = {
  key: 'memory_size',
  name: 'Memory',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: '1GB', label: '1GB' },
    { value: '2GB', label: '2GB' },
    { value: '4GB', label: '4GB' },
    { value: '6GB', label: '6GB' },
    { value: '8GB', label: '8GB' },
    { value: '10GB', label: '10GB' },
    { value: '12GB', label: '12GB' },
    { value: '16GB', label: '16GB' },
    { value: '20GB', label: '20GB' },
    { value: '24GB', label: '24GB' },
  ],
};

const gpuMemoryTypeFilter: FilterDefinition = {
  key: 'memory_type',
  name: 'Memory Type',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: 'GDDR3', label: 'GDDR3' },
    { value: 'GDDR4', label: 'GDDR4' },
    { value: 'GDDR5', label: 'GDDR5' },
    { value: 'GDDR6', label: 'GDDR6' },
    { value: 'GDDR6X', label: 'GDDR6X' },
    { value: 'GDDR7', label: 'GDDR7' },
  ],
};

const gpuResolutionFilter: FilterDefinition = {
  key: 'resolution',
  name: 'Max Resolution',
  type: 'checkbox',
  defaultExpanded: false,
  options: [
    { value: '1920x1200', label: '1920 X 1200' },
    { value: '2560x1440', label: '2560 X 1440' },
    { value: '2560x1600', label: '2560 X 1600' },
    { value: '3840x2160', label: '3840 X 2160' },
    { value: '4096x2160', label: '4096 X 2160' },
    { value: '5120x2880', label: '5120 X 2880' },
    { value: '7680x4320', label: '7680 X 4320' },
  ],
};

export function getGpuFilters(_chipsetBrand?: GpuChipsetBrand): FilterDefinition[] {
  return [
    priceRangeFilter,
    stockStatusFilter,
    gpuManufacturerFilter,
    gpuChipsetFilter,
    gpuMemoryFilter,
    gpuMemoryTypeFilter,
    gpuResolutionFilter,
  ];
}

export const GPU_SPEC_FILTER_KEYS = [
  'manufacturer',
  'gpu_chipset',
  'memory_size',
  'memory_type',
  'resolution',
] as const;

const ramStockStatusFilter: FilterDefinition = {
  key: 'stockStatus',
  name: 'Availability',
  type: 'checkbox',
  defaultExpanded: true,
  options: [
    { value: 'IN_STOCK', label: 'In Stock' },
    { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
    { value: 'PRE_ORDER', label: 'Pre Order' },
    { value: 'UPCOMING', label: 'Up Coming' },
  ],
};

const ramBrandFilter: FilterDefinition = {
  key: 'brand',
  name: 'Brands',
  type: 'checkbox',
  defaultExpanded: false,
  showClearButton: true,
  options: RAM_BRANDS.map((b) => ({ value: b.slug, label: b.label })),
};

const ramSpeedFilter: FilterDefinition = {
  key: 'speed',
  name: 'RAM Speed',
  type: 'checkbox',
  defaultExpanded: false,
  options: RAM_SPEED_OPTIONS.map((s) => ({ value: s, label: s })),
};

const ramTypeFilter: FilterDefinition = {
  key: 'memory_type',
  name: 'RAM Type',
  type: 'checkbox',
  defaultExpanded: false,
  options: RAM_TYPE_OPTIONS.map((t) => ({ value: t, label: t })),
};

const ramSizeFilter: FilterDefinition = {
  key: 'capacity',
  name: 'RAM Size',
  type: 'checkbox',
  defaultExpanded: false,
  options: RAM_SIZE_OPTIONS.map((s) => ({ value: s, label: s })),
};

const ramFeaturesFilter: FilterDefinition = {
  key: 'ram_features',
  name: 'RAM Features',
  type: 'checkbox',
  defaultExpanded: false,
  options: RAM_FEATURE_OPTIONS.map((f) => ({ value: f, label: f })),
};

export function getRamFilters(): FilterDefinition[] {
  return [
    ramStockStatusFilter,
    priceRangeFilter,
    ramBrandFilter,
    ramSpeedFilter,
    ramTypeFilter,
    ramSizeFilter,
    ramFeaturesFilter,
  ];
}

export const ramSortOptions = processorSortOptions;

export { RAM_BRANDS };

const motherboardStockStatusFilter: FilterDefinition = {
  key: 'stockStatus',
  name: 'Availability',
  type: 'checkbox',
  defaultExpanded: true,
  options: [
    { value: 'IN_STOCK', label: 'In Stock' },
    { value: 'PRE_ORDER', label: 'Pre Order' },
    { value: 'UPCOMING', label: 'Up Coming' },
  ],
};

const motherboardProcessorTypeFilter: FilterDefinition = {
  key: 'processor_type',
  name: 'Processor Type',
  type: 'checkbox',
  defaultExpanded: true,
  options: MOTHERBOARD_PROCESSOR_TYPES.map((t) => ({ value: t.value, label: t.label })),
};

const motherboardMakerBrandFilter: FilterDefinition = {
  key: 'mb_brand',
  name: 'Brand',
  type: 'checkbox',
  defaultExpanded: true,
  showClearButton: true,
  options: MOTHERBOARD_MAKER_BRANDS.map((b) => ({ value: b.value, label: b.label })),
};

const motherboardAmdSocketFilter: FilterDefinition = {
  key: 'cpu_socket',
  name: 'CPU Sockets',
  type: 'checkbox',
  defaultExpanded: false,
  options: MOTHERBOARD_AMD_SOCKETS.map((s) => ({ value: s, label: s })),
};

const motherboardIntelSocketFilter: FilterDefinition = {
  key: 'cpu_socket',
  name: 'CPU Sockets',
  type: 'checkbox',
  defaultExpanded: false,
  options: MOTHERBOARD_INTEL_SOCKETS.map((s) => ({ value: s, label: s })),
};

const motherboardFormFactorFilter: FilterDefinition = {
  key: 'form_factor',
  name: 'Form Factor',
  type: 'checkbox',
  defaultExpanded: false,
  options: MOTHERBOARD_FORM_FACTORS.map((f) => ({ value: f, label: f })),
};

const motherboardRamTypeFilter: FilterDefinition = {
  key: 'memory_type',
  name: 'RAM Type',
  type: 'checkbox',
  defaultExpanded: false,
  options: MOTHERBOARD_RAM_TYPES.map((t) => ({ value: t, label: t })),
};

const motherboardSpecialFeaturesFilter: FilterDefinition = {
  key: 'special_features',
  name: 'Special Features',
  type: 'checkbox',
  defaultExpanded: false,
  options: MOTHERBOARD_SPECIAL_FEATURES.map((f) => ({ value: f, label: f })),
};

export function getMotherboardFilters(): FilterDefinition[] {
  return [
    priceRangeFilter,
    motherboardStockStatusFilter,
    motherboardProcessorTypeFilter,
    motherboardMakerBrandFilter,
    motherboardAmdSocketFilter,
    motherboardIntelSocketFilter,
    motherboardFormFactorFilter,
    motherboardRamTypeFilter,
    motherboardSpecialFeaturesFilter,
  ];
}

export const motherboardSortOptions = processorSortOptions;

// Get filter config by category
export function getFilterConfig(category: string, brand: ProcessorBrand = 'intel'): FilterDefinition[] {
  switch (category) {
    case 'processor':
      return getProcessorFilters(brand);
    case 'gpu':
      return getGpuFilters(brand === 'amd' ? 'amd' : 'nvidia');
    case 'ram':
      return getRamFilters();
    case 'motherboard':
      return getMotherboardFilters();
    default:
      return [];
  }
}
