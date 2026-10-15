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
  PSU_MODULAR_OPTIONS,
  PSU_SPEC_FILTER_KEYS,
  PSU_WATTAGE_OPTIONS,
} from '@/lib/psuSpecDefinitions';
import {
  HDD_BRANDS,
  HDD_CAPACITY_OPTIONS,
  HDD_FORM_FACTOR_OPTIONS,
  HDD_SPEED_OPTIONS,
  HDD_TYPE_OPTIONS,
} from '@/lib/hddSpecDefinitions';
import {
  SSD_BRANDS,
  SSD_CAPACITY_FILTER_OPTIONS,
  SSD_FORM_FACTOR_OPTIONS,
  SSD_INTERFACE_OPTIONS,
  SSD_PCIE_GEN_OPTIONS,
  SSD_READ_SPEED_OPTIONS,
  SSD_SIDEBAR_BRANDS,
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

export type ProcessorBrand = 'intel' | 'amd' | 'all';

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

/** Price + availability only — Show All Component overview */
export function getComponentsOverviewFilters(): FilterDefinition[] {
  return [priceRangeFilter, stockStatusFilter];
}

const processorBrandFilter: FilterDefinition = {
  key: 'brand',
  name: 'Brand',
  type: 'checkbox',
  defaultExpanded: true,
  options: [
    { value: 'intel', label: 'Intel' },
    { value: 'amd', label: 'AMD' },
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

function mergeFilterOptions(
  ...lists: Array<Array<{ value: string; label: string }> | undefined>
): Array<{ value: string; label: string }> {
  const seen = new Set<string>();
  const merged: Array<{ value: string; label: string }> = [];
  for (const list of lists) {
    for (const option of list || []) {
      if (seen.has(option.value)) continue;
      seen.add(option.value);
      merged.push(option);
    }
  }
  return merged;
}

export function getProcessorFilters(brand: ProcessorBrand): FilterDefinition[] {
  const generationFilter =
    brand === 'amd'
      ? amdSeriesFilter
      : brand === 'intel'
        ? intelGenerationFilter
        : {
            key: 'generation',
            name: 'Generation / Series',
            type: 'checkbox' as const,
            defaultExpanded: false,
            options: mergeFilterOptions(
              intelGenerationFilter.options,
              amdSeriesFilter.options
            ),
          };

  const typeFilter =
    brand === 'amd'
      ? amdTypeFilter
      : brand === 'intel'
        ? intelTypeFilter
        : {
            key: 'processor_model',
            name: 'Type',
            type: 'checkbox' as const,
            defaultExpanded: false,
            options: mergeFilterOptions(intelTypeFilter.options, amdTypeFilter.options),
          };

  const socketFilter =
    brand === 'amd'
      ? amdSocketFilter
      : brand === 'intel'
        ? intelSocketFilter
        : {
            key: 'socket_type',
            name: 'Socket',
            type: 'checkbox' as const,
            defaultExpanded: false,
            options: mergeFilterOptions(intelSocketFilter.options, amdSocketFilter.options),
          };

  const coreFilter =
    brand === 'amd'
      ? amdCoreFilter
      : brand === 'intel'
        ? intelCoreFilter
        : {
            key: 'number_of_cores',
            name: 'Number of Core',
            type: 'checkbox' as const,
            defaultExpanded: false,
            options: mergeFilterOptions(intelCoreFilter.options, amdCoreFilter.options),
          };

  const threadFilter =
    brand === 'amd'
      ? amdThreadFilter
      : brand === 'intel'
        ? intelThreadFilter
        : {
            key: 'number_of_threads',
            name: 'Number of Thread',
            type: 'checkbox' as const,
            defaultExpanded: false,
            options: mergeFilterOptions(intelThreadFilter.options, amdThreadFilter.options),
          };

  return [
    priceRangeFilter,
    stockStatusFilter,
    processorBrandFilter,
    generationFilter,
    typeFilter,
    socketFilter,
    coreFilter,
    threadFilter,
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

/**
 * Default Sort By options for EVERY storefront category listing page.
 * Keep in sync with category APIs (`price_asc` / `price_desc` / `default`).
 * Landing with no `sort` param uses price low → high (`price_asc`).
 */
export const categorySortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price (Low > High)' },
  { value: 'price_desc', label: 'Price (High > Low)' },
] as const;

/** @deprecated Use categorySortOptions — kept as alias for existing imports */
export const processorSortOptions = categorySortOptions;

export const gpuSortOptions = categorySortOptions;

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
    { value: 'PRE_ORDER', label: 'Pre Order' },
    { value: 'UPCOMING', label: 'Upcoming' },
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
  name: 'BUS Speed',
  type: 'checkbox',
  defaultExpanded: false,
  options: RAM_SPEED_OPTIONS.map((s) => ({ value: s, label: s })),
};

const ramTypeFilter: FilterDefinition = {
  key: 'memory_type',
  name: 'Memory Type',
  type: 'checkbox',
  defaultExpanded: false,
  options: RAM_TYPE_OPTIONS.map((t) => ({ value: t, label: t })),
};

const ramSizeFilter: FilterDefinition = {
  key: 'capacity',
  name: 'Capacity',
  type: 'checkbox',
  defaultExpanded: false,
  options: RAM_SIZE_OPTIONS.map((s) => ({ value: s, label: s })),
};

const ramFeaturesFilter: FilterDefinition = {
  key: 'ram_features',
  name: 'Other Feature',
  type: 'checkbox',
  defaultExpanded: false,
  options: RAM_FEATURE_OPTIONS.map((f) => ({ value: f, label: f })),
};

/** When a top brand pill is active, hide Brands — Star Tech G.Skill pattern. */
export type RamFilterContext = {
  hideBrand: boolean;
};

export function resolveRamFilterContext(opts: {
  brand?: string | null;
}): RamFilterContext {
  const brand = (opts.brand || '').trim().toLowerCase();
  return { hideBrand: Boolean(brand) };
}

export function getRamFilters(
  context: RamFilterContext | boolean = { hideBrand: false }
): FilterDefinition[] {
  const ctx: RamFilterContext =
    typeof context === 'boolean' ? { hideBrand: context } : context;

  // Star Tech order when brand scoped: Price → Availability → Capacity → Memory Type → BUS Speed → Other Feature
  const filters: FilterDefinition[] = [
    priceRangeFilter,
    ramStockStatusFilter,
  ];

  if (!ctx.hideBrand) {
    filters.push(ramBrandFilter);
  }

  filters.push(ramSizeFilter, ramTypeFilter, ramSpeedFilter, ramFeaturesFilter);

  return filters;
}

export const ramSortOptions = categorySortOptions;

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

export type MotherboardFilterPlatform = 'all' | 'intel' | 'amd';

export type MotherboardFilterContext = {
  platform: MotherboardFilterPlatform;
  /** Top maker+platform pill active (e.g. msi-amd) — hide Brand sidebar */
  hideBrand: boolean;
  /** Platform already fixed by pill / sub — hide Processor Type */
  hideProcessorType: boolean;
};

/**
 * Derive sidebar motherboard filters from URL brand pill / processor type / sub.
 * Matches Star Tech: MSI (AMD) → AMD sockets only, no Brand / Processor Type.
 */
export function resolveMotherboardFilterContext(opts: {
  brand?: string | null;
  processorType?: string | null;
  sub?: string | null;
}): MotherboardFilterContext {
  const brand = (opts.brand || '').trim().toLowerCase();
  const makerMatch = brand.match(
    /^(msi|asrock|asus|gigabyte|colorful)-(intel|amd)$/
  );
  if (makerMatch) {
    return {
      platform: makerMatch[2] as 'intel' | 'amd',
      hideBrand: true,
      hideProcessorType: true,
    };
  }
  if (brand === 'intel-motherboard' || brand === 'intel') {
    return { platform: 'intel', hideBrand: false, hideProcessorType: true };
  }
  if (brand === 'amd-motherboard' || brand === 'amd') {
    return { platform: 'amd', hideBrand: false, hideProcessorType: true };
  }

  const types = (opts.processorType || '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  if (types.length === 1 && types[0] === 'amd') {
    return { platform: 'amd', hideBrand: false, hideProcessorType: false };
  }
  if (types.length === 1 && types[0] === 'intel') {
    return { platform: 'intel', hideBrand: false, hideProcessorType: false };
  }

  if (opts.sub === 'amd-motherboard') {
    return { platform: 'amd', hideBrand: false, hideProcessorType: true };
  }
  if (opts.sub === 'intel-motherboard') {
    return { platform: 'intel', hideBrand: false, hideProcessorType: true };
  }

  return { platform: 'all', hideBrand: false, hideProcessorType: false };
}

export function getMotherboardFilters(
  context: MotherboardFilterContext | MotherboardFilterPlatform = 'all'
): FilterDefinition[] {
  const ctx: MotherboardFilterContext =
    typeof context === 'string'
      ? { platform: context, hideBrand: false, hideProcessorType: false }
      : context;

  const filters: FilterDefinition[] = [
    priceRangeFilter,
    motherboardStockStatusFilter,
  ];

  if (!ctx.hideProcessorType) {
    filters.push(motherboardProcessorTypeFilter);
  }
  if (!ctx.hideBrand) {
    filters.push(motherboardMakerBrandFilter);
  }

  if (ctx.platform === 'amd') {
    filters.push({ ...motherboardAmdSocketFilter, defaultExpanded: true });
  } else if (ctx.platform === 'intel') {
    filters.push({ ...motherboardIntelSocketFilter, defaultExpanded: true });
  } else {
    filters.push(motherboardAmdSocketFilter, motherboardIntelSocketFilter);
  }

  filters.push(
    motherboardFormFactorFilter,
    motherboardRamTypeFilter,
    motherboardSpecialFeaturesFilter
  );

  return filters;
}

export const motherboardSortOptions = categorySortOptions;

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
  name: 'Efficiency',
  type: 'checkbox',
  defaultExpanded: true,
  options: PSU_EFFICIENCY_OPTIONS.map((e) => ({ value: e, label: e })),
};

const psuModularFilter: FilterDefinition = {
  key: 'modular_type',
  name: 'Modular',
  type: 'checkbox',
  defaultExpanded: true,
  options: PSU_MODULAR_OPTIONS.map((m) => ({ value: m, label: m })),
};

export function getPsuFilters(hideBrand = false): FilterDefinition[] {
  return [
    priceRangeFilter,
    psuStockStatusFilter,
    ...(hideBrand ? [] : [psuBrandFilter]),
    psuWattageFilter,
    psuModularFilter,
    psuEfficiencyFilter,
  ];
}

export const psuSortOptions = categorySortOptions;

const hddStockStatusFilter: FilterDefinition = {
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

const hddBrandFilter: FilterDefinition = {
  key: 'brand',
  name: 'Brand',
  type: 'checkbox',
  defaultExpanded: true,
  showClearButton: true,
  options: HDD_BRANDS.map((brand) => ({ value: brand.slug, label: brand.label })),
};

const hddTypeFilter: FilterDefinition = {
  key: 'hdd_type',
  name: 'Type',
  type: 'checkbox',
  defaultExpanded: true,
  options: HDD_TYPE_OPTIONS.map((value) => ({ value, label: value })),
};

const hddCapacityFilter: FilterDefinition = {
  key: 'capacity',
  name: 'Capacity',
  type: 'checkbox',
  defaultExpanded: true,
  options: HDD_CAPACITY_OPTIONS.map((value) => ({ value, label: value })),
};

const hddSpeedFilter: FilterDefinition = {
  key: 'rpm_speed',
  name: 'Speed',
  type: 'checkbox',
  defaultExpanded: true,
  options: HDD_SPEED_OPTIONS.map((value) => ({ value, label: value })),
};

const hddFormFactorFilter: FilterDefinition = {
  key: 'form_factor',
  name: 'From Factor',
  type: 'checkbox',
  defaultExpanded: true,
  options: HDD_FORM_FACTOR_OPTIONS.map((value) => ({ value, label: value })),
};

export function getHddFilters(hideBrand = false): FilterDefinition[] {
  return [
    priceRangeFilter,
    hddStockStatusFilter,
    ...(hideBrand ? [] : [hddBrandFilter]),
    hddTypeFilter,
    hddCapacityFilter,
    hddSpeedFilter,
    hddFormFactorFilter,
  ];
}

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
  options: SSD_SIDEBAR_BRANDS.map((b) => ({ value: b.slug, label: b.label })),
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
  name: 'FormFactor',
  type: 'checkbox',
  defaultExpanded: true,
  options: SSD_FORM_FACTOR_OPTIONS.map((v) => ({ value: v, label: v })),
};

const ssdPcieGenFilter: FilterDefinition = {
  key: 'pcie_gen',
  name: 'PCIe/NVMe Generation',
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
  name: 'ReadSpeed',
  type: 'checkbox',
  defaultExpanded: true,
  options: SSD_READ_SPEED_OPTIONS.map((v) => ({ value: v, label: v })),
};

const ssdWriteSpeedFilter: FilterDefinition = {
  key: 'write_speed',
  name: 'WriteSpeed',
  type: 'checkbox',
  defaultExpanded: true,
  options: SSD_WRITE_SPEED_OPTIONS.map((v) => ({ value: v, label: v })),
};

export function getSsdFilters(hideBrand = false): FilterDefinition[] {
  return [
    priceRangeFilter,
    ssdStockStatusFilter,
    ...(hideBrand ? [] : [ssdBrandFilter]),
    ssdInterfaceFilter,
    ssdCapacityFilter,
    ssdFormFactorFilter,
    ssdPcieGenFilter,
    ssdDramFilter,
    ssdTechnologyFilter,
    ssdReadSpeedFilter,
    ssdWriteSpeedFilter,
  ];
}

export const ssdSortOptions = categorySortOptions;

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

export const casingSortOptions = categorySortOptions;

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

export const cpuCoolerSortOptions = categorySortOptions;

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
