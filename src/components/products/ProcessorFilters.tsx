'use client';

import { useMemo } from 'react';
import { getProcessorFilters, type ProcessorBrand } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface ProcessorFiltersProps {
  brand: ProcessorBrand;
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
}

export function ProcessorFilters({ brand, priceRange, filterCounts = {} }: ProcessorFiltersProps) {
  const filters = useMemo(() => getProcessorFilters(brand), [brand]);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey={brand}
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'brand', 'type']}
    />
  );
}
