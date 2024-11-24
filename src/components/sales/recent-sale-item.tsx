"use client";

import { Avatar } from "@/components/ui/avatar";

interface RecentSaleItemProps {
  name: string;
  email: string;
  amount: string;
  items: string;
}

export function RecentSaleItem({ name, email, amount, items }: RecentSaleItemProps) {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9" />
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <div className="ml-auto font-medium">
        <p className="text-sm text-muted-foreground">{items}</p>
        <p className="text-sm">{amount}</p>
      </div>
    </div>
  );
}