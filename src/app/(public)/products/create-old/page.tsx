'use client'

import React, { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Store, Tag, Box, Clipboard, Layers, ImageIcon, Plus, ArrowRight, ArrowLeft, X, Check } from 'lucide-react'

const schema = z.object({
    name: z.string().min(1, "Product name is required"),
    stockType: z.enum(["FIXED", "HYBRID"]),
    category: z.number().int().positive(),
    subCategory: z.number().int().positive(),
    finalCategory: z.number().int().positive(),
    searchability: z.object({
        keywords: z.array(z.string()),
        audience: z.array(z.enum(["CHILDREN", "ADULTS", "SENIORS"]))
    }),
    attributes: z.object({
        dimensions: z.string(),
        materialType: z.string(),
        manufacturingType: z.enum(["handmade", "machine-made"])
    }),
    processingTime: z.string(),
    samplePhotos: z.array(z.object({
        imgId: z.string(),
        thumbnail: z.boolean()
    })).min(1).max(4),
    description: z.string(),
    stock: z.object({
        personalizationText: z.boolean(),
        variations: z.array(z.object({
            type: z.enum(["BASE", "FIXED_VARIANT", "CUSTOM"]),
            details: z.object({
                size: z.string().optional(),
                color: z.string().optional()
            }).optional(),
            stock: z.number().int().nonnegative().optional(),
            price: z.number().positive(),
            sku: z.string(),
            processingTime: z.number().int().positive().optional(),
            images: z.array(z.object({
                imgId: z.string(),
                thumbnail: z.boolean()
            })).min(1).max(4)
        })).min(1)
    })
})

type FormData = z.infer<typeof schema>

const audiences = [
    { label: "Children", value: "CHILDREN" },
    { label: "Adults", value: "ADULTS" },
    { label: "Seniors", value: "SENIORS" }
]

