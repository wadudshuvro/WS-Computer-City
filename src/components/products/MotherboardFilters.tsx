'use client';

import { useMemo } from 'react';
import {
  getMotherboardFilters,
  type MotherboardFilterContext,
} from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface MotherboardFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  filterContext?: MotherboardFilterContext;
}

export function MotherboardFilters({
  priceRange,
  filterCounts = {},
  filterContext = { platform: 'all', hideBrand: false, hideProcessorType: false },
}: MotherboardFiltersProps) {
  const filters = useMemo(
    () => getMotherboardFilters(filterContext),
    [filterContext.platform, filterContext.hideBrand, filterContext.hideProcessorType]
  );

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey={`motherboard-${filterContext.platform}-${filterContext.hideBrand}-${filterContext.hideProcessorType}`}
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type', 'brand']}
    />
  );
}
