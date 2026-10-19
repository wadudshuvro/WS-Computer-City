import type { FilterDefinition } from '@/lib/filterConfig';

export type UpsBrand = { slug: string; label: string };

function brand(label: string): UpsBrand {
  return {
    label,
    slug: label
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  };
}

/** Brand pills in the order shown on the Star Tech UPS page. */
export const UPS_BRANDS: UpsBrand[] = [
  'MaxGreen',
  'SANTAK',
  'Digital X',
  'Prolink',
  'Apollo',
  'KSTAR',
  'MARSRIVA',
  'Power Pac',
  'Vertiv',
  'Power Guard',
  'PC Power',
  'Ideal',
  'Must',
  'ZKTeco',
  'KENSON',
  'Dahua',
].map(brand);

export const UPS_LISTING_URL = 'https://www.startech.com.bd/ups';

const option = (label: string) => ({ value: label, label });

/** Sidebar groups from the Star Tech UPS page (after Price Range and Availability). */
export const UPS_SPEC_FILTERS: FilterDefinition[] = [
  {
    key: 'ups_va',
    name: 'Volt Ampere (VA)',
    type: 'checkbox',
    defaultExpanded: true,
    options: [
      '650VA',
      '750VA',
      '800VA',
      '850VA',
      '1000VA',
      '1200VA',
      '1250VA',
      '1500VA',
      '2000VA',
      '2200VA',
      '3000VA',
    ].map(option),
  },
  {
    key: 'ups_watt',
    name: 'Load Capacity (Watts)',
    type: 'checkbox',
    defaultExpanded: true,
    options: [
      '300W',
      '360W',
      '375W',
      '390W',
      '400W',
      '480W',
      '600W',
      '700W',
      '720W',
      '750W',
      '900W',
      '1200W',
      '1800W',
    ].map(option),
  },
  {
    key: 'ups_body',
    name: 'Body Material',
    type: 'checkbox',
    defaultExpanded: true,
    options: ['Metal', 'Plastic'].map(option),
  },
];

export const UPS_FILTER_KEYS = UPS_SPEC_FILTERS.map((filter) => filter.key);
