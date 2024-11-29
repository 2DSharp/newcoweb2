'use client';

import { Users, TrendingUp } from 'lucide-react';
import { Card, DonutChart, Title } from '@tremor/react';

interface CustomerData {
  newCustomers: number;
  returningCustomers: number;
  customerSegments: {
    name: string;
    value: number;
  }[];
}

interface CustomerInsightsProps {
  data: CustomerData;
}

export default function CustomerInsights({ data }: CustomerInsightsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Customer Insights</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">New Customers</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {data.newCustomers.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Returning</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {data.returningCustomers.toLocaleString()}
            </p>
          </div>
        </div>
        
        <Card className="mt-6">
          <Title>Customer Segments</Title>
          <DonutChart
            className="mt-4 h-40"
            data={data.customerSegments}
            category="value"
            index="name"
            colors={["blue", "cyan", "indigo"]}
            valueFormatter={(value) => `${value.toFixed(1)}%`}
          />
        </Card>
      </div>
    </div>
  );
}