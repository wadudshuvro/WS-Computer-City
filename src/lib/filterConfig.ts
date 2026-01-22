/**
 * Filter Configuration for Category Pages
 * Defines dynamic filters based on category specifications
 */

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

// Processor-specific filter definitions matching TechLand UI
export const processorFilters: FilterDefinition[] = [
  {
    key: 'stockStatus',
    name: 'Availability',
    type: 'checkbox',
    defaultExpanded: true,
    options: [
      { value: 'IN_STOCK', label: 'In Stock' },
      { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
      { value: 'PRE_ORDER', label: 'Pre-Order' },
      { value: 'UPCOMING', label: 'Up Coming' },
    ],
  },
  {
    key: 'priceRange',
    name: 'Price Range',
    type: 'range',
    defaultExpanded: true,
  },
  {
    key: 'brand',
    name: 'Brands',
    type: 'checkbox',
    defaultExpanded: true,
    options: [
      { value: 'amd', label: 'AMD' },
      { value: 'intel', label: 'Intel' },
    ],
  },
  {
    key: 'number_of_cores',
    name: 'Number of Cores',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      { value: '2 Core', label: '2 Core' },
      { value: '4 Core', label: '4 Core' },
      { value: '6 Core', label: '6 Core' },
      { value: '8 Core', label: '8 Core' },
      { value: '10 Core', label: '10 Core' },
      { value: '12 Core', label: '12 Core' },
      { value: '14 Core', label: '14 Core' },
      { value: '16 Core', label: '16 Core' },
      { value: '20 Core', label: '20 Core' },
      { value: '24 Core', label: '24 Core' },
      { value: '28 Core', label: '28 Core' },
    ],
  },
  {
    key: 'processor_model',
    name: 'Processor Model',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      // Intel Models
      { value: 'Intel Core i3', label: 'Intel Core i3' },
      { value: 'Intel Core i5', label: 'Intel Core i5' },
      { value: 'Intel Core i7', label: 'Intel Core i7' },
      { value: 'Intel Core i9', label: 'Intel Core i9' },
      { value: 'Intel Core Ultra 5', label: 'Intel Core Ultra 5' },
      { value: 'Intel Core Ultra 7', label: 'Intel Core Ultra 7' },
      { value: 'Intel Core Ultra 9', label: 'Intel Core Ultra 9' },
      // AMD Models
      { value: 'Ryzen 3', label: 'Ryzen 3' },
      { value: 'Ryzen 5', label: 'Ryzen 5' },
      { value: 'Ryzen 7', label: 'Ryzen 7' },
      { value: 'Ryzen 9', label: 'Ryzen 9' },
    ],
  },
  {
    key: 'number_of_threads',
    name: 'Number of Thread',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      { value: '4 Threads', label: '4 Threads' },
      { value: '6 Threads', label: '6 Threads' },
      { value: '8 Threads', label: '8 Threads' },
      { value: '12 Threads', label: '12 Threads' },
      { value: '16 Threads', label: '16 Threads' },
      { value: '20 Threads', label: '20 Threads' },
      { value: '24 Threads', label: '24 Threads' },
      { value: '28 Threads', label: '28 Threads' },
      { value: '32 Threads', label: '32 Threads' },
    ],
  },
  {
    key: 'generation',
    name: 'Processor Series',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      // Intel Generations
      { value: '14th Gen (Raptor Lake Refresh)', label: '14th Gen' },
      { value: '13th Gen (Raptor Lake)', label: '13th Gen' },
      { value: '12th Gen (Alder Lake)', label: '12th Gen' },
      { value: '11th Gen (Rocket Lake)', label: '11th Gen' },
      { value: '10th Gen (Comet Lake)', label: '10th Gen' },
      { value: 'Ultra Series 1', label: 'Ultra (Series 1)' },
      { value: 'Ultra Series 2', label: 'Ultra (Series 2)' },
      // AMD Series
      { value: 'Ryzen 9000 Series', label: 'Ryzen 9000 Series' },
      { value: 'Ryzen 8000 Series', label: 'Ryzen 8000 Series' },
      { value: 'Ryzen 7000 Series', label: 'Ryzen 7000 Series' },
      { value: 'Ryzen 5000 Series', label: 'Ryzen 5000 Series' },
    ],
  },
  {
    key: 'base_clock',
    name: 'Clock Speed',
    type: 'checkbox',
    defaultExpanded: false,
    unit: 'GHz',
    options: [
      { value: '2.0-2.5', label: '2.0 - 2.5 GHz' },
      { value: '2.5-3.0', label: '2.5 - 3.0 GHz' },
      { value: '3.0-3.5', label: '3.0 - 3.5 GHz' },
      { value: '3.5-4.0', label: '3.5 - 4.0 GHz' },
      { value: '4.0-4.5', label: '4.0 - 4.5 GHz' },
      { value: '4.5+', label: '4.5+ GHz' },
    ],
  },
  {
    key: 'socket_type',
    name: 'Socket',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      { value: 'LGA 1700', label: 'LGA 1700' },
      { value: 'LGA 1200', label: 'LGA 1200' },
      { value: 'LGA 1851', label: 'LGA 1851' },
      { value: 'FCLGA1851', label: 'FCLGA1851' },
      { value: 'AM5', label: 'AMD AM5' },
      { value: 'AM4', label: 'AMD AM4' },
    ],
  },
  {
    key: 'cache_size',
    name: 'Processor Cache Memory',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      { value: '12 MB', label: '12 MB' },
      { value: '18 MB', label: '18 MB' },
      { value: '24 MB', label: '24 MB' },
      { value: '30 MB', label: '30 MB' },
      { value: '32 MB', label: '32 MB' },
      { value: '36 MB', label: '36 MB' },
      { value: '64 MB', label: '64 MB' },
      { value: '96 MB', label: '96 MB' },
      { value: '128 MB', label: '128 MB' },
    ],
  },
  {
    key: 'processor_features',
    name: 'Processor Features',
    type: 'checkbox',
    defaultExpanded: false,
    showClearButton: true,
    options: [
      { value: 'Hyper-Threading', label: 'Hyper-Threading' },
      { value: 'Turbo Boost', label: 'Turbo Boost' },
      { value: 'DDR5 Support', label: 'DDR5 Support' },
      { value: 'PCIe 5.0 Support', label: 'PCIe 5.0 Support' },
      { value: 'Unlocked Multiplier', label: 'Unlocked Multiplier' },
      { value: 'Integrated Graphics', label: 'Integrated Graphics' },
      { value: '3D V-Cache', label: '3D V-Cache' },
    ],
  },
];

// Sort options for processor page
export const processorSortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name: A to Z' },
];

// Get filter config by category
export function getFilterConfig(category: string): FilterDefinition[] {
  switch (category) {
    case 'processor':
      return processorFilters;
    // Add more categories here
    default:
      return [];
  }
}
