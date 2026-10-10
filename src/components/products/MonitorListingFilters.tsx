'use client';

import { useMemo } from 'react';
import { getComponentsOverviewFilters } from '@/lib/filterConfig';
import { MONITOR_SPEC_FILTERS, monitorBrandFilter } from '@/lib/monitorFilters';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface MonitorListingFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  hideBrand?: boolean;
  contextKey: string;
}

export function MonitorListingFilters({
  priceRange,
  filterCounts = {},
  hideBrand = false,
  contextKey,
}: MonitorListingFiltersProps) {
  const filters = useMemo(() => {
    const base = getComponentsOverviewFilters();
    const brand = monitorBrandFilter(hideBrand);
    return [...base, ...(brand ? [brand] : []), ...MONITOR_SPEC_FILTERS];
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
