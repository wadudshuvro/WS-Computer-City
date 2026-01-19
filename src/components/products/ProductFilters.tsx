'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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

interface FilterOption {
  slug?: string;
  value?: string;
  name?: string;
  status?: string;
  count: number;
}

interface SpecificationFilter {
  key: string;
  name: string;
  unit: string | null;
  values: Array<{ value: string; count: number }>;
}

interface Filters {
  brands: FilterOption[];
  priceRange: { min: number; max: number };
  stockStatuses: FilterOption[];
  specifications: SpecificationFilter[];
}

interface ProductFiltersProps {
  filters: Filters;
}

export function ProductFilters({ filters }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStockStatuses, setSelectedStockStatuses] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceRange.min,
    filters.priceRange.max,
  ]);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string[]>>({});

  // Initialize from URL params
  useEffect(() => {
    const brands = searchParams.get('brand')?.split(',') || [];
    const stockStatuses = searchParams.get('stockStatus')?.split(',') || [];
    const minPrice = searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : filters.priceRange.min;
    const maxPrice = searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : filters.priceRange.max;

    setSelectedBrands(brands);
    setSelectedStockStatuses(stockStatuses);
    setPriceRange([minPrice, maxPrice]);

    // Load specification filters
    const specs: Record<string, string[]> = {};
    filters.specifications.forEach((spec) => {
      const value = searchParams.get(spec.key);
      if (value) {
        specs[spec.key] = value.split(',');
      }
    });
    setSelectedSpecs(specs);
  }, [searchParams, filters]);

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Brand filter
    if (selectedBrands.length > 0) {
      params.set('brand', selectedBrands.join(','));
    } else {
      params.delete('brand');
    }

    // Stock status filter
    if (selectedStockStatuses.length > 0) {
      params.set('stockStatus', selectedStockStatuses.join(','));
    } else {
      params.delete('stockStatus');
    }

    // Price range filter
    if (priceRange[0] !== filters.priceRange.min) {
      params.set('minPrice', priceRange[0].toString());
    } else {
      params.delete('minPrice');
    }

    if (priceRange[1] !== filters.priceRange.max) {
      params.set('maxPrice', priceRange[1].toString());
    } else {
      params.delete('maxPrice');
    }

    // Specification filters
    Object.entries(selectedSpecs).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    router.push(pathname);
  };

  // Handle brand checkbox
  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandSlug]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brandSlug));
    }
  };

  // Handle stock status checkbox
  const handleStockStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStockStatuses([...selectedStockStatuses, status]);
    } else {
      setSelectedStockStatuses(selectedStockStatuses.filter((s) => s !== status));
    }
  };

  // Handle specification checkbox
  const handleSpecChange = (specKey: string, value: string, checked: boolean) => {
    const currentValues = selectedSpecs[specKey] || [];
    if (checked) {
      setSelectedSpecs({
        ...selectedSpecs,
        [specKey]: [...currentValues, value],
      });
    } else {
      setSelectedSpecs({
        ...selectedSpecs,
        [specKey]: currentValues.filter((v) => v !== value),
      });
    }
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedStockStatuses.length > 0 ||
    priceRange[0] !== filters.priceRange.min ||
    priceRange[1] !== filters.priceRange.max ||
    Object.values(selectedSpecs).some((values) => values.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['brands', 'price', 'stock']} className="w-full">
        {/* Brand Filter */}
        {filters.brands.length > 0 && (
          <AccordionItem value="brands">
            <AccordionTrigger>Brand</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filters.brands.map((brand) => (
                  <div key={brand.slug} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.slug}`}
                      checked={selectedBrands.includes(brand.slug!)}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand.slug!, checked as boolean)
                      }
                    />
                    <Label htmlFor={`brand-${brand.slug}`} className="text-sm cursor-pointer flex-1">
                      {brand.name} <span className="text-muted-foreground">({brand.count})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                min={filters.priceRange.min}
                max={filters.priceRange.max}
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span>৳{priceRange[0].toLocaleString('en-BD')}</span>
                <span>৳{priceRange[1].toLocaleString('en-BD')}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Stock Status Filter */}
        {filters.stockStatuses.length > 0 && (
          <AccordionItem value="stock">
            <AccordionTrigger>Availability</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {filters.stockStatuses.map((status) => (
                  <div key={status.status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`stock-${status.status}`}
                      checked={selectedStockStatuses.includes(status.status!)}
                      onCheckedChange={(checked) =>
                        handleStockStatusChange(status.status!, checked as boolean)
                      }
                    />
                    <Label htmlFor={`stock-${status.status}`} className="text-sm cursor-pointer flex-1">
                      {status.status?.replace('_', ' ')}{' '}
                      <span className="text-muted-foreground">({status.count})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Dynamic Specification Filters */}
        {filters.specifications.map((spec) => (
          <AccordionItem key={spec.key} value={spec.key}>
            <AccordionTrigger>{spec.name}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {spec.values.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${spec.key}-${option.value}`}
                      checked={(selectedSpecs[spec.key] || []).includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleSpecChange(spec.key, option.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`${spec.key}-${option.value}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {option.value} {spec.unit && `${spec.unit}`}{' '}
                      <span className="text-muted-foreground">({option.count})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </div>
  );
}
