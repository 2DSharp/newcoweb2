'use client';

import { Package, TrendingUp, TrendingDown } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sales: number;
  trend: number;
  revenue: number;
  image: string;
}

interface TopProductsProps {
  products: Product[];
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {products.map((product) => (
          <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                <div className="mt-1 flex items-center text-sm">
                  <span className="text-gray-500">{product.sales} sales</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <div className="flex items-center space-x-1">
                    {product.trend > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={product.trend > 0 ? 'text-green-500' : 'text-red-500'}>
                      {Math.abs(product.trend)}%
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${product.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}