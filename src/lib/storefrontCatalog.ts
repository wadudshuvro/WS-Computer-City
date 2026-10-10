/**
 * Accessories and Gaming leaves verified from Star Tech category pages
 * (child-list links on /accessories and /gaming, October 2026).
 */

import { findGadgetLeaf, gadgetTopLeaves } from '@/lib/gadgetCatalog';

export type CatalogGroup = 'accessories' | 'gaming' | 'gadget';

export type CatalogLeaf = {
  group: CatalogGroup;
  name: string;
  slug: string;
  startechUrl: string;
};

export const ACCESSORIES_LEAVES: CatalogLeaf[] = [
  { group: 'accessories', name: 'Keyboard', slug: 'keyboard', startechUrl: 'https://www.startech.com.bd/accessories/keyboards' },
  { group: 'accessories', name: 'Mouse', slug: 'mouse', startechUrl: 'https://www.startech.com.bd/accessories/mouse' },
  { group: 'accessories', name: 'Headphone', slug: 'headphone', startechUrl: 'https://www.startech.com.bd/accessories/headphone' },
  { group: 'accessories', name: 'Bluetooth Headphone', slug: 'bluetooth-headphone', startechUrl: 'https://www.startech.com.bd/bluetooth-headphone' },
  { group: 'accessories', name: 'Mouse Pad', slug: 'mouse-pad', startechUrl: 'https://www.startech.com.bd/accessories/mouse-pad' },
  { group: 'accessories', name: 'Wrist Rest', slug: 'wrist-rest', startechUrl: 'https://www.startech.com.bd/wrist-rest' },
  { group: 'accessories', name: 'Headphone Stand', slug: 'headphone-stand', startechUrl: 'https://www.startech.com.bd/headphone-stand' },
  { group: 'accessories', name: 'Speaker & Home Theater', slug: 'speaker-home-theater', startechUrl: 'https://www.startech.com.bd/accessories/speaker-and-home-theater' },
  { group: 'accessories', name: 'Monitor Light Bar', slug: 'monitor-light-bar', startechUrl: 'https://www.startech.com.bd/monitor-light-bar' },
  { group: 'accessories', name: 'Bluetooth Speakers', slug: 'bluetooth-speakers', startechUrl: 'https://www.startech.com.bd/accessories/bluetooth-speaker' },
  { group: 'accessories', name: 'Webcam', slug: 'webcam', startechUrl: 'https://www.startech.com.bd/accessories/webcam' },
  { group: 'accessories', name: 'Soundbar', slug: 'soundbar', startechUrl: 'https://www.startech.com.bd/soundbar' },
  { group: 'accessories', name: 'Cable', slug: 'cable', startechUrl: 'https://www.startech.com.bd/cable' },
  { group: 'accessories', name: 'Converter', slug: 'converter', startechUrl: 'https://www.startech.com.bd/converter' },
  { group: 'accessories', name: 'Card Reader', slug: 'card-reader', startechUrl: 'https://www.startech.com.bd/card-reader' },
  { group: 'accessories', name: 'Hubs & Docks', slug: 'hubs-docks', startechUrl: 'https://www.startech.com.bd/hub-and-dock' },
  { group: 'accessories', name: 'Microphone', slug: 'microphone', startechUrl: 'https://www.startech.com.bd/accessories/microphone' },
  { group: 'accessories', name: 'Digital Voice Recorder', slug: 'digital-voice-recorder', startechUrl: 'https://www.startech.com.bd/accessories/digital-voice-recorder' },
  { group: 'accessories', name: 'Presenter', slug: 'presenter', startechUrl: 'https://www.startech.com.bd/presenter' },
  { group: 'accessories', name: 'Memory Card', slug: 'memory-card', startechUrl: 'https://www.startech.com.bd/memory-card' },
  { group: 'accessories', name: 'Sound Card', slug: 'accessory-sound-card', startechUrl: 'https://www.startech.com.bd/sound-card' },
  { group: 'accessories', name: 'Capture Card', slug: 'capture-card', startechUrl: 'https://www.startech.com.bd/capture-card' },
  { group: 'accessories', name: 'Pen Drive', slug: 'pen-drive', startechUrl: 'https://www.startech.com.bd/pen-drive' },
  { group: 'accessories', name: 'Thermal Paste', slug: 'thermal-paste', startechUrl: 'https://www.startech.com.bd/thermal-paste' },
  { group: 'accessories', name: 'HDD-SSD Enclosure', slug: 'hdd-ssd-enclosure', startechUrl: 'https://www.startech.com.bd/accessories/enclosure' },
  { group: 'accessories', name: 'Power Strip', slug: 'power-strip', startechUrl: 'https://www.startech.com.bd/power-strip' },
  { group: 'accessories', name: 'Bluetooth Adapter', slug: 'bluetooth-adapter', startechUrl: 'https://www.startech.com.bd/bluetooth-adapter' },
];

