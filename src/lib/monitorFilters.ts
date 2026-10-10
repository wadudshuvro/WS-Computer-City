import type { FilterDefinition } from '@/lib/filterConfig';
import { MONITOR_BRANDS } from '@/lib/monitorCatalog';

const option = (label: string) => ({ value: label, label });

/** Sidebar groups from the Star Tech monitor category page. */
export const MONITOR_SPEC_FILTERS: FilterDefinition[] = [
  {
    key: 'mon_size',
    name: 'Screen Size',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['15-17 inch', '18-20 inch', '21-22 inch', '23-25 inch', '26-30 inch', '31-40 inch', '41 inch & Above'].map(option),
  },
  {
    key: 'mon_resolution',
    name: 'Resolution',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['HD or Below', 'FHD', '2K QHD', '4K UHD', '5K'].map(option),
  },
  {
    key: 'mon_panel',
    name: 'Panel Type',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['TN', 'VA', 'IPS', 'OLED', 'Mini LED'].map(option),
  },
  {
    key: 'mon_refresh',
    name: 'Refresh Rate',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      'Up to 75 Hz',
      '100 Hz',
      '120 Hz',
      '144 Hz',
      '160 Hz',
      '165 Hz',
      '170 Hz',
      '175 Hz',
      '180 Hz',
      '200 Hz',
      '210 Hz',
      '220 Hz',
      '240 Hz',
      '255 Hz',
      '260 Hz',
      '275 Hz',
      '280 Hz',
      '300 Hz',
      '310 Hz',
      '320 Hz',
      '340 Hz',
      '360 Hz',
      '420 Hz',
      '425 Hz',
      '480 Hz',
      '500 Hz',
      '520 Hz',
      '540 Hz',
    ].map(option),
  },
  {
    key: 'mon_response',
    name: 'Response Time',
    type: 'checkbox',
    defaultExpanded: false,
    options: ['≤ 0.5 ms', '1-4 ms', '5-7 ms', '8-12 ms', '13-14 ms', '15 and Above'].map(option),
  },
  {
    key: 'mon_input',
    name: 'Input Type',
    type: 'checkbox',
    defaultExpanded: false,
    options: ['VGA', 'HDMI', 'DisplayPort', 'DVI', 'D-SUB', 'USB', 'USB Type-C', 'Audio Jack', 'Thunderbolt'].map(option),
  },
  {
    key: 'mon_feature',
    name: 'Features',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      'Height Adjustable Stand',
      'Touch Screen',
      'Built-in Speaker',
      'Curved Screen',
      'Built-in Webcam',
      'AMD FreeSync',
      'NVIDIA G-Sync',
      'Gaming',
      'Ultra-Wide',
      'Wall Mountable',
    ].map(option),
  },
];

export const MONITOR_FILTER_KEYS = MONITOR_SPEC_FILTERS.map((filter) => filter.key);

export function monitorBrandFilter(hideBrand: boolean): FilterDefinition | null {
  if (hideBrand) return null;
  return {
    key: 'brand',
    name: 'Brand',
    type: 'checkbox',
    defaultExpanded: true,
    options: MONITOR_BRANDS.map((brand) => ({ value: brand.slug, label: brand.label })),
  };
}
