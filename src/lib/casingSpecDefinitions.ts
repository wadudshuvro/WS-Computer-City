/**
 * Computer Casing brands, filter options, and CMS/storefront definitions.
 * Brands match Star Tech Casing hover menu + page pills.
 */

export const CASING_BRANDS = [
  // Hover menu order (primary)
  { slug: 'msi', label: 'MSI' },
  { slug: 'antec', label: 'Antec' },
  { slug: 'gamdias', label: 'Gamdias' },
  { slug: 'maxgreen', label: 'MaxGreen' },
  { slug: 'corsair', label: 'Corsair' },
  { slug: 'asus', label: 'Asus' },
  { slug: '1stplayer', label: '1STPLAYER' },
  { slug: 'nzxt', label: 'NZXT' },
  { slug: 'gigabyte', label: 'Gigabyte' },
  { slug: 'xtreme', label: 'Xtreme' },
  { slug: 'deepcool', label: 'DeepCool' },
  { slug: 'xigmatek', label: 'Xigmatek' },
  { slug: 'value-top', label: 'Value-Top' },
  { slug: 'cougar', label: 'Cougar' },
  { slug: 'pc-power', label: 'PC Power' },
  { slug: 'monarch', label: 'Monarch' },
  { slug: 'acer', label: 'Acer' },
  { slug: 'carbono', label: 'Carbono' },
  { slug: 't-wolf', label: 'T-Wolf' },
  { slug: 'arctic', label: 'Arctic' },
  // Extra page brands
  { slug: 'cooler-master', label: 'Cooler Master' },
  { slug: 'adata', label: 'Adata' },
  { slug: 'aigo', label: 'Aigo' },
  { slug: 'apacer', label: 'Apacer' },
  { slug: 'avesta', label: 'AVESTA' },
  { slug: 'bitfenix', label: 'BitFenix' },
  { slug: 'fantech', label: 'Fantech' },
  { slug: 'fractal-design', label: 'Fractal Design' },
  { slug: 'golden-field', label: 'Golden Field' },
  { slug: 'lian-li', label: 'Lian Li' },
  { slug: 'phanteks', label: 'Phanteks' },
  { slug: 'razer', label: 'Razer' },
  { slug: 'rosewill', label: 'Rosewill' },
  { slug: 'sapphire', label: 'Sapphire' },
  { slug: 'silverstone', label: 'SilverStone' },
  { slug: 'thermaltake', label: 'Thermaltake' },
  { slug: 'zalman', label: 'Zalman' },
  { slug: 'ars', label: 'ARS' },
] as const;

export const CASING_COLOR_OPTIONS = [
  'Black',
  'White',
  'Pink',
  'Blue',
  'Silver',
  'Grey',
] as const;

export const CASING_TYPE_OPTIONS = [
  'Mid Tower',
  'Full Tower',
  'Mini Tower',
  'Micro Tower',
  'Desktop',
] as const;

export const CASING_MOTHERBOARD_TYPE_OPTIONS = [
  'ATX',
  'Micro-ATX',
  'Mini-ITX',
  'E-ATX',
] as const;

export const CASING_SIDE_PANEL_OPTIONS = [
  'Mesh',
  'Side Window',
  'Full Window',
  'Tempered Glass',
  'Plastic',
  'Solid Panel',
  'Ventilation',
] as const;

export const CASING_PSU_INCLUDED_OPTIONS = ['No', 'Yes'] as const;

export const CASING_SPECIAL_FEATURE_OPTIONS = [
  'RGB',
  'ARGB',
  'Glass Side Panel',
] as const;

export const CASING_SPEC_FILTER_KEYS = [
  'color',
  'case_type',
  'motherboard_type',
  'side_panel',
  'psu_included',
  'special_features',
] as const;

export type CasingSpecFilterKey = (typeof CASING_SPEC_FILTER_KEYS)[number];

export interface CasingSpecDefinitionSeed {
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

export const CASING_SPEC_DEFINITIONS: CasingSpecDefinitionSeed[] = [
  {
    key: 'color',
    name: 'Color',
    section: 'Physical Specification',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 1,
    options: [...CASING_COLOR_OPTIONS],
  },
  {
    key: 'case_type',
    name: 'Type',
    section: 'Physical Specification',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 2,
    options: [...CASING_TYPE_OPTIONS],
  },
  {
    key: 'motherboard_type',
    name: 'Motherboard Type',
    section: 'Compatibility',
    dataType: 'TEXT',
    formType: 'multiselect',
    isFilterable: true,
    isRequired: true,
    order: 3,
    options: [...CASING_MOTHERBOARD_TYPE_OPTIONS],
    helpText: 'Select all supported motherboard sizes',
  },
  {
    key: 'side_panel',
    name: 'Side Panel',
    section: 'Physical Specification',
    dataType: 'TEXT',
    formType: 'multiselect',
    isFilterable: true,
    order: 4,
    options: [...CASING_SIDE_PANEL_OPTIONS],
  },
  {
    key: 'psu_included',
    name: 'Power Supply Included',
    section: 'Power',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    order: 5,
    options: [...CASING_PSU_INCLUDED_OPTIONS],
  },
  {
    key: 'special_features',
    name: 'Special Feature',
    section: 'Features',
    dataType: 'TEXT',
    formType: 'multiselect',
    isFilterable: true,
    order: 6,
    options: [...CASING_SPECIAL_FEATURE_OPTIONS],
  },
  {
    key: 'dimension',
    name: 'Dimension',
    section: 'Physical Specification',
    dataType: 'TEXT',
    order: 7,
    placeholder: 'e.g., 440 x 210 x 450 mm',
  },
  {
    key: 'warranty',
    name: 'Warranty',
    section: 'Warranty Information',
    dataType: 'TEXT',
    order: 8,
    placeholder: 'e.g., 1 Year',
  },
];

export const CASING_SPECIFICATION_GROUPS: Record<string, { title: string; keys: string[] }> = {
  physical: {
    title: 'Physical Specification',
    keys: ['color', 'case_type', 'side_panel', 'dimension'],
  },
  compatibility: {
    title: 'Compatibility',
    keys: ['motherboard_type'],
  },
  power: {
    title: 'Power',
    keys: ['psu_included'],
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

const CASING_CATEGORY_SLUGS = new Set(['computer-case', 'casing', 'case']);

export function isCasingCategorySlug(slugs: string[]): boolean {
  return slugs.some((slug) => CASING_CATEGORY_SLUGS.has(slug));
}
