/**
 * Star Tech–style Accessories mega-menu children.
 * Flat list under top-level "Accessories".
 */

export type AccessoriesMenuItem = {
  name: string;
  slug: string;
  href: string;
  hideArrow?: boolean;
};

const subHref = (subSlug: string) =>
  `/products?category=accessories&sub=${subSlug}`;

/** Order matches Star Tech Accessories dropdown. */
export const ACCESSORIES_MENU_ITEMS: AccessoriesMenuItem[] = [
  { name: 'Watch', slug: 'watch', href: subHref('watch'), hideArrow: false },
  { name: 'Keyboard', slug: 'keyboard', href: subHref('keyboard'), hideArrow: false },
  { name: 'Mouse', slug: 'mouse', href: subHref('mouse'), hideArrow: false },
  { name: 'Headphone', slug: 'headphone', href: subHref('headphone'), hideArrow: false },
  { name: 'Bluetooth Headphone', slug: 'bluetooth-headphone', href: subHref('bluetooth-headphone') },
  { name: 'Mouse Pad', slug: 'mouse-pad', href: subHref('mouse-pad'), hideArrow: false },
  { name: 'Wrist Rest', slug: 'wrist-rest', href: subHref('wrist-rest') },
  { name: 'Headphone Stand', slug: 'headphone-stand', href: subHref('headphone-stand') },
  { name: 'Speaker & Home Theater', slug: 'speaker-home-theater', href: subHref('speaker-home-theater') },
  { name: 'Bluetooth Speakers', slug: 'bluetooth-speakers', href: subHref('bluetooth-speakers'), hideArrow: false },
  { name: 'Soundbar', slug: 'soundbar', href: subHref('soundbar') },
  { name: 'Webcam', slug: 'webcam', href: subHref('webcam') },
  { name: 'Cable', slug: 'cable', href: subHref('cable') },
  { name: 'Converter', slug: 'converter', href: subHref('converter') },
  { name: 'Card Reader', slug: 'card-reader', href: subHref('card-reader') },
  { name: 'Hubs & Docks', slug: 'hubs-docks', href: subHref('hubs-docks') },
  { name: 'Microphone', slug: 'microphone', href: subHref('microphone') },
  { name: 'Digital Voice Recorder', slug: 'digital-voice-recorder', href: subHref('digital-voice-recorder') },
  { name: 'Presenter', slug: 'presenter', href: subHref('presenter') },
  { name: 'Memory Card', slug: 'memory-card', href: subHref('memory-card'), hideArrow: false },
  { name: 'Capture Card', slug: 'capture-card', href: subHref('capture-card') },
  { name: 'Pen Drive', slug: 'pen-drive', href: subHref('pen-drive'), hideArrow: false },
  { name: 'Thermal Paste', slug: 'thermal-paste', href: subHref('thermal-paste') },
  {
    name: 'Show All Accessories',
    slug: 'accessories-all',
    href: '/products?category=accessories',
    hideArrow: true,
  },
];
