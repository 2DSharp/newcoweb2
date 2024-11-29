'use client';

import { Card, AreaChart, Title } from '@tremor/react';

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <Title>Revenue Over Time</Title>
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index="date"
        categories={["revenue"]}
        colors={["blue"]}
        valueFormatter={(value) => `$${value.toLocaleString()}`}
      />
    </Card>
  );
}