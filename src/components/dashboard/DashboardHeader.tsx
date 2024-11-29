'use client';

import { CalendarDays, Store, Star } from 'lucide-react';

interface DashboardHeaderProps {
  storeName: string;
  storeRating: number;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export default function DashboardHeader({
  storeName,
  storeRating,
  dateRange,
  onDateRangeChange
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Store className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{storeName}</h1>
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{storeRating} Store Rating</span>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center space-x-2">
        <CalendarDays className="w-5 h-5 text-gray-500" />
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="12m">Last 12 months</option>
        </select>
      </div>
    </div>
  );
}