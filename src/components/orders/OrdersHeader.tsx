'use client';

import { Search, Filter } from 'lucide-react';
import { OrderStatus } from '@/app/seller/(workspace)/orders/page';

interface OrdersHeaderProps {
  filterStatus: OrderStatus;
  onFilterChange: (status: OrderStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function OrdersHeader({
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange
}: OrdersHeaderProps) {
  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as OrderStatus)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white w-full sm:w-48"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}