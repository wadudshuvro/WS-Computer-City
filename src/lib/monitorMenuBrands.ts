/**
 * Star Tech–style Monitor mega-menu brands + type shortcuts.
 * Used by CMS seed/sync — flat children under top "Monitor".
 */

export type MonitorMenuItem = {
  name: string;
  slug: string;
  /** Custom storefront href */
  href: string;
  hideArrow?: boolean;
};

const brandHref = (brandSlug: string) =>
  `/products?category=monitor&brand=${brandSlug}`;

const typeHref = (subSlug: string) =>
  `/products?category=monitor&sub=${subSlug}`;

/** Column order matches Star Tech Monitor dropdown (left then right). */
export const MONITOR_MENU_ITEMS: MonitorMenuItem[] = [
  // Brands (left column first, then continue right)
  { name: 'MSI', slug: 'msi', href: brandHref('msi') },
  { name: 'AOC', slug: 'aoc', href: brandHref('aoc') },
  { name: 'Asus', slug: 'asus', href: brandHref('asus') },
  { name: 'Lenovo', slug: 'lenovo', href: brandHref('lenovo') },
  { name: 'BenQ', slug: 'benq', href: brandHref('benq') },
  { name: 'LG', slug: 'lg', href: brandHref('lg') },
  { name: 'Acer', slug: 'acer', href: brandHref('acer') },
  { name: 'HP', slug: 'hp', href: brandHref('hp') },
  { name: 'Dell', slug: 'dell', href: brandHref('dell') },
  { name: 'Samsung', slug: 'samsung', href: brandHref('samsung') },
  { name: 'Gigabyte', slug: 'gigabyte', href: brandHref('gigabyte') },
  { name: 'Philips', slug: 'philips', href: brandHref('philips') },
  { name: 'Viewsonic', slug: 'viewsonic', href: brandHref('viewsonic') },
  { name: 'Corsair', slug: 'corsair', href: brandHref('corsair') },
  { name: 'ThunderRobot', slug: 'thunderrobot', href: brandHref('thunderrobot') },
  { name: 'Koorui', slug: 'koorui', href: brandHref('koorui') },
  { name: 'Dahua', slug: 'dahua', href: brandHref('dahua') },
  { name: 'PC Power', slug: 'pc-power', href: brandHref('pc-power') },
  { name: 'Hikvision', slug: 'hikvision', href: brandHref('hikvision') },
  { name: 'Eurovision', slug: 'eurovision', href: brandHref('eurovision') },
  { name: 'Walton', slug: 'walton', href: brandHref('walton') },
  { name: 'Arzopa', slug: 'arzopa', href: brandHref('arzopa') },
  { name: 'GEESUU', slug: 'geesuu', href: brandHref('geesuu') },
  { name: 'Titan Army', slug: 'titan-army', href: brandHref('titan-army') },
  { name: 'Value-Top', slug: 'value-top', href: brandHref('value-top') },
  { name: 'AIWA', slug: 'aiwa', href: brandHref('aiwa') },
  { name: 'Xiaomi', slug: 'xiaomi', href: brandHref('xiaomi') },
  { name: 'Fopo', slug: 'fopo', href: brandHref('fopo') },
  { name: 'Gigasonic', slug: 'gigasonic', href: brandHref('gigasonic') },
  { name: 'TrendSonic', slug: 'trendsonic', href: brandHref('trendsonic') },
  { name: 'FeuVision', slug: 'feuvision', href: brandHref('feuvision') },
  // Type shortcuts
  { name: 'Gaming Monitor', slug: 'gaming-monitor', href: typeHref('gaming-monitor') },
  { name: 'Curved Monitor', slug: 'curved-monitor', href: typeHref('curved-monitor') },
  { name: 'Touch Monitor', slug: 'touch-monitor', href: typeHref('touch-monitor') },
  { name: '4K Monitor', slug: '4k-monitor', href: typeHref('4k-monitor') },
  { name: 'Portable Monitor', slug: 'portable-monitor', href: typeHref('portable-monitor') },
  { name: 'Monitor Arm', slug: 'monitor-arm', href: typeHref('monitor-arm') },
  {
    name: 'Show All Monitor',
    slug: 'monitor-all',
    href: '/products?category=monitor',
    hideArrow: true,
  },
];
