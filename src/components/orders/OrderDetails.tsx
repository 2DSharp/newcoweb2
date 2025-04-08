'use client';

import { useState, useEffect } from 'react';
import { Order, OrderItem, OrderStatus } from '@/types/order';
import OrderItemCard from './OrderItemCard';
import { MapPin, Phone, Mail, PlayCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OrderDetailsProps {
  order: Order;
  onOrderUpdate: (order: Order) => void;
}

export default function OrderDetails({ order, onOrderUpdate }: OrderDetailsProps) {
  const [processingItems, setProcessingItems] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    console.log('OrderDetails - Order Status:', order.status);
    console.log('OrderDetails - Can Start Processing:', order.status === 'NEW' || order.status === 'ACTIVE');
    console.log('OrderDetails - Show Process Button:', (order.status === 'NEW' || order.status === 'ACTIVE') && order.items.length > 0);
  }, [order]);

  const handleStartProcessing = () => {
    const updatedOrder: Order = {
      ...order,
      status: 'IN_TRANSIT'
    };
    onOrderUpdate(updatedOrder);
  };

  const handleItemProcess = (itemId: number, processedQuantity: number) => {
    const updatedOrder: Order = {
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
      updatedOrder.status = 'COMPLETED';
    }

    onOrderUpdate(updatedOrder);
  };

  const handleCustomizationVerify = (itemId: number, verified: boolean) => {
    const updatedOrder: Order = {
      ...order,
      items: order.items.map(item =>
        item.id === itemId
          ? { ...item, isCustomizationVerified: verified }
          : item
      )
    };
    onOrderUpdate(updatedOrder);
  };

  const canStartProcessing = order.status === 'NEW' || order.status === 'ACTIVE';
  const showProcessButton = canStartProcessing && order.items.length > 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Order #{order.id}</h2>
          <p className="text-sm text-gray-500">
            Created: {formatDate(order.createdAt)}
          </p>
          <p className="text-sm text-gray-500">
            Updated: {formatDate(order.updatedAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(order.subTotal)}
          </p>
          <p className="text-sm text-gray-500">
            Expected by: {formatDate(order.expectedBy)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Order Items</h3>
          {showProcessButton && (
            <button
              onClick={handleStartProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Processing
            </button>
          )}
        </div>
        {order.items.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{item.productName}</h4>
                <p className="text-sm text-gray-500">{item.variantName}</p>
                <p className="text-sm text-gray-500">SKU: {item.sku}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {formatCurrency(item.price)}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
            {item.instructions && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Instructions:</span> {item.instructions}
                </p>
                {order.status === 'IN_TRANSIT' && (
                  <div className="mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.isCustomizationVerified}
                        onChange={(e) => handleCustomizationVerify(item.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        Customization verified
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status}
              </span>
              {order.status === 'IN_TRANSIT' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Processed: {item.processedQuantity || 0} of {item.quantity}
                  </span>
                  <button
                    onClick={() => handleItemProcess(item.id, (item.processedQuantity || 0) + 1)}
                    disabled={!item.isCustomizationVerified || (item.processedQuantity || 0) >= item.quantity}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      (!item.isCustomizationVerified || (item.processedQuantity || 0) >= item.quantity)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Process Item
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}