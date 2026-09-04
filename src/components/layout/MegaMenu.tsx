'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { RAM_BRANDS } from '@/lib/ramSpecDefinitions';
import { PSU_BRANDS } from '@/lib/psuSpecDefinitions';
import { SSD_BRANDS } from '@/lib/ssdSpecDefinitions';
import { CASING_BRANDS } from '@/lib/casingSpecDefinitions';
import { CPU_COOLER_BRANDS } from '@/lib/cpuCoolerSpecDefinitions';

interface SubCategory {
  name: string;
  slug: string;
  /** Link override (e.g. Show All → parent category) */
  href?: string;
  /** Hide chevron even if used as a list item */
  hideArrow?: boolean;
  children?: SubCategory[];
}

interface Category {
  name: string;
  slug: string;
  hasDropdown?: boolean;
  subCategories?: SubCategory[];
}

const HOVER_CLOSE_DELAY_MS = 280;

/** Star Tech–style order for Desktop RAM brand flyout (rest appended after). */
const DESKTOP_RAM_MENU_BRAND_ORDER = [
  'team',
  'colorful',
  'corsair',
  'kingston',
  'pny',
  'g-skill',
  'aitc',
  'lexar',
  'netac',
  'ocpc',
  'oscoo',
  'kingbank',
] as const;

/** Laptop RAM menu brands only (Star Tech reference). */
const LAPTOP_RAM_MENU_BRANDS = [
  { slug: 'team', label: 'TEAM' },
  { slug: 'adata', label: 'Adata' },
  { slug: 'g-skill', label: 'G.Skill' },
  { slug: 'lexar', label: 'Lexar' },
  { slug: 'corsair', label: 'Corsair' },
  { slug: 'pny', label: 'PNY' },
  { slug: 'ocpc', label: 'OCPC' },
  { slug: 'netac', label: 'Netac' },
] as const;

function getDesktopRamBrandChildren(): SubCategory[] {
  const bySlug = new Map(RAM_BRANDS.map((b) => [b.slug, b]));
  const ordered: { slug: string; label: string }[] = [];
  const seen = new Set<string>();

  for (const slug of DESKTOP_RAM_MENU_BRAND_ORDER) {
    const brand = bySlug.get(slug);
    if (brand) {
      ordered.push(brand);
      seen.add(slug);
    }
  }

  for (const brand of RAM_BRANDS) {
    if (!seen.has(brand.slug)) {
      ordered.push(brand);
    }
  }

  return ordered.map((brand) => ({
    name: brand.label,
    slug: brand.slug,
    href: `/products?category=components&sub=desktop-ram&brand=${brand.slug}`,
  }));
}

function getLaptopRamBrandChildren(): SubCategory[] {
  return LAPTOP_RAM_MENU_BRANDS.map((brand) => ({
    name: brand.label,
    slug: brand.slug,
    href: `/products?category=components&sub=laptop-ram&brand=${brand.slug}`,
  }));
}

function getPsuBrandChildren(): SubCategory[] {
  return PSU_BRANDS.map((brand) => ({
    name: brand.label,
    slug: brand.slug,
    href: `/products?category=components&sub=power-supply&brand=${brand.slug}`,
  }));
}

function getSsdBrandChildren(): SubCategory[] {
  return SSD_BRANDS.map((brand) => ({
    name: brand.label,
    slug: brand.slug,
    href: `/products?category=components&sub=ssd&brand=${brand.slug}`,
  }));
}

function getCasingBrandChildren(): SubCategory[] {
  return CASING_BRANDS.map((brand) => ({
    name: brand.label,
    slug: brand.slug,
    href: `/products?category=components&sub=computer-case&brand=${brand.slug}`,
  }));
}

function getCpuCoolerBrandChildren(): SubCategory[] {
  return CPU_COOLER_BRANDS.map((brand) => ({
    name: brand.label,
    slug: brand.slug,
    href: `/products?category=components&sub=cpu-cooler&brand=${brand.slug}`,
  }));
}

