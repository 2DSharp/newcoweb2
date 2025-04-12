'use client';

import { Order, OrderStatus, OrderItemStatus } from '@/types/order';
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

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      case 'READY_TO_SHIP':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'PARTIALLY_RETURNED':
      case 'RETURNED':
        return 'bg-orange-100 text-orange-800';
      case 'PARTIALLY_CANCELLED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const humanizeStatus = (status: OrderStatus | OrderItemStatus): string => {
    switch (status) {
      case 'NEW':
        return 'New';
      case 'ACTIVE':
        return 'Active';
      case 'PROCESSING':
        return 'Processing';
      case 'READY_TO_SHIP':
        return 'Ready to Ship';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Delivered';
      case 'PARTIALLY_RETURNED':
        return 'Partially Returned';
      case 'RETURNED':
        return 'Returned';
      case 'PARTIALLY_CANCELLED':
        return 'Partially Cancelled';
      case 'CANCELLED':
        return 'Cancelled';
      case 'CLOSED':
        return 'Closed';
      default:
        return status.toString().replace(/_/g, ' ').replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }
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
              <div className="flex items-center space-x-2">
                <b className="text-sm text-gray-900">Order #{order.id}</b>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                  {humanizeStatus(order.status)}
                </span>
              </div>
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