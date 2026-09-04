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
import {
  GPU_CHIPSET_OPTIONS,
  GPU_CHIPSET_SERIES_OPTIONS,
  GPU_FAN_OPTIONS,
  GPU_MANUFACTURER_BRANDS,
  GPU_MEMORY_SIZE_OPTIONS,
  GPU_MEMORY_TYPE_OPTIONS,
  GPU_PORT_COUNT_OPTIONS,
  GPU_PORT_TYPE_OPTIONS,
  GPU_RESOLUTION_OPTIONS,
  GPU_SPEC_FILTER_KEYS,
} from '@/lib/gpuFilterOptions';
import {
  PSU_BRANDS,
  PSU_EFFICIENCY_OPTIONS,
  PSU_FORM_FACTOR_OPTIONS,
  PSU_MODULAR_OPTIONS,
  PSU_SPEC_FILTER_KEYS,
  PSU_WATTAGE_OPTIONS,
} from '@/lib/psuSpecDefinitions';
import {
  SSD_BRANDS,
  SSD_CAPACITY_FILTER_OPTIONS,
  SSD_FORM_FACTOR_OPTIONS,
  SSD_INTERFACE_OPTIONS,
  SSD_PCIE_GEN_OPTIONS,
  SSD_READ_SPEED_OPTIONS,
  SSD_SPEC_FILTER_KEYS,
  SSD_TECHNOLOGY_OPTIONS,
  SSD_WRITE_SPEED_OPTIONS,
} from '@/lib/ssdSpecDefinitions';
import {
  CASING_BRANDS,
  CASING_COLOR_OPTIONS,
  CASING_MOTHERBOARD_TYPE_OPTIONS,
  CASING_PSU_INCLUDED_OPTIONS,
  CASING_SIDE_PANEL_OPTIONS,
  CASING_SPECIAL_FEATURE_OPTIONS,
  CASING_SPEC_FILTER_KEYS,
  CASING_TYPE_OPTIONS,
} from '@/lib/casingSpecDefinitions';
import {
  CPU_COOLER_BRANDS,
  CPU_COOLER_FAN_SIZE_OPTIONS,
  CPU_COOLER_FAN_SPEED_OPTIONS,
  CPU_COOLER_PROCESSOR_TYPE_OPTIONS,
  CPU_COOLER_SOCKET_OPTIONS,
  CPU_COOLER_SPECIAL_FEATURE_OPTIONS,
  CPU_COOLER_SPEC_FILTER_KEYS,
  CPU_COOLER_TYPE_OPTIONS,
} from '@/lib/cpuCoolerSpecDefinitions';

export {
  GPU_MANUFACTURER_BRANDS,
  GPU_SPEC_FILTER_KEYS,
  PSU_BRANDS,
  PSU_SPEC_FILTER_KEYS,
  SSD_BRANDS,
  SSD_SPEC_FILTER_KEYS,
  CASING_BRANDS,
  CASING_SPEC_FILTER_KEYS,
  CPU_COOLER_BRANDS,
  CPU_COOLER_SPEC_FILTER_KEYS,
};

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

const gpuManufacturerFilter: FilterDefinition = {
  key: 'manufacturer',
  name: 'Brand',
  type: 'checkbox',
  defaultExpanded: false,
  showClearButton: true,
  options: [...GPU_MANUFACTURER_BRANDS],
};

const gpuChipsetFilter: FilterDefinition = {
  key: 'gpu_chipset',
  name: 'Chipset',
  type: 'checkbox',
  defaultExpanded: true,
  options: [...GPU_CHIPSET_OPTIONS],
};

const gpuChipsetSeriesFilter: FilterDefinition = {
  key: 'chipset_series',
  name: 'Chipset Series',
  type: 'checkbox',
  defaultExpanded: false,
  showClearButton: true,
  options: [...GPU_CHIPSET_SERIES_OPTIONS],
};

const gpuMemoryFilter: FilterDefinition = {
  key: 'memory_size',
  name: 'Memory',
  type: 'checkbox',
  defaultExpanded: false,
  options: [...GPU_MEMORY_SIZE_OPTIONS],
};