export default function ProductCreationForm() {
    const [currentStep, setCurrentStep] = useState(0)
    const { register, control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            stockType: "FIXED",
            searchability: { keywords: [], audience: [] },
            samplePhotos: [],
            stock: {
                personalizationText: false,
                variations: [{ type: "BASE", stock: 0, price: 0, sku: "", images: [] }]
            }
        }
    })
    const options = [
        { id: 'option1', label: 'Option 1' },
        { id: 'option2', label: 'Option 2' },
        { id: 'option3', label: 'Option 3' },
    ];

    const [selected, setSelected] = useState(options[0].id);


    const { fields: variationFields, append: appendVariation, remove: removeVariation } = useFieldArray({
        control,
        name: "stock.variations"
    })

    const onSubmit = (data: FormData) => {
        console.log(data)
        // Here you would make your API call with the form data
    }

    const steps = [
        { title: "Basic Info", icon: <Store className="w-4 h-4" /> },
        { title: "Details", icon: <Clipboard className="w-4 h-4" /> },
        { title: "Variations", icon: <Layers className="w-4 h-4" /> }
    ]

    const renderBasicInfo = () => (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Title
                </Label>

                <Input
                                         id="title" {...register("title")} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-4">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Stock Type</Label>
                <RadioGroup defaultValue="FIXED" className="flex space-x-4 " {...register("stockType")}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className="h-5 w-5 rounded-full border border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500" value="FIXED" id="fixed" />
                        <Label htmlFor="fixed">Fixed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className="h-5 w-5 rounded-full border border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500" value="HYBRID" id="hybrid"/>

                        <Label className="text-sm font-medium text-gray-900" htmlFor="hybrid">Hybrid</Label>
                    </div>
                </RadioGroup>
            </div>

            <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">Category</Label>
                <Select onValueChange={(value) => register("category").onChange({target: {value: parseInt(value)}})}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="13">Category 1</SelectItem>
                        <SelectItem value="14">Category 2</SelectItem>
                        <SelectItem value="15">Category 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="subCategory">Sub Category</Label>
                <Select onValueChange={(value) => register("subCategory").onChange({ target: { value: parseInt(value) } })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="29">Sub Category 1</SelectItem>
                        <SelectItem value="30">Sub Category 2</SelectItem>
                        <SelectItem value="31">Sub Category 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="finalCategory">Final Category</Label>
                <Select onValueChange={(value) => register("finalCategory").onChange({ target: { value: parseInt(value) } })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select final category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="120">Final Category 1</SelectItem>
                        <SelectItem value="121">Final Category 2</SelectItem>
                        <SelectItem value="122">Final Category 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )

    const renderDetails = () => (
        <div className="space-y-4">
            <div>
                <Label>Keywords</Label>
                <Controller
                    name="searchability.keywords"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Add keyword"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            const input = e.target as HTMLInputElement
                                            if (input.value) {
                                                field.onChange([...field.value, input.value])
                                                input.value = ''
                                            }
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="Add keyword"]') as HTMLInputElement
                                        if (input.value) {
                                            field.onChange([...field.value, input.value])
                                            input.value = ''
                                        }
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {field.value.map((keyword, index) => (
                                    <Badge key={index} variant="secondary">
                                        {keyword}
                                        <button
                                            type="button"
                                            onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                />
            </div>

            <div>
                <Label>Audience</Label>
                <div className="space-y-2">
                    {audiences.map((audience) => (
                        <div key={audience.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={audience.value}
                                {...register("searchability.audience")}
                                value={audience.value}
                            />
                            <Label htmlFor={audience.value}>{audience.label}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input id="dimensions" {...register("attributes.dimensions")} placeholder="e.g., 2x3x5" />
            </div>

            <div>
                <Label htmlFor="materialType">Material Type</Label>
                <Input id="materialType" {...register("attributes.materialType")} placeholder="e.g., recycled" />
            </div>

            <div>
                <Label>Manufacturing Type</Label>
                <Select onValueChange={(value) => register("attributes.manufacturingType").onChange({ target: { value } })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select manufacturing type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="handmade">Handmade</SelectItem>
                        <SelectItem value="machine-made">Machine-made</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="processingTime">Processing Time (days)</Label>
                <Input id="processingTime" type="number" {...register("processingTime")} />
            </div>

            <div>
                <Label>Sample Photos</Label>
                <Controller
                    name="samplePhotos"
                    control={control}
                    render={({ field }) => (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {field.value.map((photo, index) => (
                                <div key={index} className="relative">
                                    <img src={`/api/images/${photo.imgId}`} alt={`Sample ${index + 1}`} className="w-full h-32 object-cover rounded" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => field.onChange(field.value.filter((_, i) => i !== index))}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <div className="absolute bottom-2 left-2">
                                        <Checkbox
                                            id={`thumbnail-${index}`}
                                            checked={photo.thumbnail}
                                            onCheckedChange={(checked) => {
                                                const newPhotos = field.value.map((p, i) => i === index ? { ...p, thumbnail: checked } : { ...p, thumbnail: false })
                                                field.onChange(newPhotos)
                                            }}
                                        />
                                        <Label htmlFor={`thumbnail-${index}`} className="ml-2 text-white">Thumbnail</Label>
                                    </div>
                                </div>
                            ))}
                            {field.value.length < 4 && (
                                <div className="w-full h-32 border-2 border-dashed rounded flex items-center justify-center">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    // In a real application, you would upload the file to your server here
                                                    // and get back an imgId. For this example, we'll use a dummy ID.
                                                    const newPhoto = { imgId: `dummy-${Date.now()}`, thumbnail: field.value.length === 0 }
                                                    field.onChange([...field.value, newPhoto])
                                                }
                                            }}
                                        />
                                        <Plus className="w-8 h-8 text-gray-400" />
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} rows={4} />
            </div>
        </div>
    )

    const renderVariations = () => (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Switch
                    id="personalizationText"
                    {...register("stock.personalizationText")}
                />
                <Label htmlFor="personalizationText">Allow Personalization Text</Label>
            </div>

            {variationFields.map((field, index) => (
                <Card key={field.id}>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {index === 0 ? "Base Variation" : `Variation ${index + 1}`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label>Variation Type</Label>
                                <Controller
                                    name={`stock.variations.${index}.type`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BASE">Base</SelectItem>
                                                <SelectItem value="FIXED_VARIANT">Fixed Variant</SelectItem>
                                                <SelectItem value="CUSTOM">Custom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {field.type === "FIXED_VARIANT" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`size-${index}`}>Size</Label>
                                        <Input id={`size-${index}`} {...register(`stock.variations.${index}.details.size`)} />
                                    </div>
                                    <div>
                                        <Label htmlFor={`color-${index}`}>Color</Label>
                                        <Input id={`color-${index}`} {...register(`stock.variations.${index}.details.color`)} />
                                    </div>
                                </div>
                            )}

                            {field.type !== "CUSTOM" && (
                                <div>
                                    <Label htmlFor={`stock-${index}`}>Stock</Label>
                                    <Input id={`stock-${index}`} type="number" {...register(`stock.variations.${index}.stock`)} />
                                </div>
                            )}

                            <div>
                                <Label htmlFor={`price-${index}`}>Price</Label>
                                <Input id={`price-${index}`} type="number" step="0.01" {...register(`stock.variations.${index}.price`)} />
                            </div>

                            <div>
                                <Label htmlFor={`sku-${index}`}>SKU</Label>
                                <Input id={`sku-${index}`} {...register(`stock.variations.${index}.sku`)} />
                            </div>

                            {field.type === "CUSTOM" && (
                                <div>
                                    <Label htmlFor={`processingTime-${index}`}>Processing Time (days)</Label>
                                    <Input id={`processingTime-${index}`} type="number" {...register(`stock.variations.${index}.processingTime`)} />
                                </div>
                            )}

                            <div>
                                <Label>Images</Label>
                                <Controller
                                    name={`stock.variations.${index}.images`}
                                    control={control}
                                    render={({ field: imageField }) => (
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            {imageField.value.map((image, imageIndex) => (
                                                <div key={imageIndex} className="relative">
                                                    <img src={`/api/images/${image.imgId}`} alt={`Variation ${index + 1} Image ${imageIndex + 1}`} className="w-full h-32 object-cover rounded" />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => imageField.onChange(imageField.value.filter((_, i) => i !== imageIndex))}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                    <div className="absolute bottom-2 left-2">
                                                        <Checkbox
                                                            id={`thumbnail-${index}-${imageIndex}`}
                                                            checked={image.thumbnail}
                                                            onCheckedChange={(checked) => {
                                                                const newImages = imageField.value.map((img, i) => i === imageIndex ? { ...img, thumbnail: checked } : { ...img, thumbnail: false })
                                                                imageField.onChange(newImages)
                                                            }}
                                                        />
                                                        <Label htmlFor={`thumbnail-${index}-${imageIndex}`} className="ml-2 text-white">Thumbnail</Label>
                                                    </div>
                                                </div>
                                            ))}
                                            {imageField.value.length < 4 && (
                                                <div className="w-full h-32 border-2 border-dashed rounded flex items-center justify-center">
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    // In a real application, you would upload the file to your server here
                                                                    // and get back an imgId. For this example, we'll use a dummy ID.
                                                                    const newImage = { imgId: `dummy-${Date.now()}`, thumbnail: imageField.value.length === 0 }
                                                                    imageField.onChange([...imageField.value, newImage])
                                                                }
                                                            }}
                                                        />
                                                        <Plus className="w-8 h-8 text-gray-400" />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    {index > 0 && (
                        <CardFooter>
                            <Button type="button" variant="destructive" onClick={() => removeVariation(index)}>
                                Remove Variation
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            ))}

            <Button type="button" variant="outline" onClick={() => appendVariation({ type: "FIXED_VARIANT", stock: 0, price: 0, sku: "", images: [] })}>
                Add Variation
            </Button>
        </div>
    )

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return renderBasicInfo()
            case 1:
                return renderDetails()
            case 2:
                return renderVariations()
            default:
                return null
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-4 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create New Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-8">
                        <Progress value={(currentStep + 1) * (100 / steps.length)} className="w-full bg-indigo-100" />
                        <div className="flex justify-between mt-2">
                            {steps.map((step, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setCurrentStep(index)}
                                    className={`flex flex-col items-center ${
                                        index <= currentStep ? 'text-indigo-600' : 'text-muted-foreground'
                                    }`}
                                    disabled={index > currentStep}
                                >
                                    <div className={`rounded-full p-2 ${
                                        index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-muted'
                                    }`}>
                                        {index < currentStep ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <span className="mt-2 text-sm font-medium">{step.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {renderStepContent()}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        type="button"
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        variant="outline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    {currentStep < steps.length - 1 ? (
                        <Button type="button" onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Submit</Button>
                    )}
                </CardFooter>
            </Card>
        </form>
    )
}