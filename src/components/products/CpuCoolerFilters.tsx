'use client';

import { useMemo } from 'react';
import { getCpuCoolerFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface CpuCoolerFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
}

export function CpuCoolerFilters({ priceRange, filterCounts = {} }: CpuCoolerFiltersProps) {
  const filters = useMemo(() => getCpuCoolerFilters(), []);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey="cpu-cooler"
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type']}
    />
  );
}
