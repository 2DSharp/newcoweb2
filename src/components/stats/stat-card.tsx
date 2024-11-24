"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  trend: "up" | "down";
}

export function StatCard({ title, value, icon: Icon, change, trend }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-slate-900 text-white rounded-full">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
        </div>
        <div className={`flex items-center space-x-1 text-sm ${
          trend === "up" ? "text-green-600" : "text-red-600"
        }`}>
          <ArrowUpRight className="h-4 w-4" />
          <span>{change}</span>
        </div>
      </div>
    </Card>
  );
}