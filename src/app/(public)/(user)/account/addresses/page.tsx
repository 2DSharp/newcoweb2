'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressForm } from '@/components/address/AddressForm';
import { apiService } from '@/services/api';
import { useToast } from "@/hooks/use-toast";
import { MapPin, Edit2, Star, Plus, Trash2, CheckCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Address {
    id: string;
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
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await apiService.accounts.getAddresses();
            if (response.successful) {
                console.log("Addresses from API:", response.data);
                setAddresses(response.data);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch addresses",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAddress = async (addressData: any) => {
        try {
            const response = await apiService.accounts.addAddress(addressData);
            if (response.successful) {
                toast({
                    title: "Success",
                    description: "Address added successfully",
                });
                setIsDialogOpen(false);
                fetchAddresses();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add address",
                variant: "destructive",
            });
        }
    };

    const handleUpdateAddress = async (addressData: any) => {
        if (!editingAddress) return;
        try {
            const response = await apiService.accounts.updateAddress(editingAddress.id, addressData);
            if (response.successful) {
                toast({
                    title: "Success",
                    description: "Address updated successfully",
                });
                setIsDialogOpen(false);
                setEditingAddress(null);
                fetchAddresses();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update address",
                variant: "destructive",
            });
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            const address = addresses.find(a => a.id === addressId);
            if (!address) return;

            const response = await apiService.accounts.updateAddress(addressId, {
                ...address,
                isDefault: true
            });

            if (response.successful) {
                toast({
                    title: "Success",
                    description: "Default address updated",
                });
                fetchAddresses();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update default address",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Addresses</h1>
                <Button onClick={() => {
                    setEditingAddress(null);
                    setIsDialogOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Address
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : addresses.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg text-muted-foreground mb-4">No addresses found</p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Your First Address
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addresses.map((address) => {
                        console.log("Address item:", address.id, "isDefault:", address.isDefault, "default:", (address as any).default);
                        // Normalize the default property - check both possible property names
                        const isDefaultAddress = address.isDefault || (address as any).default;
                        
                        return (
                        <Card key={address.id} className={`relative ${isDefaultAddress ? 'border-primary' : ''}`}>
                      
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium">
                                            {address.name}
                                            {address.label && (
                                                <span className="text-muted-foreground ml-1">
                                                    ({address.label})
                                                </span>
                                            )}
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingAddress(address);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {address.addressLine1}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.addressLine2}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.landmark && (
                                            <span>Near {address.landmark}, </span>
                                        )}
                                        {address.city}, {address.state} - {address.pinCode}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Phone: {address.phone}
                                    </p>
                                    {isDefaultAddress ? (
                                        <div className="inline-flex items-center gap-1 px-2 py-1 mt-2 text-xs font-medium rounded-full bg-green-50 text-green-600 border border-green-200">
                                            <CheckCircle className="h-3 w-3" />
                                            Default Address
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => handleSetDefault(address.id)}
                                        >
                                            <Star className="mr-1 h-3 w-3" />
                                            Set as Default
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        );
                    })}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </DialogTitle>
                    </DialogHeader>
                    <AddressForm
                        initialData={editingAddress}
                        onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
                        onCancel={() => {
                            setIsDialogOpen(false);
                            setEditingAddress(null);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
} 