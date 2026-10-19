/**
 * Desktop RAM specification definitions — CMS forms, storefront filters, and PDP display.
 */

export interface RamSpecDefinitionSeed {
  key: string;
  name: string;
  section: string;
  dataType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  isFilterable?: boolean;
  isRequired?: boolean;
  multiline?: boolean;
  order: number;
  placeholder?: string;
  options?: string[];
}

export const RAM_BRANDS = [
  { slug: 'kingston', label: 'Kingston' },
  { slug: 'team', label: 'Team' },
  { slug: 'corsair', label: 'Corsair' },
  { slug: 'pny', label: 'PNY' },
  { slug: 'adata', label: 'Adata' },
  { slug: 'ocpc', label: 'OCPC' },
  { slug: 'lexar', label: 'Lexar' },
  { slug: 'aitc', label: 'AITC' },
  { slug: 'apacer', label: 'Apacer' },
  { slug: 'g-skill', label: 'G.SKILL' },
  { slug: 'xoc', label: 'XOC' },
  { slug: 'neo-forza', label: 'Neo forza' },
  { slug: 'gigabyte', label: 'Gigabyte' },
  { slug: 'patriot', label: 'Patriot' },
  { slug: 'colorful', label: 'Colorful' },
  { slug: 'hikvision', label: 'Hikvision' },
  { slug: 'oscoo', label: 'Oscoo' },
  { slug: 'kimtigo', label: 'Kimtigo' },
  { slug: 'hiksemi', label: 'HIKSEMI' },
  { slug: 'addlink', label: 'Addlink' },
  { slug: 'netac', label: 'Netac' },
  { slug: 'crucial', label: 'Crucial' },
  { slug: 'transcend', label: 'Transcend' },
  { slug: 'kingspec', label: 'KingSpec' },
  { slug: 'kingbank', label: 'Kingbank' },
  { slug: 'dahua', label: 'Dahua' },
  { slug: 'smart', label: 'Smart' },
  { slug: 'thermaltake', label: 'Thermaltake' },
  { slug: 'abmoto', label: 'Abmoto' },
  { slug: 'pc-power', label: 'PC Power' },
  { slug: 'twinmos', label: 'TwinMos' },
  { slug: 'walton', label: 'Walton' },
  { slug: 'microfrom', label: 'MICROFROM' },
  { slug: 'hp', label: 'HP' },
  { slug: 'geil', label: 'GeIL' },
  { slug: 'biostar', label: 'Biostar' },
];

export const RAM_SPEED_OPTIONS = [
  '1600 MHz',
  '2400 MHz',
  '2666 MHz',
  '3200 MHz',
  '3600 MHz',
  '3733 MHz',
  '4000 MHz',
  '4600 MHz',
  '4800 MHz',
  '5200 MHz',
  '5600 MHz',
  '6000 MHz',
  '6200 MHz',
  '6400 MHz',
  '6800 MHz',
  '7000 MHz',
  '7200 MHz',
  '8000 MHz',
];

export const RAM_TYPE_OPTIONS = ['DDR3', 'DDR4', 'DDR5'];

export const LAPTOP_RAM_BRANDS = [
  { slug: 'team', label: 'TEAM' },
  { slug: 'colorful', label: 'Colorful' },
  { slug: 'adata', label: 'Adata' },
  { slug: 'transcend', label: 'Transcend' },
  { slug: 'g-skill', label: 'G.Skill' },
  { slug: 'kingston', label: 'Kingston' },
  { slug: 'lexar', label: 'Lexar' },
  { slug: 'corsair', label: 'Corsair' },
  { slug: 'pny', label: 'PNY' },
  { slug: 'twinmos', label: 'TwinMOS' },
  { slug: 'ocpc', label: 'OCPC' },
  { slug: 'netac', label: 'Netac' },
  { slug: 'samsung', label: 'Samsung' },
] as const;

export const LAPTOP_RAM_SIZE_OPTIONS = ['4GB', '8GB', '16GB', '32GB'] as const;

export const LAPTOP_RAM_SPEED_OPTIONS = [
  '1600 MHz',
  '2400 MHz',
  '2666 MHz',
  '3200 MHz',
  '4800 MHz',
  '5200 MHz',
  '5600 MHz',
  '6000 MHz',
] as const;

