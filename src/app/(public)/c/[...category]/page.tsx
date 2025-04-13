'use client';

import { useParams, useSearchParams } from 'next/navigation';
import SearchResults from '@/app/(public)/search/page';
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';

export default function CategorySearchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryPath = params.category as string[];
  const [filterData, setFilterData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Check if category2 parameter is provided for filtering
  const category2 = searchParams.get('category2');
  
  // First check if category is provided in the query parameters with proper casing
  const queryCategory = searchParams.get('category');
  
  // Fetch filters if category2 is provided
  useEffect(() => {
    if (category2) {
      const fetchFilters = async () => {
        setLoading(true);
        try {
          console.log(`Fetching filters for parent category: ${category2}`);
          const response = await apiService.search.getFilters(category2);
          console.log('Received filter response:', response);
          
          // Ensure the response has the correct structure
          if (response && response.filters) {
            // Log the filter structure for debugging
            console.log('Filter structure:', {
              filters: response.filters,
              results: response.results || []
            });
            
            setFilterData({
              filters: response.filters,
              results: response.results || []
            });
          } else {
            console.error('Invalid filter response structure:', response);
            setFilterData(null);
          }
        } catch (error) {
          console.error('Error fetching category filters:', error);
          setFilterData(null);
        } finally {
          setLoading(false);
        }
      };
      
      fetchFilters();
    }
  }, [category2]);
  
  // If we have category2 parameter, we want to show results filtered by it
  if (category2) {
    // Call SearchResults with filter API data
    return (
      <SearchResults 
        initialCategory={category2}
        apiData={filterData} 
        isLoadingProp={loading}
        useFilterApi={true}
      />
    );
  }
  
  if (queryCategory) {
    // Call SearchResults with the regular search API approach
    return <SearchResults initialCategory={queryCategory} />;
  }
  
  // Fallback: Extract the last part of the path for display
  // This is used when the category is not in the query parameters
  const lastCategory = categoryPath[categoryPath.length - 1];
  
  // Use the URL path segment directly without reformatting
  // Just replace hyphens with spaces if needed
  const formattedCategory = lastCategory.replace('+', ' ');
  
  return <SearchResults initialCategory={formattedCategory} />;
} 