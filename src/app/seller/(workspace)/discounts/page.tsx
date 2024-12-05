"use client";

import { useEffect, useState } from "react";
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
import { Plus, Tag, BadgePercent, ShoppingBag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import apiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function DiscountsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const response = await apiService.discounts.getList();
      setDiscounts(response.data);
    } catch (error) {
      console.error("Failed to load discounts:", error);
      toast({
        title: "Error",
        description: "Failed to load discounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivation = async (discount: any) => {
    try {
      setToggleLoading(discount.id);
      
      if (!discount.active) {
        await apiService.discounts.activate(discount.id);
        setDiscounts(prevDiscounts => 
          prevDiscounts.map(d => 
            d.id === discount.id ? { ...d, active: true } : d
          )
        );
        toast({
          title: "Success",
          description: "Discount activated successfully",
        });
      } else {
        await apiService.discounts.deactivate(discount.id);
        setDiscounts(prevDiscounts => 
          prevDiscounts.map(d => 
            d.id === discount.id ? { ...d, active: false } : d
          )
        );
        toast({
          title: "Success",
          description: "Discount deactivated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${discount.active ? 'deactivate' : 'activate'} discount`,
        variant: "destructive",
      });
      await loadDiscounts();
    } finally {
      setToggleLoading(null);
    }
  };

  const getConditionText = (discount) => {
    switch (discount.condition.type) {
      case "MIN_PURCHASE_QTY":
        return `Min ${discount.condition.minPurchaseQty} items`;
      case "MIN_PURCHASE_AMOUNT":
        return `Min ₹${discount.condition.minPurchaseAmount}`;
      case "REFERRAL":
        return `Code: ${discount.condition.referralCode}`;
      default:
        return "No condition";
    }
  };

  const getDiscountText = (discount) => {
    switch (discount.discountType) {
      case "PERCENTAGE":
        return `${discount.applicableDiscount}% off`;
      case "FIXED":
        return `₹${discount.applicableDiscount} off`;
      case "BUY_AND_GET_FREE":
        return `Buy ${discount.applicableDiscount} get 1 free`;
      default:
        return discount.applicableDiscount;
    }
  };

  const ToggleSwitch = ({ discount }: { discount: any }) => (
    <div className="flex items-center gap-2">
      <Switch
        checked={discount.active}
        disabled={toggleLoading === discount.id}
        onCheckedChange={() => handleToggleActivation(discount)}
        className={toggleLoading === discount.id ? "opacity-50 cursor-not-allowed" : ""}
      />
      {toggleLoading === discount.id && (
        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
      )}
    </div>
  );

  const DiscountsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Valid From</TableHead>
          <TableHead>Valid To</TableHead>
          <TableHead className="text-center">Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {discounts.map((discount) => (
          <TableRow key={discount.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                {discount.name}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <BadgePercent className="h-4 w-4 text-indigo-500" />
                {discount.discountType.replace(/_/g, " ")}
              </div>
            </TableCell>
            <TableCell>{getDiscountText(discount)}</TableCell>
            <TableCell>{getConditionText(discount)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-gray-500" />
                <span>{discount.targetProducts.length} products</span>
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(discount.condition.startDate), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              {format(new Date(discount.condition.endDate), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <ToggleSwitch discount={discount} />
              </div>
            </TableCell>
          </TableRow>
        ))}
        {discounts.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              <div className="text-gray-500">
                No discounts found. Create your first discount to get started.
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderProducts = (products) => (
    products.map((product) => (
      <div key={product.id} className="text-sm">
        {product.name}
      </div>
    ))
  );

  const DiscountsAccordion = () => (
    <Accordion type="single" collapsible className="w-full">
      {discounts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No discounts found. Create your first discount to get started.
        </div>
      ) : (
        discounts.map((discount) => (
          <AccordionItem value={discount.id} key={discount.id}>
            <AccordionTrigger className="px-4">
              <div className="flex items-center gap-4 w-full">
                <Tag className="h-4 w-4 text-gray-500" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{discount.name}</h3>
                  <p className="text-sm text-gray-500">{getDiscountText(discount)}</p>
                </div>
                <ToggleSwitch discount={discount} />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <div className="flex items-center gap-2 mt-1">
                      <BadgePercent className="h-4 w-4 text-indigo-500" />
                      {discount.discountType.replace(/_/g, " ")}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Condition</label>
                    <div className="mt-1">{getConditionText(discount)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Products</label>
                    <div className="flex items-center gap-2 mt-1">
                      <ShoppingBag className="h-4 w-4 text-gray-500" />
                      <span>{discount.targetProducts.length} products</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Valid Period</label>
                    <div className="text-sm mt-1">
                      <div>{format(new Date(discount.condition.startDate), "MMM d, yyyy")}</div>
                      <div className="text-gray-500">to</div>
                      <div>{format(new Date(discount.condition.endDate), "MMM d, yyyy")}</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="text-sm font-medium text-gray-500">Applied Products</label>
                  <div className="mt-2 space-y-2">
                    {renderProducts(discount.targetProducts)}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))
      )}
    </Accordion>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discounts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product discounts and promotions
          </p>
        </div>
        <Button
          onClick={() => router.push("/seller/discounts/new")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Discount
        </Button>
      </div>

      <Card className="bg-white rounded-lg shadow-sm">
        <div className="hidden md:block">
          <DiscountsTable />
        </div>
        <div className="md:hidden">
          <DiscountsAccordion />
        </div>
      </Card>
    </div>
  );
}