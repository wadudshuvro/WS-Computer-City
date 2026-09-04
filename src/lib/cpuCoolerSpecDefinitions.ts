/**
 * CPU Cooler brands, filter options, and CMS/storefront definitions.
 * Brands match Star Tech CPU Cooler hover menu + page pills.
 */

export const CPU_COOLER_BRANDS = [
  // Hover menu order (primary)
  { slug: 'msi', label: 'MSI' },
  { slug: 'antec', label: 'Antec' },
  { slug: 'gamdias', label: 'Gamdias' },
  { slug: 'arctic', label: 'ARCTIC' },
  { slug: 'corsair', label: 'Corsair' },
  { slug: 'ocypus', label: 'Ocypus' },
  { slug: 'deepcool', label: 'DeepCool' },
  { slug: 'asus', label: 'Asus' },
  { slug: '1stplayer', label: '1STPLAYER' },
  { slug: 'nzxt', label: 'NZXT' },
  { slug: 'cooler-master', label: 'Cooler Master' },
  { slug: 'cougar', label: 'Cougar' },
  { slug: 'gigabyte', label: 'Gigabyte' },
  { slug: 'xigmatek', label: 'Xigmatek' },
  { slug: 'xtreme', label: 'Xtreme' },
  { slug: 'team', label: 'TEAM' },
  { slug: 'uphere', label: 'upHere' },
  { slug: 'yeston', label: 'Yeston' },
  { slug: 'value-top', label: 'Value-Top' },
  // Extra page / sidebar brands
  { slug: 'lian-li', label: 'Lian Li' },
  { slug: 'thermaltake', label: 'Thermaltake' },
  { slug: 'noctua', label: 'Noctua' },
  { slug: 'montech', label: 'Montech' },
  { slug: 'pny', label: 'PNY' },
  { slug: 'aorus', label: 'Aorus' },
  { slug: 'apc', label: 'APC' },
  { slug: 'havit', label: 'Havit' },
] as const;

export const CPU_COOLER_PROCESSOR_TYPE_OPTIONS = ['Intel', 'AMD'] as const;

export const CPU_COOLER_SOCKET_OPTIONS = [
  'LGA1151',
  'LGA1150',
  'LGA1155',
  'LGA1156',
  'LGA2011',
  'LGA2066',
  'LGA1200',
  'LGA1700',
  'AM4',
  'AM5',
] as const;

export const CPU_COOLER_TYPE_OPTIONS = [
  'Air Cooler',
  'Liquid Cooler',
  'Hydro-Electric Cooler',
] as const;

export const CPU_COOLER_FAN_SIZE_OPTIONS = [
  '80mm',
  '92mm',
  '120mm',
  '140mm',
  '200mm',
  '240mm',
  '280mm',
  '360mm',
] as const;

export const CPU_COOLER_FAN_SPEED_OPTIONS = [
  'Up to 1500 RPM',
  '1500 RPM - 2500 RPM',
  'Above 2500 RPM',
] as const;

export const CPU_COOLER_SPECIAL_FEATURE_OPTIONS = ['RGB', 'ARGB'] as const;

export const CPU_COOLER_SPEC_FILTER_KEYS = [
  'processor_type',
  'socket',
  'cooler_type',
  'fan_size',
  'fan_speed',
  'special_features',
] as const;

export type CpuCoolerSpecFilterKey = (typeof CPU_COOLER_SPEC_FILTER_KEYS)[number];

export interface CpuCoolerSpecDefinitionSeed {
  key: string;
  name: string;
  section: string;
  dataType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  formType?: 'text' | 'number' | 'select' | 'multiselect' | 'textarea';
  isFilterable?: boolean;
  isRequired?: boolean;
  order: number;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export const CPU_COOLER_SPEC_DEFINITIONS: CpuCoolerSpecDefinitionSeed[] = [
  {
    key: 'processor_type',
    name: 'Processor Type',
    section: 'Compatibility',
    dataType: 'TEXT',
    formType: 'multiselect',
    isFilterable: true,
    isRequired: true,
    order: 1,
    options: [...CPU_COOLER_PROCESSOR_TYPE_OPTIONS],
    helpText: 'Select supported CPU platforms',
  },
  {
    key: 'socket',
    name: 'Sockets',
    section: 'Compatibility',
    dataType: 'TEXT',
    formType: 'multiselect',
    isFilterable: true,
    isRequired: true,
    order: 2,
    options: [...CPU_COOLER_SOCKET_OPTIONS],
    helpText: 'Select all supported sockets',
  },
  {
    key: 'cooler_type',
    name: 'Cooler Type',
    section: 'Physical Specification',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 3,
    options: [...CPU_COOLER_TYPE_OPTIONS],
  },
  {
    key: 'fan_size',
    name: 'Fan Size',
    section: 'Physical Specification',
    dataType: 'TEXT',
    formType: 'multiselect',
    isFilterable: true,
    order: 4,
    options: [...CPU_COOLER_FAN_SIZE_OPTIONS],
  },
  {
    key: 'fan_speed',
    name: 'Fan Speed',
    section: 'Performance',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    order: 5,
    options: [...CPU_COOLER_FAN_SPEED_OPTIONS],
    helpText: 'Pick the range that best matches max RPM',
  },
  {
    key: 'special_features',
    name: 'Special Features',
    section: 'Features',
    dataType: 'TEXT',
    formType: 'multiselect',
    isFilterable: true,
    order: 6,
    options: [...CPU_COOLER_SPECIAL_FEATURE_OPTIONS],
  },
  {
    key: 'airflow',
    name: 'Airflow',
    section: 'Performance',
    dataType: 'TEXT',
    order: 7,
    placeholder: 'e.g., 75.89 CFM',
  },
  {
    key: 'noise_level',
    name: 'Noise Level',
    section: 'Performance',
    dataType: 'TEXT',
    order: 8,
    placeholder: 'e.g., 31.6 dB(A)',
  },
  {
    key: 'fan_speed_detail',
    name: 'Fan Speed Detail',
    section: 'Performance',
    dataType: 'TEXT',
    order: 9,
    placeholder: 'e.g., 500~2000 RPM±10%',
  },
  {
    key: 'warranty',
    name: 'Warranty',
    section: 'Warranty Information',
    dataType: 'TEXT',
    order: 10,
    placeholder: 'e.g., 2 Years',
  },
];

export const CPU_COOLER_SPECIFICATION_GROUPS: Record<string, { title: string; keys: string[] }> = {
  compatibility: {
    title: 'Compatibility',
    keys: ['processor_type', 'socket'],
  },
  physical: {
    title: 'Physical Specification',
    keys: ['cooler_type', 'fan_size'],
  },
  performance: {
    title: 'Performance',
    keys: ['fan_speed', 'fan_speed_detail', 'airflow', 'noise_level'],
  },
  features: {
    title: 'Features',
    keys: ['special_features'],
  },
  warranty: {
    title: 'Warranty Information',
    keys: ['warranty'],
  },
};

const CPU_COOLER_CATEGORY_SLUGS = new Set(['cpu-cooler', 'cpu-coolers', 'cooler']);

export function isCpuCoolerCategorySlug(slugs: string[]): boolean {
  return slugs.some((slug) => CPU_COOLER_CATEGORY_SLUGS.has(slug));
}
