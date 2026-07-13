/**
 * Motherboard storefront filter options — Star Tech style sidebar + brand pills.
 */

export const MOTHERBOARD_MAKER_BRANDS = [
  { value: 'asrock', label: 'ASRock' },
  { value: 'asus', label: 'ASUS' },
  { value: 'gigabyte', label: 'GIGABYTE' },
  { value: 'msi', label: 'MSI' },
  { value: 'colorful', label: 'Colorful' },
] as const;

export const MOTHERBOARD_PROCESSOR_TYPES = [
  { value: 'Intel', label: 'Intel' },
  { value: 'AMD', label: 'AMD' },
] as const;

export const MOTHERBOARD_AMD_SOCKETS = ['AM4', 'AM5', 'TR5'] as const;

export const MOTHERBOARD_INTEL_SOCKETS = [
  'LGA1150',
  'LGA1151',
  'LGA1200',
  'LGA1700',
  'LGA1851',
  'LGA2066',
] as const;

export const MOTHERBOARD_FORM_FACTORS = [
  'ATX',
  'Extended ATX',
  'Micro ATX',
  'Mini ITX',
] as const;

export const MOTHERBOARD_RAM_TYPES = ['DDR3', 'DDR4', 'DDR5'] as const;

export const MOTHERBOARD_SPECIAL_FEATURES = [
  'CrossFireX',
  'Wi-Fi',
  'SLI',
  'm.2',
] as const;

/** Spec / URL keys used by motherboard sidebar filters (excludes price & availability). */
export const MOTHERBOARD_SPEC_FILTER_KEYS = [
  'processor_type',
  'mb_brand',
  'cpu_socket',
  'form_factor',
  'memory_type',
  'special_features',
] as const;

export type MotherboardSpecFilterKey = (typeof MOTHERBOARD_SPEC_FILTER_KEYS)[number];
