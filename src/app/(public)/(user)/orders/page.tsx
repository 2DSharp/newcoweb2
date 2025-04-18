'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import apiService from '@/services/api';

interface Order {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  subOrderList: {
    subOrderId: string;
    status: string;
    itemPreview: string;
  }[];
}

function OrdersPageContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.orders.getList();
        if (response.successful) {
          setOrders(response.data);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError('An error occurred while fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-64 h-64 relative mb-6">
            <Image 
              src="/sad-cat.jpg" 
              alt="Disappointed cat" 
              layout="fill" 
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Looks like you haven't placed any orders yet.</p>
          <Button asChild className="px-8">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.orderId} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-base font-semibold">Order #{order.orderId}</h4>
                <p className="text-sm text-gray-600">Placed on {formatDate(order.orderDate)}</p>
                <div className="mt-1 space-y-1">
                  {order.subOrderList.map((subOrder) => (
                    <div key={subOrder.subOrderId} className="text-sm">
                      <span className="text-gray-600">{subOrder.itemPreview}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                        {subOrder.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                <p className="text-sm text-gray-600 capitalize">{order.status}</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/orders/${order.orderId}`}>View Details</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>}>
      <OrdersPageContent />
    </Suspense>
  );
}

