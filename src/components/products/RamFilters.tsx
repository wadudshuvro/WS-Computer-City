'use client';

import { useMemo } from 'react';
import {
  getRamFilters,
  type RamFilterContext,
} from '@/lib/filterConfig';
import { ProductSidebarFilters } from '@/components/products/ProductSidebarFilters';

interface RamFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: Record<string, Record<string, number>>;
  filterContext?: RamFilterContext;
}

export function RamFilters({
  priceRange,
  filterCounts = {},
  filterContext = { hideBrand: false },
}: RamFiltersProps) {
  const filters = useMemo(() => {
    const defs = getRamFilters(filterContext);

    // When a brand pill is active, only show options that exist for that brand (Star Tech).
    if (!filterContext.hideBrand || Object.keys(filterCounts).length === 0) {
      return defs;
    }

    return defs
      .map((filter) => {
        if (filter.type !== 'checkbox' || !filter.options) return filter;
        if (filter.key === 'stockStatus') return filter;

        const counts = filterCounts[filter.key] || {};
        const scopedOptions = filter.options.filter((o) => (counts[o.value] || 0) > 0);
        if (scopedOptions.length === 0) return null;
        return { ...filter, options: scopedOptions };
      })
      .filter((filter): filter is NonNullable<typeof filter> => filter != null);
  }, [filterContext.hideBrand, filterCounts]);

  return (
    <ProductSidebarFilters
      filters={filters}
      contextKey={`ram-${filterContext.kind || 'desktop'}-${filterContext.hideBrand ? 'brand' : 'all'}`}
      priceRange={priceRange}
      filterCounts={filterCounts}
      preserveParamKeys={['category', 'sub', 'type', 'brand']}
    />
  );
}
