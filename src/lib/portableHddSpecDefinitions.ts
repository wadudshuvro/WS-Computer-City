export const PORTABLE_HDD_BRANDS = [
  { slug: 'transcend', label: 'Transcend' },
  { slug: 'western-digital', label: 'Western Digital' },
  { slug: 'seagate', label: 'Seagate' },
  { slug: 'netac', label: 'Netac' },
  { slug: 'lacie', label: 'LaCie' },
  { slug: 'asus', label: 'Asus' },
  { slug: 'toshiba', label: 'Toshiba' },
] as const;

export const PORTABLE_HDD_CAPACITY_OPTIONS = [
  '512GB to 1TB',
  '2TB to 4TB',
  '5TB to 10TB',
  '11TB to 20TB',
  '21TB to Above',
] as const;

export const PORTABLE_HDD_WEIGHT_OPTIONS = [
  'Up to 150g',
  '150g to 200g',
  '201g to 400g',
  '401g to 500g',
  'Above 500g',
] as const;

export const PORTABLE_HDD_MATERIAL_OPTIONS = ['Plastic', 'Aluminum', 'Plastic-Rubber'] as const;

export const PORTABLE_HDD_SPEC_FILTER_KEYS = ['capacity', 'weight', 'external_material'] as const;
