'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { PriceRangeSlider } from './PriceRangeSlider';
import { useSearchParams } from 'next/navigation';

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

interface FilterSidebarProps {
  filters?: FiltersData;
  onFilterChange?: (filterType: string, value: string, checked: boolean) => void;
  selectedFilters?: {[key: string]: string[]};
  priceRange?: [number, number] | null;
  onPriceRangeChange?: (range: [number, number]) => void;
}

// Predefined price ranges
const PRICE_RANGES = [
  { min: 0, max: 500, label: '₹0 - ₹500' },
  { min: 500, max: 1000, label: '₹500 - ₹1000' },
  { min: 1000, max: 2000, label: '₹1000 - ₹2000' },
  { min: 2000, max: 5000, label: '₹2000 - ₹5000' },
  { min: 5000, max: 10000, label: '₹5000+' }
];

export default function FilterSidebar({ 
  filters = {}, 
  onFilterChange, 
  selectedFilters = {},
  priceRange = null,
  onPriceRangeChange
}: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const searchParams = useSearchParams();
  
  // Debug log - Check received filters
  useEffect(() => {
    console.log('FilterSidebar received filters:', JSON.stringify(filters));
  }, [filters]);
  
  // Default price range values
  const DEFAULT_MIN_PRICE = 0;
  const DEFAULT_MAX_PRICE = 10000;
  const DEFAULT_STEP = 100;

  useEffect(() => {
    // Initialize expanded sections with all filter keys
    if (Object.keys(filters).length > 0 && expanded.length === 0) {
      console.log('Expanding filter sections:', Object.keys(filters));
      setExpanded(Object.keys(filters));
    }
  }, [filters, expanded.length]);

  const toggleSection = (section: string) => {
    setExpanded(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleCheckboxChange = (filterType: string, value: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (onFilterChange) {
      onFilterChange(filterType, value, event.target.checked);
    }
  };

  // Check if a filter is currently selected
  const isFilterSelected = (filterType: string, value: string) => {
    return selectedFilters[filterType]?.includes(value) || false;
  };

  // Handle price range changes
  const handlePriceRangeChange = (range: [number, number]) => {
    if (onPriceRangeChange) {
      onPriceRangeChange(range);
    }
  };

  // Handle price range link click
  const handlePriceRangeClick = (min: number, max: number) => {
    if (onPriceRangeChange) {
      onPriceRangeChange([min, max]);
    }
  };

  // Reset price range to default
  const resetPriceRange = () => {
    if (onPriceRangeChange) {
      onPriceRangeChange(null as any);
    }
  };

  // Check if a price range is currently selected
  const isPriceRangeSelected = (min: number, max: number) => {
    if (!priceRange) return false;
    // Special case for "5000+" range
    if (max === 10000 && min === 5000) {
      return priceRange[0] >= 5000;
    }
    return priceRange[0] === min && priceRange[1] === max;
  };

  // Check if any price filter is active
  const isPriceFilterActive = priceRange !== null;

  // Sort filters by order field (if present)
  const sortedFilterEntries = Object.entries(filters).sort((a, b) => {
    const orderA = a[1]?.order !== undefined ? a[1].order : Number.MAX_SAFE_INTEGER;
    const orderB = b[1]?.order !== undefined ? b[1].order : Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  // Debug log - Check sorted filters
  useEffect(() => {
    if (sortedFilterEntries.length > 0) {
      console.log('Sorted filter entries:', sortedFilterEntries.map(([key]) => key).join(', '));
    }
  }, [sortedFilterEntries]);

  // Find the min and max prices for the price filter if available
  const priceFilter = filters.price;
  const priceOptions = priceFilter?.options || [];
  
  // Get min and max price from filter options or use defaults
  let minPrice = DEFAULT_MIN_PRICE;
  let maxPrice = DEFAULT_MAX_PRICE;
  
  if (priceOptions.length > 0) {
    // Try to extract min/max from price ranges like "100-500"
    const ranges = priceOptions.map(option => {
      const match = option.value.match(/(\d+)-(\d+)/);
      if (match) {
        return [parseInt(match[1]), parseInt(match[2])];
      }
      return null;
    }).filter(range => range !== null) as number[][];
    
    if (ranges.length > 0) {
      minPrice = Math.min(...ranges.map(range => range[0]));
      maxPrice = Math.max(...ranges.map(range => range[1]));
    }
  }

  return (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
          {isPriceFilterActive && (
            <button 
              onClick={resetPriceRange}
              className="inline-flex items-center text-xs text-primary hover:text-primary/90"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Reset
            </button>
          )}
        </div>
        
        {/* Price Range Slider */}
        <div className="mb-4">
          <PriceRangeSlider 
            min={minPrice}
            max={maxPrice}
            step={DEFAULT_STEP}
            initialValue={priceRange || [minPrice, maxPrice]}
            onRangeChange={handlePriceRangeChange}
          />
        </div>
        
        {/* Price Range Links */}
        <div className="mt-6 border-t pt-3">
          <div className="space-y-1">
            {PRICE_RANGES.map((range, index) => (
              <button
                key={`price-range-${index}`}
                className={`w-full text-left py-1 px-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                  isPriceRangeSelected(range.min, range.max) 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-700'
                }`}
                onClick={() => handlePriceRangeClick(range.min, range.max)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic filters from API response */}
      {sortedFilterEntries.map(([key, section]) => {
        // Skip rendering if section is undefined or not properly formed
        if (!section || key === undefined) return null;
        
        // Skip price filter as we're using the price slider for it
        if (key.toLowerCase() === 'price') return null;
        
        // Skip sections with no options
        if (!section.options || section.options.length === 0) return null;
        
        return (
          <div key={key} className="border-b pb-6">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => toggleSection(key)}
            >
              <h3 className="text-sm font-semibold text-gray-900">{section.name || key}</h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expanded.includes(key) ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            {expanded.includes(key) && (
              <div className="mt-4 space-y-3">
                {section.options.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={isFilterSelected(key, option.value)}
                      onChange={(e) => handleCheckboxChange(key, option.value, e)}
                    />
                    <span className="ml-3 text-sm text-gray-600">
                      {option.label}
                      {option.count > 0 && (
                        <span className="ml-1 text-gray-400">({option.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
      
      {Object.keys(filters).length === 0 && (
        <div className="text-sm text-gray-500 py-4">
          No filters available for this search
        </div>
      )}
    </div>
  );
}