"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Badge } from "@/components/ui/badge";
import { Eye, Package } from "lucide-react";

const pendingOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2024-03-20",
    total: "$129.99",
    items: 3,
    status: "Processing",
    priority: "High",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2024-03-20",
    total: "$79.99",
    items: 2,
    status: "Payment Confirmed",
    priority: "Medium",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: "2024-03-19",
    total: "$299.99",
    items: 5,
    status: "Processing",
    priority: "High",
  },
  {
    id: "ORD-004",
    customer: "Sarah Williams",
    date: "2024-03-19",
    total: "$159.99",
    items: 4,
    status: "Payment Confirmed",
    priority: "Low",
  },
];

const priorityColors = {
  High: "text-red-500 bg-red-100",
  Medium: "text-yellow-500 bg-yellow-100",
  Low: "text-green-500 bg-green-100",
};

export function PendingOrders() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pending Orders</h3>
        <PrimaryButton>
          <Package className="mr-2 h-4 w-4" />
          Process Selected
        </PrimaryButton>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>
                <Badge variant="secondary">{order.status}</Badge>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[order.priority as keyof typeof priorityColors]}`}>
                  {order.priority}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}