'use client';

import { useMemo } from 'react';
import { getComponentsOverviewFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface ComponentsOverviewFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
}

export function ComponentsOverviewFilters({
  priceRange,
  filterCounts = {},
}: ComponentsOverviewFiltersProps) {
  const filters = useMemo(() => getComponentsOverviewFilters(), []);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey="components-overview"
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub']}
    />
  );
}
