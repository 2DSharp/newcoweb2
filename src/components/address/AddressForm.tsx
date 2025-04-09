'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getPincodeDetails } from '@/lib/utils';
import { Loader2, MapPin, Home, Building2, User, Phone, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddressFormProps {
    initialData?: {
        label?: string;
        name: string;
        phone: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        state: string;
        pinCode: number;
        isDefault: boolean;
        landmark?: string;
    } | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [formData, setFormData] = useState({
        label: initialData?.label || '',
        name: initialData?.name || '',
        phone: initialData?.phone || '',
        addressLine1: initialData?.addressLine1 || '',
        addressLine2: initialData?.addressLine2 || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        pinCode: initialData?.pinCode || '',
        landmark: initialData?.landmark || '',
        isDefault: initialData?.isDefault || false,
    });
    const [isLoadingPincode, setIsLoadingPincode] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'pinCode' ? parseInt(value) || '' : value)
        }));
    };

    const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            pinCode: parseInt(value) || ''
        }));

        if (value.length === 6) {
            setIsLoadingPincode(true);
            try {
                const details = await getPincodeDetails(value);
                if (details) {
                    setFormData(prev => ({
                        ...prev,
                        addressLine2: details.area,
                        city: details.district,
                        state: details.state
                    }));
                }
            } catch (error) {
                console.error('Error fetching pincode details:', error);
            } finally {
                setIsLoadingPincode(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    {initialData ? 'Edit Address' : 'Add New Address'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Rajesh Kumar Sharma"
                                required
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g., 9876543210"
                                required
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pinCode" className="flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Pincode
                            </Label>
                            <div className="relative">
                                <Input
                                    id="pinCode"
                                    name="pinCode"
                                    type="number"
                                    value={formData.pinCode}
                                    onChange={handlePincodeChange}
                                    placeholder="e.g., 400001"
                                    required
                                    maxLength={6}
                                    className="bg-background"
                                />
                                {isLoadingPincode && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="label" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Label (Optional)
                            </Label>
                            <Input
                                id="label"
                                name="label"
                                value={formData.label}
                                onChange={handleChange}
                                placeholder="e.g., Home, Office, Mom's House"
                                className="bg-background"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="addressLine1" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Address Line 1
                            </Label>
                            <Input
                                id="addressLine1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                placeholder="e.g., Flat No. 5, Shanti Apartments"
                                required
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addressLine2" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Address Line 2
                            </Label>
                            <Input
                                id="addressLine2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                placeholder="e.g., 2nd Floor, Near Shivaji Park"
                                required
                                className="bg-background"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g., Mumbai"
                                    required
                                    className="bg-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="e.g., Maharashtra"
                                    required
                                    className="bg-background"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="landmark">Landmark (Optional)</Label>
                            <Input
                                id="landmark"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                placeholder="e.g., Near Shivaji Park, Opposite ICICI Bank"
                                className="bg-background"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="isDefault"
                            name="isDefault"
                            checked={formData.isDefault}
                            onCheckedChange={(checked) => {
                                setFormData(prev => ({
                                    ...prev,
                                    isDefault: checked as boolean
                                }));
                            }}
                        />
                        <Label htmlFor="isDefault" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Set as default address
                        </Label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {initialData ? 'Update Address' : 'Add Address'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 