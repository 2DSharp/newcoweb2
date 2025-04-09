"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parseCurrency } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PriceDisplay } from "@/components/ProductInfo";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
}

export function CartOverlay({ isOpen, onClose, items }: CartOverlayProps) {
  const [itemToDelete, setItemToDelete] = useState(null);
  const { toast } = useToast();
  const subtotal = items.reduce((sum, item) => 
    sum + (parseCurrency(item.pricing.finalPrice) * item.quantity), 0
  );

  const updateQuantity = async (item, newQuantity) => {
    const authData = localStorage.getItem('buyer_data');
    if (authData) {
      const { loginType } = JSON.parse(authData);
      if (loginType === 'BUYER') {
        await apiService.cart.updateQuantity(item.variantId, newQuantity);
        return;
      }
    }

    // Update local storage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = cart.find(i => i.variantId === item.variantId);
    if (cartItem) {
      cartItem.quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      const authData = localStorage.getItem('auth_data');
      const { loginType } = authData ? JSON.parse(authData) : null;

      if (loginType === 'BUYER') {
        await apiService.cart.updateQuantity(itemToDelete.variantId, 0);
      } else {
        // Update local storage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter(i => i.variantId !== itemToDelete.variantId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      window.dispatchEvent(new CustomEvent('cartUpdated'));
      setItemToDelete(null);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[85vh] p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-semibold">Cart ({items.length})</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 relative">
                          <Link href={`/products/${item.product.id}`}>
                            <Image
                              src={item.variant.images[0].variations.thumbnail}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </Link>
                        </div>

                        <div className="flex-1">
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="font-semibold">{item.product.name}</h3>
                            {item.variant.name && (
                              <p className="text-sm text-gray-500">{item.variant.name}</p>
                            )}
                          </Link>
                          <div className="mt-2">
                            <PriceDisplay displayStyle="small" selectedVariant={item.variant} />
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                if (item.quantity === 1) {
                                  setItemToDelete(item);
                                } else {
                                  updateQuantity(item, item.quantity - 1);
                                }
                              }}
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="h-4 w-4 text-red-500" />
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-4 space-y-4 bg-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onClose}
                  asChild
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button 
                  className="w-full"
                  asChild
                >
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}