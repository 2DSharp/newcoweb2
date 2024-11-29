'use client';

import { format } from 'date-fns';
import { Order } from '@/types/order';

interface OrdersListProps {
  orders: Order[];
  selectedOrderId?: string;
  onOrderSelect: (order: Order) => void;
}

export default function OrdersList({ orders, selectedOrderId, onOrderSelect }: OrdersListProps) {
  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      ready_for_shipping: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => onOrderSelect(order)}
            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors duration-150 ${
              selectedOrderId === order.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Order #{order.id}</p>
                <p className="mt-1 text-sm text-gray-500">{order.customer.name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {format(new Date(order.date), 'MMM d, yyyy')}
              </span>
              <span className="font-medium text-gray-900">
                ${order.amount.toLocaleString()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}