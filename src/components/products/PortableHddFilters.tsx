'use client';

import { useMemo } from 'react';
import { getPortableHddFilters } from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

export function PortableHddFilters({
  priceRange,
  filterCounts = {},
  hideBrand = false,
}: {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  hideBrand?: boolean;
}) {
  const filters = useMemo(() => getPortableHddFilters(hideBrand), [hideBrand]);
  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey={`portable-hdd-${hideBrand ? 'brand' : 'all'}`}
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type']}
    />
  );
}
