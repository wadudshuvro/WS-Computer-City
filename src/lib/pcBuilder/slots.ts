/** PC Builder component slots. Safe to import on server and client. */

export type SlotId =
  | 'cpu'
  | 'cpu-cooler'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'gpu'
  | 'psu'
  | 'casing'
  | 'monitor'
  | 'casing-cooler'
  | 'keyboard'
  | 'mouse'
  | 'speaker'
  | 'headphone'
  | 'wifi'
  | 'antivirus'
  | 'ups';

/** Products come from these categories. `nameAny` narrows a category to matching names. */
export type SlotSource = { categories: string[]; nameAny?: string[] };

/** pattern keeps only clean values (CMS data for some keys is free text). */
export type SlotFacet = { key: string; label: string; pattern?: string };

export type SlotDef = {
  id: SlotId;
  label: string;
  /** Singular noun for "Choose a CPU" and "+ Add Another RAM". */
  noun: string;
  group: 'core' | 'peripherals';
  required?: boolean;
  /** Maximum number of items. 1 means choosing replaces. */
  max: number;
  sources: SlotSource[];
  facets: SlotFacet[];
};

export const PC_BUILDER_SLOTS: SlotDef[] = [
  {
    id: 'cpu',
    label: 'CPU',
    noun: 'CPU',
    group: 'core',
    required: true,
    max: 1,
    sources: [{ categories: ['intel', 'amd'] }],
    facets: [
      { key: 'socket_type', label: 'Socket' },
      { key: 'number_of_cores', label: 'Number of Core' },
      { key: 'generation', label: 'Generation' },
    ],
  },
  {
    id: 'cpu-cooler',
    label: 'CPU Cooler',
    noun: 'CPU Cooler',
    group: 'core',
    max: 1,
    sources: [{ categories: ['cpu-cooler'] }],
    facets: [],
  },
  {
    id: 'motherboard',
    label: 'Motherboard',
    noun: 'Motherboard',
    group: 'core',
    required: true,
    max: 1,
    sources: [{ categories: ['intel-motherboard', 'amd-motherboard'] }],
    facets: [
      { key: 'memory_type', label: 'Memory Type', pattern: '^DDR[2-5]$' },
      { key: 'chipset', label: 'Chipset', pattern: '^(AMD|Intel) [A-Z]\\d{2,3}[A-Z]?$' },
    ],
  },
  {
    id: 'ram',
    label: 'RAM',
    noun: 'RAM',
    group: 'core',
    required: true,
    max: 4,
    sources: [{ categories: ['desktop-ram'] }],
    facets: [
      { key: 'memory_type', label: 'Memory Type', pattern: '^DDR[2-5]$' },
      { key: 'capacity', label: 'Capacity' },
      { key: 'speed', label: 'BUS Speed' },
    ],
  },
  {
    id: 'storage',
    label: 'Storage',
    noun: 'Storage',
    group: 'core',
    required: true,
    max: 4,
    sources: [{ categories: ['ssd', 'hdd'] }],
    facets: [],
  },
  {
    id: 'gpu',
    label: 'Graphics Card',
    noun: 'Graphics Card',
    group: 'core',
    max: 1,
    sources: [{ categories: ['nvidia', 'amd-gpu', 'graphics-card'] }],
    facets: [
      { key: 'chipset_series', label: 'Chipset Series' },
      { key: 'memory_size', label: 'Video Memory' },
    ],
  },
  {
    id: 'psu',
    label: 'Power Supply',
    noun: 'Power Supply',
    group: 'core',
    max: 1,
    sources: [{ categories: ['power-supply'] }],
    facets: [{ key: 'modular_type', label: 'Modular Type' }],
  },
  {
    id: 'casing',
    label: 'Casing',
    noun: 'Casing',
    group: 'core',
    max: 1,
    sources: [{ categories: ['computer-case'] }],
    facets: [],
  },
  {
    id: 'monitor',
    label: 'Monitor',
    noun: 'Monitor',
    group: 'peripherals',
    max: 3,
    sources: [{ categories: ['monitor', 'gaming-monitor'] }],
    facets: [],
  },
  {
    id: 'casing-cooler',
    label: 'Casing Cooler',
    noun: 'Casing Cooler',
    group: 'peripherals',
    max: 4,
    sources: [],
    facets: [],
  },
  {
    id: 'keyboard',
    label: 'Keyboard',
    noun: 'Keyboard',
    group: 'peripherals',
    max: 1,
    sources: [{ categories: ['keyboard', 'gaming-keyboard'] }],
    facets: [],
  },
  {
    id: 'mouse',
    label: 'Mouse',
    noun: 'Mouse',
    group: 'peripherals',
    max: 1,
    sources: [{ categories: ['mouse', 'gaming-mouse'] }],
    facets: [],
  },
  {
    id: 'speaker',
    label: 'Speaker & Home Theater',
    noun: 'Speaker',
    group: 'peripherals',
    max: 1,
    sources: [{ categories: ['speaker-home-theater', 'soundbar'] }],
    facets: [],
  },
  {
    id: 'headphone',
    label: 'Headphone',
    noun: 'Headphone',
    group: 'peripherals',
    max: 1,
    sources: [{ categories: ['headphone', 'gaming-headphone', 'bluetooth-headphone'] }],
    facets: [],
  },
  {
    id: 'wifi',
    label: 'WiFi Adapter / LAN Card',
    noun: 'WiFi Adapter / LAN Card',
    group: 'peripherals',
    max: 1,
    sources: [
      { categories: ['bluetooth-adapter'], nameAny: ['wifi', 'wi-fi', 'wireless', 'lan'] },
      { categories: ['converter'], nameAny: ['ethernet', 'rj45', 'lan'] },
    ],
    facets: [],
  },
  {
    id: 'antivirus',
    label: 'Anti Virus',
    noun: 'Anti Virus',
    group: 'peripherals',
    max: 1,
    sources: [],
    facets: [],
  },
  {
    id: 'ups',
    label: 'UPS',
    noun: 'UPS',
    group: 'peripherals',
    max: 1,
    sources: [{ categories: ['ups'] }],
    facets: [],
  },
];

export const SLOT_BY_ID: Record<SlotId, SlotDef> = Object.fromEntries(
  PC_BUILDER_SLOTS.map((slot) => [slot.id, slot])
) as Record<SlotId, SlotDef>;

export function isSlotId(value: string): value is SlotId {
  return value in SLOT_BY_ID;
}

/** Which slot a product belongs to, from its category slug (used when loading a shared build). */
export function slotForCategory(categorySlug: string, productName = ''): SlotId | null {
  const name = productName.toLowerCase();
  for (const slot of PC_BUILDER_SLOTS) {
    for (const source of slot.sources) {
      if (!source.categories.includes(categorySlug)) continue;
      if (source.nameAny && !source.nameAny.some((word) => name.includes(word))) continue;
      return slot.id;
    }
  }
  return null;
}
