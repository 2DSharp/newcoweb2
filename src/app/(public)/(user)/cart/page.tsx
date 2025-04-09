'use client';

import { Suspense, useEffect, useState } from 'react';
import apiService from '@/services/api';
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
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
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { parseCurrency } from '@/lib/utils';
import { PriceDisplay } from '@/components/ProductInfo';
function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams()
    const { toast } = useToast();
 
    const added = searchParams.get('added')
  
    // Add a function to listen for cart updates
    useEffect(() => {
        const handleCartUpdate = () => {
            loadCartItems();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    // Separate loadCartItems into its own function
    const loadCartItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const authData = localStorage.getItem('buyer_data');
            let items = [];
            
            if (authData) {
                const { loginType } = JSON.parse(authData);
                if (loginType === 'BUYER') {
                    // TODO: Implement API call to get cart items
                    return;
                }
            }
            
            items = JSON.parse(localStorage.getItem('cart') || '[]');
            
            if (items.length === 0) {
                setCartItems([]);
                setLoading(false);
                return;
            }

            // Load product details in parallel
            const itemsWithDetails = await Promise.all(
                items.map(async (item) => {
                    try {
                        const product = (await apiService.products.getProduct(item.productId)).data;
                        const variant = product.stock.variations.find(v => v.variantId === item.variantId);
                        const pricing = variant.pricing;
                        if (!pricing || pricing.pricingId !== item.pricingId) {
                            toast({
                                title: "Price Changed",
                                description: `The price of ${product.name}${variant.name ? ` - ${variant.name}` : ''} has changed since you added it to the cart. Current price: ₹${pricing.finalPrice}`,
                                variant: "destructive",
                            });
                        }
                        return {
                            ...item,
                            product,
                            variant,
                            pricing,
                            priceChanged: !pricing || pricing.pricingId !== item.pricingId
                        };
                    } catch (error) {
                        console.error('Error loading product:', error);
                        return null;
                    }
                })
            );
            
            setCartItems(itemsWithDetails.filter(item => item !== null));
        } catch (error) {
            console.error('Error loading cart:', error);
            setError('Failed to load cart items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadCartItems();
        
        if (added) {
            toast({
                title: "Item Added",
                description: "Item has been added to your cart",
            });
        }
    }, [added]);

    const updateQuantity = async (item, newQuantity) => {
        const authData = localStorage.getItem('buyer_data');
        if (authData) {
            const { loginType } = JSON.parse(authData);
            if (loginType === 'BUYER') {
                await apiService.cart.updateQuantity(item.variantId, newQuantity);
                // Refresh cart items
                // TODO: Implement API call to get updated cart items
                return;
            }
        }

        // Update local storage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = cart.find(i => i.variantId === item.variantId);
        if (cartItem) {
            cartItem.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update state
            setCartItems(prevItems => 
                prevItems.map(i => 
                    i.variantId === item.variantId 
                        ? { ...i, quantity: newQuantity }
                        : i
                )
            );
        }
    };

    const handleDeleteItem = async () => {
        if (!itemToDelete) return;

        try {
          const authData = localStorage.getItem('buyer_data');
          const { loginType } = authData ? JSON.parse(authData) : null;

          if (loginType === 'BUYER') {
              await apiService.cart.updateQuantity(itemToDelete.variantId, 0);
          } else {
              // Update local storage
              const cart = JSON.parse(localStorage.getItem('cart') || '[]');
              const updatedCart = cart.filter(i => i.variantId !== itemToDelete.variantId);
              localStorage.setItem('cart', JSON.stringify(updatedCart));
            }
     
          setCartItems(prev => prev.filter(item => item.variantId !== itemToDelete.variantId));
          setItemToDelete(null);
          window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (error) {
          console.error('Error removing item from cart:', error);
      }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
                    <p className="text-gray-500">Looks like you haven't added any items to your cart yet.</p>
                    <div className="pt-4">
                        <Link href="/">
                            <Button>Continue Shopping</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

  return (
    
    <div className="container mx-auto px-4 py-8">
          <Toaster />

      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
        {cartItems.map((item) => (
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
        <div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{cartItems.reduce((sum, item) => sum + (parseCurrency(item.pricing.finalPrice) * item.quantity), 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery and Taxes</span>  
              <span>55.00</span>
            </div>
        
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total</span>
              <span>₹{(
                cartItems.reduce((sum, item) => sum + (parseCurrency(item.pricing.finalPrice) * item.quantity), 0) + 
                55 
              ).toFixed(2)}</span>
            </div>
            <Button asChild className="w-full mt-6">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
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
    </div>
  )
}

export default function CartPageFull() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }
    >
      <CartPage />
    </Suspense>
  )
}