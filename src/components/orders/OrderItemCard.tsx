'use client';

import { useState } from 'react';
import { OrderItem, OrderStatus } from '@/types/order';
import { Check, AlertCircle } from 'lucide-react';

interface OrderItemCardProps {
  item: OrderItem;
  orderStatus: OrderStatus;
  onProcess: (itemId: number, processedQuantity: number) => void;
  onCustomizationVerify: (itemId: number, verified: boolean) => void;
}

export default function OrderItemCard({
  item,
  orderStatus,
  onProcess,
  onCustomizationVerify
}: OrderItemCardProps) {
  const [processing, setProcessing] = useState(false);

  const handleProcessClick = () => {
    if (item.processedQuantity < item.quantity) {
      onProcess(item.id, item.processedQuantity + 1);
    }
  };

  const canProcess = orderStatus === 'processing' && 
    (!item.customization || item.isCustomizationVerified);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.productName}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{item.productName}</h4>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <span>Quantity: {item.quantity}</span>
            <span className="mx-2">•</span>
            <span>${item.price.toFixed(2)} each</span>
          </div>
          
          {item.customization && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Customization Request:</p>
                  <p className="text-sm text-gray-600">{item.customization}</p>
                  <div className="mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.isCustomizationVerified}
                        onChange={(e) => onCustomizationVerify(item.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        Customization verified
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {canProcess && (
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Processed: {item.processedQuantity} of {item.quantity}
                  </span>
                </div>
                <button
                  onClick={handleProcessClick}
                  disabled={item.processedQuantity === item.quantity}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    item.processedQuantity === item.quantity
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {item.processedQuantity === item.quantity ? (
                    <span className="flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      Completed
                    </span>
                  ) : (
                    `Process Item (${item.processedQuantity + 1}/${item.quantity})`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}