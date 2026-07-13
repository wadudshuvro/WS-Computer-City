'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FilterDefinition } from '@/lib/filterConfig';

interface FilterCounts {
  [key: string]: {
    [value: string]: number;
  };
}

interface ProductSidebarFiltersProps {
  filters: FilterDefinition[];
  contextKey?: string;
  priceRange: { min: number; max: number };
  filterCounts?: FilterCounts;
  preserveParamKeys?: string[];
}

export function ProductSidebarFilters({
  filters,
  contextKey = 'default',
  priceRange,
  filterCounts = {},
  preserveParamKeys = ['category', 'sub', 'brand', 'type'],
}: ProductSidebarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([
    priceRange.min,
    priceRange.max,
  ]);
  const [priceInputMin, setPriceInputMin] = useState(priceRange.min.toString());
  const [priceInputMax, setPriceInputMax] = useState(priceRange.max.toString());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const nextFilters: Record<string, string[]> = {};

    filters.forEach((filter) => {
      if (filter.key === 'priceRange') return;
      const value = searchParams.get(filter.key);
      if (value) {
        nextFilters[filter.key] = value.split(',');
      }
    });

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    setSelectedFilters(nextFilters);
    setCurrentPriceRange([
      minPrice ? Number(minPrice) : priceRange.min,
      maxPrice ? Number(maxPrice) : priceRange.max,
    ]);
    setPriceInputMin(minPrice || priceRange.min.toString());
    setPriceInputMax(maxPrice || priceRange.max.toString());
  }, [searchParams, priceRange, filters]);

  useEffect(() => {
    setSelectedFilters((prev) => {
      const validKeys = new Set(filters.map((f) => f.key));
      const validValues: Record<string, Set<string>> = {};
      filters.forEach((filter) => {
        if (filter.options) {
          const existing = validValues[filter.key] ?? new Set<string>();
          filter.options.forEach((o) => existing.add(o.value));
          validValues[filter.key] = existing;
        }
      });

      const next: Record<string, string[]> = {};
      let changed = false;

      Object.entries(prev).forEach(([key, values]) => {
        if (!validKeys.has(key)) {
          changed = true;
          return;
        }
        const allowed = validValues[key];
        const filtered = allowed ? values.filter((v) => allowed.has(v)) : values;
        if (filtered.length !== values.length) changed = true;
        if (filtered.length > 0) next[key] = filtered;
      });

      return changed ? next : prev;
    });
  }, [contextKey, filters]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });

    if (currentPriceRange[0] !== priceRange.min) {
      params.set('minPrice', currentPriceRange[0].toString());
    } else {
      params.delete('minPrice');
    }
    if (currentPriceRange[1] !== priceRange.max) {
      params.set('maxPrice', currentPriceRange[1].toString());
    } else {
      params.delete('maxPrice');
    }

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedFilters, currentPriceRange, priceRange, pathname, router, searchParams]);

  const handleCheckboxChange = (filterKey: string, value: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      return { ...prev, [filterKey]: newValues };
    });
  };

  const handlePriceChange = (values: [number, number]) => {
    setCurrentPriceRange(values);
    setPriceInputMin(values[0].toString());
    setPriceInputMax(values[1].toString());
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setPriceInputMin(value);
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= priceRange.min && numValue < currentPriceRange[1]) {
        setCurrentPriceRange([numValue, currentPriceRange[1]]);
      }
    } else {
      setPriceInputMax(value);
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue <= priceRange.max && numValue > currentPriceRange[0]) {
        setCurrentPriceRange([currentPriceRange[0], numValue]);
      }
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setCurrentPriceRange([priceRange.min, priceRange.max]);
    setPriceInputMin(priceRange.min.toString());
    setPriceInputMax(priceRange.max.toString());

    const params = new URLSearchParams();
    preserveParamKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) params.set(key, value);
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const clearFilter = (filterKey: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const hasActiveFilters =
    Object.values(selectedFilters).some((values) => values.length > 0) ||
    currentPriceRange[0] !== priceRange.min ||
    currentPriceRange[1] !== priceRange.max;

  const getCount = (filterKey: string, value: string): number => {
    return filterCounts[filterKey]?.[value] || 0;
  };

  const defaultExpandedItems = filters
    .map((f, index) => ({ filter: f, index }))
    .filter(({ filter }) => filter.defaultExpanded)
    .map(({ filter, index }) => `${filter.key}-${index}`);

  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <p className="text-sm text-gray-500 mt-3">Loading filters...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="p-4">
        <Accordion
          key={contextKey}
          type="multiple"
          defaultValue={defaultExpandedItems}
          className="w-full space-y-0"
        >
          {filters.map((filter, index) => {
            const accordionId = `${filter.key}-${index}`;
            return (
            <AccordionItem key={accordionId} value={accordionId} className="border-b-0">
              <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-gray-900">
                <div className="flex items-center gap-2">
                  {filter.name}
                  {(selectedFilters[filter.key]?.length ?? 0) > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      {selectedFilters[filter.key]?.length ?? 0}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {filter.key === 'priceRange' ? (
                  <div className="space-y-4">
                    <Slider
                      min={priceRange.min}
                      max={priceRange.max}
                      step={1000}
                      value={currentPriceRange}
                      onValueChange={handlePriceChange}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Min</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            ৳
                          </span>
                          <input
                            type="number"
                            value={priceInputMin}
                            onChange={(e) => handlePriceInputChange('min', e.target.value)}
                            className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <span className="text-gray-400 mt-5">to</span>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Max</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            ৳
                          </span>
                          <input
                            type="number"
                            value={priceInputMax}
                            onChange={(e) => handlePriceInputChange('max', e.target.value)}
                            className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {filter.showClearButton && (selectedFilters[filter.key]?.length ?? 0) > 0 && (
                      <button
                        onClick={() => clearFilter(filter.key)}
                        className="text-xs text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Clear All
                      </button>
                    )}
                    {filter.options?.map((option) => {
                      const count = getCount(filter.key, option.value);
                      const isChecked =
                        selectedFilters[filter.key]?.includes(option.value) || false;

                      return (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 hover:bg-gray-50 rounded px-1 py-1"
                        >
                          <Checkbox
                            id={`${accordionId}-${option.value}`}
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(filter.key, option.value, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`${accordionId}-${option.value}`}
                            className="text-sm text-gray-600 cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{option.label}</span>
                            {count > 0 && (
                              <span className="text-gray-400 text-xs">({count})</span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