/** Top nav — Star Tech order, single line only */
const categories: Category[] = [
  {
    name: 'Desktop',
    slug: 'desktop',
    hasDropdown: true,
    subCategories: [
      { name: 'Brand PC', slug: 'brand-pc' },
      { name: 'Gaming PC', slug: 'gaming-pc' },
      { name: 'Custom PC', slug: 'custom-pc' },
    ],
  },
  {
    name: 'Laptop',
    slug: 'laptop',
  },
  {
    name: 'Component',
    slug: 'components',
    hasDropdown: true,
    subCategories: [
      {
        name: 'Processor',
        slug: 'processor',
        children: [
          { name: 'Intel', slug: 'intel' },
          { name: 'AMD Ryzen', slug: 'amd-ryzen' },
        ],
      },
      { name: 'CPU Cooler', slug: 'cpu-cooler', children: getCpuCoolerBrandChildren() },
      { name: 'Water / Liquid Cooling', slug: 'liquid-cooling' },
      {
        name: 'Motherboard',
        slug: 'motherboard',
        children: [
          { name: 'Intel Motherboard', slug: 'intel-motherboard' },
          { name: 'AMD Motherboard', slug: 'amd-motherboard' },
        ],
      },
      {
        name: 'Graphics Card',
        slug: 'graphics-card',
        children: [
          { name: 'NVIDIA', slug: 'nvidia' },
          { name: 'AMD', slug: 'amd-gpu' },
        ],
      },
      {
        name: 'RAM (Desktop)',
        slug: 'desktop-ram',
        children: getDesktopRamBrandChildren(),
      },
      {
        name: 'RAM (Laptop)',
        slug: 'laptop-ram',
        children: getLaptopRamBrandChildren(),
      },
      {
        name: 'Power Supply',
        slug: 'power-supply',
        children: getPsuBrandChildren(),
      },
      { name: 'Hard Disk Drive', slug: 'hdd' },
      { name: 'Portable Hard Disk Drive', slug: 'portable-hdd' },
      {
        name: 'SSD',
        slug: 'ssd',
        children: getSsdBrandChildren(),
      },
      { name: 'Portable SSD', slug: 'portable-ssd' },
      {
        name: 'Casing',
        slug: 'computer-case',
        children: getCasingBrandChildren(),
      },
      { name: 'Casing Cooler', slug: 'casing-fan' },
      { name: 'Optical Disk Drive', slug: 'optical-disk-drive' },
      { name: 'Vertical GPU Holder', slug: 'gpu-vertical-mount' },
      {
        name: 'Show All Component',
        slug: 'components',
        href: '/products?category=components',
        hideArrow: true,
      },
    ],
  },
  { name: 'Monitor', slug: 'monitor' },
  { name: 'Power', slug: 'power' },
  { name: 'Phone', slug: 'phone' },
  { name: 'Tablet', slug: 'tablet' },
  { name: 'Office Equipment', slug: 'office-equipment' },
  { name: 'Camera', slug: 'camera' },
  { name: 'Security', slug: 'security' },
  {
    name: 'Networking',
    slug: 'networking',
    hasDropdown: true,
    subCategories: [
      { name: 'Router', slug: 'router' },
      { name: 'Switch', slug: 'switch' },
      { name: 'Network Adapter', slug: 'network-adapter' },
    ],
  },
  { name: 'Software', slug: 'software' },
  { name: 'Server & Storage', slug: 'server-storage' },
  {
    name: 'Accessories',
    slug: 'accessories',
    hasDropdown: true,
    subCategories: [
      { name: 'Keyboard', slug: 'keyboard' },
      { name: 'Mouse', slug: 'mouse' },
      { name: 'Headphone', slug: 'headphone' },
      { name: 'Webcam', slug: 'webcam' },
      { name: 'Speaker', slug: 'speaker' },
    ],
  },
  { name: 'Gadget', slug: 'gadget' },
  { name: 'Gaming', slug: 'gaming' },
  { name: 'TV', slug: 'tv' },
  { name: 'Appliance', slug: 'appliance' },
];

function subCategoryHref(categorySlug: string, subCat: SubCategory): string {
  if (subCat.href) return subCat.href;
  return `/products?category=${categorySlug}&sub=${subCat.slug}`;
}

function childHref(categorySlug: string, child: SubCategory): string {
  if (child.href) return child.href;
  return `/products?category=${categorySlug}&sub=${child.slug}`;
}

