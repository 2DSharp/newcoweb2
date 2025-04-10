'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ChevronRight as ChevronRightArrow } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface FeaturedProductsProps {
  heading: string;
  products: Product[];
}

export default function FeaturedProducts({ heading, products }: FeaturedProductsProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 2; // Show 2 products per page on mobile
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  // Calculate what products to show for mobile view based on current page
  const mobileProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  return (
    <section className="py-6">
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair">{heading}</h2>
          <Link 
            href="/products" 
            className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
          >
            View all <ChevronRightArrow className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {/* Mobile view with pagination */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mobileProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Mobile navigation controls */}
          <div className="flex items-center justify-between mt-6">
            <button 
              onClick={handlePrevPage}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === currentPage ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={() => setCurrentPage(idx)}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNextPage}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Desktop view (all products) */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative h-48 md:h-56">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="p-4">
          <span className="text-sm text-blue-600 mb-1 block">{product.category}</span>
          <h3 className="font-semibold text-lg mb-2 truncate font-playfair">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 