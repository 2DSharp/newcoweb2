'use client';

import { useState } from 'react';
import { Order, OrderItem } from '@/types/order';
import OrderItemCard from './OrderItemCard';
import { MapPin, Phone, Mail, PlayCircle } from 'lucide-react';

interface OrderDetailsProps {
  order: Order;
  onOrderUpdate: (order: Order) => void;
}

export default function OrderDetails({ order, onOrderUpdate }: OrderDetailsProps) {
  const [processingItems, setProcessingItems] = useState<{ [key: number]: boolean }>({});

  const handleStartProcessing = () => {
    const updatedOrder = {
      ...order,
      status: 'processing'
    };
    onOrderUpdate(updatedOrder);
  };

  const handleItemProcess = (itemId: number, processedQuantity: number) => {
    const updatedOrder = {
      ...order,
      items: order.items.map(item =>
        item.id === itemId
          ? { ...item, processedQuantity }
          : item
      )
    };

    // Check if all items are fully processed
    const allItemsProcessed = updatedOrder.items.every(
      item => item.processedQuantity === item.quantity
    );

    // Update order status if all items are processed
    if (allItemsProcessed) {
      updatedOrder.status = 'ready_for_shipping';
    }

    onOrderUpdate(updatedOrder);
  };

  const handleCustomizationVerify = (itemId: number, verified: boolean) => {
    const updatedOrder = {
      ...order,
      items: order.items.map(item =>
        item.id === itemId
          ? { ...item, isCustomizationVerified: verified }
          : item
      )
    };
    onOrderUpdate(updatedOrder);
  };

  const canStartProcessing = order.status === 'pending';
  const showProcessButton = canStartProcessing && order.items.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Order #{order.id}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Placed on {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-900">
              ${order.amount.toLocaleString()}
            </span>
            {showProcessButton && (
              <button
                onClick={handleStartProcessing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Processing
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-3">
              <p className="text-gray-600">{order.customer.name}</p>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {order.customer.email}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {order.customer.phone}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div className="flex items-start text-gray-600">
              <MapPin className="w-4 h-4 mr-2 mt-1" />
              <div>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        {order.status === 'pending' ? (
          <div className="text-center py-8 text-gray-500">
            Click "Start Processing" to begin processing items
          </div>
        ) : (
          <div className="space-y-4">
            {order.items.map((item) => (
              <OrderItemCard
                key={item.id}
                item={item}
                orderStatus={order.status}
                onProcess={handleItemProcess}
                onCustomizationVerify={handleCustomizationVerify}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}