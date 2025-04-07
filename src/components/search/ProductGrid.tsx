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
  tags: string;
  title: string;
  url: string;
  variant_id: string | null;
}

interface ProductGridProps {
  results: SearchResult[];
  loading: boolean;
}

export default function ProductGrid({ results, loading }: ProductGridProps) {
  // Add debug logging
  console.log('ProductGrid received:', { loading, resultsCount: results.length });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {results.map((product) => (
        <Link
          key={product.product_id}
          href={product.url}
          className="group"
        >
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
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
            <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              ₹{product.price.toFixed(2)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}