const gpuMemoryTypeFilter: FilterDefinition = {
  key: 'memory_type',
  name: 'Memory Type',
  type: 'checkbox',
  defaultExpanded: false,
  options: [...GPU_MEMORY_TYPE_OPTIONS],
};

const gpuFanFilter: FilterDefinition = {
  key: 'cooling_type',
  name: 'No. of Fans',
  type: 'checkbox',
  defaultExpanded: false,
  options: [...GPU_FAN_OPTIONS],
};

const gpuPortTypesFilter: FilterDefinition = {
  key: 'port_types',
  name: 'Types Of Ports',
  type: 'checkbox',
  defaultExpanded: false,
  options: [...GPU_PORT_TYPE_OPTIONS],
};

const gpuPortCountFilter: FilterDefinition = {
  key: 'port_count',
  name: 'No. of Ports',
  type: 'checkbox',
  defaultExpanded: false,
  options: [...GPU_PORT_COUNT_OPTIONS],
};

const gpuResolutionFilter: FilterDefinition = {
  key: 'resolution',
  name: 'Max Resolution',
  type: 'checkbox',
  defaultExpanded: false,
  options: [...GPU_RESOLUTION_OPTIONS],
};

export function getGpuFilters(_chipsetBrand?: GpuChipsetBrand): FilterDefinition[] {
  return [
    priceRangeFilter,
    stockStatusFilter,
    gpuManufacturerFilter,
    gpuChipsetFilter,
    gpuChipsetSeriesFilter,
    gpuMemoryFilter,
    gpuMemoryTypeFilter,
    gpuFanFilter,
    gpuPortTypesFilter,
    gpuPortCountFilter,
    gpuResolutionFilter,
  ];
}

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

