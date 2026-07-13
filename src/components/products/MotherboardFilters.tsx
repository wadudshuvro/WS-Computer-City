'use client';

import { useMemo } from 'react';
import { getMotherboardFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface MotherboardFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
}

export function MotherboardFilters({ priceRange, filterCounts = {} }: MotherboardFiltersProps) {
  const filters = useMemo(() => getMotherboardFilters(), []);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey="motherboard"
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type', 'brand']}
    />
  );
}
