"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ProductInfoForm from '@/components/product-configuration/product-info-form';
import ProductVariationsForm from '@/components/product-configuration/product-variations-form';
import SearchabilityDetailsForm from '@/components/product-configuration/searchability';
import apiService from '@/services/api';
import { useToast } from "@/hooks/use-toast";

interface ProductManagementOverlayProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductManagementOverlay({ productId, isOpen, onClose }: ProductManagementOverlayProps) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const { toast } = useToast();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        const response = await apiService.products.getSellerProductDetails(productId);
        const formattedData = {
          ...response.data,
          stock: null,
    
          personalizationText: response.data.stock?.personalizationText || false,
          variations: response.data.stock?.variations?.map(variation => ({
            ...variation,
            isCustom: variation.type === 'CUSTOM',
            pricing: null,
            customizationOptions: variation.customizationOptions || [],
            details: variation.details || {},
            dimensions: {
              l: variation.dimensions?.l || 0,
              w: variation.dimensions?.w || 0,
              h: variation.dimensions?.h || 0,
            },
            weight: variation.weight || 0,
            images: variation.images?.map(img => ({
              imgId: img.imgId,
              thumbnail: img.thumbnail,
              url: img.url
            })) || []
          })) || [{}]
        };
        setFormData(formattedData);
        setInitialData(JSON.stringify(formattedData));
      } catch (error) {
        console.error('Failed to load product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && productId) {
      loadProductData();
    }
  }, [productId, isOpen]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      setHasChanges(JSON.stringify(newData) !== initialData);
      return newData;
    });
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      onClose();
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await apiService.products.updateProduct(productId, formData);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Failed to update product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleClose} modal>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-4">
        <div className="flex items-center justify-between relative">
            <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
            </Button>
            <SheetTitle className="absolute left-1/2 -translate-x-1/2">
                Manage Product
            </SheetTitle>
            <div className="w-10" /> {/* Spacer to balance the close button */}
        </div>
    </SheetHeader>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span>Loading...</span>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4 mt-6">
              <AccordionItem value="product-info">
                <AccordionTrigger>Product Information</AccordionTrigger>
                <AccordionContent>
                  <ProductInfoForm
                    formData={formData}
                    updateFormData={updateFormData}
                    handleSubmit={(e) => e?.preventDefault()}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleSave} 
                      disabled={loading || !hasChanges}
                    >
                      Save Changes
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="variations">
                <AccordionTrigger>Variations</AccordionTrigger>
                <AccordionContent>
                  <ProductVariationsForm
                    formData={formData}
                    updateFormData={updateFormData}
                    isManagementOverlay={true}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleSave} 
                      disabled={loading || !hasChanges}
                    >
                      Save Changes
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="searchability">
                <AccordionTrigger>Searchability</AccordionTrigger>
                <AccordionContent>
                  <SearchabilityDetailsForm
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleSave} 
                      disabled={loading || !hasChanges}
                    >
                      Save Changes
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDiscardDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDiscardDialog(false);
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 