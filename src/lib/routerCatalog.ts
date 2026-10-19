export type RouterBrand = { slug: string; label: string };

function brand(label: string): RouterBrand {
  return {
    label,
    slug: label
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  };
}

/** Brand order from the Star Tech Router flyout, then remaining sidebar brands. */
export const ROUTER_BRANDS: RouterBrand[] = [
  'TP-Link',
  'Tenda',
  'Cudy',
  'Mikrotik',
  'D-Link',
  'Ruijie',
  'ASUS',
  'Mercusys',
  'Zyxel',
  'TOTOLINK',
  'BDCOM',
  'PROLINK',
  'Grandstream',
  'Cisco',
  'Dahua',
  'Hikvision',
  'Netis',
  'RobiWifi',
  'VSOL',
  'Netgear',
  'Huawei',
  'XO',
].map(brand);

export const ROUTER_LISTING_URL = 'https://www.startech.com.bd/networking/router';
