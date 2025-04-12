'use client';

import { useEffect, useState } from 'react';
import OrdersHeader from '@/components/orders/OrdersHeader';
import OrdersList from '@/components/orders/OrdersList';
import OrderDetails from '@/components/orders/OrderDetails';
import apiService from '@/services/api';
import { OrderStatus, OrderItem, Order, FilterStatus } from '@/types/order';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderCounts, setOrderCounts] = useState<{ [key in FilterStatus]: number }>({
    ACTIVE: 0,
    IN_TRANSIT: 0,
    COMPLETED: 0,
    FAILED: 0
  });

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        
        // Fetch orders for each filter status to get counts
        const activeResponse = await apiService.orders.getSellerOrders('ACTIVE');
        const inTransitResponse = await apiService.orders.getSellerOrders('IN_TRANSIT');
        const completedResponse = await apiService.orders.getSellerOrders('COMPLETED');
        const failedResponse = await apiService.orders.getSellerOrders('FAILED');
        
        // Calculate counts
        const counts = {
          ACTIVE: activeResponse.successful ? activeResponse.data.length : 0,
          IN_TRANSIT: inTransitResponse.successful ? inTransitResponse.data.length : 0,
          COMPLETED: completedResponse.successful ? completedResponse.data.length : 0,
          FAILED: failedResponse.successful ? failedResponse.data.length : 0
        };
        
        setOrderCounts(counts);
        
        // Set orders based on current filter
        if (filterStatus === 'ACTIVE' && activeResponse.successful) {
          setOrders(activeResponse.data);
        } else if (filterStatus === 'IN_TRANSIT' && inTransitResponse.successful) {
          setOrders(inTransitResponse.data);
        } else if (filterStatus === 'COMPLETED' && completedResponse.successful) {
          setOrders(completedResponse.data);
        } else if (filterStatus === 'FAILED' && failedResponse.successful) {
          setOrders(failedResponse.data);
        }
      } catch (err) {
        setError('An error occurred while fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);
  
  useEffect(() => {
    const fetchFilteredOrders = async () => {
      try {
        setLoading(true);
        const response = await apiService.orders.getSellerOrders(filterStatus);
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

    fetchFilteredOrders();
  }, [filterStatus]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  const handleOrderSelect = (order: Order) => {
    console.log('Selected Order:', order);
    setSelectedOrder(order);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setSelectedOrder(updatedOrder);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-8">
        <OrdersHeader 
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          orderCounts={orderCounts}
        />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-5 xl:col-span-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <OrdersList 
                orders={filteredOrders}
                selectedOrderId={selectedOrder?.id}
                onOrderSelect={handleOrderSelect}
              />
            )}
          </div>
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-4">
              {selectedOrder ? (
                <OrderDetails 
                  order={selectedOrder}
                  onOrderUpdate={handleUpdateOrder}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <h3 className="text-lg text-gray-500">
                    Select an order to view details
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}