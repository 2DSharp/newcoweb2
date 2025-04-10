'use client';

import React from 'react';
import FeaturedProducts from './FeaturedProducts';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface FeaturedProductsSectionProps {
  heading: string;
  products: Product[];
}

export default function FeaturedProductsSection({ 
  heading = "Featured Products",
  products = []
}: FeaturedProductsSectionProps) {
  return (
    <FeaturedProducts 
      heading={heading} 
      products={products} 
    />
  );
} 