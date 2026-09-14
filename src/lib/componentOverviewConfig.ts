/**
 * Star Tech–style “Show All Component” overview pills.
 * Links use /products?category=components&sub=<slug>
 */
export type ComponentOverviewPill = {
  label: string;
  subSlug: string;
};

export const COMPONENT_OVERVIEW_PILLS: ComponentOverviewPill[] = [
  { label: 'Processor', subSlug: 'processor' },
  { label: 'CPU Cooler', subSlug: 'cpu-cooler' },
  { label: 'Motherboard', subSlug: 'motherboard' },
  { label: 'Graphics Card', subSlug: 'graphics-card' },
  { label: 'RAM (Desktop)', subSlug: 'desktop-ram' },
  { label: 'RAM (Laptop)', subSlug: 'laptop-ram' },
  { label: 'Power Supply', subSlug: 'power-supply' },
  { label: 'Hard Disk Drive', subSlug: 'hdd' },
  { label: 'Portable Hard Disk Drive', subSlug: 'portable-hdd' },
  { label: 'SSD', subSlug: 'ssd' },
  { label: 'Portable SSD', subSlug: 'portable-ssd' },
  { label: 'Casing', subSlug: 'computer-case' },
  { label: 'Casing Cooler', subSlug: 'casing-fan' },
  { label: 'Optical Disk Drive', subSlug: 'optical-disk-drive' },
  { label: 'Vertical GPU Holder', subSlug: 'gpu-vertical-mount' },
  { label: 'SSD Cooler', subSlug: 'ssd-cooler' },
  { label: 'Water / Liquid Cooling', subSlug: 'liquid-cooling' },
];

export function componentOverviewHref(subSlug: string) {
  return `/products?category=components&sub=${subSlug}`;
}
