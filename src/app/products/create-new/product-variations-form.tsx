import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, X, ImageIcon } from 'lucide-react'

export default function ProductVariationsForm({ formData, updateFormData }) {
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
            {
                id: formData.variations.length + 1,
                name: '',
                type: 'FIXED_VARIANT',
                stock: 0,
                price: 0,
                processingTime: 1,
                sku: '',
                isCustom: false,
                images: []
            }
        ])
    }

    const removeVariation = (index) => {
        if (formData.variations.length > 1) {
            const updatedVariations = formData.variations.filter((_, i) => i !== index)
            updateFormData('variations', updatedVariations)
        }
    }

    const handleImageUpload = (index, e) => {
        const files = Array.from(e.target.files)
        const variation = formData.variations[index]

        if (variation.images.length + files.length > 4) {
            alert('Maximum 4 images allowed per variation')
            return
        }

        const newImages = files.map((file, i) => ({
            imgId: `img-${Date.now()}-${i}`,
            thumbnail: variation.images.length === 0 && i === 0,
            preview: URL.createObjectURL(file)
        }))

        handleVariationChange(index, 'images', [...variation.images, ...newImages])
    }

    const removeImage = (variationIndex, imageIndex) => {
        const variation = formData.variations[variationIndex]
        const updatedImages = variation.images.filter((_, i) => i !== imageIndex)
        handleVariationChange(variationIndex, 'images', updatedImages)
    }

    return (
        <div className="space-y-6">
            {formData.variations.map((variation, index) => (
                <Card key={variation.id} className="p-4">
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
                                    <Label htmlFor={`name-${index}`}>Variation Name *</Label>
                                    <Input
                                        id={`name-${index}`}
                                        value={variation.name}
                                        onChange={(e) => handleVariationChange(index, 'name', e.target.value)}
                                        placeholder="Enter variation name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`sku-${index}`}>SKU *</Label>
                                    <Input
                                        id={`sku-${index}`}
                                        value={variation.sku}
                                        onChange={(e) => handleVariationChange(index, 'sku', e.target.value)}
                                        placeholder="Enter SKU"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`price-${index}`}>Price *</Label>
                                    <Input
                                        id={`price-${index}`}
                                        type="number"
                                        value={variation.price}
                                        onChange={(e) => handleVariationChange(index, 'price', Number(e.target.value))}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`stock-${index}`}>Stock *</Label>
                                    <Input
                                        id={`stock-${index}`}
                                        type="number"
                                        value={variation.stock}
                                        onChange={(e) => handleVariationChange(index, 'stock', Number(e.target.value))}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`processing-${index}`}>Processing Time (days)</Label>
                                    <Input
                                        id={`processing-${index}`}
                                        type="number"
                                        value={variation.processingTime}
                                        onChange={(e) => handleVariationChange(index, 'processingTime', Number(e.target.value))}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`custom-${index}`}
                                    checked={variation.isCustom}
                                    onCheckedChange={(checked) => handleVariationChange(index, 'isCustom', checked)}
                                />
                                <Label htmlFor={`custom-${index}`}>Custom Variation</Label>
                            </div>

                            <div className="space-y-2">
                                <Label>Images (1-4 required) *</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {variation.images.map((image, imgIndex) => (
                                        <div key={image.imgId} className="relative">
                                            <img
                                                src={image.preview}
                                                alt={`Product ${imgIndex + 1}`}
                                                className="w-full h-24 object-cover rounded"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2"
                                                onClick={() => removeImage(index, imgIndex)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {variation.images.length < 4 && (
                                        <div className="w-full h-24 border-2 border-dashed rounded flex items-center justify-center">
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleImageUpload(index, e)}
                                                />
                                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                            </label>
                                        </div>
                                    )}
                                </div>
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