const psuStockStatusFilter: FilterDefinition = {
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

const psuBrandFilter: FilterDefinition = {
  key: 'brand',
  name: 'Brand',
  type: 'checkbox',
  defaultExpanded: true,
  showClearButton: true,
  options: PSU_BRANDS.map((b) => ({ value: b.slug, label: b.label })),
};

const psuWattageFilter: FilterDefinition = {
  key: 'wattage',
  name: 'Wattage',
  type: 'checkbox',
  defaultExpanded: true,
  options: PSU_WATTAGE_OPTIONS.map((w) => ({ value: w, label: w })),
};

const psuEfficiencyFilter: FilterDefinition = {
  key: 'efficiency',
  name: 'Efficiency Rating',
  type: 'checkbox',
  defaultExpanded: true,
  options: PSU_EFFICIENCY_OPTIONS.map((e) => ({ value: e, label: e })),
};

const psuModularFilter: FilterDefinition = {
  key: 'modular_type',
  name: 'Modular Type',
  type: 'checkbox',
  defaultExpanded: true,
  options: PSU_MODULAR_OPTIONS.map((m) => ({ value: m, label: m })),
};

const psuFormFactorFilter: FilterDefinition = {
  key: 'form_factor',
  name: 'Form Factor',
  type: 'checkbox',
  defaultExpanded: true,
  options: PSU_FORM_FACTOR_OPTIONS.map((f) => ({ value: f, label: f })),
};

export function getPsuFilters(): FilterDefinition[] {
  return [
    priceRangeFilter,
    psuStockStatusFilter,
    psuBrandFilter,
    psuWattageFilter,
    psuEfficiencyFilter,
    psuModularFilter,
    psuFormFactorFilter,
  ];
}

export const psuSortOptions = processorSortOptions;

const ssdStockStatusFilter: FilterDefinition = {
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

const ssdBrandFilter: FilterDefinition = {
  key: 'brand',
  name: 'SSD Brand',
  type: 'checkbox',
  defaultExpanded: true,
  showClearButton: true,
  options: SSD_BRANDS.map((b) => ({ value: b.slug, label: b.label })),
};

const ssdCapacityFilter: FilterDefinition = {
  key: 'capacity',
  name: 'Capacity',
  type: 'checkbox',
  defaultExpanded: true,
  options: [...SSD_CAPACITY_FILTER_OPTIONS],
};

const ssdInterfaceFilter: FilterDefinition = {
  key: 'interface',
  name: 'Interface',
  type: 'checkbox',
  defaultExpanded: true,
  options: SSD_INTERFACE_OPTIONS.map((v) => ({ value: v, label: v })),
};

const ssdFormFactorFilter: FilterDefinition = {
  key: 'form_factor',
  name: 'Form Factor',
  type: 'checkbox',
  defaultExpanded: true,
  options: SSD_FORM_FACTOR_OPTIONS.map((v) => ({ value: v, label: v })),
};

const ssdPcieGenFilter: FilterDefinition = {
  key: 'pcie_gen',
  name: 'PCI-Express Generation',
  type: 'checkbox',
  defaultExpanded: true,
  options: SSD_PCIE_GEN_OPTIONS.map((v) => ({ value: v, label: v })),
};

const ssdDramFilter: FilterDefinition = {
  key: 'dram',
  name: 'DRAM',
  type: 'checkbox',
  defaultExpanded: true,
  options: [{ value: 'With DRAM', label: 'With DRAM' }],
};

const ssdTechnologyFilter: FilterDefinition = {
  key: 'technology',
  name: 'Technology',
  type: 'checkbox',
  defaultExpanded: true,
  options: SSD_TECHNOLOGY_OPTIONS.map((v) => ({ value: v, label: v })),
};

const ssdReadSpeedFilter: FilterDefinition = {
  key: 'read_speed',
  name: 'Read Speed',
  type: 'checkbox',
  defaultExpanded: true,
  options: SSD_READ_SPEED_OPTIONS.map((v) => ({ value: v, label: v })),
};

const ssdWriteSpeedFilter: FilterDefinition = {
  key: 'write_speed',
  name: 'Write Speed',
  type: 'checkbox',
  defaultExpanded: true,
  options: SSD_WRITE_SPEED_OPTIONS.map((v) => ({ value: v, label: v })),
};

export function getSsdFilters(): FilterDefinition[] {
  return [
    priceRangeFilter,
    ssdStockStatusFilter,
    ssdBrandFilter,
    ssdCapacityFilter,
    ssdInterfaceFilter,
    ssdFormFactorFilter,
    ssdPcieGenFilter,
    ssdDramFilter,
    ssdTechnologyFilter,
    ssdReadSpeedFilter,
    ssdWriteSpeedFilter,
  ];
}

export const ssdSortOptions = processorSortOptions;

const casingStockStatusFilter: FilterDefinition = {
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

const casingBrandFilter: FilterDefinition = {
  key: 'brand',
  name: 'Brand',
  type: 'checkbox',
  defaultExpanded: true,
  showClearButton: true,
  options: CASING_BRANDS.map((b) => ({ value: b.slug, label: b.label })),
};

const casingColorFilter: FilterDefinition = {
  key: 'color',
  name: 'Color',
  type: 'checkbox',
  defaultExpanded: true,
  options: CASING_COLOR_OPTIONS.map((v) => ({ value: v, label: v })),
};

const casingTypeFilter: FilterDefinition = {
  key: 'case_type',
  name: 'Type',
  type: 'checkbox',
  defaultExpanded: true,
  options: CASING_TYPE_OPTIONS.map((v) => ({ value: v, label: v })),
};

const casingMotherboardTypeFilter: FilterDefinition = {
  key: 'motherboard_type',
  name: 'Motherboard Type',
  type: 'checkbox',
  defaultExpanded: true,
  options: CASING_MOTHERBOARD_TYPE_OPTIONS.map((v) => ({ value: v, label: v })),
};

const casingSidePanelFilter: FilterDefinition = {
  key: 'side_panel',
  name: 'Side Panel',
  type: 'checkbox',
  defaultExpanded: true,
  options: CASING_SIDE_PANEL_OPTIONS.map((v) => ({ value: v, label: v })),
};

const casingPsuIncludedFilter: FilterDefinition = {
  key: 'psu_included',
  name: 'Power Supply',
  type: 'checkbox',
  defaultExpanded: true,
  options: CASING_PSU_INCLUDED_OPTIONS.map((v) => ({ value: v, label: v })),
};

const casingSpecialFeatureFilter: FilterDefinition = {
  key: 'special_features',
  name: 'Special Feature',
  type: 'checkbox',
  defaultExpanded: true,
  options: CASING_SPECIAL_FEATURE_OPTIONS.map((v) => ({ value: v, label: v })),
};

export function getCasingFilters(): FilterDefinition[] {
  return [
    priceRangeFilter,
    casingStockStatusFilter,
    casingBrandFilter,
    casingColorFilter,
    casingTypeFilter,
    casingMotherboardTypeFilter,
    casingSidePanelFilter,
    casingPsuIncludedFilter,
    casingSpecialFeatureFilter,
  ];
}

export const casingSortOptions = processorSortOptions;

const cpuCoolerStockStatusFilter: FilterDefinition = {
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

const cpuCoolerBrandFilter: FilterDefinition = {
  key: 'brand',
  name: 'Brand',
  type: 'checkbox',
  defaultExpanded: true,
  showClearButton: true,
  options: CPU_COOLER_BRANDS.map((b) => ({ value: b.slug, label: b.label })),
};

const cpuCoolerProcessorTypeFilter: FilterDefinition = {
  key: 'processor_type',
  name: 'Processor Type',
  type: 'checkbox',
  defaultExpanded: true,
  options: CPU_COOLER_PROCESSOR_TYPE_OPTIONS.map((v) => ({ value: v, label: v })),
};

const cpuCoolerSocketFilter: FilterDefinition = {
  key: 'socket',
  name: 'Sockets',
  type: 'checkbox',
  defaultExpanded: true,
  options: CPU_COOLER_SOCKET_OPTIONS.map((v) => ({ value: v, label: v })),
};

const cpuCoolerTypeFilter: FilterDefinition = {
  key: 'cooler_type',
  name: 'Cooler Type',
  type: 'checkbox',
  defaultExpanded: true,
  options: CPU_COOLER_TYPE_OPTIONS.map((v) => ({ value: v, label: v })),
};

const cpuCoolerFanSizeFilter: FilterDefinition = {
  key: 'fan_size',
  name: 'Fan Size',
  type: 'checkbox',
  defaultExpanded: true,
  options: CPU_COOLER_FAN_SIZE_OPTIONS.map((v) => ({ value: v, label: v })),
};

const cpuCoolerFanSpeedFilter: FilterDefinition = {
  key: 'fan_speed',
  name: 'Fan Speed',
  type: 'checkbox',
  defaultExpanded: true,
  options: CPU_COOLER_FAN_SPEED_OPTIONS.map((v) => ({ value: v, label: v })),
};

const cpuCoolerSpecialFeatureFilter: FilterDefinition = {
  key: 'special_features',
  name: 'Special Features',
  type: 'checkbox',
  defaultExpanded: true,
  options: CPU_COOLER_SPECIAL_FEATURE_OPTIONS.map((v) => ({ value: v, label: v })),
};

export function getCpuCoolerFilters(): FilterDefinition[] {
  return [
    priceRangeFilter,
    cpuCoolerStockStatusFilter,
    cpuCoolerBrandFilter,
    cpuCoolerProcessorTypeFilter,
    cpuCoolerSocketFilter,
    cpuCoolerTypeFilter,
    cpuCoolerFanSizeFilter,
    cpuCoolerFanSpeedFilter,
    cpuCoolerSpecialFeatureFilter,
  ];
}

export const cpuCoolerSortOptions = processorSortOptions;

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
    case 'psu':
    case 'power-supply':
      return getPsuFilters();
    case 'ssd':
    case 'nvme':
    case 'storage':
      return getSsdFilters();
    case 'casing':
    case 'computer-case':
    case 'case':
      return getCasingFilters();
    case 'cpu-cooler':
    case 'cooler':
      return getCpuCoolerFilters();
    default:
      return [];
  }
}
