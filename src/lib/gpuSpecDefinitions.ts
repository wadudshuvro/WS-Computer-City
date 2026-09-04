/**
 * GPU specification definitions — shared between seed, admin forms, and PDP display.
 * Matches Star Tech / TechLand-style grouped specification layout.
 */

import {
  GPU_CHIPSET_SERIES_OPTIONS,
  GPU_FAN_OPTIONS,
  GPU_MEMORY_SIZE_OPTIONS,
  GPU_MEMORY_TYPE_OPTIONS,
  GPU_PORT_COUNT_OPTIONS,
  GPU_PORT_TYPE_OPTIONS,
} from '@/lib/gpuFilterOptions';

export interface GpuSpecDefinitionSeed {
  key: string;
  name: string;
  section: string;
  dataType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  formType?: 'text' | 'number' | 'select' | 'multiselect' | 'textarea';
  unit?: string;
  isFilterable?: boolean;
  isRequired?: boolean;
  order: number;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export const GPU_SPEC_DEFINITIONS: GpuSpecDefinitionSeed[] = [
  // Memory
  {
    key: 'memory_size',
    name: 'Memory Size',
    section: 'Memory',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 1,
    options: [
      ...GPU_MEMORY_SIZE_OPTIONS.map((o) => o.label.replace('GB', ' GB')),
      '32 GB',
      '48 GB',
    ],
  },
  {
    key: 'bus_type',
    name: 'Bus Type',
    section: 'Memory',
    dataType: 'TEXT',
    order: 2,
    placeholder: 'e.g., 28 Gbps',
  },
  {
    key: 'memory_type',
    name: 'Memory Type',
    section: 'Memory',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 3,
    options: [
      ...GPU_MEMORY_TYPE_OPTIONS.map((o) => o.value),
      'GDDR5X',
      'HBM3',
      'HBM2e',
    ],
  },
  {
    key: 'memory_clock',
    name: 'Memory Clock',
    section: 'Memory',
    dataType: 'TEXT',
    unit: 'MHz',
    order: 4,
    placeholder: 'e.g., 2595 MHz',
  },
  {
    key: 'memory_bus',
    name: 'Memory Bus (Bit)',
    section: 'Memory',
    dataType: 'SELECT',
    formType: 'select',
    order: 5,
    options: ['64 bit', '96 bit', '128 bit', '192 bit', '256 bit', '320 bit', '384 bit', '512 bit'],
  },
  // Display
  {
    key: 'resolution',
    name: 'Max Resolution',
    section: 'Display',
    dataType: 'TEXT',
    isFilterable: true,
    order: 6,
    placeholder: 'e.g., 7680x4320',
  },
  {
    key: 'multi_display',
    name: 'Multi Display',
    section: 'Display',
    dataType: 'NUMBER',
    formType: 'number',
    order: 7,
    placeholder: '4',
  },
  // Graphics / Chipset
  {
    key: 'gpu_chipset',
    name: 'GPU Chipset',
    section: 'Graphics',
    dataType: 'TEXT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 8,
    helpText: 'Select the GPU model',
  },
  {
    key: 'chipset_series',
    name: 'Chipset Series',
    section: 'Graphics',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    isRequired: true,
    order: 9,
    options: GPU_CHIPSET_SERIES_OPTIONS.map((o) => o.value),
    helpText: 'Used by storefront Chipset Series filter (e.g. RTX 4000, RX 7000)',
  },
  {
    key: 'cuda_cores',
    name: 'CUDA Cores (Nvidia)',
    section: 'Graphics',
    dataType: 'NUMBER',
    formType: 'number',
    order: 10,
    placeholder: '3840',
    helpText: 'CUDA cores for NVIDIA, Stream Processors for AMD',
  },
  {
    key: 'pci_express',
    name: 'Interface (PCI Express)',
    section: 'Graphics',
    dataType: 'SELECT',
    formType: 'select',
    order: 11,
    options: ['PCI-E 3.0', 'PCI-E 4.0', 'PCI-E 5.0'],
  },
  {
    key: 'directx',
    name: 'DirectX',
    section: 'Graphics',
    dataType: 'SELECT',
    formType: 'select',
    order: 12,
    options: ['DirectX 12 API', 'DirectX 12 Ultimate', 'DirectX 11'],
  },
  {
    key: 'opengl',
    name: 'OpenGL',
    section: 'Graphics',
    dataType: 'SELECT',
    formType: 'select',
    order: 13,
    options: ['4.6', '4.5', '4.4'],
  },
  // Cooling
  {
    key: 'cooling_type',
    name: 'No. of Fans',
    section: 'Cooling',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    order: 14,
    options: [
      ...GPU_FAN_OPTIONS.map((o) => o.value),
      'Blower Style',
      'Hybrid (Air + AIO)',
      'Liquid Cooled',
    ],
  },
  // Power
  {
    key: 'recommended_psu',
    name: 'Recommended Power',
    section: 'Battery And Power',
    dataType: 'TEXT',
    order: 15,
    placeholder: 'e.g., 550W',
  },
  {
    key: 'power_connector',
    name: 'Power Connector',
    section: 'Battery And Power',
    dataType: 'SELECT',
    formType: 'select',
    order: 16,
    options: [
      '12VHPWR (16-pin)',
      '12V-2x6',
      '8-pin x3',
      '8-pin x2',
      '8-pin + 6-pin',
      '8-pin',
      '6-pin x2',
      '6-pin',
      'No External Power',
    ],
  },
  // Ports
  {
    key: 'port_types',
    name: 'Types Of Ports',
    section: 'Ports',
    dataType: 'TEXT',
    formType: 'multiselect',
    isFilterable: true,
    order: 17,
    options: GPU_PORT_TYPE_OPTIONS.map((o) => o.value),
    helpText: 'Select all display outputs on this card',
  },
  {
    key: 'port_count',
    name: 'No. of Ports',
    section: 'Ports',
    dataType: 'SELECT',
    formType: 'select',
    isFilterable: true,
    order: 18,
    options: GPU_PORT_COUNT_OPTIONS.map((o) => o.value),
  },
  {
    key: 'display_port',
    name: 'DisplayPort Detail',
    section: 'Ports',
    dataType: 'TEXT',
    order: 19,
    placeholder: 'e.g., DisplayPort 2.1b *3',
  },
  {
    key: 'hdmi',
    name: 'HDMI Detail',
    section: 'Ports',
    dataType: 'TEXT',
    order: 20,
    placeholder: 'e.g., HDMI 2.1b *1',
  },
  // Physical
  {
    key: 'dimension',
    name: 'Dimension',
    section: 'Physical Specification',
    dataType: 'TEXT',
    order: 21,
    placeholder: 'e.g., L=281 W=117 H=40',
  },
  // Warranty
  {
    key: 'warranty',
    name: 'Warranty',
    section: 'Warranty Information',
    dataType: 'TEXT',
    order: 22,
    placeholder: 'e.g., 3 Years',
  },
];

export const GPU_SPECIFICATION_GROUPS: Record<string, { title: string; keys: string[] }> = {
  memory: {
    title: 'Memory',
    keys: ['memory_size', 'bus_type', 'memory_type', 'memory_clock', 'memory_bus'],
  },
  display: {
    title: 'Display',
    keys: ['resolution', 'multi_display'],
  },
  graphics: {
    title: 'Graphics',
    keys: ['gpu_chipset', 'chipset_series', 'cuda_cores', 'pci_express', 'directx', 'opengl'],
  },
  cooling: {
    title: 'Cooling',
    keys: ['cooling_type'],
  },
  power: {
    title: 'Battery And Power',
    keys: ['recommended_psu', 'power_connector'],
  },
  ports: {
    title: 'Ports',
    keys: ['port_types', 'port_count', 'display_port', 'hdmi'],
  },
  physical: {
    title: 'Physical Specification',
    keys: ['dimension'],
  },
  warranty: {
    title: 'Warranty Information',
    keys: ['warranty'],
  },
};

const GPU_CATEGORY_SLUGS = new Set(['graphics-card', 'nvidia', 'amd-gpu']);

export function isGpuCategory(slugs: string[]): boolean {
  return slugs.some((slug) => GPU_CATEGORY_SLUGS.has(slug));
}

export function getCategorySlugs(category: {
  slug: string;
  breadcrumb?: { slug: string }[];
}): string[] {
  return [category.slug, ...(category.breadcrumb?.map((c) => c.slug) ?? [])];
}

/** Key highlight lines shown under the title on GPU product pages (TechLand style) */
export const GPU_SHORT_DESCRIPTION_FIELDS: { label: string; keys: string[] }[] = [
  { label: 'Memory Clock', keys: ['bus_type', 'memory_clock'] },
  { label: 'Memory Size', keys: ['memory_size'] },
  { label: 'Memory Type', keys: ['memory_type'] },
  { label: 'Card Bus', keys: ['pci_express'] },
];

export function getGpuShortDescriptionLines(
  getSpecValue: (key: string) => string | null
): { label: string; value: string }[] {
  return GPU_SHORT_DESCRIPTION_FIELDS.map(({ label, keys }) => {
    const value = keys.map((k) => getSpecValue(k)).find(Boolean);
    return value ? { label, value } : null;
  }).filter(Boolean) as { label: string; value: string }[];
}

/** Model name for feature box — chipset or shortened product name */
export function getGpuModelName(
  getSpecValue: (key: string) => string | null,
  productName: string
): string {
  const chipset = getSpecValue('gpu_chipset');
  if (chipset) return chipset;

  const withoutBrand = productName.replace(
    /^(Gigabyte|ASUS|MSI|Zotac|Palit|Galax|Sapphire|PowerColor|XFX|PNY|Colorful)\s+/i,
    ''
  );
  return withoutBrand || productName;
}

export function formatGpuWarranty(getSpecValue: (key: string) => string | null): string {
  const warranty = getSpecValue('warranty');
  if (!warranty) return 'No Warranty';
  if (/year/i.test(warranty)) return warranty;
  if (/^\d+$/.test(warranty.trim())) return `${warranty} Years`;
  return warranty;
}
