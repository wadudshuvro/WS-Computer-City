/**
 * Power Supply (PSU) brands, filter options, and CMS/storefront shared keys.
 * Brands match Star Tech Power Supply hover menu.
 */

export const PSU_BRANDS = [
  { slug: 'msi', label: 'MSI' },
  { slug: 'antec', label: 'Antec' },
  { slug: 'gamdias', label: 'Gamdias' },
  { slug: 'maxgreen', label: 'MaxGreen' },
  { slug: '1stplayer', label: '1STPLAYER' },
  { slug: 'corsair', label: 'Corsair' },
  { slug: 'cooler-master', label: 'Cooler Master' },
  { slug: 'gigabyte', label: 'Gigabyte' },
  { slug: 'asus', label: 'Asus' },
  { slug: 'deepcool', label: 'DeepCool' },
  { slug: 'nzxt', label: 'NZXT' },
  { slug: 'ocypus', label: 'Ocypus' },
  { slug: 'acer', label: 'Acer' },
  { slug: 'xigmatek', label: 'Xigmatek' },
  { slug: 'cougar', label: 'Cougar' },
  { slug: 'ocpc', label: 'OCPC' },
  { slug: 't-wolf', label: 'T-WOLF' },
  { slug: 'solitine', label: 'Solitine' },
] as const;

export const PSU_WATTAGE_OPTIONS = [
  'Up to 499Watt',
  '500 to 799Watt',
  '800 to 999Watt',
  '1000 & Above',
] as const;

export const PSU_EFFICIENCY_OPTIONS = [
  '80+ Titanium',
  '80+ Platinum',
  '80+ Gold',
  '80+ Silver',
  '80+ Bronze',
  '80+ White',
  '80+',
] as const;

export const PSU_MODULAR_OPTIONS = ['Full Modular', 'Semi Modular', 'Non Modular'] as const;

export const PSU_FORM_FACTOR_OPTIONS = ['ATX', 'SFX', 'SFX-L', 'TFX'] as const;

/** Spec / URL keys used by PSU sidebar filters (excludes price, availability, brand). */
export const PSU_SPEC_FILTER_KEYS = ['wattage', 'modular_type', 'efficiency'] as const;

export type PsuSpecFilterKey = (typeof PSU_SPEC_FILTER_KEYS)[number];

export interface PsuSpecDefinitionSeed {
  key: string;
  name: string;
  section: string;
  dataType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  formType?: 'text' | 'number' | 'select' | 'textarea';
  isFilterable?: boolean;
  isRequired?: boolean;
  order: number;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export const PSU_SPEC_DEFINITIONS: PsuSpecDefinitionSeed[] = [
  {
    key: 'wattage',
    name: 'Wattage',
    section: 'Power',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 1,
    options: [...PSU_WATTAGE_OPTIONS],
    helpText: 'Continuous / rated power output',
  },
  {
    key: 'efficiency',
    name: 'Efficiency Rating',
    section: 'Power',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 2,
    options: [...PSU_EFFICIENCY_OPTIONS],
  },
  {
    key: 'modular_type',
    name: 'Modular Type',
    section: 'Cables',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 3,
    options: [...PSU_MODULAR_OPTIONS],
  },
  {
    key: 'form_factor',
    name: 'Form Factor',
    section: 'Physical Specification',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 4,
    options: [...PSU_FORM_FACTOR_OPTIONS],
  },
  {
    key: 'connectors',
    name: 'Connectors',
    section: 'Cables',
    dataType: 'TEXT',
    formType: 'textarea',
    order: 5,
    placeholder: 'e.g., 1x 24-pin, 2x 8-pin CPU, 3x PCIe, SATA…',
  },
  {
    key: 'fan_size',
    name: 'Fan Size',
    section: 'Cooling',
    dataType: 'TEXT',
    order: 6,
    placeholder: 'e.g., 120mm',
  },
  {
    key: 'dimension',
    name: 'Dimension',
    section: 'Physical Specification',
    dataType: 'TEXT',
    order: 7,
    placeholder: 'e.g., 150 x 140 x 86 mm',
  },
  {
    key: 'warranty',
    name: 'Warranty',
    section: 'Warranty Information',
    dataType: 'TEXT',
    order: 8,
    placeholder: 'e.g., 5 Years',
  },
];

export const PSU_SPECIFICATION_GROUPS: Record<string, { title: string; keys: string[] }> = {
  power: {
    title: 'Power',
    keys: ['wattage', 'efficiency'],
  },
  cables: {
    title: 'Cables',
    keys: ['modular_type', 'connectors'],
  },
  cooling: {
    title: 'Cooling',
    keys: ['fan_size'],
  },
  physical: {
    title: 'Physical Specification',
    keys: ['form_factor', 'dimension'],
  },
  warranty: {
    title: 'Warranty Information',
    keys: ['warranty'],
  },
};

const PSU_CATEGORY_SLUGS = new Set(['power-supply', 'psu']);

export function isPsuCategory(slugs: string[]): boolean {
  return slugs.some((slug) => PSU_CATEGORY_SLUGS.has(slug));
}
