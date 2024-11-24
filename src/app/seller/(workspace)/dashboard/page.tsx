"use client";

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/stats/stat-card";
import { SalesChart } from "@/components/charts/sales-chart";
import { RecentSaleItem } from "@/components/sales/recent-sale-item";
import { DollarSign, Package, ShoppingCart } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    icon: DollarSign,
    change: "+20.1%",
    trend: "up" as const,
  },
  {
    title: "Products",
    value: "2,345",
    icon: Package,
    change: "+12.5%",
    trend: "up" as const,
  },
  {
    title: "Orders",
    value: "12,234",
    icon: ShoppingCart,
    change: "+8.1%",
    trend: "up" as const,
  },
];

const recentSales = [
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    amount: "$250.00",
    items: "Premium Package",
  },
  {
    name: "Michael Chen",
    email: "michael@example.com",
    amount: "$150.00",
    items: "Basic Bundle",
  },
  {
    name: "Emily Davis",
    email: "emily@example.com",
    amount: "$350.00",
    items: "Pro Suite",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full mx-auto space-y-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4 p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Overview</h3>
            </div>
            <SalesChart />
          </Card>
          
          <Card className="col-span-3 p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Recent Sales</h3>
            </div>
            <div className="mt-6 space-y-8">
              {recentSales.map((sale, index) => (
                <RecentSaleItem key={index} {...sale} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}