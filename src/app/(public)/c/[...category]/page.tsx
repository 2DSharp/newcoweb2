'use client';

import { useParams, useSearchParams } from 'next/navigation';
import SearchResults from '@/app/(public)/search/page';

export default function CategorySearchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryPath = params.category as string[];
  
  // First check if category is provided in the query parameters with proper casing
  const queryCategory = searchParams.get('category');
  
  if (queryCategory) {
    // Use the category from query parameter directly
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