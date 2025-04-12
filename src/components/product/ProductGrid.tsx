'use client';

import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  showAll?: boolean;
}

export default function ProductGrid({ products, showAll = false }: ProductGridProps) {
  const displayProducts = showAll ? products : products.slice(0, 8);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayProducts.map(product => (
        <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
          <div className="relative h-48">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-100">
              <Heart className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <h4 className="font-semibold truncate">{product.name}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}