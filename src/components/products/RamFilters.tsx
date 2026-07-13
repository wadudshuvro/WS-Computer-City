'use client';

import { useMemo } from 'react';
import { getRamFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface RamFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
}

export function RamFilters({ priceRange, filterCounts = {} }: RamFiltersProps) {
  const filters = useMemo(() => getRamFilters(), []);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey="desktop-ram"
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type']}
    />
  );
}
