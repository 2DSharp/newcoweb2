'use client';

import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Star } from 'lucide-react';

interface AnalyticsData {
  revenue: {
    value: number;
    trend: number;
  };
  orders: {
    value: number;
    trend: number;
  };
  customers: {
    value: number;
    trend: number;
  };
  satisfaction: {
    value: number;
    trend: number;
  };
}

interface AnalyticsCardsProps {
  data: AnalyticsData;
}

export default function AnalyticsCards({ data }: AnalyticsCardsProps) {
  const cards = [
    {
      title: 'Revenue',
      value: `$${data.revenue.value.toLocaleString()}`,
      trend: data.revenue.trend,
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Orders',
      value: data.orders.value.toLocaleString(),
      trend: data.orders.trend,
      icon: ShoppingBag,
      color: 'green'
    },
    {
      title: 'Customers',
      value: data.customers.value.toLocaleString(),
      trend: data.customers.trend,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Satisfaction',
      value: `${data.satisfaction.value}%`,
      trend: data.satisfaction.trend,
      icon: Star,
      color: 'yellow'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className={`p-2 bg-${card.color}-100 rounded-lg`}>
              <card.icon className={`w-6 h-6 text-${card.color}-600`} />
            </div>
            <div className="flex items-center space-x-1">
              {card.trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${card.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(card.trend)}%
              </span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}