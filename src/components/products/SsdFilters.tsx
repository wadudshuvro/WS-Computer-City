'use client';

import { useMemo } from 'react';
import { getSsdFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface SsdFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  hideBrand?: boolean;
}

export function SsdFilters({ priceRange, filterCounts = {}, hideBrand = false }: SsdFiltersProps) {
  const filters = useMemo(() => getSsdFilters(hideBrand), [hideBrand]);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey="ssd"
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type']}
    />
  );
}
