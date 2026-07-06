/**
 * Admin CMS content types — mirrors storefront PC component categories.
 * Each item maps to a database category slug for product filtering.
 */

export interface AdminContentType {
  name: string;
  slug: string;
  description: string;
  /** Maps to categoryHierarchy key in ProductEntryForm when applicable */
  formMainCategory?: string;
}

export interface AdminContentGroup {
  id: string;
  name: string;
  description: string;
  items: AdminContentType[];
}

export const adminContentGroups: AdminContentGroup[] = [
  {
    id: 'components',
    name: 'Components',
    description: 'Core PC parts — processors, GPUs, memory, storage, and more',
    items: [
      { name: 'Processor', slug: 'processor', description: 'Intel & AMD CPUs', formMainCategory: 'processor' },
      { name: 'Graphics Card', slug: 'graphics-card', description: 'NVIDIA & AMD GPUs', formMainCategory: 'graphics_card' },
      { name: 'Motherboard', slug: 'motherboard', description: 'Intel & AMD motherboards', formMainCategory: 'motherboard' },
      { name: 'Desktop RAM', slug: 'desktop-ram', description: 'DDR4 & DDR5 memory', formMainCategory: 'ram' },
      { name: 'RAM', slug: 'ram', description: 'All memory modules', formMainCategory: 'ram' },
      { name: 'SSD', slug: 'ssd', description: 'Internal solid state drives', formMainCategory: 'storage' },
      { name: 'Hard Disk Drive', slug: 'hdd', description: 'Internal HDDs', formMainCategory: 'storage' },
      { name: 'Portable SSD', slug: 'portable-ssd', description: 'External SSDs' },
      { name: 'Portable HDD', slug: 'portable-hdd', description: 'External hard drives' },
      { name: 'Power Supply', slug: 'power-supply', description: 'PSU units' },
      { name: 'Computer Case', slug: 'computer-case', description: 'PC chassis' },
      { name: 'CPU Cooler', slug: 'cpu-cooler', description: 'Air & liquid CPU coolers' },
      { name: 'Casing Fan', slug: 'casing-fan', description: 'Case fans' },
      { name: 'SSD Cooler', slug: 'ssd-cooler', description: 'M.2 heatsinks' },
      { name: 'Custom Cooling Kit', slug: 'custom-cooling-kit', description: 'Custom loop parts' },
      { name: 'Sound Card', slug: 'sound-card', description: 'Audio cards' },
      { name: 'GPU Vertical Mount', slug: 'gpu-vertical-mount', description: 'GPU risers & mounts' },
    ],
  },
  {
    id: 'desktop',
    name: 'Desktop',
    description: 'Pre-built and custom desktop systems',
    items: [
      { name: 'Brand PC', slug: 'brand-pc', description: 'Branded desktops' },
      { name: 'Gaming PC', slug: 'gaming-pc', description: 'Gaming desktops' },
      { name: 'Custom PC', slug: 'custom-pc', description: 'Custom builds' },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Peripherals and add-ons',
    items: [
      { name: 'Keyboard', slug: 'keyboard', description: 'Mechanical & membrane keyboards' },
      { name: 'Mouse', slug: 'mouse', description: 'Gaming & office mice' },
      { name: 'Headphone', slug: 'headphone', description: 'Headsets & headphones' },
      { name: 'Webcam', slug: 'webcam', description: 'Web cameras' },
      { name: 'Speaker', slug: 'speaker', description: 'Audio speakers' },
    ],
  },
  {
    id: 'display',
    name: 'Display',
    description: 'Monitors and displays',
    items: [
      { name: 'Monitor', slug: 'monitor', description: 'PC monitors' },
      { name: 'Television', slug: 'television', description: 'TVs' },
      { name: 'Projector', slug: 'projector', description: 'Projectors' },
    ],
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Additional catalog sections',
    items: [
      { name: 'Laptop', slug: 'laptop', description: 'Laptops & notebooks' },
      { name: 'Networking', slug: 'networking', description: 'Routers & switches' },
      { name: 'Gaming', slug: 'gaming', description: 'Gaming gear' },
    ],
  },
];

export function getAllContentTypes(): AdminContentType[] {
  return adminContentGroups.flatMap((g) => g.items);
}

export function getContentTypeBySlug(slug: string): AdminContentType | undefined {
  return getAllContentTypes().find((item) => item.slug === slug);
}

export function getContentGroupForSlug(slug: string): AdminContentGroup | undefined {
  return adminContentGroups.find((g) => g.items.some((item) => item.slug === slug));
}
