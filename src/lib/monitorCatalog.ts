export type MonitorBrand = { slug: string; label: string };

function brand(label: string): MonitorBrand {
  return {
    label,
    slug: label
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  };
}

/** Pill order from the Star Tech monitor child list. Huawei is on the sidebar list only. */
export const MONITOR_BRANDS: MonitorBrand[] = [
  'MSI',
  'AOC',
  'Asus',
  'Lenovo',
  'BenQ',
  'LG',
  'Acer',
  'HP',
  'Dell',
  'Samsung',
  'Gigabyte',
  'Philips',
  'ViewSonic',
  'Corsair',
  'ThundeRobot',
  'Koorui',
  'Dahua',
  'PC Power',
  'Hikvision',
  'Eurovision',
  'Walton',
  'Arzopa',
  'GEESUU',
  'Alimoto',
  'Thermaltake',
  'Smart',
  'Titan Army',
  'Value-Top',
  'AIWA',
  'Xiaomi',
  'Fopo',
  'Gigasonic',
  'TrendSonic',
  'FeuVision',
  'Huawei',
].map(brand);

/** Menu type links under Monitor. These narrow the monitor listing; they are not separate catalogs. */
export const MONITOR_TYPE_FILTERS: Record<string, { key: string; value: string; title: string }> = {
  'gaming-monitor': { key: 'mon_feature', value: 'Gaming', title: 'Gaming Monitor Price in Bangladesh' },
  'curved-monitor': { key: 'mon_feature', value: 'Curved Screen', title: 'Curved Monitor Price in Bangladesh' },
  'touch-monitor': { key: 'mon_feature', value: 'Touch Screen', title: 'Touch Monitor Price in Bangladesh' },
  '4k-monitor': { key: 'mon_resolution', value: '4K UHD', title: '4K Monitor Price in Bangladesh' },
  'portable-monitor': { key: 'mon_feature', value: 'Portable', title: 'Portable Monitor Price in Bangladesh' },
};

export const MONITOR_LISTING_URL = 'https://www.startech.com.bd/monitor';
