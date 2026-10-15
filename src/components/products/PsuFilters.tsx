'use client';

import { useMemo } from 'react';
import { getPsuFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface PsuFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  hideBrand?: boolean;
}

export function PsuFilters({ priceRange, filterCounts = {}, hideBrand = false }: PsuFiltersProps) {
  const filters = useMemo(() => getPsuFilters(hideBrand), [hideBrand]);

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
