/**
 * Hard Disk Drive brands and Star Tech sidebar filter labels.
 * Live source: https://www.startech.com.bd/component/hard-disk-drive
 */

export const HDD_BRANDS = [
  { slug: 'toshiba', label: 'Toshiba' },
  { slug: 'western-digital', label: 'Western Digital' },
  { slug: 'seagate', label: 'Seagate' },
  { slug: 'hikvision', label: 'Hikvision' },
] as const;

export const HDD_TYPE_OPTIONS = ['SATA', 'Surveillance', 'NAS'] as const;

export const HDD_CAPACITY_OPTIONS = [
  '1 TB',
  '2 TB',
  '3 TB',
  '4 TB',
  '6 TB',
  '8 TB',
  '10 TB',
  '12 TB',
  '14 TB',
  '16 TB',
  '18 TB',
  '20 TB',
  '24TB',
] as const;

export const HDD_SPEED_OPTIONS = ['5400 RPM', '5700 RPM', '5900 RPM', '7200 RPM'] as const;

export const HDD_FORM_FACTOR_OPTIONS = ['2.5 inch', '3.5 inch'] as const;

export const HDD_SPEC_FILTER_KEYS = ['hdd_type', 'capacity', 'rpm_speed', 'form_factor'] as const;

export function isHddCategorySlug(slug: string | null | undefined): boolean {
  return slug === 'hdd' || slug === 'hard-disk-drive';
}
