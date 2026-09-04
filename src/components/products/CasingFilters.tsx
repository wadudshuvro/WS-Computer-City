'use client';

import { useMemo } from 'react';
import { getCasingFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface CasingFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
}

export function CasingFilters({ priceRange, filterCounts = {} }: CasingFiltersProps) {
  const filters = useMemo(() => getCasingFilters(), []);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey="computer-case"
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type']}
    />
  );
}