export const RAM_SIZE_OPTIONS = ['4GB', '8GB', '16GB', '24GB', '32GB', '48GB', '64GB', '128GB'];

export const RAM_FEATURE_OPTIONS = ['ARGB', 'RGB RAM', 'Heatsink'];

export const RAM_SPEC_DEFINITIONS: RamSpecDefinitionSeed[] = [
  {
    key: 'capacity',
    name: 'Memory Size',
    section: 'Memory',
    dataType: 'SELECT',
    isFilterable: true,
    isRequired: true,
    order: 1,
    options: RAM_SIZE_OPTIONS,
    placeholder: 'e.g., 16GB',
  },
  {
    key: 'memory_type',
    name: 'Memory Type',
    section: 'Memory',
    dataType: 'SELECT',
    isFilterable: true,
    isRequired: true,
    order: 2,
    options: RAM_TYPE_OPTIONS,
  },
  {
    key: 'speed',
    name: 'Bus Speed',
    section: 'Memory',
    dataType: 'SELECT',
    isFilterable: true,
    isRequired: true,
    order: 3,
    options: RAM_SPEED_OPTIONS,
    placeholder: 'e.g., 5600MHz',
  },
  {
    key: 'latency',
    name: 'Latency',
    section: 'Memory',
    dataType: 'TEXT',
    order: 4,
    placeholder: 'e.g., CL30-36-36-89',
  },
  {
    key: 'voltage',
    name: 'Voltage',
    section: 'Battery And Power',
    dataType: 'TEXT',
    order: 5,
    placeholder: 'e.g., 1.25V',
  },
  {
    key: 'power_consumption',
    name: 'Power Consumption',
    section: 'Battery And Power',
    dataType: 'TEXT',
    order: 6,
    placeholder: 'e.g., 11W',
  },
  {
    key: 'pin_count',
    name: 'Number-of-Pin',
    section: 'Ports',
    dataType: 'TEXT',
    order: 7,
    placeholder: 'e.g., 288 Pin',
  },
  {
    key: 'ram_features',
    name: 'Lighting Effect',
    section: 'Special Features',
    dataType: 'SELECT',
    isFilterable: true,
    order: 8,
    options: RAM_FEATURE_OPTIONS,
  },
  {
    key: 'other_features',
    name: 'Other Features',
    section: 'Others',
    dataType: 'TEXT',
    multiline: true,
    order: 9,
    placeholder: 'e.g., AMD EXPO, PC5-44800',
  },
  {
    key: 'color',
    name: 'Color',
    section: 'Physical Specification',
    dataType: 'TEXT',
    order: 10,
    placeholder: 'e.g., Black',
  },
  {
    key: 'warranty',
    name: 'Warranty',
    section: 'Warranty Information',
    dataType: 'TEXT',
    order: 11,
    placeholder: 'e.g., Lifetime',
    isRequired: true,
  },
];

/** Star Tech–style PDP section order */
export const RAM_SPECIFICATION_GROUPS: Record<string, { title: string; keys: string[] }> = {
  memory: {
    title: 'Memory',
    keys: ['capacity', 'memory_type', 'speed', 'latency'],
  },
  power: {
    title: 'Battery And Power',
    keys: ['voltage', 'power_consumption'],
  },
  ports: {
    title: 'Ports',
    keys: ['pin_count'],
  },
  specialFeatures: {
    title: 'Special Features',
    keys: ['ram_features'],
  },
  others: {
    title: 'Others',
    keys: ['other_features'],
  },
  physical: {
    title: 'Physical Specification',
    keys: ['color'],
  },
  warranty: {
    title: 'Warranty Information',
    keys: ['warranty'],
  },
};

export const RAM_SPEC_FILTER_KEYS = [
  'memory_type',
  'speed',
  'capacity',
  'ram_features',
] as const;

const RAM_CATEGORY_SLUGS = new Set(['ram', 'desktop-ram', 'laptop-ram', 'ddr4-ram', 'ddr5-ram']);

export function isRamCategory(slugs: string[]): boolean {
  return slugs.some((slug) => RAM_CATEGORY_SLUGS.has(slug));
}
