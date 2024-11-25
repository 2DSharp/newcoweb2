'use client';

import { Heart, ShoppingCart, Star } from 'lucide-react';

const products = [
  {
    id: 1,
    title: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    rating: 4.5,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  },
  {
    id: 2,
    title: 'Premium Leather Wallet',
    price: 79.99,
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
  },
  {
    id: 3,
    title: 'Smart Fitness Watch',
    price: 199.99,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  },
  {
    id: 4,
    title: 'Minimalist Desk Lamp',
    price: 129.99,
    rating: 4.7,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
  },
  {
    id: 5,
    title: 'Vintage Polaroid Camera',
    price: 249.99,
    rating: 4.4,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
  },
  {
    id: 6,
    title: 'Ceramic Coffee Mug Set',
    price: 39.99,
    rating: 4.9,
    reviews: 207,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d',
  },
  {
    id: 7,
    title: 'Designer Sunglasses',
    price: 159.99,
    rating: 4.6,
    reviews: 183,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
  },
  {
    id: 8,
    title: 'Portable Bluetooth Speaker',
    price: 89.99,
    rating: 4.7,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
  },
];

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div className="aspect-square relative overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-2 right-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
              -20%
            </div>
          </div>
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">Store Name</div>
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
              {product.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-gray-900">
                ${product.price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${product.price + 20}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}