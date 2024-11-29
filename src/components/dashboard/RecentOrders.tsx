'use client';

import { format } from 'date-fns';
import { Package, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
}

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
            View all <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Order #{order.id}</p>
                <p className="mt-1 text-sm text-gray-500">{order.customer}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <span>{format(new Date(order.date), 'MMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <span>{order.items} items</span>
              </div>
              <span className="font-medium text-gray-900">${order.amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}