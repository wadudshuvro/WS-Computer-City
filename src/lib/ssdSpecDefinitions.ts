/**
 * SSD brands, filter options, and CMS/storefront shared definitions.
 * Brands match Star Tech SSD hover menu + page pills.
 */

export const SSD_BRANDS = [
  { slug: 'team', label: 'TEAM' },
  { slug: 'colorful', label: 'Colorful' },
  { slug: 'miphi', label: 'MiPhi' },
  { slug: 'corsair', label: 'Corsair' },
  { slug: 'kingston', label: 'Kingston' },
  { slug: 'western-digital', label: 'Western Digital' },
  { slug: 'lexar', label: 'Lexar' },
  { slug: 'transcend', label: 'Transcend' },
  { slug: 'seagate', label: 'Seagate' },
  { slug: 'aitc', label: 'AITC' },
  { slug: 'netac', label: 'Netac' },
  { slug: 'ocpc', label: 'OCPC' },
  { slug: 'oscoo', label: 'OSCOO' },
  { slug: 'addlink', label: 'Addlink' },
  { slug: 'kingbank', label: 'KingBank' },
  { slug: 'adata', label: 'ADATA' },
  { slug: 'samsung', label: 'Samsung' },
  { slug: 'hp', label: 'HP' },
  { slug: 'gigabyte', label: 'Gigabyte' },
  { slug: 'dahua', label: 'Dahua' },
  { slug: 'pny', label: 'PNY' },
  { slug: 'twinmos', label: 'TwinMOS' },
  { slug: 'apacer', label: 'Apacer' },
  { slug: 'patriot', label: 'Patriot' },
  { slug: 'biostar', label: 'Biostar' },
  { slug: 'acer', label: 'Acer' },
  { slug: 'kingspec', label: 'Kingspec' },
] as const;

/** Capacity filter buckets (Star Tech style) */
export const SSD_CAPACITY_FILTER_OPTIONS = [
  { value: '120GB-128GB', label: '120GB-128GB' },
  { value: '240GB-256GB', label: '240GB-256GB' },
  { value: '480GB-512GB', label: '480GB-512GB' },
  { value: '1TB-2TB', label: '1TB-2TB' },
  { value: 'Over 2TB', label: 'Over 2TB' },
] as const;

/** Actual capacities for CMS entry */
export const SSD_CAPACITY_CMS_OPTIONS = [
  '120 GB',
  '128 GB',
  '240 GB',
  '256 GB',
  '480 GB',
  '500 GB',
  '512 GB',
  '960 GB',
  '1 TB',
  '2 TB',
  '4 TB',
  '8 TB',
] as const;

export const SSD_INTERFACE_OPTIONS = ['SATA', 'NVMe'] as const;

export const SSD_FORM_FACTOR_OPTIONS = ['2.5 Inch', 'M.2'] as const;

export const SSD_PCIE_GEN_OPTIONS = ['Gen3', 'Gen4', 'Gen5'] as const;

export const SSD_DRAM_OPTIONS = ['With DRAM', 'DRAM-less'] as const;

export const SSD_TECHNOLOGY_OPTIONS = ['TLC', 'QLC'] as const;

export const SSD_READ_SPEED_OPTIONS = [
  'Up to 500MB/s',
  '500MB/s to 900MB/s',
  '900MB/s to 4000MB/s',
  '4000MB/s & Above',
] as const;

export const SSD_WRITE_SPEED_OPTIONS = [
  'Up to 400MB/s',
  '400MB/s to 1000MB/s',
  '1000MB/s & Above',
] as const;

export const SSD_SPEC_FILTER_KEYS = [
  'capacity',
  'interface',
  'form_factor',
  'pcie_gen',
  'dram',
  'technology',
  'read_speed',
  'write_speed',
] as const;

export type SsdSpecFilterKey = (typeof SSD_SPEC_FILTER_KEYS)[number];

export interface SsdSpecDefinitionSeed {
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

export const SSD_SPEC_DEFINITIONS: SsdSpecDefinitionSeed[] = [
  {
    key: 'capacity',
    name: 'Capacity',
    section: 'Storage',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 1,
    options: [...SSD_CAPACITY_CMS_OPTIONS],
  },
  {
    key: 'interface',
    name: 'Interface',
    section: 'Interface',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 2,
    options: [...SSD_INTERFACE_OPTIONS],
  },
  {
    key: 'form_factor',
    name: 'Form Factor',
    section: 'Physical Specification',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 3,
    options: [...SSD_FORM_FACTOR_OPTIONS],
  },
  {
    key: 'pcie_gen',
    name: 'PCI-Express Generation',
    section: 'Interface',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    order: 4,
    options: [...SSD_PCIE_GEN_OPTIONS],
    helpText: 'For NVMe SSDs',
  },
  {
    key: 'dram',
    name: 'DRAM',
    section: 'Memory',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    order: 5,
    options: [...SSD_DRAM_OPTIONS],
  },
  {
    key: 'technology',
    name: 'Technology',
    section: 'Memory',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    order: 6,
    options: [...SSD_TECHNOLOGY_OPTIONS],
    helpText: 'NAND flash type (TLC / QLC)',
  },
  {
    key: 'read_speed',
    name: 'Read Speed',
    section: 'Performance',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    order: 7,
    options: [...SSD_READ_SPEED_OPTIONS],
  },
  {
    key: 'write_speed',
    name: 'Write Speed',
    section: 'Performance',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    order: 8,
    options: [...SSD_WRITE_SPEED_OPTIONS],
  },
  {
    key: 'sequential_read',
    name: 'Sequential Read Detail',
    section: 'Performance',
    dataType: 'TEXT',
    order: 9,
    placeholder: 'e.g., 5500 MB/s',
  },
  {
    key: 'sequential_write',
    name: 'Sequential Write Detail',
    section: 'Performance',
    dataType: 'TEXT',
    order: 10,
    placeholder: 'e.g., 4500 MB/s',
  },
  {
    key: 'warranty',
    name: 'Warranty',
    section: 'Warranty Information',
    dataType: 'TEXT',
    order: 11,
    placeholder: 'e.g., 5 Years',
  },
];

export const SSD_SPECIFICATION_GROUPS: Record<string, { title: string; keys: string[] }> = {
  storage: { title: 'Storage', keys: ['capacity'] },
  interface: { title: 'Interface', keys: ['interface', 'pcie_gen'] },
  physical: { title: 'Physical Specification', keys: ['form_factor'] },
  memory: { title: 'Memory', keys: ['dram', 'technology'] },
  performance: {
    title: 'Performance',
    keys: ['read_speed', 'write_speed', 'sequential_read', 'sequential_write'],
  },
  warranty: { title: 'Warranty Information', keys: ['warranty'] },
};

const SSD_CATEGORY_SLUGS = new Set(['ssd', 'nvme', 'storage']);

export function isSsdCategorySlug(slugs: string[]): boolean {
  return slugs.some((slug) => SSD_CATEGORY_SLUGS.has(slug));
}
