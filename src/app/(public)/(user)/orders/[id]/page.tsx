'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import apiService from '@/services/api';

interface Address {
  id: string;
  type: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  pinCode: number;
  city: string;
  landmark: string;
  phone: string;
}

interface OrderItem {
  productName: string;
  variantName: string;
  variantId: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface SubOrder {
  subOrderId: string;
  status: string;
  expectedBy: string;
  itemPreview: string;
  items: OrderItem[];
}

interface OrderDetails {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  deliveryAddress: Address;
  billingAddress: Address;
  paymentStatus: string;
  paymentMethod: string;
  subOrderList: SubOrder[];
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeliveryAddress, setShowDeliveryAddress] = useState(false);
  const [showBillingAddress, setShowBillingAddress] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await apiService.orders.getDetails(params.id);
        if (response.successful) {
          setOrderDetails(response.data);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        setError('An error occurred while fetching order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Order details not found'}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const renderAddress = (address: Address, type: string) => {
    const isExpanded = type === 'delivery' ? showDeliveryAddress : showBillingAddress;
    const toggleAddress = () => {
      if (type === 'delivery') {
        setShowDeliveryAddress(!showDeliveryAddress);
      } else {
        setShowBillingAddress(!showBillingAddress);
      }
    };

    return (
      <div className="mb-4">
        <div 
          onClick={toggleAddress}
          className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900"
        >
          <h3 className="text-base font-medium capitalize">{type} Address</h3>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {isExpanded && (
          <div className="mt-2 text-sm text-gray-600 pl-4">
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>{address.city}, {address.state} - {address.pinCode}</p>
            {address.landmark && <p>Landmark: {address.landmark}</p>}
            <p>Phone: {address.phone}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Order #{orderDetails.orderId}</h2>
            <p className="text-gray-600">Placed on {formatDate(orderDetails.orderDate)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(orderDetails.totalAmount)}</p>
            <p className="text-gray-600 capitalize">{orderDetails.status.toLowerCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderAddress(orderDetails.deliveryAddress, 'delivery')}
              {renderAddress(orderDetails.billingAddress, 'billing')}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium mb-2">Payment Details</h3>
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{orderDetails.paymentStatus.toLowerCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium capitalize">{orderDetails.paymentMethod.toLowerCase().replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          {orderDetails.subOrderList.map((subOrder) => (
            <div key={subOrder.subOrderId} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-semibold">Sub-Order #{subOrder.subOrderId}</h4>
                  <p className="text-sm text-gray-600">{subOrder.itemPreview}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Expected by: {formatDate(subOrder.expectedBy)}</p>
                  <p className="text-sm capitalize">{subOrder.status.toLowerCase()}</p>
                </div>
              </div>
              <div className="space-y-3">
                {subOrder.items.map((item) => (
                  <div key={item.variantId} className="flex items-center p-3 bg-gray-50 rounded">
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm">{item.productName}</h4>
                      <p className="text-xs text-gray-600">{item.variantName}</p>
                      <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(item.price)}</p>
                      <p className="text-xs text-gray-600">Total: {formatCurrency(item.totalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

