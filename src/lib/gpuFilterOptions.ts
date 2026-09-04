/**
 * GPU storefront filter options — Star Tech style sidebar + brand pills.
 */

export const GPU_MANUFACTURER_BRANDS = [
  { value: 'zotac', label: 'ZOTAC' },
  { value: 'msi', label: 'MSI' },
  { value: 'gigabyte', label: 'GIGABYTE' },
  { value: 'asus', label: 'ASUS' },
  { value: 'sapphire', label: 'Sapphire' },
  { value: 'pny', label: 'PNY' },
  { value: 'colorful', label: 'Colorful' },
  { value: 'gunnir', label: 'GUNNIR' },
  { value: 'peladn', label: 'PELADN' },
  { value: 'inno3d', label: 'INNO3D' },
  { value: 'manli', label: 'Manli' },
  { value: 'nvidia', label: 'NVIDIA' },
  { value: 'powercolor', label: 'PowerColor' },
  { value: 'yeston', label: 'Yeston' },
  { value: 'arktek', label: 'ARKTEK' },
  { value: 'afox', label: 'AFOX' },
  { value: 'ocpc', label: 'OCPC' },
  { value: 'maxsun', label: 'MAXSUN' },
  { value: 'unika', label: 'Unika' },
] as const;

export const GPU_CHIPSET_OPTIONS = [
  { value: 'NVIDIA GeForce', label: 'NVIDIA GeForce' },
  { value: 'AMD Radeon', label: 'AMD Radeon' },
  { value: 'Intel Arc', label: 'Intel Arc' },
] as const;

export const GPU_CHIPSET_SERIES_OPTIONS = [
  { value: 'GT 700', label: 'GT 700' },
  { value: 'GT 1000', label: 'GT 1000' },
  { value: 'GTX 1600', label: 'GTX 1600' },
  { value: 'RTX 3000', label: 'RTX 3000' },
  { value: 'RTX 4000', label: 'RTX 4000' },
  { value: 'RTX 5000', label: 'RTX 5000' },
  { value: 'RTX PRO', label: 'RTX PRO' },
  { value: 'RX 500', label: 'RX 500' },
  { value: 'RX 6000', label: 'RX 6000' },
  { value: 'RX 7000', label: 'RX 7000' },
  { value: 'RX 8000', label: 'RX 8000' },
  { value: 'RX 9000', label: 'RX 9000' },
  { value: 'Arc A', label: 'Intel Arc A' },
] as const;

export const GPU_MEMORY_SIZE_OPTIONS = [
  { value: '1GB', label: '1GB' },
  { value: '2GB', label: '2GB' },
  { value: '4GB', label: '4GB' },
  { value: '6GB', label: '6GB' },
  { value: '8GB', label: '8GB' },
  { value: '10GB', label: '10GB' },
  { value: '12GB', label: '12GB' },
  { value: '16GB', label: '16GB' },
  { value: '20GB', label: '20GB' },
  { value: '24GB', label: '24GB' },
] as const;

export const GPU_MEMORY_TYPE_OPTIONS = [
  { value: 'GDDR3', label: 'GDDR3' },
  { value: 'GDDR4', label: 'GDDR4' },
  { value: 'GDDR5', label: 'GDDR5' },
  { value: 'GDDR6', label: 'GDDR6' },
  { value: 'GDDR6X', label: 'GDDR6X' },
  { value: 'GDDR7', label: 'GDDR7' },
] as const;

export const GPU_FAN_OPTIONS = [
  { value: 'Single Fan', label: 'Single Fan' },
  { value: 'Dual Fan', label: 'Dual Fan' },
  { value: 'Triple Fan', label: 'Triple Fan' },
] as const;

export const GPU_PORT_TYPE_OPTIONS = [
  { value: 'HDMI', label: 'HDMI' },
  { value: 'DisplayPort', label: 'DisplayPort' },
  { value: 'Mini DisplayPort', label: 'Mini DisplayPort' },
  { value: 'DVI', label: 'DVI' },
  { value: 'VGA (D-Sub)', label: 'VGA (D-Sub)' },
  { value: 'Type-C', label: 'Type-C' },
] as const;

export const GPU_PORT_COUNT_OPTIONS = [
  { value: '2 Ports', label: '2 Ports' },
  { value: '3 Ports', label: '3 Ports' },
  { value: '4 Ports', label: '4 Ports' },
  { value: '5 Ports', label: '5 Ports' },
] as const;

export const GPU_RESOLUTION_OPTIONS = [
  { value: '1920x1200', label: '1920 X 1200' },
  { value: '2560x1440', label: '2560 X 1440' },
  { value: '2560x1600', label: '2560 X 1600' },
  { value: '3840x2160', label: '3840 X 2160' },
  { value: '4096x2160', label: '4096 X 2160' },
  { value: '5120x2880', label: '5120 X 2880' },
  { value: '7680x4320', label: '7680 X 4320' },
] as const;

/** Spec / URL keys used by GPU sidebar filters (excludes price & availability). */
export const GPU_SPEC_FILTER_KEYS = [
  'manufacturer',
  'gpu_chipset',
  'chipset_series',
  'memory_size',
  'memory_type',
  'cooling_type',
  'port_types',
  'port_count',
  'resolution',
] as const;

export type GpuSpecFilterKey = (typeof GPU_SPEC_FILTER_KEYS)[number];
