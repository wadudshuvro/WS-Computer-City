import type { FilterDefinition } from '@/lib/filterConfig';
import { WATCH_BRANDS } from '@/lib/watchCatalog';

/** Star Tech Smart Watch sidebar groups. */
export const WATCH_SPEC_FILTERS: FilterDefinition[] = [
  {
    key: 'watch_use',
    name: 'Use For',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['Male', 'Female', 'Children'].map((label) => ({ value: label, label })),
  },
  {
    key: 'watch_dial',
    name: 'Dial Shape',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['Round', 'Square', 'Curved'].map((label) => ({ value: label, label })),
  },
  {
    key: 'watch_strap',
    name: 'Strap Material',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['Silicone', 'Leather', 'Metal'].map((label) => ({ value: label, label })),
  },
  {
    key: 'watch_display',
    name: 'Display Type',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['OLED', 'AMOLED', 'TFT', 'IPS'].map((label) => ({ value: label, label })),
  },
  {
    key: 'watch_os',
    name: 'OS',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['Android', 'iOS', 'Others'].map((label) => ({ value: label, label })),
  },
  {
    key: 'watch_feature',
    name: 'Features',
    type: 'checkbox',
    defaultExpanded: true,
    options: [
      'Heart Rate Monitor',
      'Oxygen Sensor (SpO2)',
      'GPS',
      'Call Function',
      'PAI',
      'Waterproof',
    ].map((label) => ({ value: label, label })),
  },
];

export const WATCH_FILTER_KEYS = WATCH_SPEC_FILTERS.map((filter) => filter.key);

export function watchBrandFilter(hideBrand: boolean): FilterDefinition | null {
  if (hideBrand) return null;
  return {
    key: 'brand',
    name: 'Brand',
    type: 'checkbox',
    defaultExpanded: true,
    options: WATCH_BRANDS.map((brand) => ({ value: brand.slug, label: brand.label })),
  };
}
