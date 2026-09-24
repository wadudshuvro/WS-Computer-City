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
  'LGA775',
  'LGA1366',
  'LGA1150',
  'LGA1151',
  'LGA1155',
  'LGA1156',
  'LGA1200',
  'LGA2011',
  'LGA2066',
  'LGA1700',
  'LGA1851',
  'FM1',
  'FM2',
  'FM2+',
  'AM2',
  'AM2+',
  'AM3',
  'AM3+',
  'AM4',
  'TR4',
  'TRX4',
  'AM5',
] as const;

export const CPU_COOLER_TYPE_OPTIONS = [
  'Air Cooler',
  'Liquid Cooler',
  'Hybrid Liquid Cooler',
] as const;

export const CPU_COOLER_FAN_SIZE_OPTIONS = [
  '80mm',
  '92mm',
  '100mm',
  '120mm',
  '140mm',
  '200mm',
  '240mm',
  '280mm',
  '360mm',
  '420mm',
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
    name: 'Type',
    section: 'Key Features',
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
    key: 'fan_speed_detail',
    name: 'Fan Speed',
    section: 'Key Features',
    dataType: 'TEXT',
    order: 7,
    placeholder: 'e.g., 2000±10% RPM(max)',
  },
  {
    key: 'airflow',
    name: 'Fan Airflow',
    section: 'Key Features',
    dataType: 'TEXT',
    order: 8,
    placeholder: 'e.g., 57.76 CFM',
  },
  {
    key: 'noise_level',
    name: 'Noise',
    section: 'Key Features',
    dataType: 'TEXT',
    order: 9,
    placeholder: 'e.g., ≤28.87 dB(A)',
  },
  {
    key: 'air_pressure',
    name: 'Air Pressure',
    section: 'Key Features',
    dataType: 'TEXT',
    order: 10,
    placeholder: 'e.g., 2.78 mmAq',
  },
  {
    key: 'connector',
    name: 'Connector',
    section: 'Key Features',
    dataType: 'TEXT',
    order: 11,
    placeholder: 'e.g., 4-pin PWM',
  },
  {
    key: 'others',
    name: 'Others',
    section: 'Key Features',
    dataType: 'TEXT',
    order: 12,
    placeholder: 'e.g., Bearing Type: Hydro Bearing',
  },
  {
    key: 'dimension',
    name: 'Dimension',
    section: 'Physical Specification',
    dataType: 'TEXT',
    order: 13,
    placeholder: 'e.g., 127×144×159 mm (L×W×H)',
  },
  {
    key: 'weight',
    name: 'Weight',
    section: 'Physical Specification',
    dataType: 'TEXT',
    order: 14,
    placeholder: 'e.g., 1386 g',
  },
  {
    key: 'intel_sockets',
    name: 'Intel',
    section: 'Supported Sockets',
    dataType: 'TEXT',
    order: 15,
    placeholder: 'e.g., LGA1851 / 1700 / 1200 / 115X',
  },
  {
    key: 'amd_sockets',
    name: 'AMD',
    section: 'Supported Sockets',
    dataType: 'TEXT',
    order: 16,
    placeholder: 'e.g., AM5 / AM4',
  },
  {
    key: 'warranty',
    name: 'Warranty',
    section: 'Warranty Information',
    dataType: 'TEXT',
    isRequired: true,
    order: 17,
    placeholder: 'e.g., 3 Years',
  },
];

/** Star Tech PDP order: Key Features → Physical → Supported Sockets → Warranty */
export const CPU_COOLER_SPECIFICATION_GROUPS: Record<string, { title: string; keys: string[] }> = {
  key_features: {
    title: 'Key Features',
    keys: [
      'cooler_type',
      'fan_speed_detail',
      'airflow',
      'noise_level',
      'air_pressure',
      'connector',
      'others',
    ],
  },
  physical: {
    title: 'Physical Specification',
    keys: ['dimension', 'weight', 'fan_size'],
  },
  sockets: {
    title: 'Supported Sockets',
    keys: ['intel_sockets', 'amd_sockets'],
  },
  warranty: {
    title: 'Warranty Information',
    keys: ['warranty'],
  },
};

export function getCpuCoolerShortDescriptionLines(
  getSpecValue: (key: string) => string | null
): { label: string; value: string }[] {
  const fields: { label: string; key: string }[] = [
    { label: 'Type', key: 'cooler_type' },
    { label: 'Fan Speed', key: 'fan_speed_detail' },
    { label: 'Fan Airflow', key: 'airflow' },
    { label: 'Noise', key: 'noise_level' },
  ];
  return fields
    .map(({ label, key }) => {
      const value = getSpecValue(key);
      return value ? { label, value } : null;
    })
    .filter(Boolean) as { label: string; value: string }[];
}

export function getCpuCoolerModelName(productName: string): string {
  const brands = CPU_COOLER_BRANDS.map((b) => b.label).sort((a, b) => b.length - a.length);
  for (const brand of brands) {
    const stripped = productName.replace(new RegExp(`^${brand}\\s+`, 'i'), '').trim();
    if (stripped && stripped !== productName) return stripped;
  }
  return productName;
}

export function formatCpuCoolerWarranty(getSpecValue: (key: string) => string | null): string {
  const warranty = getSpecValue('warranty');
  if (!warranty) return 'No Warranty';
  if (/year/i.test(warranty)) return warranty;
  if (/^\d+$/.test(warranty.trim())) return `${warranty} Years`;
  return warranty;
}

export function getCpuCoolerListingCardLines(
  getSpecValue: (key: string) => string | null
): string[] {
  const speed = getSpecValue('fan_speed_detail');
  const airflow = getSpecValue('airflow');
  const noise = getSpecValue('noise_level');
  const intel = getSpecValue('intel_sockets');
  const amd = getSpecValue('amd_sockets');
  const compat = [intel ? `Intel ${intel}` : null, amd ? `AMD ${amd}` : null]
    .filter(Boolean)
    .join(', ');
  const lines: string[] = [];
  if (speed) lines.push(`Fan Speed: ${speed}`);
  if (airflow) lines.push(`Fan Airflow: ${airflow}`);
  if (noise) lines.push(`Noise: ${noise}`);
  if (compat) lines.push(compat);
  if (lines.length < 4) {
    const type = getSpecValue('cooler_type');
    const size = getSpecValue('fan_size');
    if (type) lines.push(`Type: ${type}`);
    if (size && lines.length < 4) lines.push(`Fan Size: ${size}`);
  }
  return lines.slice(0, 4);
}

const CPU_COOLER_CATEGORY_SLUGS = new Set(['cpu-cooler', 'cpu-coolers', 'cooler']);

export function isCpuCoolerCategorySlug(slugs: string[]): boolean {
  return slugs.some((slug) => CPU_COOLER_CATEGORY_SLUGS.has(slug));
}
