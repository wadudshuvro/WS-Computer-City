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

export const RAM_SIZE_OPTIONS = ['4GB', '8GB', '16GB', '24GB', '32GB', '48GB', '64GB', '128GB'];

export const RAM_FEATURE_OPTIONS = ['ARGB', 'RGB RAM', 'Heatsink'];

export const RAM_SPEC_DEFINITIONS: RamSpecDefinitionSeed[] = [
  {
    key: 'memory_type',
    name: 'Memory Type',
    section: 'Memory',
    dataType: 'SELECT',
    isFilterable: true,
    isRequired: true,
    order: 1,
    options: RAM_TYPE_OPTIONS,
  },
  {
    key: 'speed',
    name: 'Bus Speed',
    section: 'Memory',
    dataType: 'SELECT',
    isFilterable: true,
    isRequired: true,
    order: 2,
    options: RAM_SPEED_OPTIONS,
    placeholder: 'e.g., 7200MHz',
  },
  {
    key: 'latency',
    name: 'Latency',
    section: 'Memory',
    dataType: 'TEXT',
    order: 3,
    placeholder: 'e.g., 36-46-46-115',
  },
  {
    key: 'capacity',
    name: 'Capacity',
    section: 'Storage',
    dataType: 'SELECT',
    isFilterable: true,
    isRequired: true,
    order: 4,
    options: RAM_SIZE_OPTIONS,
    placeholder: 'e.g., 24GB Single Unit',
  },
  {
    key: 'voltage',
    name: 'Voltage',
    section: 'Battery And Power',
    dataType: 'TEXT',
    order: 5,
    placeholder: 'e.g., 1.10V',
  },
  {
    key: 'other_features',
    name: 'Other Features',
    section: 'Others',
    dataType: 'TEXT',
    multiline: true,
    order: 6,
    placeholder: 'e.g., Tested Voltage (XMP) 1.35V',
  },
  {
    key: 'color',
    name: 'Color',
    section: 'Physical Specification',
    dataType: 'TEXT',
    order: 7,
    placeholder: 'e.g., Black',
  },
  {
    key: 'ram_features',
    name: 'RAM Features',
    section: 'Physical Specification',
    dataType: 'SELECT',
    isFilterable: true,
    order: 8,
    options: RAM_FEATURE_OPTIONS,
  },
  {
    key: 'warranty',
    name: 'Warranty',
    section: 'Warranty Information',
    dataType: 'TEXT',
    order: 9,
    placeholder: 'e.g., Lifetime',
  },
];

export const RAM_SPECIFICATION_GROUPS: Record<string, { title: string; keys: string[] }> = {
  memory: {
    title: 'Memory',
    keys: ['memory_type', 'speed', 'latency'],
  },
  storage: {
    title: 'Storage',
    keys: ['capacity'],
  },
  power: {
    title: 'Battery And Power',
    keys: ['voltage'],
  },
  others: {
    title: 'Others',
    keys: ['other_features'],
  },
  physical: {
    title: 'Physical Specification',
    keys: ['color', 'ram_features'],
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
