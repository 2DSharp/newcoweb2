"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrimaryButton } from "@/components/ui/primary-button";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/hooks/use-toast";
import apiService from '@/services/api';

const schema = z.object({
  discountType: z.enum(["PERCENTAGE", "FIXED", "BUY_AND_GET_FREE"]),
  condition: z.object({
    type: z.enum(["NO_CONDITION", "MIN_PURCHASE_QTY", "MIN_PURCHASE_AMOUNT", "REFERRAL"]),
    startDate: z.string(),
    endDate: z.string(),
    minPurchaseQty: z.number().optional(),
    minPurchaseAmount: z.number().optional(),
    referralCode: z.string().optional(),
  }),
  applicableDiscount: z.number(),
  triggerProducts: z.array(z.string()),
  targetProducts: z.array(z.string()),
});

export default function NewDiscountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      discountType: "PERCENTAGE",
      condition: {
        type: "NO_CONDITION",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      },
      applicableDiscount: 0,
      triggerProducts: [],
      targetProducts: [],
    }
  });

  const promotionType = watch("condition.type") || "NO_CONDITION";
  const triggerProducts = watch("triggerProducts") || [];
  const targetProducts = watch("targetProducts") || [];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await apiService.products.getList();
        const formattedProducts = response.data.map(product => ({
          value: product.id.toString(),
          label: product.name,
          image: product.thumbnail
        })) || [];
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadProducts();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await apiService.discounts.create(data);
      toast({
        title: "Success",
        description: "Discount created successfully",
      });
      router.push('/seller/discounts');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discount. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format selected values
  const formatSelectedValues = (selectedIds = []) => {
    if (!Array.isArray(selectedIds)) return [];
    
    return selectedIds.map(id => ({
      value: id.toString(),
      label: products.find(p => p.value === id.toString())?.label || id.toString()
    })).filter(item => item.label);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Discount</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Promotion Conditions</h2>
            
            <div>
              <Label>Buyer purchases</Label>
              <Select onValueChange={value => setValue("condition.type", value)} defaultValue={promotionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO_CONDITION">No Condition</SelectItem>
                  <SelectItem value="MIN_PURCHASE_QTY">At least this quantity of items</SelectItem>
                  <SelectItem value="MIN_PURCHASE_AMOUNT">At least this amount</SelectItem>
                  <SelectItem value="REFERRAL">With a referral code</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {promotionType === "NO_CONDITION" && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All selected products will be eligible for the discount without any condition
                </AlertDescription>
              </Alert>
            )}



            {promotionType === "MIN_PURCHASE_QTY" && (
              <div>
                <Label>Minimum Purchase Quantity</Label>
                <Input type="number" {...register("condition.minPurchaseQty")} />
              </div>
            )}

            {promotionType === "MIN_PURCHASE_AMOUNT" && (
              <div>
                <Label>Minimum Purchase Amount</Label>
                <Input type="number" {...register("condition.minPurchaseAmount")} />
              </div>
            )}

            {promotionType === "REFERRAL" && (
              <div>
                <Label>Referral Code</Label>
                <Input {...register("condition.referralCode")} />
              </div>
            )}
{promotionType !== "NO_CONDITION" && (
  <div>
    <Label>Products Required for Discount</Label>
    <MultiSelect
      options={products}
      value={formatSelectedValues(triggerProducts)}
      onChange={(selectedOptions) => {
        const values = selectedOptions?.map(option => option.value) || [];
        setValue("triggerProducts", values);
      }}
      placeholder="Search and select products..."
    />
  </div>
)}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input type="date" {...register("condition.startDate")} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" {...register("condition.endDate")} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Discount Details</h2>
            
            <div>
              <Label>Discount Type</Label>
              <Select onValueChange={value => setValue("discountType", value)} defaultValue={watch("discountType")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage Off</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount Off</SelectItem>
                  <SelectItem value="BUY_AND_GET_FREE">Buy X Get Y Free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Applicable Discount</Label>
              <Input
                type="number"
                {...register("applicableDiscount")}
                placeholder={watch("discountType") === "PERCENTAGE" ? "Enter percentage" : "Enter amount"}
              />
            </div>

            <div>
              <Label>Products to Apply Discount On</Label>
              {promotionType === "NO_CONDITION" ? (
                <MultiSelect
                  options={products}
                  value={formatSelectedValues(triggerProducts)}
                  onChange={(selectedOptions) => {
                    const values = selectedOptions?.map(option => option.value) || [];
                    setValue("triggerProducts", values);
                    setValue("targetProducts", values);
                  }}
                  placeholder="Search and select products..."
                />
              ) : (
                <MultiSelect
                  options={products}
                  value={formatSelectedValues(targetProducts)}
                  onChange={(selectedOptions) => {
                    const values = selectedOptions?.map(option => option.value) || [];
                    setValue("targetProducts", values);
                  }}
                  placeholder="Search and select products..."
                />
              )}
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Discount"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
} 