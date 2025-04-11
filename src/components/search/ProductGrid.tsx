'use client';

import { Heart, ShoppingCart, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

interface ProductGridProps {
  results: SearchResult[];
  loading: boolean;
}

export default function ProductGrid({ results, loading }: ProductGridProps) {
  // Add debug logging
  console.log('ProductGrid received:', { loading, resultsCount: results?.length || 0 });
  console.log('Results array type:', Array.isArray(results) ? 'array' : typeof results);
  console.log('First few results:', results?.slice(0, 2));
  
  // Ensure results is an array
  const safeResults = Array.isArray(results) ? results : [];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!safeResults.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {safeResults.map((product, index) => {
        // Debug individual product
        console.log(`Rendering product ${index}:`, product);
        
        // Generate a key for each product
        const productKey = product?.product_id || `product-${index}`;
        
        // Generate a URL (use fallback if missing)
        const productUrl = product?.url || `/product/${product?.product_id || index}`;
        
        return (
          <Link
            key={productKey}
            href={productUrl}
            className="group"
          >
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              {product?.image ? (
                <Image
                  src={product.image}
                  alt={product.title || 'Product image'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-medium text-gray-900">{product?.title || 'Unnamed product'}</h3>
              <p className="text-sm text-gray-500">{product?.category || 'Uncategorized'}</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                ₹{(product?.price || 0).toFixed(2)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}