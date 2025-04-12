'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import ProductGrid from './ProductGrid';
import { Product } from '@/types/product';

interface ProductSectionProps {
  title: string;
  icon?: React.ReactNode;
  products: Product[];
}

export default function ProductSection({ title, icon, products }: ProductSectionProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h4>
        <button className="text-blue-600 hover:text-blue-700 flex items-center">
          View all <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}