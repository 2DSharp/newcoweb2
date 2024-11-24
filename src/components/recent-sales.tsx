"use client";

import { Avatar } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      {[
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
      ].map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">
            <p className="text-sm text-muted-foreground">{sale.items}</p>
            <p className="text-sm">{sale.amount}</p>
          </div>
        </div>
      ))}
    </div>
  );
}