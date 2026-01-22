'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronRight, X } from 'lucide-react';
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
import { processorFilters, FilterDefinition } from '@/lib/filterConfig';

interface FilterCounts {
  [key: string]: {
    [value: string]: number;
  };
}

interface ProcessorFiltersProps {
  priceRange: { min: number; max: number };
  filterCounts?: FilterCounts;
}

export function ProcessorFilters({ priceRange, filterCounts = {} }: ProcessorFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for all filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([
    priceRange.min,
    priceRange.max,
  ]);
  const [priceInputMin, setPriceInputMin] = useState(priceRange.min.toString());
  const [priceInputMax, setPriceInputMax] = useState(priceRange.max.toString());

  // Initialize from URL params
  useEffect(() => {
    const filters: Record<string, string[]> = {};
    
    processorFilters.forEach((filter) => {
      if (filter.key === 'priceRange') return;
      
      const value = searchParams.get(filter.key);
      if (value) {
        filters[filter.key] = value.split(',');
      }
    });

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    setSelectedFilters(filters);
    setCurrentPriceRange([
      minPrice ? Number(minPrice) : priceRange.min,
      maxPrice ? Number(maxPrice) : priceRange.max,
    ]);
    setPriceInputMin(minPrice || priceRange.min.toString());
    setPriceInputMax(maxPrice || priceRange.max.toString());
  }, [searchParams, priceRange]);

  // Apply filters to URL
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Preserve existing category params
    if (!params.has('category') && !params.has('sub')) {
      params.set('sub', 'processor');
    }

    // Add all selected filters
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });

    // Add price range if changed
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

    // Reset to page 1
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedFilters, currentPriceRange, priceRange, pathname, router, searchParams]);

  // Handle checkbox change
  const handleCheckboxChange = (filterKey: string, value: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterKey] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
      
      return {
        ...prev,
        [filterKey]: newValues,
      };
    });
  };

  // Handle price range change
  const handlePriceChange = (values: [number, number]) => {
    setCurrentPriceRange(values);
    setPriceInputMin(values[0].toString());
    setPriceInputMax(values[1].toString());
  };

  // Handle price input change
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

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({});
    setCurrentPriceRange([priceRange.min, priceRange.max]);
    setPriceInputMin(priceRange.min.toString());
    setPriceInputMax(priceRange.max.toString());
    
    // Preserve category params when clearing
    const params = new URLSearchParams();
    const category = searchParams.get('category');
    const sub = searchParams.get('sub');
    if (category) params.set('category', category);
    if (sub) params.set('sub', sub);
    
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  // Clear specific filter section
  const clearFilter = (filterKey: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    Object.values(selectedFilters).some((values) => values.length > 0) ||
    currentPriceRange[0] !== priceRange.min ||
    currentPriceRange[1] !== priceRange.max;

  // Get count for filter value
  const getCount = (filterKey: string, value: string): number => {
    return filterCounts[filterKey]?.[value] || 0;
  };

  // Get default expanded accordion items
  const defaultExpandedItems = processorFilters
    .filter((f) => f.defaultExpanded)
    .map((f) => f.key);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
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

      {/* Filter Sections */}
      <div className="p-4">
        <Accordion
          type="multiple"
          defaultValue={defaultExpandedItems}
          className="w-full space-y-0"
        >
          {processorFilters.map((filter) => (
            <AccordionItem key={filter.key} value={filter.key} className="border-b-0">
              <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-gray-900">
                <div className="flex items-center gap-2">
                  {filter.name}
                  {selectedFilters[filter.key]?.length > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      {selectedFilters[filter.key].length}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {filter.key === 'priceRange' ? (
                  // Price Range Filter
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
                  // Checkbox Filters
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {filter.showClearButton && selectedFilters[filter.key]?.length > 0 && (
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
                      const isChecked = selectedFilters[filter.key]?.includes(option.value) || false;

                      return (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 hover:bg-gray-50 rounded px-1 py-1"
                        >
                          <Checkbox
                            id={`${filter.key}-${option.value}`}
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(filter.key, option.value, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`${filter.key}-${option.value}`}
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
          ))}
        </Accordion>
      </div>

      {/* Apply Button */}
      <div className="p-4 border-t border-gray-200">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
