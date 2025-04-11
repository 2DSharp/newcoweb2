'use client';

import { Filter } from 'lucide-react';
import ProductGrid from '@/components/search/ProductGrid';
import FilterSidebar from '@/components/search/FilterSidebar';
import SortDropdown from '@/components/search/SortDropdown';
import ActiveFilters from '@/components/search/ActiveFilters';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import apiService from '@/services/api';

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

interface SearchResult {
  category: string;
  discount: number | null;
  image: string;
  price: number;
  processing_time: number;
  product_id: string;
  rating: number;
  rating_count: number;
  stock: string;
  tags: string;
  title: string;
  url: string;
  variant_id: string | null;
}

interface SearchResponse {
  filters: FiltersData;
  results: SearchResult[];
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<FiltersData>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({});
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const router = useRouter();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    setSearchQuery(query);
    
    // Parse URL params for filters
    const urlFilters: {[key: string]: string[]} = {};
    let urlPriceMin: number | null = null;
    let urlPriceMax: number | null = null;
    
    searchParams.forEach((value, key) => {
      if (key === 'price_min') {
        urlPriceMin = Number(value);
      } else if (key === 'price_max') {
        urlPriceMax = Number(value);
      } else if (key === 'price_range') {
        const [min, max] = value.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          urlPriceMin = min;
          urlPriceMax = max;
        }
      } else if (key !== 'q' && key !== 'sort') {
        if (!urlFilters[key]) {
          urlFilters[key] = [];
        }
        urlFilters[key].push(value);
      }
    });
    
    setSelectedFilters(urlFilters);
    
    // Set price range if both min and max are available
    if (urlPriceMin !== null && urlPriceMax !== null) {
      setPriceRange([urlPriceMin, urlPriceMax]);
    }
  }, [searchParams]);

  // Prepare API query parameters based on selected filters
  const prepareQueryParams = useCallback(() => {
    const params: Record<string, string> = { q: query };
    
    // Add category filters - preserve the exact case
    if (selectedFilters.category && selectedFilters.category.length > 0) {
      // Join category values without changing their case
      params.category = selectedFilters.category.join(',');
    }
    
    // Add rating filter (use the highest value if multiple are selected)
    if (selectedFilters.rating && selectedFilters.rating.length > 0) {
      const highestRating = selectedFilters.rating
        .map(r => r.replace('+', '')) // Remove + suffix
        .sort((a, b) => Number(b) - Number(a))[0]; // Sort numerically descending
      
      params.rating = highestRating;
      params.rating_str = `${highestRating}+`;
    }
    
    // Add price range
    if (priceRange) {
      params.price_min = priceRange[0].toString();
      params.price_max = priceRange[1].toString();
      params.price_range = `${priceRange[0]}-${priceRange[1]}`;
    }
    
    // Add other filters as needed
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (key !== 'category' && key !== 'rating' && values.length > 0) {
        params[key] = values.join(',');
      }
    });
    
    return params;
  }, [query, selectedFilters, priceRange]);

  const fetchResults = useCallback(async () => {
    if (!query) return;
    
    setLoading(true);
    try {
      // Prepare query parameters
      const queryParams = prepareQueryParams();
      console.log('Search API params:', queryParams);
      
      // Make sure we're passing the parameters correctly
      const response = await apiService.search.query(queryParams);
      console.log('Search API response:', response);
      
      // Debug: Print the exact structure of the response
      console.log('Response type:', typeof response);
      console.log('Response has results property:', response && 'results' in response);
      console.log('Response results type:', response?.results ? typeof response.results : 'undefined');
      console.log('Response results length:', response?.results?.length);
      console.log('First result item:', response?.results?.[0]);
      
      // Extract both results and filters from the response
      if (response) {
        if (Array.isArray(response)) {
          // If response is an array, use it directly as results
          console.log('Using array response directly as results');
          setResults(response || []);
        } else {
          // If response is an object with results property
          console.log('Using response.results property');
          setResults(response.results || []);
          setFilters(response.filters || {});
        }
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
      setFilters({});
    } finally {
      setLoading(false);
    }
  }, [query, prepareQueryParams]);

  useEffect(() => {
    if (query) {
      fetchResults();
    } else {
      setResults([]);
      setFilters({});
      setLoading(false);
    }
  }, [query, fetchResults]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    const newFilters = { ...selectedFilters };
    
    if (checked) {
      // Add the filter
      if (!newFilters[filterType]) {
        newFilters[filterType] = [];
      }
      if (!newFilters[filterType].includes(value)) {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
    } else {
      // Remove the filter
      if (newFilters[filterType]) {
        newFilters[filterType] = newFilters[filterType].filter(v => v !== value);
        if (newFilters[filterType].length === 0) {
          delete newFilters[filterType];
        }
      }
    }
    
    setSelectedFilters(newFilters);
    
    // Update URL with selected filters
    updateUrlWithFilters(newFilters, priceRange);
  };

  // Handle price range changes
  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    updateUrlWithFilters(selectedFilters, range);
  };
  
  // Update URL with all filters and price range
  const updateUrlWithFilters = (filters: {[key: string]: string[]}, range: [number, number] | null) => {
    const params = new URLSearchParams();
    params.set('q', query);
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, values]) => {
      values.forEach(value => {
        params.append(key, value);
      });
    });
    
    // Add price range parameters
    if (range) {
      params.set('price_min', range[0].toString());
      params.set('price_max', range[1].toString());
      params.set('price_range', `${range[0]}-${range[1]}`);
    }
    
    // Keep sort parameter if exists
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      params.set('sort', sortParam);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  // Add this console log to verify state updates
  console.log('Current state:', { 
    loading, 
    resultsCount: results.length, 
    filters, 
    selectedFilters,
    priceRange 
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-4 sm:pt-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <p className="text-sm font-bold text-gray-900">
            <span className="text-gray-500">
              {loading ? 'Searching...' : `Found ${results.length} items for "${query}"`}
            </span>
          </p>
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button with Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="h-full overflow-y-auto py-6 px-4">
                  <FilterSidebar 
                    filters={filters} 
                    onFilterChange={handleFilterChange}
                    selectedFilters={selectedFilters}
                    priceRange={priceRange}
                    onPriceRangeChange={handlePriceRangeChange}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <SortDropdown />
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-4">
              <FilterSidebar 
                filters={filters} 
                onFilterChange={handleFilterChange}
                selectedFilters={selectedFilters}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              <ActiveFilters 
                selectedFilters={selectedFilters}
                filters={filters}
                onRemoveFilter={handleFilterChange}
                priceRange={priceRange}
                onClearPriceRange={() => handlePriceRangeChange(null as any)}
              />
              
              {/* Add a fallback rendering for debugging */}
              {!loading && results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No results found for "{query}"</p>
                </div>
              ) : (
                <ProductGrid results={results} loading={loading} />
              )}
              

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}