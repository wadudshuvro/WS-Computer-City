/**
 * Motherboard specification definitions — shared between seed, admin CMS, and PDP display.
 */

export interface MotherboardSpecDefinitionSeed {
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

export const MOTHERBOARD_SPEC_DEFINITIONS: MotherboardSpecDefinitionSeed[] = [
  {
    key: 'supported_cpu',
    name: 'Supported CPU',
    section: 'Processor',
    dataType: 'TEXT',
    isRequired: true,
    multiline: true,
    order: 1,
    placeholder: 'e.g., Support Intel Core 14th/13th/12th Gen Processors, LGA 1700',
  },
  {
    key: 'chipset',
    name: 'Chipset',
    section: 'Processor',
    dataType: 'TEXT',
    isFilterable: true,
    isRequired: true,
    order: 2,
    placeholder: 'e.g., Intel H610 Chipset',
  },
  {
    key: 'memory_size',
    name: 'Memory Size',
    section: 'Memory',
    dataType: 'TEXT',
    isFilterable: true,
    order: 3,
    placeholder: 'e.g., 64GB',
  },
  {
    key: 'memory_type',
    name: 'Memory Type',
    section: 'Memory',
    dataType: 'TEXT',
    isFilterable: true,
    order: 4,
    placeholder: 'e.g., DDR4',
  },
  {
    key: 'storage_slots',
    name: 'Storage Slots',
    section: 'Storage',
    dataType: 'TEXT',
    order: 5,
    placeholder: 'e.g., 2',
  },
  {
    key: 'graphics',
    name: 'Graphics',
    section: 'Graphics',
    dataType: 'TEXT',
    order: 6,
    placeholder: 'e.g., 1x HDMI',
  },
  {
    key: 'audio',
    name: 'Audio',
    section: 'Audio & Microphone',
    dataType: 'TEXT',
    order: 7,
    placeholder: 'e.g., Realtek ALC897 Codec',
  },
  {
    key: 'ports_connectors',
    name: 'Ports & Connectors',
    section: 'Ports',
    dataType: 'TEXT',
    multiline: true,
    order: 8,
    placeholder: 'List HDMI, USB, LAN, Wireless, TPM, etc. (one per line)',
  },
  {
    key: 'special_features',
    name: 'Special Features',
    section: 'Special Features',
    dataType: 'TEXT',
    order: 9,
    placeholder: 'e.g., 4x EZ Debug LED',
  },
  {
    key: 'form_factor',
    name: 'Form Factor',
    section: 'Physical Specification',
    dataType: 'TEXT',
    isFilterable: true,
    order: 10,
    placeholder: 'e.g., mATX',
  },
  {
    key: 'expansion_slots',
    name: 'Expansion Slots',
    section: 'Physical Specification',
    dataType: 'TEXT',
    multiline: true,
    order: 11,
    placeholder: 'List PCI and M.2 slots (one per line)',
  },
  {
    key: 'warranty',
    name: 'Warranty',
    section: 'Warranty Information',
    dataType: 'TEXT',
    order: 12,
    placeholder: 'e.g., 3-Years',
  },
];

export const MOTHERBOARD_SPECIFICATION_GROUPS: Record<string, { title: string; keys: string[] }> = {
  processor: {
    title: 'Processor',
    keys: ['supported_cpu', 'chipset'],
  },
  memory: {
    title: 'Memory',
    keys: ['memory_size', 'memory_type'],
  },
  storage: {
    title: 'Storage',
    keys: ['storage_slots'],
  },
  graphics: {
    title: 'Graphics',
    keys: ['graphics'],
  },
  audio: {
    title: 'Audio & Microphone',
    keys: ['audio'],
  },
  ports: {
    title: 'Ports',
    keys: ['ports_connectors'],
  },
  specialFeatures: {
    title: 'Special Features',
    keys: ['special_features'],
  },
  physical: {
    title: 'Physical Specification',
    keys: ['form_factor', 'expansion_slots'],
  },
  warranty: {
    title: 'Warranty Information',
    keys: ['warranty'],
  },
};

const MOTHERBOARD_CATEGORY_SLUGS = new Set([
  'motherboard',
  'intel-motherboard',
  'amd-motherboard',
]);

export function isMotherboardCategory(slugs: string[]): boolean {
  return slugs.some((slug) => MOTHERBOARD_CATEGORY_SLUGS.has(slug));
}
