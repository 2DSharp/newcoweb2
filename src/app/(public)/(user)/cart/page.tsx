'use client';

import { useEffect, useState } from 'react';
import apiService from '@/services/api';
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        const loadCartItems = async () => {
            const authData = localStorage.getItem('auth_data');
            let items = [];
            
            if (authData) {
                const { loginType } = JSON.parse(authData);
                if (loginType === 'BUYER') {
                    // TODO: Implement API call to get cart items
                    return;
                }
            }
            
            items = JSON.parse(localStorage.getItem('cart') || '[]');
            
            // Load product details in parallel
            const itemsWithDetails = await Promise.all(
                items.map(async (item) => {
                    try {
                      
                        const product = await apiService.products.getProduct(item.productId);

                        const variant = product.stock.variations.find(v => v.variantId === item.variantId);
                        const pricing = variant.pricing;
                        console.log("Pricing + " , pricing);

                        return {
                            ...item,
                            product,
                            variant,
                            pricing,
                            priceChanged: !pricing
                        };
                    } catch (error) {
                        console.error('Error loading product:', error);
                        return null;
                    }
                })
            );
            console.log(itemsWithDetails);
            setCartItems(itemsWithDetails.filter(item => item !== null));
            setLoading(false);
        };
        
        loadCartItems();
    }, []);

    const updateQuantity = async (item, newQuantity) => {
        const authData = localStorage.getItem('auth_data');
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
     
          setCartItems(prev => prev.filter(item => item.variantId !== itemToDelete.variantId));
          setItemToDelete(null);
          window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (error) {
          console.error('Error removing item from cart:', error);
      }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
                <Link href="/">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        );
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
        {cartItems.map((item) => (
                    <div key={item.variantId} className="border rounded-lg p-4">
                        <div className="flex gap-4">
                            <div className="w-24 h-24 relative">
                                <Image
                                    src={item.variant.images[0].variations.thumbnail}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.product.name}</h3>
                                {item.variant.name && (
                                    <p className="text-sm text-gray-500">{item.variant.name}</p>
                                )}
                                <div className="mt-2">
                                    {item.priceChanged ? (
                                        <p className="text-red-600">Price has changed since adding to cart</p>
                                    ) : (
                                        <p className="font-medium">₹{item.pricing.finalPrice}</p>
                                    )}
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
              <span>₹{cartItems.reduce((sum, item) => sum + (parseFloat(item.pricing.finalPrice) * item.quantity), 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Fee</span>  
              <span>₹40.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Taxes</span>
              <span>₹{(cartItems.reduce((sum, item) => sum + (item.pricing.finalPrice * item.quantity), 0) * 0.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total</span>
              <span>₹{(
                cartItems.reduce((sum, item) => sum + (item.pricing.finalPrice * item.quantity), 0) + 
                40 + 
                (cartItems.reduce((sum, item) => sum + (item.pricing.finalPrice * item.quantity), 0) * 0.18)
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

