'use client';

import React from 'react';
import FeaturedProducts from './FeaturedProducts';

const sampleProducts = [
  {
    id: 1,
    name: 'Handcrafted Wooden Table',
    price: '$249.99',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Furniture'
  },
  {
    id: 2,
    name: 'Vintage Leather Bag',
    price: '$89.99',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Accessories'
  },
  {
    id: 3,
    name: 'Artisan Ceramic Vase',
    price: '$49.99',
    image: 'https://newco2024-dev.s3.amazonaws.com/variants/C_bNMBh47mJ8d-U7yyXerNlyJL3fdL-XZmsiJCbOrWk_desktop.jpg',
    category: 'Home Decor'
  },
  {
    id: 4,
    name: 'Hand-Woven Wool Blanket',
    price: '$79.99',
    image: 'https://images.unsplash.com/photo-1612363148951-15f16817648f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Textiles'
  },
  {
    id: 5,
    name: 'Macrame Wall Hanging',
    price: '$59.99',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Home Decor'
  },
  {
    id: 6,
    name: 'Handmade Ceramic Mug',
    price: '$24.99',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Kitchen'
  },
  {
    id: 7,
    name: 'Wooden Cutting Board',
    price: '$39.99',
    image: 'https://newco2024-dev.s3.amazonaws.com/variants/YmU-jGZ_xDUikpRfHXbhZUpMmHFN_qYJ4dCtp7PLiNk_desktop.jpg',
    category: 'Kitchen'
  },
  {
    id: 8,
    name: 'Woven Rattan Chair',
    price: '$189.99',
    image: 'https://images.unsplash.com/photo-1540574573343-bdd23b70c48b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Furniture'
  }
];

export default function FeaturedProductsSection() {
  return (
    <FeaturedProducts 
      heading="Featured Products" 
      products={sampleProducts} 
    />
  );
} 