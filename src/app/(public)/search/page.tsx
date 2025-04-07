'use client';

import { Filter } from 'lucide-react';
import ProductGrid from '@/components/search/ProductGrid';
import FilterSidebar from '@/components/search/FilterSidebar';
import SortDropdown from '@/components/search/SortDropdown';
import ActiveFilters from '@/components/search/ActiveFilters';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiService from '@/services/api';

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

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Log the query to make sure it's correct
        console.log('Searching for:', query);
        
        const response = await apiService.search.query(query);
        
        // Log the raw response to see what we're getting
        console.log('Search API response:', response);
        
        // Make sure we're extracting data correctly
        const searchResults = response || [];
        console.log('Processed search results:', searchResults);
        
        setResults(searchResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  // Add this console log to verify state updates
  console.log('Current state:', { loading, resultsCount: results.length });

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
                  <FilterSidebar />
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
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              <ActiveFilters />
              
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