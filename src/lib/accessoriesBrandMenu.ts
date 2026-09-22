import type { MenuTreeItem } from '@/lib/menu';

type BrandRef = { slug: string; label: string };

function brandHref(subSlug: string, brandSlug: string) {
  return `/products?category=accessories&sub=${subSlug}&brand=${brandSlug}`;
}

function toMenuChildren(
  parentKey: string,
  subSlug: string,
  brands: BrandRef[]
): MenuTreeItem[] {
  return brands.map((brand, index) => ({
    id: `acc-brand-${parentKey}-${brand.slug}`,
    name: brand.label,
    slug: brand.slug,
    level: 2,
    sortOrder: index,
    href: brandHref(subSlug, brand.slug),
    categoryId: null,
    categorySlug: null,
    isVisible: true,
    hideArrow: false,
    children: [],
  }));
}

function brands(labels: string[]): BrandRef[] {
  return labels.map((label) => ({
    label,
    slug: label
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  }));
}

/** Star Tech–style Accessories brand flyouts (from shared references). */
export const ACCESSORIES_BRAND_FLYOUTS: Record<string, BrandRef[]> = {
  watch: brands([
    'Amazfit',
    'Apple',
    'Black Shark',
    'boAt',
    'COLMI',
    'DIZO',
    'Fastrack',
    'Fire-Boltt',
    'Google',
    'Havit',
    'Haylou',
    'HiFuture',
    'IMILAB',
    'HUAWEI',
    'Kieslect',
    'Weofly',
    'KOSPET',
    'OnePlus',
    'Oraimo',
    'QCY',
    'Realme',
    'RIVER SONG',
    'Samsung',
    'Titan',
    'WiWU',
    'Xiaomi',
    'XTRA',
    'Yison',
    'Zeblaze',
    'Remax',
    'Joyroom',
    'Awei',
    'MOVR',
    'Tecno',
    'BWOO',
    'CHARG',
    'Unikyy',
    'XO',
  ]),
  keyboard: brands([
    'Logitech',
    'Xtrike Me',
    'GAMDIAS',
    'Fantech',
    'Asus',
    'Corsair',
    'A4Tech',
    'SteelSeries',
    'Durgod',
    'Havit',
    'Rapoo',
    'T-WOLF',
    'Onikuma',
    'AULA',
    'iMICE',
    'ROYAL KLUDGE',
    'AJAZZ',
    'Keychron',
    'Dareu',
    'Redragon',
    'Microsoft',
    'NZXT',
    'PC Power',
    'Jedel',
    'MCHOSE',
    'Furycube',
    'Magegee',
    'XO',
  ]),
  mouse: brands([
    'Logitech',
    'Xtrike Me',
    'Asus',
    'Corsair',
    'A4Tech',
    'SteelSeries',
    'Fantech',
    'Havit',
    'iMICE',
    'Rapoo',
    'Durgod',
    'T-WOLF',
    'Onikuma',
    'AULA',
    'ThunderRobot',
    'GAMDIAS',
    'Apple',
    'Redragon',
    'MSI',
    'AJAZZ',
    'PC Power',
    'Hoco',
    'MCHOSE',
    'Furycube',
    'Inphic',
    'XO',
  ]),
  headphone: brands([
    'Logitech',
    'Xtrike Me',
    'Sony',
    'Asus',
    'Corsair',
    'A4Tech',
    'SteelSeries',
    'Fantech',
    'Havit',
    'Edifier',
    'Rapoo',
    'iMICE',
    'Onikuma',
    'Inbertec',
    'JBL',
    'MSI',
    'EKSA',
    'Apple',
    'Jabra',
    'RODE',
    'MeeTion',
    'Redragon',
    'Microlab',
    'Anker',
    'Audio Technica',
    'Beyerdynamic',
    'UGREEN',
    'AKG',
    'Awei',
    'Tribit',
    'Hoco',
    'Fastrack',
    'PC Power',
    'OneOdio',
    'Acefast',
    'Weofly',
    'AJAZZ',
  ]),
  'mouse-pad': brands([
    'RAZER',
    'Xtrike Me',
    'Asus',
    'Fantech',
    'Havit',
    'Logitech',
    'SteelSeries',
    'MSI',
    'MeeTion',
    'X-Raypad',
    'Elgato',
    'Onikuma',
    'A4Tech',
    'Inphic',
    'AJAZZ',
    'ThundeRobot',
  ]),
  'bluetooth-speakers': brands([
    'Awei',
    'Baseus',
    'EarFun',
    'Fantech',
    'Oraimo',
    'HiFuture',
    'Hoco',
    'JBL',
    'Havit',
    'JOYROOM',
    'Marshall',
    'Thunderobot',
    'Logitech',
    'Edifier',
    'F&D',
    'HONOR',
    'RECCI',
    'Sony',
    'Tribit',
    'LDNIO',
    'Yison',
    'Ikarao',
    'SteelSeries',
    'Thonet & Vander',
    'QCY',
    'Onikuma',
    'BWOO',
    'TOZO',
    'Monster',
    'Weofly',
    'Jiayou',
    'Unikyy',
  ]),
  'pen-drive': brands([
    'TEAM',
    'Transcend',
    'TWINMOS',
    'ADATA',
    'SanDisk',
    'Kingston',
    'Apacer',
    'Lexar',
    'Dahua',
    'Netac',
    'Smart',
    'Hiksemi',
    'Eaget',
    'OSCOO',
  ]),
  'memory-card': brands([
    'TEAM',
    'PNY',
    'SanDisk',
    'Transcend',
    'Apacer',
    'Lexar',
    'Adata',
    'Sony',
    'TwinMOS',
    'Samsung',
    'Nikon',
    'Dahua',
    'Smart',
    'Hiksemi',
    'Jovision',
    'Kingston',
    'OCPC',
    'EZVIZ',
    'HP',
  ]),
};

export const ACCESSORIES_BRAND_PARENT_SLUGS = Object.keys(
  ACCESSORIES_BRAND_FLYOUTS
) as (keyof typeof ACCESSORIES_BRAND_FLYOUTS)[];

export function getAccessoriesBrandFlyout(subSlug: string): MenuTreeItem[] | null {
  const list = ACCESSORIES_BRAND_FLYOUTS[subSlug];
  if (!list?.length) return null;
  return toMenuChildren(subSlug, subSlug, list);
}

/**
 * Attach Accessories brand flyouts when CMS children are missing.
 * Does not touch Component / Monitor trees.
 */
export function enrichAccessoriesBrandFlyouts(tree: MenuTreeItem[]): MenuTreeItem[] {
  return tree.map((top) => {
    if (top.slug !== 'accessories') return top;

    return {
      ...top,
      children: top.children.map((sub) => {
        if (sub.children.length > 0) return sub;
        const brandList = getAccessoriesBrandFlyout(sub.slug);
        if (!brandList?.length) return sub;
        return { ...sub, hideArrow: false, children: brandList };
      }),
    };
  });
}
