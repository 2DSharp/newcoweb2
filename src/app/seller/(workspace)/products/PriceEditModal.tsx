"use client";

import { useState, useEffect } from "react";
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";

interface PricingBreakdown {
  id: string;
  discount: {
    name: string;
    value: number;
  } | null;
  price: number;
  basePrice: number;
  shippingFees: number;
  shippingTax: number;
  commission: number;
  commissionTax: number;
  baseTax: number;
  tcs: number;
}

interface Variant {
  variantId: string;
  name: string;
  price: number;
  basePrice: number;
  activePricing: PricingBreakdown;
}

interface PriceEditOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  variants: Variant[];
  productId: string;
  onPriceUpdate: () => void;
}

export default function PriceEditOverlay({ isOpen, onClose, variants, productId, onPriceUpdate }: PriceEditOverlayProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const initialPrices: Record<string, number> = {};
    variants.forEach(variant => {
      initialPrices[variant.variantId] = variant.activePricing.basePrice;
    });
    return initialPrices;
  });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    console.log("VARIANTS", variants)
    const newPrices: Record<string, number> = {};
    variants.forEach(variant => {
      newPrices[variant.variantId] = variant.activePricing.basePrice;
    });
    console.log("NEW PRICES", newPrices)
    setPrices(newPrices);
  }, [variants]);

  const calculateCommission = (basePrice: number) => {
    return basePrice * 0.06;
  };

  const calculateFinalPrice = (basePrice: number, variant: Variant) => {
    const commission = calculateCommission(basePrice);
    const commissionTax = commission * 0.18;
    const shippingTax = variant.activePricing.shippingFees * 0.18;
    const tcs = basePrice * 0.01;

    return basePrice + 
           variant.activePricing.shippingFees + 
           shippingTax +
           commission +
           commissionTax +
           tcs;
  };

  const PriceBreakdown = ({ variant, newBasePrice }: { variant: Variant, newBasePrice: number }) => {
    const commission = calculateCommission(newBasePrice);
    const commissionTax = commission * 0.18;
    const shippingTax = variant.activePricing.shippingFees * 0.18;
    const tcs = newBasePrice * 0.01;
    const finalPrice = calculateFinalPrice(newBasePrice, variant);

    return (
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Price</span>
          <span className="font-medium">₹{newBasePrice.toFixed(2)}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping Fee</span>
            <span>+ ₹{variant.activePricing.shippingFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping Tax (18%)</span>
            <span>+ ₹{shippingTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Commission (6%)</span>
            <span>+ ₹{commission.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Commission Tax (18%)</span>
            <span>+ ₹{commissionTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">TCS (1%)</span>
            <span>+ ₹{tcs.toFixed(2)}</span>
          </div>
        </div>

        {variant.activePricing.discount && (
          <>
            <Separator />
            <div className="flex justify-between text-sm text-green-600">
              <span>{variant.activePricing.discount.name}</span>
              <span>- ₹{variant.activePricing.discount.value.toFixed(2)}</span>
            </div>
          </>
        )}

        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Final Price</span>
          <span>₹{finalPrice.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!confirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that you understand the pricing changes",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const variantsData = Object.entries(prices).map(([variantId, basePrice]) => ({
        variantId,
        basePrice: Number(basePrice)
      }));

      await apiService.products.updatePricing(productId, variantsData);
      toast({
        title: "Success",
        description: "Prices updated successfully",
      });
      onPriceUpdate();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="px-6">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between relative">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
              <SheetTitle className="absolute left-1/2 -translate-x-1/2">
                Edit Prices
              </SheetTitle>
              <div className="w-10" />
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
              Price changes will affect all future orders. Existing orders will maintain their original prices.
              <br />
            </div>

            {variants.map(variant => (
              <div key={variant.variantId} className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    {variant.name || 'Default Variant'}
                  </Label>
                  <div className="mt-2">
                    <Label>Base Price</Label>
                    <Input
                      type="number"
                      value={prices[variant.variantId]}
                      onChange={(e) => {
                        const newPrice = parseFloat(e.target.value) || 0;
                        setPrices(prev => ({
                          ...prev,
                          [variant.variantId]: newPrice
                        }));
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <PriceBreakdown 
                  variant={variant} 
                  newBasePrice={prices[variant.variantId]}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="px-6 pt-4">
            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand that changing the base price will affect:
                </label>
                <p className="text-sm text-muted-foreground leading-relaxed space-y-1">
                  <span className="block">- The final price customers see</span>
                  <span className="block">- All future orders</span>
                  <span className="block">- Platform fees and taxes</span>
                </p>
              </div>
            </div>
            <div className="space-y-2 pt-4 pb-2">
              <Button 
                className="w-full" 
                onClick={handleSubmit} 
                disabled={loading || !confirmed}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 