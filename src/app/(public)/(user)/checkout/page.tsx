"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import apiService from "@/services/api.js";
import { Checkbox } from "@/components/ui/checkbox";

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

const PAYMENT_METHODS = [
  { id: "DEBIT_CARD", label: "Debit Card" },
  { id: "CREDIT_CARD", label: "Credit Card" },
  { id: "UPI", label: "UPI" },
  { id: "NETBANKING", label: "Net Banking" },
  { id: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get product details
        const productId = searchParams.get("product");
        const variantId = searchParams.get("variantId");
        const quantity = searchParams.get("quantity");
        const pricingVariantId = searchParams.get("pricingVariantId");

        if (!productId || !variantId || !quantity || !pricingVariantId) {
          throw new Error("Missing required parameters");
        }

        // Load product details
        const productResponse = await apiService.products.getProduct(productId);

        const variant = productResponse.stock.variations.find(
          (v: any) => v.variantId === variantId
        );

        if (!variant) {
          throw new Error("Variant not found");
        }

        setProduct({
          ...productResponse,
          selectedVariant: variant,
          quantity: parseInt(quantity),
          pricingVariantId
        });

        // Load addresses
        const addressResponse = await apiService.accounts.getAddresses();
        if (addressResponse.successful) {
          setAddresses(addressResponse.data);
          console.log(addressResponse.data);
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
  }, [searchParams]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.accounts.addAddress(newAddress);
      if (response.successful) {
        // Refresh addresses list
        const addressResponse = await apiService.accounts.getAddresses();
        if (addressResponse.successful) {
          setAddresses(addressResponse.data);
          setSelectedAddress(response.data); // Select newly added address
          setShowAddressForm(false);
          
          // Clear the form
          setNewAddress({
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

      const orderData = {
        item: {
          product: searchParams.get("product"),
          variantId: searchParams.get("variantId"),
          quantity: parseInt(searchParams.get("quantity")!),
          pricingVariantId: searchParams.get("pricingVariantId"),
        },
        paymentMethod,
        deliveryAddress: selectedAddress,
        billingAddress: selectedAddress,
      };

      const response = await apiService.orders.create(orderData);
      if (response.successful) {
        router.push(`/orders/${response.orderId}`);
      } else {
        throw new Error(response.message || "Failed to place order");
      }
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-2xl font-bold mb-8">Place Order</h1>
      
      {/* Product Summary */}
      {product && (
        <div className="mb-8 border rounded-lg p-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 relative flex-shrink-0">
              <Image
                src={product.selectedVariant.images[0].variations.thumbnail}
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
                ₹{(product.selectedVariant.pricing.finalPrice * product.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Addresses Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Delivering to</h2>
            <Button
              variant="outline"
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              {showAddressForm ? "Cancel" : "Add New Address"}
            </Button>
          </div>

{showAddressForm ? (
  <form onSubmit={handleAddAddress} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={newAddress.name}
          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            +91
          </span>
          <Input
            id="phone"
            type="tel"
            className="pl-12"
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            pattern="[0-9]{10}"
            maxLength={10}
            required
          />
        </div>
      </div>
    </div>

    <div>
      <Label htmlFor="addressLine1">Address Line 1</Label>
      <Input
        id="addressLine1"
        value={newAddress.addressLine1}
        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
        placeholder="House No., Building Name"
        required
      />
    </div>

    <div>
      <Label htmlFor="addressLine2">Address Line 2</Label>
      <Input
        id="addressLine2"
        value={newAddress.addressLine2}
        onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
        placeholder="Street, Area"
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={newAddress.city}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={newAddress.state}
          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="pinCode">PIN Code</Label>
        <Input
          id="pinCode"
          type="text"
          value={newAddress.pinCode}
          onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
          pattern="[0-9]{6}"
          maxLength={6}
          required
        />
      </div>
      <div>
        <Label htmlFor="landmark">Landmark (Optional)</Label>
        <Input
          id="landmark"
          value={newAddress.landmark}
          onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
          placeholder="Nearby landmark"
        />
      </div>
    </div>

    <div className="flex items-center space-x-2">
      <Checkbox
        id="isDefault"
        checked={newAddress.isDefault}
        onCheckedChange={(checked) => 
          setNewAddress({ ...newAddress, isDefault: checked as boolean })
        }
      />
      <Label htmlFor="isDefault">Set as default address</Label>
    </div>

    <div className="flex justify-end space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowAddressForm(false)}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Save Address
      </Button>
    </div>
  </form>
)  : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedAddress?.id === address.id
                      ? "border-primary"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{address.addressLine1}</p>
                      <p className="text-sm text-gray-600">{address.addressLine2}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.pinCode}
                      </p>
                      {address.landmark && (
                        <p className="text-sm text-gray-600">
                          Landmark: {address.landmark}
                        </p>
                      )}
                    </div>
                    {address.default && (
                      <span className="text-sm text-primary">Default</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-4"
          >
            {PAYMENT_METHODS.map((method) => (
              <div
                key={method.id}
                className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => setPaymentMethod(method.id)}
              >
                <div className="flex items-center flex-1">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label 
                    htmlFor={method.id} 
                    className="flex-1 ml-2 cursor-pointer"
                  >
                    {method.label}
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="mt-8 space-y-4 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                ₹
                {product
                  ? (
                      product.selectedVariant.pricing.finalPrice * product.quantity
                    ).toFixed(2)
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
                {product
                  ? (
                      product.selectedVariant.pricing.finalPrice * product.quantity +
                      40
                    ).toFixed(2)
                  : "0.00"}
              </span>
            </div>

            <Button
              className="w-full"
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
  );
}

