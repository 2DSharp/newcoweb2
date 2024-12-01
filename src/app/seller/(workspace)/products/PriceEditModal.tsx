"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { useState } from "react";
import apiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function PriceEditModal({ isOpen, onClose, variants, productId, onPriceUpdate }) {
    const { toast } = useToast();
    const [prices, setPrices] = useState(
        variants.reduce((acc, variant) => ({
            ...acc,
            [variant.variantId]: variant.basePrice
        }), {})
    );

    const handlePriceChange = (variantId: string, value: string) => {
        setPrices(prev => ({
            ...prev,
            [variantId]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = async () => {
        try {
            const variantsData = Object.entries(prices).map(([variantId, price]) => ({
                variantId,
                price: Number(price)
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
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Prices</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                        <p className="text-sm text-blue-700">
                            Price changes will only affect new orders. Existing orders will maintain their original prices.
                        </p>
                    </div>
                    
                    {variants.map(variant => (
                        <div key={variant.variantId} className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-medium">
                                    {variant.name || 'Default Variant'}
                                </label>
                                <Input
                                    type="number"
                                    value={prices[variant.variantId]}
                                    onChange={(e) => handlePriceChange(variant.variantId, e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    ))}
                    
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Save Changes</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 