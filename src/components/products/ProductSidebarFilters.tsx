'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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

  /** Drop generation/socket values that don't belong to the current brand. */
  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    filters.forEach((filter) => {
      if (filter.key === 'priceRange' || !filter.options?.length) return;
      const raw = params.get(filter.key);
      if (!raw) return;
      const allowed = new Set(filter.options.map((o) => o.value));
      const next = raw.split(',').filter((value) => allowed.has(value));
      if (next.length === raw.split(',').filter(Boolean).length) return;
      changed = true;
      if (next.length > 0) {
        params.set(filter.key, next.join(','));
      } else {
        params.delete(filter.key);
      }
    });

    if (!changed) return;
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [contextKey, filters, mounted, pathname, router, searchParams]);

  const pushFiltersToUrl = useCallback(
    (
      nextFilters: Record<string, string[]>,
      nextPriceRange: [number, number] = currentPriceRange
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      filters.forEach((filter) => {
        if (filter.key === 'priceRange') return;
        const values = nextFilters[filter.key] || [];
        if (values.length > 0) {
          params.set(filter.key, values.join(','));
        } else {
          params.delete(filter.key);
        }
      });

      if (nextPriceRange[0] !== priceRange.min) {
        params.set('minPrice', nextPriceRange[0].toString());
      } else {
        params.delete('minPrice');
      }
      if (nextPriceRange[1] !== priceRange.max) {
        params.set('maxPrice', nextPriceRange[1].toString());
      } else {
        params.delete('maxPrice');
      }

      params.set('page', '1');

      const nextQuery = params.toString();
      const currentQuery = new URLSearchParams(searchParams.toString());
      currentQuery.set('page', '1');
      // Avoid fighting mega-menu navigation with a no-op / stale filter push.
      if (nextQuery === currentQuery.toString()) {
        return;
      }

      router.push(`${pathname}?${nextQuery}`, { scroll: false });
    },
    [currentPriceRange, filters, pathname, priceRange, router, searchParams]
  );

  const handleCheckboxChange = (filterKey: string, value: string, checked: boolean) => {
    const currentValues = selectedFilters[filterKey] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    const nextFilters = { ...selectedFilters };
    if (newValues.length > 0) {
      nextFilters[filterKey] = newValues;
    } else {
      delete nextFilters[filterKey];
    }

    // Brand drives Generation/Series + Socket — clear the other family's leftovers.
    if (filterKey === 'brand') {
      delete nextFilters.generation;
      delete nextFilters.socket_type;
    }

    setSelectedFilters(nextFilters);
    pushFiltersToUrl(nextFilters);
  };

  const getCount = (filterKey: string, value: string): number => {
    return filterCounts[filterKey]?.[value] || 0;
  };

  // Open every filter section by default (Price, Brand, Chipset, etc.)
  const defaultExpandedItems = filters.map(
    (filter, index) => `${filter.key}-${index}`
  );

  /** Fine step so both thumbs can move; coarse 1000 + minStepsBetweenThumbs locks a flat catalog. */
  const PRICE_STEP = 100;
  const catalogSpan = priceRange.max - priceRange.min;
  const sliderMin = catalogSpan > 0 ? Math.min(0, priceRange.min) : 0;
  const sliderMax =
    catalogSpan > 0
      ? Math.max(priceRange.max, priceRange.min + PRICE_STEP)
      : Math.max(priceRange.max + 50_000, 100_000);

  const handlePriceChange = (range: [number, number]) => {
    setCurrentPriceRange(range);
    setPriceInputMin(range[0].toString());
    setPriceInputMax(range[1].toString());
  };

  const handlePriceCommit = (range: [number, number]) => {
    setCurrentPriceRange(range);
    setPriceInputMin(range[0].toString());
    setPriceInputMax(range[1].toString());
    pushFiltersToUrl(selectedFilters, range);
  };

  const clampPriceRange = (minRaw: string, maxRaw: string): [number, number] => {
    let min = Number(minRaw);
    let max = Number(maxRaw);

    if (isNaN(min)) min = sliderMin;
    if (isNaN(max)) max = sliderMax;

    min = Math.max(sliderMin, Math.min(min, sliderMax));
    max = Math.max(sliderMin, Math.min(max, sliderMax));

    if (min > max) {
      return [max, min];
    }
    return [min, max];
  };

  const commitPriceInputs = () => {
    const range = clampPriceRange(priceInputMin, priceInputMax);
    setCurrentPriceRange(range);
    setPriceInputMin(range[0].toString());
    setPriceInputMax(range[1].toString());
    pushFiltersToUrl(selectedFilters, range);
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setPriceInputMin(value);
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= sliderMin && numValue <= currentPriceRange[1]) {
        setCurrentPriceRange([numValue, currentPriceRange[1]]);
      }
    } else {
      setPriceInputMax(value);
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue <= sliderMax && numValue >= currentPriceRange[0]) {
        setCurrentPriceRange([currentPriceRange[0], numValue]);
      }
    }
  };

  const sliderLow = Math.min(Math.max(currentPriceRange[0], sliderMin), sliderMax);
  const sliderHigh = Math.max(
    Math.min(Math.max(currentPriceRange[1], sliderMin), sliderMax),
    sliderLow
  );
  const sliderValue: [number, number] = [sliderLow, sliderHigh];
  if (!mounted) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-400">Loading filters...</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Accordion
      key={contextKey}
      type="multiple"
      defaultValue={defaultExpandedItems}
      className="w-full space-y-3"
    >
      {filters.map((filter, index) => {
        const accordionId = `${filter.key}-${index}`;
        return (
          <AccordionItem
            key={accordionId}
            value={accordionId}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <AccordionTrigger className="px-3 py-2.5 text-sm font-semibold text-slate-800 hover:no-underline hover:text-slate-900 bg-slate-50">
              <div className="flex items-center gap-2">
                {filter.name}
                {(selectedFilters[filter.key]?.length ?? 0) > 0 && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                    {selectedFilters[filter.key]?.length ?? 0}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
                {filter.key === 'priceRange' ? (
                  <div className="space-y-3">
                    <Slider
                      min={sliderMin}
                      max={sliderMax}
                      step={PRICE_STEP}
                      value={sliderValue}
                      onValueChange={handlePriceChange}
                      onValueCommit={handlePriceCommit}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs text-muted-foreground">Min</label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ৳
                          </span>
                          <input
                            type="number"
                            value={priceInputMin}
                            onChange={(e) => handlePriceInputChange('min', e.target.value)}
                            onBlur={commitPriceInputs}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                            }}
                            className="h-9 w-full rounded-md border border-input bg-background py-1 pl-6 pr-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>
                      </div>
                      <span className="mt-5 text-xs text-muted-foreground">to</span>
                      <div className="flex-1">
                        <label className="mb-1 block text-xs text-muted-foreground">Max</label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ৳
                          </span>
                          <input
                            type="number"
                            value={priceInputMax}
                            onChange={(e) => handlePriceInputChange('max', e.target.value)}
                            onBlur={commitPriceInputs}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                            }}
                            className="h-9 w-full rounded-md border border-input bg-background py-1 pl-6 pr-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
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
  );
}
