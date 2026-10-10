'use client';

import { useMemo } from 'react';
import { getComponentsOverviewFilters } from '@/lib/filterConfig';
import { KEYBOARD_SPEC_FILTERS } from '@/lib/keyboardFilters';
import { findGadgetLeaf } from '@/lib/gadgetCatalog';
import type { FilterDefinition } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface CatalogListingFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  subSlug?: string | null;
  contextKey: string;
  hideBrand?: boolean;
}

export function CatalogListingFilters({
  priceRange,
  filterCounts = {},
  subSlug,
  contextKey,
  hideBrand = false,
}: CatalogListingFiltersProps) {
  const filters = useMemo(() => {
    const base = getComponentsOverviewFilters();
    const extra: FilterDefinition[] = [];
    if (subSlug === 'keyboard') extra.push(...KEYBOARD_SPEC_FILTERS);
    const gadgetLeaf = findGadgetLeaf(subSlug);
    if (gadgetLeaf) {
      if (!hideBrand && gadgetLeaf.brands.length > 0) {
        extra.push({
          key: 'brand',
          name: 'Brand',
          type: 'checkbox',
          defaultExpanded: true,
          options: gadgetLeaf.brands.map((brand) => ({ value: brand.slug, label: brand.label })),
        });
      }
      extra.push(...gadgetLeaf.filters);
    }
    return [...base, ...extra];
  }, [hideBrand, subSlug]);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey={contextKey}
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'brand']}
    />
  );
}
