import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ImageIcon, Tag, Package, Clock, Info, Barcode, IndianRupee } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ImageUploader from '@/components/ImageUploader'

export default function ProductVariationsForm({ formData, updateFormData }) {
    React.useEffect(() => {
        if (!formData.variations || formData.variations.length === 0) {
            updateFormData('variations', [{}])
        }
    }, [])

    const handleVariationChange = (index, field, value) => {
        const updatedVariations = [...formData.variations]
        updatedVariations[index] = {
            ...updatedVariations[index],
            [field]: value
        }
        updateFormData('variations', updatedVariations)
    }

    const addVariation = () => {
        updateFormData('variations', [
            ...formData.variations,
            {}
        ])
    }

    const removeVariation = (index) => {
        if (formData.variations.length > 1) {
            const updatedVariations = formData.variations.filter((_, i) => i !== index)
            updateFormData('variations', updatedVariations)
        }
    }

    return (
        <div className="space-y-6">
            {(formData.variations || []).map((variation, index) => (
                <Card key={index} className="p-4">
                    <CardContent>
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
                                            min="100"
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
                                            ₹ {(((variation.price || 0) * 0.06) * 1.18).toFixed(2)}
                                        </div>
                                        <p className="text-xs text-gray-500">Platform fee + 18% GST</p>
                                    </div>

                                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                                        <Label className="text-sm text-gray-600">Delivery + GST</Label>
                                        <div className="text-lg font-semibold text-orange-600">
                                            ₹ {(85 * 1.18).toFixed(2)}
                                        </div>
                                        <p className="text-xs text-gray-500">₹85 shipping + 18% GST</p>
                                    </div>

                                    <div className="space-y-2 bg-green-50 p-3 rounded-lg">
                                        <Label className="text-sm text-gray-600">Your Earnings</Label>
                                        <div className="text-lg font-semibold text-green-600">
                                            ₹ {(
                                                (variation.price || 0) - 
                                                ((variation.price || 0) * 0.06 * 1.18) - 
                                                (85 * 1.18)
                                            ).toFixed(2)}
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
                                                Stock {!variation.isCustom && '*'}
                                            </Label>
                                            <Input
                                                id={`stock-${index}`}
                                                type="number"
                                                value={variation.stock}
                                                onChange={(e) => handleVariationChange(index, 'stock', Number(e.target.value))}
                                                min="0"
                                                required={!variation.isCustom}
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
                                                Processing Time (days)
                                            </Label>
                                            <Input
                                                id={`processing-${index}`}
                                                type="number"
                                                value={variation.processingTime}
                                                onChange={(e) => handleVariationChange(index, 'processingTime', Number(e.target.value))}
                                                min="1"
                                                placeholder="e.g., 3"
                                            />
                                            <p className="text-sm text-gray-500">
                                                Number of days needed to prepare this variation for shipping
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center">
                                    <ImageIcon className="mr-2 text-red-500" size={16} />
                                    Sample  (1-4 required) *
                                </Label>
                                <ImageUploader
                                    images={variation.images || []}
                                    onChange={(newImages) => handleVariationChange(index, 'images', newImages)}
                                    maxImages={4}
                                />
                                <p className="text-sm text-gray-500">
                                    Upload 1-4 high-quality images showing this variation from different angles
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

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