'use client';

import { useMemo } from 'react';
import { getPsuFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface PsuFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
}

export function PsuFilters({ priceRange, filterCounts = {} }: PsuFiltersProps) {
  const filters = useMemo(() => getPsuFilters(), []);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey="power-supply"
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type']}
    />
  );
}
