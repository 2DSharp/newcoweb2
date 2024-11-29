'use client';

import { useState } from 'react';
import OrdersHeader from '@/components/orders/OrdersHeader';
import OrdersList from '@/components/orders/OrdersList';
import OrderDetails from '@/components/orders/OrderDetails';
import { Order } from '@/types/order';
import { ordersData } from '@/data/ordersData';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setSelectedOrder(updatedOrder);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-8">
        <OrdersHeader 
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-5 xl:col-span-4">
            <OrdersList 
              orders={filteredOrders}
              selectedOrderId={selectedOrder?.id}
              onOrderSelect={handleOrderSelect}
            />
          </div>
          <div className="lg:col-span-7 xl:col-span-8">
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
  );
}