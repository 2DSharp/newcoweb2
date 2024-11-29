'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AnalyticsCards from '@/components/dashboard/AnalyticsCards';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import TopProducts from '@/components/dashboard/TopProducts';
import CustomerInsights from '@/components/dashboard/CustomerInsights';
import { dashboardData } from '@/data/dashboardData';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader 
          storeName={dashboardData.storeName}
          storeRating={dashboardData.storeRating}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        
        <div className="mt-8">
          <AnalyticsCards data={dashboardData.analytics} />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RevenueChart data={dashboardData.revenueData} />
          </div>
          <div>
            <TopProducts products={dashboardData.topProducts} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentOrders orders={dashboardData.recentOrders} />
          </div>
          <div>
            <CustomerInsights data={dashboardData.customerInsights} />
          </div>
        </div>
      </div>
    </div>
  );
}