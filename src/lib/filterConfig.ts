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

// Processor filters matching TechLand BD layout (Intel / AMD tabs handle brand)
export const processorFilters: FilterDefinition[] = [
  {
    key: 'priceRange',
    name: 'Price Range',
    type: 'range',
    defaultExpanded: true,
  },
  {
    key: 'stockStatus',
    name: 'Availability',
    type: 'checkbox',
    defaultExpanded: true,
    options: [
      { value: 'IN_STOCK', label: 'In Stock' },
      { value: 'PRE_ORDER', label: 'Pre Order' },
      { value: 'UPCOMING', label: 'Up Coming' },
    ],
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
    default:
      return [];
  }
}
