/**
 * GPU specification definitions — shared between seed, admin forms, and PDP display.
 * Matches TechLand-style grouped specification layout.
 */

export interface GpuSpecDefinitionSeed {
  key: string;
  name: string;
  dataType: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  unit?: string;
  isFilterable?: boolean;
  isRequired?: boolean;
  order: number;
}

export const GPU_SPEC_DEFINITIONS: GpuSpecDefinitionSeed[] = [
  // Memory
  { key: 'memory_size', name: 'Memory Size', dataType: 'TEXT', isFilterable: true, isRequired: true, order: 1 },
  { key: 'bus_type', name: 'Bus Type', dataType: 'TEXT', order: 2 },
  { key: 'memory_type', name: 'Memory Type', dataType: 'TEXT', isFilterable: true, isRequired: true, order: 3 },
  { key: 'memory_clock', name: 'Memory Clock', dataType: 'TEXT', unit: 'MHz', order: 4 },
  { key: 'memory_bus', name: 'Memory Bus (Bit)', dataType: 'TEXT', order: 5 },
  // Display
  { key: 'resolution', name: 'Resolution', dataType: 'TEXT', order: 6 },
  { key: 'multi_display', name: 'Multi Display', dataType: 'NUMBER', order: 7 },
  // Graphics
  { key: 'gpu_chipset', name: 'GPU Chipset', dataType: 'TEXT', isFilterable: true, isRequired: true, order: 8 },
  { key: 'cuda_cores', name: 'CUDA Cores (Nvidia)', dataType: 'NUMBER', order: 9 },
  { key: 'pci_express', name: 'Interface (PCI Express)', dataType: 'TEXT', order: 10 },
  { key: 'directx', name: 'DirectX', dataType: 'TEXT', order: 11 },
  { key: 'opengl', name: 'OpenGL', dataType: 'TEXT', order: 12 },
  // Power
  { key: 'recommended_psu', name: 'Recommended Power', dataType: 'TEXT', order: 13 },
  // Ports
  { key: 'display_port', name: 'DisplayPort', dataType: 'TEXT', order: 14 },
  { key: 'power_connector', name: 'Power Connector', dataType: 'TEXT', order: 15 },
  { key: 'hdmi', name: 'HDMI', dataType: 'TEXT', order: 16 },
  // Physical
  { key: 'dimension', name: 'Dimension', dataType: 'TEXT', order: 17 },
  // Warranty
  { key: 'warranty', name: 'Warranty', dataType: 'TEXT', order: 18 },
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
    keys: ['gpu_chipset', 'cuda_cores', 'pci_express', 'directx', 'opengl'],
  },
  power: {
    title: 'Battery And Power',
    keys: ['recommended_psu'],
  },
  ports: {
    title: 'Ports',
    keys: ['display_port', 'power_connector', 'hdmi'],
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

  // Strip brand prefix from product name if present
  const withoutBrand = productName.replace(/^(Gigabyte|ASUS|MSI|Zotac|Palit|Galax|Sapphire|PowerColor|XFX|PNY|Colorful)\s+/i, '');
  return withoutBrand || productName;
}

export function formatGpuWarranty(getSpecValue: (key: string) => string | null): string {
  const warranty = getSpecValue('warranty');
  if (!warranty) return 'No Warranty';
  if (/year/i.test(warranty)) return warranty;
  if (/^\d+$/.test(warranty.trim())) return `${warranty} Years`;
  return warranty;
}
