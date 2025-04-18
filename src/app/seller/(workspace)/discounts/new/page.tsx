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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePicker } from "@/components/ui/date-picker";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  discountType: z.enum(["PERCENTAGE", "FIXED", "BUY_AND_GET_FREE"]),
  condition: z.object({
    type: z.enum(["NO_CONDITION", "MIN_PURCHASE_QTY", "MIN_PURCHASE_AMOUNT", "REFERRAL"]),
    startDate: z.string(),
    endDate: z.string(),
    minPurchaseQty: z.string().optional(),
    minPurchaseAmount: z.string().optional(),
    referralCode: z.string().optional(),
  }),
  applicableDiscount: z.any(),
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
      name: "",
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

  const promotionType = watch("condition.type");

  const [selectedTriggerProducts, setSelectedTriggerProducts] = useState<string[]>([]);
  const [selectedTargetProducts, setSelectedTargetProducts] = useState<string[]>([]);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await apiService.products.getList();
        const formattedProducts = response.data.map(product => ({
          value: product.id.toString(),
          label: product.name,
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

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setLoading(true);
      const submissionData = {
        ...data,
        triggerProducts: selectedTriggerProducts,
        targetProducts: promotionType === "NO_CONDITION" 
          ? selectedTriggerProducts 
          : selectedTargetProducts,
      };
      
      await apiService.discounts.create(submissionData);
      toast({
        title: "Success",
        description: "Discount created successfully",
      });
      router.push('/seller/discounts');
    } catch (error) {
      console.error('Submission error:', error);
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
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div>
              <Label>Discount Name</Label>
              <Input 
                {...register("name")} 
                placeholder="Enter a name for this discount"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Promotion Conditions</h3>
            
            <div>
              <Label>Buyer purchases</Label>
              <Select 
                value={promotionType}
                onValueChange={value => setValue("condition.type", value)} 
                defaultValue="NO_CONDITION"
              >
                <SelectTrigger>
                  <SelectValue />
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
        onValueChange={setSelectedTriggerProducts}
        placeholder="Search and select products..."
        variant="inverted"
        animation={2}
        maxCount={3}
      />
  </div>
)}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <DatePicker
                  value={watch("condition.startDate")}
                  onChange={(date) => {
                    setValue("condition.startDate", date);
                    // If end date is before start date, update end date
                    const endDate = watch("condition.endDate");
                    if (date && endDate && new Date(endDate) < new Date(date)) {
                      setValue("condition.endDate", date);
                    }
                  }}
                  placeholder="Select start date"
                  minDate={new Date()} // Can't select dates before today
                />
              </div>
              <div>
                <Label>End Date</Label>
                <DatePicker
                  value={watch("condition.endDate")}
                  onChange={(date) => setValue("condition.endDate", date)}
                  placeholder="Select end date"
                  minDate={new Date(watch("condition.startDate") || Date.now())} // Can't select dates before start date
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Discount Details</h3>
            
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
                  onValueChange={(v) => {
                    setSelectedTriggerProducts(v);
                    setSelectedTargetProducts(v); // Automatically set both to the same value
                  }}
                  placeholder="Search and select products..."
                  variant="inverted"
                  animation={2}
                  maxCount={3}
                />
              ) : (
                <MultiSelect
                  options={products}
                  onValueChange={setSelectedTargetProducts}
                  placeholder="Search and select products..."
                  variant="inverted"
                  animation={2}
                  maxCount={3}
                />
              )}
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Discount"}
          </Button>
        </div>
      </form>
    </div>
  );
} 