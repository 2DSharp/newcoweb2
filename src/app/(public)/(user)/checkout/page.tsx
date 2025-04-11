"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import apiService from "@/services/api.js";
import { Checkbox } from "@/components/ui/checkbox";
import { AddressForm } from "@/components/address/AddressForm";

interface Address {
  id: string;
  label: string | null;
  name: string | null;
  phone: string | null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: number;
  landmark: string;
  default: boolean;
}

interface CartItem {
  productId: string;
  variantId: string;
  pricingId: string;
  quantity: number;
  productName: string;
  variantName: string;
  finalPrice: string;
  originalPrice: string;
  images: any[];
}

const PAYMENT_METHODS = [
  { id: "DEBIT_CARD", label: "Debit Card" },
  { id: "CREDIT_CARD", label: "Credit Card" },
  { id: "UPI", label: "UPI" },
  { id: "NETBANKING", label: "Net Banking" },
  { id: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
];

function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [processedCartItems, setProcessedCartItems] = useState<any[]>([]);
  const [isFromCart, setIsFromCart] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [newAddress, setNewAddress] = useState({
    label: "",
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    landmark: "",
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('buyer_data');
      if (!authData) {
        // Not logged in, redirect to login
        const currentUrl = window.location.href;
        router.push(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
        return false;
      }

      const { loginType } = JSON.parse(authData);
      if (loginType !== 'BUYER') {
        // Not a buyer, redirect to login
        const currentUrl = window.location.href;
        router.push(`/login?redirectUrl=${encodeURIComponent(currentUrl)}`);
        return false;
      }

      return true;
    };

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check authentication first
        if (!checkAuth()) {
          return;
        }

        // Check if checkout is from cart
        const fromCart = searchParams.get("fromCart") === "true";
        setIsFromCart(fromCart);

        // Load data based on source (cart or direct product)
        if (fromCart) {
          // Load cart items
          const cartResponse = await apiService.cart.getItems();
          if (cartResponse.successful && cartResponse.data.length > 0) {
            setCartItems(cartResponse.data);
            
            // Fetch detailed product information for each cart item
            const enhancedCartItems = await Promise.all(
              cartResponse.data.map(async (cartItem) => {
                try {
                  // Get full product details from product API
                  const productResponse = await apiService.products.getProduct(cartItem.productId);
                  
                  if (productResponse.successful) {
                    // Find the specific variant
                    const variant = productResponse.data.stock.variations.find(
                      (v: any) => v.variantId === cartItem.variantId
                    );
                    
                    if (variant) {
                      return {
                        ...cartItem,
                        productDetails: productResponse.data,
                        variantDetails: variant,
                        images: variant.images || [],
                        finalPrice: variant.pricing?.finalPrice || "0",
                        originalPrice: variant.pricing?.originalPrice || "0"
                      };
                    }
                  }
                  // If we can't get detailed info, return the original cart item
                  return cartItem;
                } catch (error) {
                  console.error(`Error fetching details for product ${cartItem.productId}:`, error);
                  return cartItem;
                }
              })
            );
            
            setProcessedCartItems(enhancedCartItems);
          } else {
            throw new Error("Your cart is empty");
          }
        } else {
          // Get single product details
          const productId = searchParams.get("product");
          const variantId = searchParams.get("variantId");
          const quantity = searchParams.get("quantity");
          const pricingVariantId = searchParams.get("pricingVariantId");

          if (!productId || !variantId || !quantity || !pricingVariantId) {
            throw new Error("Missing required parameters");
          }

          // Load product details
          const productResponse = await apiService.products.getProduct(productId);
          if (productResponse.successful) {
            const variant = productResponse.data.stock.variations.find(
              (v: any) => v.variantId === variantId
            );

            if (!variant) {
              throw new Error("Variant not found");
            }

            setProduct({
              ...productResponse.data,
              selectedVariant: variant,
              quantity: parseInt(quantity),
              pricingVariantId
            });
          } else {
            throw new Error("Failed to load product details");
          }
        }

        // Load addresses
        const addressResponse = await apiService.accounts.getAddresses();
        if (addressResponse.successful) {
          setAddresses(addressResponse.data);
          // Find default address or use first address
          const defaultAddress = addressResponse.data.find(addr => addr.default) || addressResponse.data[0];
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          } else {
            // If no addresses exist, show the form
            setShowAddressForm(true);
          }
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router, searchParams]);

  const handleAddAddress = async (formData: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.accounts.addAddress(formData);
      if (response.successful) {
        // Refresh addresses list
        const addressResponse = await apiService.accounts.getAddresses();
        if (addressResponse.successful) {
          setAddresses(addressResponse.data);
          setSelectedAddress(response.data); // Select newly added address
          setShowAddressForm(false);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedAddress) {
        throw new Error("Please select a delivery address");
      }

      // Create order data object
      let orderData: any = {
        paymentMethod,
        deliveryAddress: selectedAddress,
        billingAddress: selectedAddress,
      };

      // Only add item details if not purchasing from cart
      if (!isFromCart) {
        orderData.item = {
          product: searchParams.get("product"),
          variantId: searchParams.get("variantId"),
          quantity: parseInt(searchParams.get("quantity")!),
          pricingVariantId: searchParams.get("pricingVariantId"),
        };
      }

      const response = await apiService.orders.create(orderData);
      if (response.successful) {
        // If order was from cart, trigger a cart update event
        if (isFromCart) {
          // Dispatch event to update cart counts in the UI
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
        router.push(`/orders/${response.data}`);
      } else {
        throw new Error(response.message || "Failed to place order");
      }
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price for cart items
  const calculateCartTotal = () => {
    return processedCartItems.reduce((sum, item) => {
      let price = 0;
      
      if (item.variantDetails && item.variantDetails.pricing && typeof item.variantDetails.pricing.finalPrice === 'string') {
        price = parseFloat(item.variantDetails.pricing.finalPrice.replace(/,/g, ''));
      } else if (typeof item.finalPrice === 'string') {
        price = parseFloat(item.finalPrice.replace(/,/g, ''));
      }
      
      return sum + (price * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/15 text-destructive rounded-md p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-12 gap-8">
        {/* Left Column - Order Items and Payment */}
        <div className="md:col-span-7">
          {/* Product Summary */}
          {!isFromCart && product && (
            <div className="mb-8 border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="flex gap-4">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={product.selectedVariant.images && 
                         product.selectedVariant.images.length > 0 && 
                         product.selectedVariant.images[0].variations?.thumbnail
                      ? product.selectedVariant.images[0].variations.thumbnail 
                      : '/placeholder-image.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  {product.selectedVariant.name && (
                    <p className="text-sm text-gray-500">{product.selectedVariant.name}</p>
                  )}
                  <p className="mt-1">Quantity: {product.quantity}</p>
                  <p className="mt-1 font-medium">
                    ₹{product.selectedVariant.pricing && typeof product.selectedVariant.pricing.finalPrice === 'string'
                       ? (parseFloat(product.selectedVariant.pricing.finalPrice.replace(/,/g, '')) * product.quantity).toFixed(2)
                       : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cart Items Summary */}
          {isFromCart && processedCartItems.length > 0 && (
            <div className="mb-8 border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {processedCartItems.map((item) => (
                  <div key={item.variantId} className="flex gap-4 border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={
                          item.variantDetails && item.variantDetails.images && item.variantDetails.images.length > 0 && item.variantDetails.images[0].variations?.thumbnail
                            ? item.variantDetails.images[0].variations.thumbnail
                            : item.images && item.images.length > 0 && item.images[0].variations?.thumbnail 
                               ? item.images[0].variations.thumbnail 
                               : '/placeholder-image.jpg'
                        }
                        alt={item.productName}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.productName}</h3>
                      {item.variantName && (
                        <p className="text-sm text-gray-500">{item.variantName}</p>
                      )}
                      <p className="text-sm">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium">
                        ₹{
                          item.variantDetails && item.variantDetails.pricing && typeof item.variantDetails.pricing.finalPrice === 'string'
                            ? (parseFloat(item.variantDetails.pricing.finalPrice.replace(/,/g, '')) * item.quantity).toFixed(2)
                            : typeof item.finalPrice === 'string' 
                               ? (parseFloat(item.finalPrice.replace(/,/g, '')) * item.quantity).toFixed(2)
                               : '0.00'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Section - Moved to left column */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-4"
            >
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center space-x-2 border rounded-lg p-4"
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id}>{method.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Right Column - Address and Order Summary */}
        <div className="md:col-span-5">
          {/* Delivery Address Section */}
          <div className="mb-6 border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Delivery Address</h2>
              {!showAddressForm && selectedAddress && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllAddresses(!showAllAddresses)}
                >
                  {showAllAddresses ? "Cancel" : "Edit"}
                </Button>
              )}
            </div>

            {showAddressForm ? (
              <AddressForm 
                onSubmit={handleAddAddress}
                onCancel={() => setShowAddressForm(false)}
                initialData={null}
              />
            ) : (
              <div>
                {/* Currently Selected Address */}
                {selectedAddress && !showAllAddresses && (
                  <div className="border rounded-lg p-4">
                    <p className="font-medium">{selectedAddress.name}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.addressLine1}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.addressLine2}</p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pinCode}
                    </p>
                    {selectedAddress.landmark && (
                      <p className="text-sm text-gray-600">
                        Landmark: {selectedAddress.landmark}
                      </p>
                    )}
                    <p className="text-sm text-black-600">Phone: {selectedAddress.phone}</p>
                  </div>
                )}

                {/* All Addresses (Shown when Edit is clicked) */}
                {showAllAddresses && (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer ${
                          selectedAddress?.id === address.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => {
                          setSelectedAddress(address);
                          setShowAllAddresses(false);
                        }}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm text-gray-600">{address.addressLine1}</p>
                            <p className="text-sm text-gray-600">{address.addressLine2}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.pinCode}
                            </p>
                            {address.landmark && (
                              <p className="text-sm text-gray-600">
                                Landmark: {address.landmark}
                              </p>
                            )}
                            <p className="text-sm text-black-600">Phone: {address.phone}</p>
                          </div>
                          {address.default && (
                            <span className="text-sm text-primary">Default</span>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setShowAddressForm(true);
                        setShowAllAddresses(false);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>
                )}

                {/* Button to add new address when no addresses exist */}
                {!selectedAddress && addresses.length === 0 && !showAddressForm && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">No delivery addresses found</p>
                    <Button 
                      onClick={() => setShowAddressForm(true)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary - Moved below address section */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₹
                  {isFromCart 
                    ? calculateCartTotal().toFixed(2)
                    : product && product.selectedVariant && product.selectedVariant.pricing && typeof product.selectedVariant.pricing.finalPrice === 'string'
                      ? (parseFloat(product.selectedVariant.pricing.finalPrice.replace(/,/g, '')) * product.quantity).toFixed(2)
                      : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>₹40.00</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>
                  ₹
                  {isFromCart
                    ? (calculateCartTotal() + 40).toFixed(2)
                    : product && product.selectedVariant && product.selectedVariant.pricing && typeof product.selectedVariant.pricing.finalPrice === 'string'
                      ? ((parseFloat(product.selectedVariant.pricing.finalPrice.replace(/,/g, '')) * product.quantity) + 40).toFixed(2)
                      : "0.00"}
                </span>
              </div>

              <Button
                className="w-full mt-4"
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPageFull() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }
    >
      <CheckoutPage />
    </Suspense>
  )
}