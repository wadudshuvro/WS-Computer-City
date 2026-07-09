'use client';

import { useMemo } from 'react';
import { getGpuFilters, type GpuChipsetBrand } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface GpuFiltersProps {
  chipsetBrand: GpuChipsetBrand;
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
}

export function GpuFilters({ chipsetBrand, priceRange, filterCounts = {} }: GpuFiltersProps) {
  const filters = useMemo(() => getGpuFilters(chipsetBrand), [chipsetBrand]);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey={chipsetBrand}
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type']}
    />
  );
}
