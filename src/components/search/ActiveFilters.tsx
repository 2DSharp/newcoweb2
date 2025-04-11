'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface FilterSection {
  name: string;
  options: FilterOption[];
  order?: number;
}

interface FiltersData {
  [key: string]: FilterSection;
}

interface ActiveFiltersProps {
  selectedFilters: {[key: string]: string[]};
  filters: FiltersData;
  onRemoveFilter: (filterType: string, value: string, checked: boolean) => void;
  priceRange?: [number, number] | null;
  onClearPriceRange?: () => void;
}

export default function ActiveFilters({ 
  selectedFilters, 
  filters, 
  onRemoveFilter,
  priceRange,
  onClearPriceRange
}: ActiveFiltersProps) {
  // Check if there are any active filters
  const hasActiveFilters = Object.keys(selectedFilters).length > 0 || (priceRange !== null && priceRange !== undefined);
  
  // Function to get filter label from its value
  const getFilterLabel = (filterType: string, value: string): string => {
    const section = filters[filterType];
    if (section) {
      const option = section.options.find(opt => opt.value === value);
      if (option) {
        return option.label;
      }
    }
    return value;
  };

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Sort filter types by their order property
  const sortedFilterTypes = Object.keys(selectedFilters).sort((a, b) => {
    const orderA = filters[a]?.order !== undefined ? filters[a].order! : Number.MAX_SAFE_INTEGER;
    const orderB = filters[b]?.order !== undefined ? filters[b].order! : Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  if (!hasActiveFilters) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Active filters:</span>
        
        {/* Regular filters */}
        {sortedFilterTypes.map(filterType => (
          selectedFilters[filterType].map(value => (
            <Badge 
              key={`${filterType}-${value}`} 
              variant="outline" 
              className="flex items-center gap-1 px-2 py-1 bg-gray-50"
            >
              <span className="text-xs font-medium capitalize">
                {filters[filterType]?.name}: {getFilterLabel(filterType, value)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onRemoveFilter(filterType, value, false)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          ))
        ))}
        
        {/* Price range filter */}
        {priceRange && (
          <Badge 
            key="price-range"
            variant="outline" 
            className="flex items-center gap-1 px-2 py-1 bg-gray-50"
          >
            <span className="text-xs font-medium capitalize">
              Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={onClearPriceRange}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear price range</span>
            </Button>
          </Badge>
        )}
        
        {/* Clear all button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={() => {
              // Clear all filters by calling onRemoveFilter for each selected filter
              Object.entries(selectedFilters).forEach(([filterType, values]) => {
                values.forEach(value => {
                  onRemoveFilter(filterType, value, false);
                });
              });
              
              // Clear price range if set
              if (priceRange && onClearPriceRange) {
                onClearPriceRange();
              }
            }}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}