'use client';

import { Suspense } from 'react';
import { Filter } from 'lucide-react';
import ProductGrid from '@/components/search/ProductGrid';
import FilterSidebar from '@/components/search/FilterSidebar';
import SortDropdown, { SortOption, sortOptions } from '@/components/search/SortDropdown';
import ActiveFilters from '@/components/search/ActiveFilters';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
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
  tags: string | string[];
  title: string;
  url: string | null;
  variant_id: string | null;
}

interface SearchResponse {
  filters: FiltersData;
  results: SearchResult[];
}

interface SearchResultsProps {
  initialCategory?: string;
  apiData?: any; // Data from filter API (if provided)
  isLoadingProp?: boolean; // Loading state for API data
  useFilterApi?: boolean; // Flag to indicate if using filter API
}

function SearchResultsContent({ 
  initialCategory, 
  apiData, 
  isLoadingProp = false,
  useFilterApi = false 
}: SearchResultsProps = {}) {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [sortedResults, setSortedResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<FiltersData>({});
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({});
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const router = useRouter();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    setSearchQuery(query);
    
    // Parse URL params for filters
    const urlFilters: {[key: string]: string[]} = {};
    let urlPriceMin: number | null = null;
    let urlPriceMax: number | null = null;
    
    // Initialize sort from URL
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      const sortOption = sortOptions.find(opt => opt.value === sortParam);
      if (sortOption) {
        setCurrentSort(sortOption);
      }
    }
    
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
    
    // Add initialCategory if provided
    if (initialCategory && !urlFilters.category) {
      urlFilters.category = [initialCategory];
    }
    
    setSelectedFilters(urlFilters);
    
    // Set price range if both min and max are available
    if (urlPriceMin !== null && urlPriceMax !== null) {
      setPriceRange([urlPriceMin, urlPriceMax]);
    }
  }, [searchParams, initialCategory]);

  // Prepare API query parameters based on selected filters
  const prepareQueryParams = useCallback(() => {
    const params: Record<string, string> = { q: query };
    
    // Log for debugging
    console.log('[SearchResults] Preparing API params, useFilterApi =', useFilterApi);
    
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
    
    // Add sort parameter
    if (currentSort && currentSort.value !== 'relevance') {
      params.sort = currentSort.value;
    }
    
    // Add other filters as needed
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (key !== 'category' && key !== 'rating' && values.length > 0) {
        params[key] = values.join(',');
      }
    });
    
    // Log final params for debugging
    console.log('[SearchResults] Final API params:', params);
    
    return params;
  }, [query, selectedFilters, priceRange, currentSort, useFilterApi]);
  
  // Initial redirect to set URL if initialCategory is provided
  useEffect(() => {
    if (initialCategory && window.location.pathname.includes('/c/')) {
      // Create a search params object with the initial category
      const params = new URLSearchParams(window.location.search);
      
      // Log current state for debugging
      console.log('[SearchResults] URL update: initialCategory =', initialCategory);
      console.log('[SearchResults] URL update: useFilterApi =', useFilterApi);
      
      // Check if category2 is present - if it is, don't add category parameter
      const hasCategory2 = params.has('category2');
      console.log('[SearchResults] URL update: hasCategory2 =', hasCategory2);
      
      // When explicitly using category2, don't add category parameter
      if (useFilterApi) {
        console.log('[SearchResults] URL update: Using category2 mode, skipping category param');
        // Ensure we don't have a category param when using category2
        if (params.has('category')) {
          params.delete('category');
        }
      }
      // Otherwise only set category if it's not already in the URL and no category2
      else if (!params.has('category') && !hasCategory2) {
        console.log('[SearchResults] URL update: Adding category param =', initialCategory);
        params.set('category', initialCategory);
      }
      
      // Keep other existing params
      searchParams.forEach((value, key) => {
        if (!params.has(key)) {
          params.set(key, value);
        }
      });
      
      // Update URL without redirecting to keep the SEO friendly URL
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      console.log('[SearchResults] URL update: New URL =', newUrl);
      window.history.replaceState({}, '', newUrl);
    }
  }, [initialCategory, searchParams, useFilterApi]);

  const fetchResults = useCallback(async () => {
    // If we're using filter API and have data, don't fetch again
    if (useFilterApi && apiData) {
      console.log('Using provided filter API data instead of fetching');
      
      // Extract results and filters from apiData if available
      if (apiData.results) {
        setResults(apiData.results);
      }
      if (apiData.filters) {
        setFilters(apiData.filters);
      }
      
      return;
    }
    
    // Don't fetch if we're using filter API or if we have no query/category
    if (useFilterApi || (!query && !selectedFilters.category?.length)) return;
    
    setFetchLoading(true);
    try {
      // Prepare query parameters
      const queryParams = prepareQueryParams();
      console.log('Search API params:', queryParams);
      
      // Make sure we're passing the parameters correctly
      const response = await apiService.search.query(queryParams);
      console.log('Search API response:', response);
      
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
      setFetchLoading(false);
    }
  }, [query, selectedFilters.category, prepareQueryParams, useFilterApi, apiData]);

  // Initial data fetching
  useEffect(() => {
    // When using filter API and we have data, process it without calling fetchResults
    if (useFilterApi && apiData) {
      console.log('Processing filter API data directly');
      
      // Set loading state
      setFetchLoading(false);
      
      // Extract results and filters from apiData if available
      if (apiData.results) {
        setResults(apiData.results);
      }
      if (apiData.filters) {
        setFilters(apiData.filters);
      }
      
      return;
    }
    
    // For regular search API flow
    if (query || selectedFilters.category?.length) {
      fetchResults();
    } else {
      setResults([]);
      setFilters({});
      setFetchLoading(false);
    }
  }, [query, selectedFilters.category, fetchResults, useFilterApi, apiData]);

  // Use category filters if provided from the parent component
  useEffect(() => {
    if (apiData) {
      console.log('[SearchResults] Received apiData:', JSON.stringify(apiData, null, 2));
      
      try {
        // If apiData already has the correct structure, use it directly
        if (apiData.filters) {
          console.log('[SearchResults] Using apiData.filters - proper structure detected');
          setFilters(apiData.filters);
          
          // Also set results if available
          if (apiData.results) {
            setResults(apiData.results);
          }
        } 
        // If apiData has a nested structure, extract filters
        else if (apiData.data?.filters) {
          console.log('[SearchResults] Using apiData.data.filters - nested structure detected');
          setFilters(apiData.data.filters);
          
          if (apiData.data.results) {
            setResults(apiData.data.results);
          }
        }
        // Fallback - try to use as is
        else {
          console.log('[SearchResults] Using apiData as is - unknown structure');
          setFilters(prev => {
            const result = {
              ...prev,
              ...apiData
            };
            console.log('[SearchResults] Final filters structure:', result);
            return result;
          });
        }
      } catch (err) {
        console.error('[SearchResults] Error processing filters:', err);
      }
    }
  }, [apiData]);

  // Apply client-side sorting to results
  useEffect(() => {
    if (!results.length) {
      setSortedResults([]);
      return;
    }

    let sorted = [...results];
    
    switch (currentSort.value) {
      case 'price-low':
        sorted = sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted = sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Since we don't have a date field, we're assuming product_id might contain timestamp info
        // This is a placeholder - adjust based on actual data
        sorted = sorted.sort((a, b) => b.product_id.localeCompare(a.product_id));
        break;
      case 'rating':
        sorted = sorted.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'relevance' - don't sort, use API's default order
        break;
    }
    
    setSortedResults(sorted);
  }, [results, currentSort]);

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
    updateUrlWithFilters(newFilters, priceRange, currentSort);
  };

  // Handle price range changes
  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    updateUrlWithFilters(selectedFilters, range, currentSort);
  };
  
  // Handle sort changes
  const handleSortChange = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
    updateUrlWithFilters(selectedFilters, priceRange, sortOption);
  };
  
  // Update URL with all filters and price range
  const updateUrlWithFilters = (
    filters: {[key: string]: string[]}, 
    range: [number, number] | null,
    sort: SortOption
  ) => {
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
    
    // Add sort parameter if it's not the default (relevance)
    if (sort && sort.value !== 'relevance') {
      params.set('sort', sort.value);
    }
    
    // If we came from a category page, maintain the current URL structure
    if (initialCategory && window.location.pathname.includes('/c/')) {
      // Just update the search params portion without changing the path
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    } else {
      router.push(`/search?${params.toString()}`);
    }
  };

  // Add this console log to verify state updates
  console.log('Current state:', { 
    fetchLoading, 
    resultsCount: results.length, 
    sortedResultsCount: sortedResults.length,
    filters, 
    selectedFilters,
    priceRange,
    currentSort,
    initialCategory
  });

  // Determine overall loading state
  const isLoading = fetchLoading || isLoadingProp;

  return (
    <div className="min-h-screen bg-gray-50 pt-4 sm:pt-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <p className="text-sm font-bold text-gray-900">
            <span className="text-gray-500">
              {isLoading ? 'Searching...' : `Found ${results.length} items${initialCategory ? ` in ${initialCategory}` : query ? ` for "${query}"` : ''}`}
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
            <SortDropdown onSortChange={handleSortChange} />
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
              
              {/* Show loading or results */}
              {isLoading && (
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">
                      {isLoading ? 'Loading...' : 'Searching...'}
                    </p>
                  </div>
                </div>
              )}
              {!isLoading && sortedResults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {initialCategory 
                      ? `No products found in "${initialCategory}"` 
                      : query 
                        ? `No results found for "${query}"` 
                        : 'No results found'}
                  </p>
                </div>
              ) : (
                <ProductGrid results={sortedResults.length ? sortedResults : results} loading={fetchLoading} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchResults(props: SearchResultsProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>}>
      <SearchResultsContent {...props} />
    </Suspense>
  );
}