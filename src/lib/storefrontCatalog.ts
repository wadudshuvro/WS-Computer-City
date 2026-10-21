/**
 * Accessories and Gaming category leaves.
 * sourcePath is only read by the offline import scripts.
 */

import { findGadgetLeaf, gadgetTopLeaves } from '@/lib/gadgetCatalog';

export type CatalogGroup = 'accessories' | 'gaming' | 'gadget';

export type CatalogLeaf = {
  group: CatalogGroup;
  name: string;
  slug: string;
  sourcePath: string;
};

export const ACCESSORIES_LEAVES: CatalogLeaf[] = [
  { group: 'accessories', name: 'Keyboard', slug: 'keyboard', sourcePath: '/accessories/keyboards' },
  { group: 'accessories', name: 'Mouse', slug: 'mouse', sourcePath: '/accessories/mouse' },
  { group: 'accessories', name: 'Headphone', slug: 'headphone', sourcePath: '/accessories/headphone' },
  { group: 'accessories', name: 'Bluetooth Headphone', slug: 'bluetooth-headphone', sourcePath: '/bluetooth-headphone' },
  { group: 'accessories', name: 'Mouse Pad', slug: 'mouse-pad', sourcePath: '/accessories/mouse-pad' },
  { group: 'accessories', name: 'Wrist Rest', slug: 'wrist-rest', sourcePath: '/wrist-rest' },
  { group: 'accessories', name: 'Headphone Stand', slug: 'headphone-stand', sourcePath: '/headphone-stand' },
  { group: 'accessories', name: 'Speaker & Home Theater', slug: 'speaker-home-theater', sourcePath: '/accessories/speaker-and-home-theater' },
  { group: 'accessories', name: 'Monitor Light Bar', slug: 'monitor-light-bar', sourcePath: '/monitor-light-bar' },
  { group: 'accessories', name: 'Bluetooth Speakers', slug: 'bluetooth-speakers', sourcePath: '/accessories/bluetooth-speaker' },
  { group: 'accessories', name: 'Webcam', slug: 'webcam', sourcePath: '/accessories/webcam' },
  { group: 'accessories', name: 'Soundbar', slug: 'soundbar', sourcePath: '/soundbar' },
  { group: 'accessories', name: 'Cable', slug: 'cable', sourcePath: '/cable' },
  { group: 'accessories', name: 'Converter', slug: 'converter', sourcePath: '/converter' },
  { group: 'accessories', name: 'Card Reader', slug: 'card-reader', sourcePath: '/card-reader' },
  { group: 'accessories', name: 'Hubs & Docks', slug: 'hubs-docks', sourcePath: '/hub-and-dock' },
  { group: 'accessories', name: 'Microphone', slug: 'microphone', sourcePath: '/accessories/microphone' },
  { group: 'accessories', name: 'Digital Voice Recorder', slug: 'digital-voice-recorder', sourcePath: '/accessories/digital-voice-recorder' },
  { group: 'accessories', name: 'Presenter', slug: 'presenter', sourcePath: '/presenter' },
  { group: 'accessories', name: 'Memory Card', slug: 'memory-card', sourcePath: '/memory-card' },
  { group: 'accessories', name: 'Sound Card', slug: 'accessory-sound-card', sourcePath: '/sound-card' },
  { group: 'accessories', name: 'Capture Card', slug: 'capture-card', sourcePath: '/capture-card' },
  { group: 'accessories', name: 'Pen Drive', slug: 'pen-drive', sourcePath: '/pen-drive' },
  { group: 'accessories', name: 'Thermal Paste', slug: 'thermal-paste', sourcePath: '/thermal-paste' },
  { group: 'accessories', name: 'HDD-SSD Enclosure', slug: 'hdd-ssd-enclosure', sourcePath: '/accessories/enclosure' },
  { group: 'accessories', name: 'Power Strip', slug: 'power-strip', sourcePath: '/power-strip' },
  { group: 'accessories', name: 'Bluetooth Adapter', slug: 'bluetooth-adapter', sourcePath: '/bluetooth-adapter' },
];

export const GAMING_LEAVES: CatalogLeaf[] = [
  { group: 'gaming', name: 'Gaming Chair', slug: 'gaming-chair', sourcePath: '/gaming-chair' },
  { group: 'gaming', name: 'Gaming Desk', slug: 'gaming-desk', sourcePath: '/gaming-desk' },
  { group: 'gaming', name: 'Gaming Console', slug: 'gaming-console', sourcePath: '/gaming-console' },
  { group: 'gaming', name: 'Gaming Laptop', slug: 'gaming-laptop', sourcePath: '/gaming-laptop' },
  { group: 'gaming', name: 'Gaming Monitor', slug: 'gaming-monitor', sourcePath: '/gaming-monitor' },
  { group: 'gaming', name: 'Keyboard', slug: 'gaming-keyboard', sourcePath: '/gaming-keyboard' },
  { group: 'gaming', name: 'Mouse', slug: 'gaming-mouse', sourcePath: '/gaming-mouse' },
  { group: 'gaming', name: 'Headphone', slug: 'gaming-headphone', sourcePath: '/gaming-headphone' },
  { group: 'gaming', name: 'Mouse Pad', slug: 'gaming-mouse-pad', sourcePath: '/gaming-mouse-pad' },
  { group: 'gaming', name: 'Gamepad', slug: 'gamepad', sourcePath: '/game-pad' },
  { group: 'gaming', name: 'Racing Wheel', slug: 'racing-wheel', sourcePath: '/racing-wheel' },
  { group: 'gaming', name: 'VR', slug: 'vr', sourcePath: '/vr' },
  { group: 'gaming', name: 'Games', slug: 'gaming-games', sourcePath: '/ps4-n-x-box-one-games' },
  { group: 'gaming', name: 'Gaming Router', slug: 'gaming-router', sourcePath: '/gaming-router' },
];

export function catalogLeaves(group: CatalogGroup): CatalogLeaf[] {
  if (group === 'accessories') return ACCESSORIES_LEAVES;
  if (group === 'gaming') return GAMING_LEAVES;
  return gadgetTopLeaves().map((leaf) => ({
    group: 'gadget' as const,
    name: leaf.name,
    slug: leaf.slug,
    sourcePath: leaf.sourcePath,
  }));
}

export function findCatalogLeaf(group: CatalogGroup, slug: string | null | undefined): CatalogLeaf | null {
  if (!slug) return null;
  if (group === 'gadget') {
    const leaf = findGadgetLeaf(slug);
    return leaf
      ? { group: 'gadget', name: leaf.name, slug: leaf.slug, sourcePath: leaf.sourcePath }
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
