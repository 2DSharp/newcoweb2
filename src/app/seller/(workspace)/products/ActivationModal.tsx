"use client";

import { ModalForm } from '@/components/ui/modal-form';
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import apiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Product {
  id: string;
  active: boolean;
  variants: Array<{
    id: string;
    name: string;
  }>;
}

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onActivationUpdate: () => void;
}

export default function ActivationModal({ isOpen, onClose, product, onActivationUpdate }: ActivationModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState('product');
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [active, setActive] = useState(product.active);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiService.products.updateActivation(
        product.id,
        scope === 'variant' ? selectedVariant : null,
        active
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

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Activation"
      infoText="Activation changes will only affect new orders. Existing orders will not be affected."
      onSubmit={handleSubmit}
      loading={loading}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Select Scope</h3>
          <RadioGroup 
            value={scope} 
            onValueChange={setScope}
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
                  <div className="text-sm text-gray-500">Apply changes to all variants</div>
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
                  {variant.name || 'Default Variant'}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="active" className="text-sm font-medium">
            Activation Status
          </Label>
          <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              id="active"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <Label htmlFor="active" className="cursor-pointer">
              {active ? 'Active' : 'Inactive'}
            </Label>
          </div>
        </div>
      </div>
    </ModalForm>
  );
} 