export function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const categoryCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subCategoryCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = (timer: { current: ReturnType<typeof setTimeout> | null }) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const openCategory = useCallback((slug: string) => {
    clearTimer(categoryCloseTimer);
    clearTimer(subCategoryCloseTimer);
    setActiveCategory((prev) => {
      if (prev !== slug) {
        setActiveSubCategory(null);
      }
      return slug;
    });
  }, []);

  const scheduleCloseCategory = useCallback(() => {
    clearTimer(categoryCloseTimer);
    categoryCloseTimer.current = setTimeout(() => {
      setActiveCategory(null);
      setActiveSubCategory(null);
    }, HOVER_CLOSE_DELAY_MS);
  }, []);

  const openSubCategory = useCallback((slug: string) => {
    clearTimer(subCategoryCloseTimer);
    setActiveSubCategory(slug);
  }, []);

  const scheduleCloseSubCategory = useCallback(() => {
    clearTimer(subCategoryCloseTimer);
    subCategoryCloseTimer.current = setTimeout(() => {
      setActiveSubCategory(null);
    }, HOVER_CLOSE_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      clearTimer(categoryCloseTimer);
      clearTimer(subCategoryCloseTimer);
    };
  }, []);

  return (
    <nav className="relative z-40 bg-white border-b border-gray-200 overflow-visible">
      <div className="mx-auto max-w-[1600px] px-1 overflow-visible">
        <ul className="relative z-40 flex flex-nowrap items-center justify-between gap-0 overflow-visible whitespace-nowrap text-[11px] font-semibold leading-none xl:text-[12px]">
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            const showDropdown =
              Boolean(category.hasDropdown && category.subCategories?.length) && isActive;

            return (
              <li
                key={category.slug}
                className="relative shrink-0 overflow-visible"
                onMouseEnter={() => openCategory(category.slug)}
                onMouseLeave={scheduleCloseCategory}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className={`block px-1.5 py-3 transition-colors xl:px-2 ${
                    isActive ? 'text-[#e85d04]' : 'text-gray-900 hover:text-[#e85d04]'
                  }`}
                >
                  {category.name}
                </Link>

                {showDropdown && (
                  <div
                    className="absolute left-0 top-full z-[60] min-w-[240px] border border-gray-200 border-t-2 border-t-[#e85d04] bg-white text-gray-800 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                    onMouseEnter={() => openCategory(category.slug)}
                  >
                    <ul className="py-1">
                      {category.subCategories!.map((subCat) => {
                        const hasChildren = Boolean(subCat.children?.length);
                        const isSubActive = activeSubCategory === subCat.slug;
                        const showArrow = hasChildren && !subCat.hideArrow;

                        return (
                          <li
                            key={`${subCat.slug}-${subCat.name}`}
                            className="relative"
                            onMouseEnter={() => {
                              if (hasChildren) {
                                openSubCategory(subCat.slug);
                              } else {
                                clearTimer(subCategoryCloseTimer);
                                setActiveSubCategory(null);
                              }
                            }}
                            onMouseLeave={() => {
                              if (hasChildren) {
                                scheduleCloseSubCategory();
                              }
                            }}
                          >
                            <Link
                              href={subCategoryHref(category.slug, subCat)}
                              className={`flex items-center justify-between gap-3 px-4 py-2 text-[13px] font-normal transition-colors ${
                                isSubActive
                                  ? 'bg-[#fff4ec] text-[#e85d04]'
                                  : 'text-gray-800 hover:bg-[#fff4ec] hover:text-[#e85d04]'
                              }`}
                            >
                              <span>{subCat.name}</span>
                              {showArrow && (
                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#f4a261]" />
                              )}
                            </Link>

                            {hasChildren && isSubActive && (
                              <div
                                className="absolute left-full top-0 z-[70] -ml-px max-h-[70vh] min-w-[180px] overflow-y-auto border border-gray-200 bg-white text-gray-800 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                                onMouseEnter={() => openSubCategory(subCat.slug)}
                                onMouseLeave={scheduleCloseSubCategory}
                              >
                                <ul className="py-1">
                                  {subCat.children!.map((child) => (
                                    <li key={child.slug}>
                                      <Link
                                        href={childHref(category.slug, child)}
                                        className="block px-4 py-2 text-[13px] font-normal text-gray-800 transition-colors hover:bg-[#fff4ec] hover:text-[#e85d04]"
                                      >
                                        {child.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