export const GAMING_LEAVES: CatalogLeaf[] = [
  { group: 'gaming', name: 'Gaming Chair', slug: 'gaming-chair', startechUrl: 'https://www.startech.com.bd/gaming-chair' },
  { group: 'gaming', name: 'Gaming Desk', slug: 'gaming-desk', startechUrl: 'https://www.startech.com.bd/gaming-desk' },
  { group: 'gaming', name: 'Gaming Console', slug: 'gaming-console', startechUrl: 'https://www.startech.com.bd/gaming-console' },
  { group: 'gaming', name: 'Gaming Laptop', slug: 'gaming-laptop', startechUrl: 'https://www.startech.com.bd/gaming-laptop' },
  { group: 'gaming', name: 'Gaming Monitor', slug: 'gaming-monitor', startechUrl: 'https://www.startech.com.bd/gaming-monitor' },
  { group: 'gaming', name: 'Keyboard', slug: 'gaming-keyboard', startechUrl: 'https://www.startech.com.bd/gaming-keyboard' },
  { group: 'gaming', name: 'Mouse', slug: 'gaming-mouse', startechUrl: 'https://www.startech.com.bd/gaming-mouse' },
  { group: 'gaming', name: 'Headphone', slug: 'gaming-headphone', startechUrl: 'https://www.startech.com.bd/gaming-headphone' },
  { group: 'gaming', name: 'Mouse Pad', slug: 'gaming-mouse-pad', startechUrl: 'https://www.startech.com.bd/gaming-mouse-pad' },
  { group: 'gaming', name: 'Gamepad', slug: 'gamepad', startechUrl: 'https://www.startech.com.bd/game-pad' },
  { group: 'gaming', name: 'Racing Wheel', slug: 'racing-wheel', startechUrl: 'https://www.startech.com.bd/racing-wheel' },
  { group: 'gaming', name: 'VR', slug: 'vr', startechUrl: 'https://www.startech.com.bd/vr' },
  { group: 'gaming', name: 'Games', slug: 'gaming-games', startechUrl: 'https://www.startech.com.bd/ps4-n-x-box-one-games' },
  { group: 'gaming', name: 'Gaming Router', slug: 'gaming-router', startechUrl: 'https://www.startech.com.bd/gaming-router' },
];

export function catalogLeaves(group: CatalogGroup): CatalogLeaf[] {
  if (group === 'accessories') return ACCESSORIES_LEAVES;
  if (group === 'gaming') return GAMING_LEAVES;
  return gadgetTopLeaves().map((leaf) => ({
    group: 'gadget' as const,
    name: leaf.name,
    slug: leaf.slug,
    startechUrl: leaf.startechUrl,
  }));
}

export function findCatalogLeaf(group: CatalogGroup, slug: string | null | undefined): CatalogLeaf | null {
  if (!slug) return null;
  if (group === 'gadget') {
    const leaf = findGadgetLeaf(slug);
    return leaf
      ? { group: 'gadget', name: leaf.name, slug: leaf.slug, startechUrl: leaf.startechUrl }
      : null;
  }
  return catalogLeaves(group).find((leaf) => leaf.slug === slug) ?? null;
}

export function catalogGroupHref(group: CatalogGroup): string {
  return `/products?category=${group}`;
}

export function catalogLeafHref(leaf: CatalogLeaf): string {
  return `/products?category=${leaf.group}&sub=${leaf.slug}`;
}
