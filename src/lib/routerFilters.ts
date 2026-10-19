import type { FilterDefinition } from '@/lib/filterConfig';
import { ROUTER_BRANDS } from '@/lib/routerCatalog';

const option = (label: string) => ({ value: label, label });

/** Sidebar groups from the Star Tech router category page. */
export const ROUTER_SPEC_FILTERS: FilterDefinition[] = [
  {
    key: 'rt_type',
    name: 'Type',
    type: 'checkbox',
    defaultExpanded: true,
    options: [
      'Standard Router',
      'Gaming Router',
      'Mesh Router',
      'SIM Router',
      'Gigabit Router',
      'ONU Router',
      'VPN Router',
      'Enterprise Router',
    ].map(option),
  },
  {
    key: 'rt_wifi',
    name: 'Wi-Fi Standard',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['Wi-Fi 7', 'Wi-Fi 6E', 'Wi-Fi 6', 'Wi-Fi 5', 'Wi-Fi 4'].map(option),
  },
  {
    key: 'rt_speed',
    name: 'WiFi Speed',
    type: 'checkbox',
    defaultExpanded: true,
    options: [
      'Up to 300 Mbps',
      '301 Mbps to 750 Mbps',
      '751 Mbps to 1200 Mbps',
      '1201 Mbps to 1800 Mbps',
      '1801 Mbps and Above',
    ].map(option),
  },
  {
    key: 'rt_band',
    name: 'Number of Bands',
    type: 'checkbox',
    defaultExpanded: false,
    options: ['Single Band', 'Dual Band', 'Tri-Band', 'Quad-Band'].map(option),
  },
  {
    key: 'rt_lan',
    name: 'Number of LAN Ports',
    type: 'checkbox',
    defaultExpanded: false,
    options: ['1', '2', '3', '4', '5 and Above'].map(option),
  },
  {
    key: 'rt_feature',
    name: 'Additional Features',
    type: 'checkbox',
    defaultExpanded: false,
    options: [
      'USB Port',
      'Repeater Mode',
      'Access Point Mode',
      'Parental Controls',
      'Mesh Support / Compatibile',
      'Dedicated Backhaul',
      'App Control',
      'Guest Network',
      'Built-in VPN',
      'QoS / Bandwidth Control',
      'Built-in Antivirus',
      'MU-MIMO',
      'Beamforming',
      'Smart Home Compatibility',
      'IPTV Support',
    ].map(option),
  },
];

export const ROUTER_FILTER_KEYS = ROUTER_SPEC_FILTERS.map((filter) => filter.key);

export function routerBrandFilter(hideBrand: boolean): FilterDefinition | null {
  if (hideBrand) return null;
  return {
    key: 'brand',
    name: 'Brand',
    type: 'checkbox',
    defaultExpanded: true,
    options: ROUTER_BRANDS.map((item) => ({ value: item.slug, label: item.label })),
  };
}
