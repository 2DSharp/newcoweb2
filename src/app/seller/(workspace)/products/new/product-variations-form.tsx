import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ImageIcon, Tag, Package, Clock, Info, Barcode, IndianRupee, X, Trash, Scale, BoxSelect } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

export default function ProductVariationsForm({ formData, updateFormData }) {
    const [validationError, setValidationError] = useState(false);

    React.useEffect(() => {
        if (!formData.variations || formData.variations.length === 0) {
            updateFormData('variations', [{}])
                } else {
            // Ensure all variations have properly formatted image data
            const updatedVariations = formData.variations.map(variation => ({
                ...variation,
                images: variation.images?.map(img => ({
                    imgId: img.imgId,
                    thumbnail: img.thumbnail,
                    url: img.url // Ensure URL is preserved
                })) || []
            }))
            updateFormData('variations', updatedVariations)
        }
    }, [])

    const handleVariationChange = (index, field, value) => {
        const updatedVariations = [...formData.variations]
            // Ensure the variation at this index exists and has all required fields
    if (!updatedVariations[index]) {
        updatedVariations[index] = {
            details: {},
            images: []
        }
    }

    // Special handling for images to ensure they're properly scoped to this variation
    if (field === 'images') {
        updatedVariations[index] = {
            ...updatedVariations[index],
            images: [...value] // Create new array to prevent reference issues
        }
    } else {
        updatedVariations[index] = {
            ...updatedVariations[index],
            [field]: value
        }
    }
        updateFormData('variations', updatedVariations)
    }

    const addVariation = () => {
        const lastVariation = formData.variations[formData.variations.length - 1]

        updateFormData('variations', [
            ...formData.variations,
            { 
                price: lastVariation.price || '', // Copy price
                weight: lastVariation.weight || '', // Copy price
                dimensions: lastVariation.dimensions || '', // Copy price
                processingTime: lastVariation.processingTime || '', // Copy processing time
                details: { ...lastVariation.details } || {}, // Deep copy details object
            }
        ])

    }

    const removeVariation = (index) => {
        if (formData.variations.length > 1) {
            const updatedVariations = formData.variations.filter((_, i) => i !== index)
            updateFormData('variations', updatedVariations)
        }
    }

    const validateVariations = () => {
        return formData.variations.every(variation => {
            if (variation.isCustom) {
                return variation.name &&
                    variation.price > 0 &&
                    variation.processingTime > 0 &&
                    variation.images?.length >= 1 &&
                    variation.images?.length <= 4;
            }
            return variation.name &&
                variation.price > 0 &&
                variation.processingTime > 0 &&
                variation.images?.length >= 1 &&
                variation.images?.length <= 4;
        });
    };

    const handleDetailsChange = (index: number, details: { key: string, value: string }[]) => {
        const updatedVariations = [...formData.variations]
        updatedVariations[index] = {
            ...updatedVariations[index],
            details: details.reduce((acc, detail) => {
                if (detail.key || detail.value) {
                    acc[detail.key] = detail.value
                }
                return acc
            }, {})
        }
        updateFormData('variations', updatedVariations)
    }

    const addDetail = (index: number) => {
        const variation = formData.variations[index]
        const updatedVariations = [...formData.variations]
        updatedVariations[index] = {
            ...variation,
            details: {
                ...(variation.details || {}),
                '': ''
            }
        }
        updateFormData('variations', updatedVariations)
    }

    useEffect(() => {
        // Clear validation error when form data changes
        setValidationError(false);
    }, [formData.variations]);

    // Add validation check to form submission
    const handleSubmit = (e) => {
        e?.preventDefault();
        if (!validateVariations()) {
            setValidationError(true);
            return false;
        }
        return true;
    };

    return (
        <div className="space-y-6">
            {(formData.variations || []).map((variation, index) => (
                <div key={index} className="p-4">
                    <div>

                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold">
                                {index === 0 ? 'Base Variation' : `Variation ${index + 1}`}
                            </h3>
                            {index !== 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeVariation(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <div className="grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`name-${index}`} className="flex items-center">
                                        <Tag className="mr-2 text-blue-500" size={16} />
                                        Variation Name {index !== 0 && '*'}
                                    </Label>
                                    <Input
                                        id={`name-${index}`}
                                        value={variation.name}
                                        onChange={(e) => handleVariationChange(index, 'name', e.target.value)}
                                        placeholder={index === 0 ? "Regular, Basic, Standard" : "e.g., Large Blue, Custom Size, Premium Edition"}
                                        required={index !== 0}
                                    />
                                    <p className="text-sm text-gray-500">
                                        {index === 0 
                                            ? "Optional name for your base product variation"
                                            : "Give this variation a unique, descriptive name to differentiate it"
                                        }
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`sku-${index}`} className="flex items-center">
                                        <Barcode className="mr-2 text-purple-500" size={16} />
                                        SKU
                                    </Label>
                                    <Input
                                        id={`sku-${index}`}
                                        value={variation.sku}
                                        onChange={(e) => handleVariationChange(index, 'sku', e.target.value)}
                                        placeholder="e.g., PROD-001-BLU, CUSTOM-LARGE-001"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Optional unique identifier for inventory tracking
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Price and Calculations Row */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`price-${index}`} className="flex items-center">
                                            <IndianRupee className="mr-2 text-green-500" size={16} />
                                            Selling Price Per Unit *
                                        </Label>
                                        <Input
                                            id={`price-${index}`}
                                            type="number"
                                            value={variation.price}
                                            onChange={(e) => handleVariationChange(index, 'price', Number(e.target.value))}
                                            step="1"
                                            required
                                        />
                                        <p className="text-sm text-gray-500">
                                            The final price that will be displayed to the customer. This price will be inclusive of all shipping and taxes.
                                        </p>
                                    </div>

                                    {/* Live Calculations */}
                                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                                        <Label className="text-sm text-gray-600">Commission (6% + GST)</Label>
                                        <div className="text-lg font-semibold text-red-600">
                                            ₹ {variation.price ? (((variation.price * 0.06) * 1.18).toFixed(2)) : '0.00'}
                                        </div>
                                        <p className="text-xs text-gray-500">Platform fee + 18% GST</p>
                                    </div>

                                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                                        <Label className="text-sm text-gray-600">Delivery + GST</Label>
                                        <div className="text-lg font-semibold text-orange-600">
                                            ₹ {variation.price ? ((85 * 1.18).toFixed(2)) : '0.00'}
                                        </div>
                                        <p className="text-xs text-gray-500">₹85 shipping + 18% GST</p>
                                    </div>

                                    <div className="space-y-2 bg-green-50 p-3 rounded-lg">
                                        <Label className="text-sm text-gray-600">Your Earnings</Label>
                                        <div className="text-lg font-semibold text-green-600">
                                            ₹ {variation.price ? (
                                                (variation.price - 
                                                (variation.price * 0.06 * 1.18) - 
                                                (85 * 1.18)
                                                ).toFixed(2)
                                            ) : '0.00'}
                                        </div>
                                        <p className="text-xs text-gray-500">Final amount after all deductions</p>
                                    </div>
                                </div>

                                {/* Stock and Processing Time Row */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id={`custom-${index}`}
                                            checked={variation.isCustom}
                                            onCheckedChange={(checked) => handleVariationChange(index, 'isCustom', checked)}
                                        />
                                        <Label htmlFor={`custom-${index}`}>Custom Variation</Label>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Enable for made-to-order or customizable items
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`stock-${index}`} className="flex items-center">
                                                <Package className="mr-2 text-orange-500" size={16} />
                                                Stock
                                            </Label>
                                            <Input
                                                id={`stock-${index}`}
                                                type="number"
                                                value={variation.stock}
                                                onChange={(e) => handleVariationChange(index, 'stock', Number(e.target.value))}
                                                min="0"
                                                disabled={variation.isCustom}
                                                className={variation.isCustom ? 'bg-gray-100' : ''}
                                                placeholder="Available quantity"
                                            />
                                            <p className="text-sm text-gray-500">
                                                {variation.isCustom 
                                                    ? "Stock tracking disabled for custom variations"
                                                    : "Number of items available for immediate purchase"
                                                }
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`processing-${index}`} className="flex items-center">
                                                <Clock className="mr-2 text-indigo-500" size={16} />
                                                Processing Time (days) *
                                            </Label>
                                            <Input
                                                id={`processing-${index}`}
                                                type="number"
                                                value={variation.processingTime}
                                                onChange={(e) => handleVariationChange(index, 'processingTime', Number(e.target.value))}
                                                min="1"
                                                required
                                                placeholder="e.g., 3"
                                            />
                                            <p className="text-sm text-gray-500">
                                                Number of days needed to prepare this variation for shipping
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`weight-${index}`} className="flex items-center">
                                        <Scale className="mr-2 text-purple-500" size={16} />
                                        Weight (kg) *
                                    </Label>
                                    <Input
                                        id={`weight-${index}`}
                                        type="number"
                                        value={variation.weight}
                                        onChange={(e) => handleVariationChange(index, 'weight', Number(e.target.value))}
                                        min="0.01"
                                        step="0.01"
                                        required
                                        placeholder="e.g., 1.5"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Approximate weight in kilograms
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`dimensions-${index}`} className="flex items-center">
                                        <BoxSelect className="mr-2 text-yellow-500" size={16} />
                                        Dimensions (cm) *
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input
                                            type="number"
                                            value={variation.dimensions?.l}
                                            onChange={(e) => handleVariationChange(index, 'dimensions', {
                                                ...variation.dimensions,
                                                l: Number(e.target.value)
                                            })}
                                            min="1"
                                            required
                                            placeholder="Length"
                                        />
                                        <Input
                                            type="number"
                                            value={variation.dimensions?.w}
                                            onChange={(e) => handleVariationChange(index, 'dimensions', {
                                                ...variation.dimensions,
                                                w: Number(e.target.value)
                                            })}
                                            min="1"
                                            required
                                            placeholder="Width"
                                        />
                                        <Input
                                            type="number"
                                            value={variation.dimensions?.h}
                                            onChange={(e) => handleVariationChange(index, 'dimensions', {
                                                ...variation.dimensions,
                                                h: Number(e.target.value)
                                            })}
                                            min="1"
                                            required
                                            placeholder="Height"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Length × Width × Height in centimeters
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center">
                                    <ImageIcon className="mr-2 text-green-500" size={16} />
                                    Sample Photos (1-5 required) *
                                </Label>
                                <p className="text-sm text-gray-500">
                                    Upload 1-5 high-quality images showing this variation from different angles
                                </p>
                                <ImageUploader
                                    images={variation.images || []}
                                    onChange={(newImages) => handleVariationChange(index, 'images', newImages)}
                                    maxImages={5}
                                    variationIndex={index}
                                />
                               
                            </div>

                            <div className="space-y-2 mt-4">
                                <Label className="flex items-center">
                                    <Info className="mr-2 text-blue-500" size={16} />
                                    Variant Specifications (Optional)
                                </Label>
                                <p className="text-sm text-gray-500">
                                    Add product specifications like dimensions, color, material etc.
                                </p>
                                <div className="border rounded-md overflow-hidden">
                                    {/* Desktop layout */}
                                    <div className="hidden md:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                                    <TableHead className="font-medium">Feature</TableHead>
                                                    <TableHead className="font-medium border-l">Value</TableHead>
                                                    <TableHead className="w-[40px] border-l"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Object.entries(variation.details || {}).map(([key, value], detailIndex) => (
                                                    <TableRow key={detailIndex} className="hover:bg-gray-50">
                                                        <TableCell className="p-0">
                                                            <Input 
                                                                value={key}
                                                                onChange={(e) => {
                                                                    const newDetails = { ...variation.details }
                                                                    const oldValue = newDetails[key]
                                                                    delete newDetails[key]
                                                                    newDetails[e.target.value] = oldValue
                                                                    handleDetailsChange(index, Object.entries(newDetails).map(([k, v]) => ({ key: k, value: v })))
                                                                }}
                                                                placeholder="e.g., Dimensions"
                                                                className="border-0 focus:ring-0 focus:ring-offset-0 rounded-none h-11"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="p-0 border-l">
                                                            <Input 
                                                                value={value}
                                                                onChange={(e) => {
                                                                    const newDetails = { ...variation.details }
                                                                    newDetails[key] = e.target.value
                                                                    handleDetailsChange(index, Object.entries(newDetails).map(([k, v]) => ({ key: k, value: v })))
                                                                }}
                                                                placeholder="e.g., 10x20x30 cm"
                                                                className="border-0 focus:ring-0 focus:ring-offset-0 rounded-none h-11"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="border-l w-[40px] text-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => {
                                                                    const newDetails = { ...variation.details }
                                                                    delete newDetails[key]
                                                                    handleDetailsChange(index, Object.entries(newDetails).map(([k, v]) => ({ key: k, value: v })))
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell colSpan={3} className="p-0">
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full rounded-none h-11 hover:bg-gray-50"
                                                            onClick={() => addDetail(index)}
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Detail
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Mobile layout */}
                                    <div className="md:hidden divide-y">
                                        {Object.entries(variation.details || {}).map(([key, value], detailIndex) => (
                                            <div key={detailIndex} className="relative bg-white">
                                                <div className="p-3 space-y-3">
                                                    <div className="pr-8">
                                                        <Label className="text-xs text-gray-500 mb-1">Feature</Label>
                                                        <Input 
                                                            value={key}
                                                            onChange={(e) => {
                                                                const newDetails = { ...variation.details }
                                                                const oldValue = newDetails[key]
                                                                delete newDetails[key]
                                                                newDetails[e.target.value] = oldValue
                                                                handleDetailsChange(index, Object.entries(newDetails).map(([k, v]) => ({ key: k, value: v })))
                                                            }}
                                                            placeholder="e.g., Dimensions"
                                                            className="border-0 focus:ring-0 focus:ring-offset-0 bg-gray-50/50 h-9"
                                                        />
                                                    </div>
                                                    <div className="pr-8 border-t">
                                                        <Label className="text-xs text-gray-500 mb-1">Value</Label>
                                                        <Input 
                                                            value={value}
                                                            onChange={(e) => {
                                                                const newDetails = { ...variation.details }
                                                                newDetails[key] = e.target.value
                                                                handleDetailsChange(index, Object.entries(newDetails).map(([k, v]) => ({ key: k, value: v })))
                                                            }}
                                                            placeholder="e.g., 10x20x30 cm"
                                                            className="border-0 focus:ring-0 focus:ring-offset-0 bg-gray-50/50 h-9"
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-3 right-2 h-8 w-8 p-0"
                                                    onClick={() => {
                                                        const newDetails = { ...variation.details }
                                                        delete newDetails[key]
                                                        handleDetailsChange(index, Object.entries(newDetails).map(([k, v]) => ({ key: k, value: v })))
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        
                                        <Button
                                            variant="ghost"
                                            className="w-full h-11 rounded-none"
                                            onClick={() => addDetail(index)}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Detail
                                        </Button>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {validationError && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Please ensure all variations have a name, price, and 1-4 images.
                        {!formData.variations[0].isCustom && " Stock is required for non-custom variations."}
                    </AlertDescription>
                </Alert>
            )}

            <Button
                variant="outline"
                onClick={addVariation}
                className="w-full"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Variation
            </Button>
        </div>
    )
}