'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SubCategory {
  name: string;
  slug: string;
  children?: SubCategory[];
}

interface Category {
  name: string;
  slug: string;
  hasDropdown?: boolean;
  subCategories?: SubCategory[];
}

const categories: Category[] = [
  {
    name: 'Laptop',
    slug: 'laptop',
    hasDropdown: false,
  },
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
    name: 'Components',
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
      {
        name: 'Graphics Card',
        slug: 'graphics-card',
        children: [
          { name: 'NVIDIA', slug: 'nvidia' },
          { name: 'AMD', slug: 'amd-gpu' },
        ],
      },
      { name: 'Portable HDD', slug: 'portable-hdd' },
      { name: 'Portable SSD', slug: 'portable-ssd' },
      {
        name: 'Desktop RAM',
        slug: 'desktop-ram',
        children: [
          { name: 'DDR4 RAM', slug: 'ddr4-ram' },
          { name: 'DDR5 RAM', slug: 'ddr5-ram' },
        ],
      },
      { name: 'Computer Case', slug: 'computer-case' },
      { name: 'CPU Cooler', slug: 'cpu-cooler' },
      { name: 'Casing Fan', slug: 'casing-fan' },
      { name: 'SSD Cooler', slug: 'ssd-cooler' },
      { name: 'Power Supply', slug: 'power-supply' },
      { name: 'Custom Cooling Kit', slug: 'custom-cooling-kit' },
      { name: 'Sound Card', slug: 'sound-card' },
      { name: 'GPU Vertical Mount', slug: 'gpu-vertical-mount' },
    ],
  },
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
  {
    name: 'Phone & Tablet',
    slug: 'phone-tablet',
    hasDropdown: true,
    subCategories: [
      { name: 'Mobile Phone', slug: 'mobile-phone' },
      { name: 'Tablet', slug: 'tablet' },
      { name: 'Phone Accessories', slug: 'phone-accessories' },
    ],
  },
  {
    name: 'Display',
    slug: 'display',
    hasDropdown: true,
    subCategories: [
      { name: 'Monitor', slug: 'monitor' },
      { name: 'Television', slug: 'television' },
      { name: 'Projector', slug: 'projector' },
    ],
  },
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
  { name: 'Office Equipments', slug: 'office-equipments' },
  { name: 'Gadgets', slug: 'gadgets' },
  { name: 'Cameras', slug: 'cameras' },
  { name: 'TV', slug: 'tv' },
  { name: 'Power', slug: 'power' },
  { name: 'Security', slug: 'security' },
  { name: 'Gaming', slug: 'gaming' },
  { name: 'Appliance', slug: 'appliance' },
  { name: 'Software', slug: 'software' },
  { name: 'Servers', slug: 'servers' },
];

export function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);

  return (
    <nav className="bg-[#252b3b] border-t border-gray-700">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center gap-1 py-0 text-sm flex-wrap">
          {categories.map((category) => (
            <li
              key={category.slug}
              className="relative group"
              onMouseEnter={() => setActiveCategory(category.slug)}
              onMouseLeave={() => {
                setActiveCategory(null);
                setActiveSubCategory(null);
              }}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="block px-4 py-3 hover:text-blue-400 hover:bg-[#1a1f2e] transition-colors"
              >
                {category.name}
              </Link>

              {/* Dropdown Menu */}
              {category.hasDropdown && category.subCategories && activeCategory === category.slug && (
                <div className="absolute left-0 top-full bg-white text-gray-800 shadow-xl rounded-b-lg min-w-[220px] z-50 border border-gray-200">
                  <ul className="py-2">
                    {category.subCategories.map((subCat) => (
                      <li
                        key={subCat.slug}
                        className="relative"
                        onMouseEnter={() => setActiveSubCategory(subCat.slug)}
                        onMouseLeave={() => setActiveSubCategory(null)}
                      >
                        <Link
                          href={`/products?category=${category.slug}&sub=${subCat.slug}`}
                          className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <span>{subCat.name}</span>
                          {subCat.children && (
                            <span className="text-gray-400">›</span>
                          )}
                        </Link>

                        {/* Third Level Dropdown */}
                        {subCat.children && activeSubCategory === subCat.slug && (
                          <div className="absolute left-full top-0 bg-white text-gray-800 shadow-xl rounded-lg min-w-[200px] ml-1 border border-gray-200">
                            <ul className="py-2">
                              {subCat.children.map((child) => (
                                <li key={child.slug}>
                                  <Link
                                    href={`/products?category=${category.slug}&sub=${child.slug}`}
                                    className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
