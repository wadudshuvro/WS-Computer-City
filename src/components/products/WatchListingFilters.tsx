'use client';

import { useMemo } from 'react';
import { getComponentsOverviewFilters } from '@/lib/filterConfig';
import { WATCH_SPEC_FILTERS, watchBrandFilter } from '@/lib/watchFilters';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface WatchListingFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  hideBrand?: boolean;
  contextKey: string;
}

export function WatchListingFilters({
  priceRange,
  filterCounts = {},
  hideBrand = false,
  contextKey,
}: WatchListingFiltersProps) {
  const filters = useMemo(() => {
    const base = getComponentsOverviewFilters();
    const brand = watchBrandFilter(hideBrand);
    return [...base, ...(brand ? [brand] : []), ...WATCH_SPEC_FILTERS];
  }, [hideBrand]);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey={contextKey}
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'brand']}
    />
  );
}
