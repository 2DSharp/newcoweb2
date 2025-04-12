'use client';

import { Search } from 'lucide-react';
import { OrderStatus, FilterStatus } from '@/types/order';

interface OrdersHeaderProps {
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  orderCounts?: {
    ACTIVE: number;
    IN_TRANSIT: number;
    COMPLETED: number;
    FAILED: number;
  };
}

export default function OrdersHeader({
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  orderCounts = { ACTIVE: 0, IN_TRANSIT: 0, COMPLETED: 0, FAILED: 0 }
}: OrdersHeaderProps) {
  const statusOptions: { value: FilterStatus; label: string; icon?: string; color: string }[] = [
    { value: 'ACTIVE', label: 'Active', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'IN_TRANSIT', label: 'In Transit', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'FAILED', label: 'Failed', color: 'bg-red-100 text-red-800 border-red-200' }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
      
      <div className="flex flex-wrap items-center gap-2">
        {/* Status filter buttons */}
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center space-x-2 
              ${filterStatus === option.value 
                ? `${option.color} border-2` 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            <span>{option.label}</span>
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full bg-white">
              {orderCounts[option.value]}
            </span>
          </button>
        ))}
        
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[280px]"
          />
        </div>
      </div>
    </div>
  );
}