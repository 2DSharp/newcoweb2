"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const orders = [
  {
    id: "#ORD-001",
    customer: "Sarah Johnson",
    date: "2024-03-15",
    total: "$250.00",
    status: "Pending",
  },
  {
    id: "#ORD-002",
    customer: "Michael Chen",
    date: "2024-03-14",
    total: "$150.00",
    status: "Shipped",
  },
  {
    id: "#ORD-003",
    customer: "Emily Davis",
    date: "2024-03-13",
    total: "$350.00",
    status: "Completed",
  },
  {
    id: "#ORD-004",
    customer: "James Wilson",
    date: "2024-03-12",
    total: "$200.00",
    status: "Returned",
  },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
        </div>

        <Card className="bg-white rounded-lg shadow p-6">
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
                Pending
              </TabsTrigger>
              <TabsTrigger value="shipped" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
                Shipped
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
                Completed
              </TabsTrigger>
              <TabsTrigger value="returned" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
                Returned
              </TabsTrigger>
            </TabsList>
            
            {["pending", "shipped", "completed", "returned"].map((status) => (
              <TabsContent key={status} value={status}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-600">Order ID</TableHead>
                      <TableHead className="text-gray-600">Customer</TableHead>
                      <TableHead className="text-gray-600">Date</TableHead>
                      <TableHead className="text-gray-600">Total</TableHead>
                      <TableHead className="text-gray-600">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders
                      .filter(
                        (order) =>
                          order.status.toLowerCase() === status.toLowerCase()
                      )
                      .map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{order.id}</TableCell>
                          <TableCell className="text-gray-700">{order.customer}</TableCell>
                          <TableCell className="text-gray-700">{order.date}</TableCell>
                          <TableCell className="text-gray-700">{order.total}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                {
                                  Pending: "bg-yellow-100 text-yellow-800",
                                  Shipped: "bg-blue-100 text-blue-800",
                                  Completed: "bg-green-100 text-green-800",
                                  Returned: "bg-red-100 text-red-800",
                                }[order.status]
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}