'use client';

import { useMemo } from 'react';
import { getComponentsOverviewFilters } from '@/lib/filterConfig';
import { ROUTER_SPEC_FILTERS, routerBrandFilter } from '@/lib/routerFilters';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface RouterListingFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  hideBrand?: boolean;
  contextKey: string;
}

export function RouterListingFilters({
  priceRange,
  filterCounts = {},
  hideBrand = false,
  contextKey,
}: RouterListingFiltersProps) {
  const filters = useMemo(() => {
    const base = getComponentsOverviewFilters();
    const brand = routerBrandFilter(hideBrand);
    return [...base, ...(brand ? [brand] : []), ...ROUTER_SPEC_FILTERS];
  }, [hideBrand]);

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
