"use client";

import { ModalForm } from '@/components/ui/modal-form';
import { Info } from "lucide-react";
import { useState } from "react";
import apiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function ActivationModal({ isOpen, onClose, product, onActivationUpdate }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [scope, setScope] = useState('product');
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const newActiveState = scope === 'product' ? !product.active : 
                selectedVariant ? !product.variants.find(v => v.id === selectedVariant)?.active : false;

            await apiService.products.updateActivation(
                product.id,
                scope === 'variant' ? selectedVariant : null,
                newActiveState
            );
            
            toast({
                title: "Success",
                description: "Activation status updated successfully",
            });
            onActivationUpdate();
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update activation status",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getActionText = () => {
        if (scope === 'product') {
            return product.active ? 'Deactivate Product' : 'Activate Product';
        } else if (selectedVariant) {
            const variant = product.variants.find(v => v.id === selectedVariant);
            return variant?.active ? 'Deactivate Variant' : 'Activate Variant';
        }
        return 'Update Status';
    };

    return (
        <ModalForm
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Activation"
            infoText="Activation changes will only affect new orders. Existing orders will not be affected."
            onSubmit={handleSubmit}
            loading={loading}
            submitText={getActionText()}
        >
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium mb-3">Select Scope</h3>
                    <RadioGroup 
                        value={scope} 
                        onValueChange={(value) => {
                            setScope(value);
                            setSelectedVariant(null);
                        }}
                        className="space-y-3"
                    >
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <RadioGroupItem value="product" id="product" />
                            <Label 
                                htmlFor="product" 
                                className="flex-1 cursor-pointer"
                            >
                                <div>
                                    <div className="font-medium">Entire Product</div>
                                    <div className="text-sm text-gray-500">
                                        Currently {product.active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <RadioGroupItem value="variant" id="variant" />
                            <Label 
                                htmlFor="variant" 
                                className="flex-1 cursor-pointer"
                            >
                                <div>
                                    <div className="font-medium">Specific Variant</div>
                                    <div className="text-sm text-gray-500">Apply changes to a single variant</div>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {scope === 'variant' && (
                    <div className="space-y-2">
                        <Label htmlFor="variant-select" className="text-sm font-medium">
                            Select Variant
                        </Label>
                        <select
                            id="variant-select"
                            className="w-full p-2 border rounded-md bg-white"
                            onChange={(e) => setSelectedVariant(e.target.value)}
                            value={selectedVariant || ''}
                        >
                            <option value="">Select Variant</option>
                            {product.variants.map(variant => (
                                <option key={variant.id} value={variant.id}>
                                    {variant.name || 'Default Variant'} ({variant.active ? 'Active' : 'Inactive'})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                
            </div>
        </ModalForm>
    );
} 