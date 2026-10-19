'use client';

import { useMemo } from 'react';
import { getComponentsOverviewFilters } from '@/lib/filterConfig';
import { UPS_SPEC_FILTERS } from '@/lib/upsCatalog';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface UpsListingFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  contextKey: string;
}

/** Star Tech UPS sidebar: Price Range, Availability, Volt Ampere, Load Capacity, Body Material. Brands are the pills above. */
export function UpsListingFilters({ priceRange, filterCounts = {}, contextKey }: UpsListingFiltersProps) {
  const filters = useMemo(() => [...getComponentsOverviewFilters(), ...UPS_SPEC_FILTERS], []);

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
