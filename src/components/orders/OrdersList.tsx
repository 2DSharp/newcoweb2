'use client';

import { Order } from '@/app/seller/(workspace)/orders/page';
import { formatCurrency } from '@/lib/utils';

interface OrdersListProps {
  orders: Order[];
  selectedOrderId: string | null;
  onOrderSelect: (order: Order) => void;
}

export default function OrdersList({
  orders,
  selectedOrderId,
  onOrderSelect,
}: OrdersListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onOrderSelect(order)}
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            selectedOrderId === order.id
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-white border border-gray-200 hover:border-blue-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
              <p className="text-sm text-gray-500">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {formatCurrency(order.subTotal)}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {order.items[0]?.productName}
            {order.items.length > 1 && ` +${order.items.length - 1} more`}
          </div>
        </div>
      ))}
    </div>
  );
}