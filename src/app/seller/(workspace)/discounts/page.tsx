"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const discounts = [
  {
    id: 1,
    code: "SUMMER2024",
    type: "Percentage",
    value: "20%",
    status: "Active",
    usageLimit: 100,
    usageCount: 45,
    expiryDate: "2024-08-31",
  },
  {
    id: 2,
    code: "WELCOME50",
    type: "Fixed Amount",
    value: "$50",
    status: "Active",
    usageLimit: 200,
    usageCount: 123,
    expiryDate: "2024-12-31",
  },
  {
    id: 3,
    code: "FLASH25",
    type: "Percentage",
    value: "25%",
    status: "Inactive",
    usageLimit: 50,
    usageCount: 50,
    expiryDate: "2024-06-30",
  },
];

export default function DiscountsPage() {
  const router = useRouter();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Discounts</h2>
        <a href="/seller/discounts/new">
        <Button onClick={() => router.push('/seller/discounts/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Discount
        </Button>
        </a>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-medium">{discount.code}</TableCell>
                <TableCell>{discount.type}</TableCell>
                <TableCell>{discount.value}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      discount.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {discount.status}
                  </span>
                </TableCell>
                <TableCell>
                  {discount.usageCount}/{discount.usageLimit}
                </TableCell>
                <TableCell>{discount.expiryDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}