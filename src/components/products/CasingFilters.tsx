'use client';

import { useMemo } from 'react';
import { getCasingFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface CasingFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  hideBrand?: boolean;
}

export function CasingFilters({ priceRange, filterCounts = {}, hideBrand = false }: CasingFiltersProps) {
  const filters = useMemo(() => getCasingFilters({ hideBrand }), [hideBrand]);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey={`computer-case-${hideBrand ? 'brand' : 'all'}`}
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type']}
    />
  );
}
