'use client';

import { useMemo } from 'react';
import { getHddFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface HddFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  hideBrand?: boolean;
}

export function HddFilters({ priceRange, filterCounts = {}, hideBrand = false }: HddFiltersProps) {
  const filters = useMemo(() => getHddFilters(hideBrand), [hideBrand]);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey={`hdd-${hideBrand ? 'brand' : 'all'}`}
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type']}
    />
  );
}
