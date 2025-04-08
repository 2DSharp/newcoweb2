'use client'

import { useRouter, useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Store, Clipboard, Layers, Check, Search, Wand2, Pencil, ArrowLeftCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import ProductInfoForm from '@/components/product-configuration/product-info-form'
import SearchabilityDetailsForm from '@/components/product-configuration/searchability'
import ProductVariationsForm from '@/components/product-configuration/product-variations-form'
import apiService from '@/services/api'
import { Card } from "@/components/ui/card"
import ImageUploader from '@/components/ImageUploader'
import { Loader2 } from 'lucide-react'

export default function ProductCreationWizard() {
    const router = useRouter()
    const params = useParams()
    
    const [step, setStep] = useState(0)
    const [draftId, setDraftId] = useState(null)
    const [formData, setFormData] = useState({
        variations: [{}]
    })
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadedImages, setUploadedImages] = useState([])
    const [showImageUploader, setShowImageUploader] = useState(false)

    // Initialize from URL params
    useEffect(() => {
        if (params.params) {
            const [urlDraftId, urlStep] = params.params
            if (urlDraftId) setDraftId(urlDraftId)
            if (urlStep) setStep(parseInt(urlStep))
        }
    }, [params])

    // Load draft data ONLY on initial page load
    useEffect(() => {
        const loadDraftData = async () => {
            if (isInitialLoad && draftId) {
                try {
                    const response = await apiService.products.getDraft(draftId)
                    // Restructure the variations data to include image URLs
                    const formattedData = {
                        ...response.data,
                        personalizationText: response.data.stock?.personalizationText || false,
                        variations: response.data.stock?.variations?.map(variation => ({
                            ...variation,
                            isCustom: variation.type === 'CUSTOM',
                            details: variation.details || {}, // Ensure details are preserved
                            dimensions:{
                                l: variation.dimensions?.l || 0,
                            w: variation.dimensions?.w || 0,
                            h: variation.dimensions?.h || 0,
                          } , // Add weight
                            weight: variation.weight || 0,
                    
                            images: variation.images?.map(img => ({
                                imgId: img.imgId,
                                thumbnail: img.thumbnail,
                                url: img.url // Construct the URL for each image
                            })) || []
                        })) || [{}]
                    }
                    console.log("Formatted data:", formattedData)
                    setFormData(prev => ({
                        ...prev,
                        ...formattedData
                    }))
                } catch (error) {
                    console.error('Failed to load draft:', error)
                } finally {
                    setIsInitialLoad(false)
                }
            }
        }

        loadDraftData()
    }, [draftId, isInitialLoad])

    // Update URL when step or draftId changes
    useEffect(() => {
        if (draftId) {
            router.push(`/seller/products/new/${draftId}/${step}`, { shallow: true })
        }
    }, [step, draftId, router])

    // Reset isInitialLoad when draftId changes to null
    useEffect(() => {
        if (!draftId) {
            setIsInitialLoad(true)
        }
    }, [draftId])

    const createProductDraft = async () => {
        const draftData = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            subCategory: formData.subCategory,
            finalCategory: formData.finalCategory,
            manufacturingType: formData.manufacturingType
        }

        try {
            const response = await apiService.products.createDraft(draftData)
            setDraftId(response.data)
            setStep(prev => prev + 1)
        } catch (error) {
            console.error('Failed to create draft:', error)
            return false
        }
    }

    const formatDataForApi = (formData) => {
        return {
            description: formData.description,
            name: formData.name,
            category: formData.category,
            subCategory: formData.subCategory,
            finalCategory: formData.finalCategory,
            manufacturingType: formData.manufacturingType,
            stock: {
                personalizationText: formData.personalizationText || false,
                variations: formData.variations.map(variation => ({
                    name: variation.name,
                    type: variation.isCustom ? 'CUSTOM' : 'FIXED_VARIANT',
                    stock: variation.stock || 0,
                    price: variation.price,
                    sku: variation.sku,
                    details: variation.details || {}, // Ensure details are preserved
                    processingTime: variation.processingTime,
                    dimensions: {
                        l: variation.dimensions.l || 0,
                        w: variation.dimensions.w || 0,
                        h: variation.dimensions.h || 0
                    },
                    weight: variation.weight || 0,
                    images: variation.images?.map(img => ({
                        imgId: img.imgId,
                        thumbnail: img.thumbnail
                    })) || []
                }))
            },
            searchability: {
                keywords: formData.searchability?.keywords || [],
                audience: formData.searchability?.audience || []
            },
            materialType: formData.materialType || []
        }
    }

    const handleNextStep = async (e) => {
        e?.preventDefault()
        console.log("Step", step)
        try {
            if (draftId) {
                const formattedData = formatDataForApi(formData)
                await apiService.products.updateDraft(draftId, formattedData)
                if (step === 3) {
                    try {
                        setIsSubmitting(true)
                        console.log("Submitting product...")
                        const data = await apiService.products.publishDraft(draftId)
                        router.push('/seller/products')
                    } catch (error) {
                        console.error('Failed to submit product:', error)
                        setIsSubmitting(false)
                    }
                }
            } else if (step === 1) {
                // First step creation with minimal data
                const response = await apiService.products.createDraft({
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    subCategory: formData.subCategory,
                    finalCategory: formData.finalCategory
                })
                setDraftId(response.data)
            }
            if (!isSubmitting) {
                setStep(prev => prev + 1)
            }
        } catch (error) {
            console.error('Failed to save draft:', error)
        }
    }

    
    const handleAIGeneration = async () => {
        setIsGenerating(true)
        try {
            // Call AI metadata generation endpoint
            const response = await fetch('http://localhost:5000/ai/generate-metadata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_ids: uploadedImages.map(img => img.imgId)
                })
            })
            
            if (!response.ok) {
                throw new Error('Failed to generate metadata')
            }
            
            const data = await response.json()
            
            // Create draft with generated metadata and preserve image order
            const draftData = {
                ...data.metadata,
                stock: {
                    ...data.metadata.stock,
                    variations: data.metadata.stock.variations.map((variation, index) => ({
                        ...variation,
                        images: uploadedImages.map(img => ({
                            imgId: img.imgId,
                            thumbnail: index === 0 && img === uploadedImages[0] // Set first image as thumbnail
                        }))
                    }))
                }
            }
            
            const draftResponse = await apiService.products.createDraft(draftData)
            setDraftId(draftResponse.data)
            setFormData(prev => ({
                ...prev,
                ...draftData
            }))
            setStep(1) // Move to first step of the wizard
        } catch (error) {
            console.error('Failed to generate product:', error)
        } finally {
            setIsGenerating(false)
        }
    }
    
    const handleBack = async () => {
        try {
            if (draftId) {
                const formattedData = formatDataForApi(formData)
                await apiService.products.updateDraft(draftId, formattedData)
            }
            setStep(prev => prev - 1)
        } catch (error) {
            console.error('Failed to save draft on back navigation:', error)
            setStep(prev => prev - 1)
        }
    }

    const handleSubmit = async (e) => {
       // e?.preventDefault()
       
    }

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const steps = [
        { title: "Choose Method", icon: <Wand2 className="w-4 h-4" /> },
        { title: "Product Info", icon: <Store className="w-4 h-4" /> },
        { title: "Stock & Pricing", icon: <Layers className="w-4 h-4" /> },
        { title: "Searchability", icon: <Search className="w-4 h-4" /> }
    ]

    const renderStepContent = () => {
        if (isSubmitting) {
            return (
                <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Listing your awesome product</h2>
                    <p className="text-gray-500">This may take a few moments...</p>
                </div>
            )
        }

        switch (step) {
            case 0:
                return (
                    <div className="space-y-8 p-6">
                        {!showImageUploader ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowImageUploader(true)}>
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <Wand2 className="w-12 h-12 text-indigo-600" />
                                        <h3 className="text-xl font-semibold">AI Magic</h3>
                                        <p className="text-gray-500">Upload images and let us magically generate product details using AI!</p>
                                    </div>
                                </Card>
                                
                                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setStep(1)}>
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <Pencil className="w-12 h-12 text-indigo-600" />
                                        <h3 className="text-xl font-semibold">Manual Entry</h3>
                                        <p className="text-gray-500">Fill in all product details manually</p>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowImageUploader(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <ArrowLeftCircle className="mr-2 h-4 w-4" />
                                        Back to options
                                    </Button>
                                </div>
                                
                                <div className="transition-all duration-300 ease-in-out">
                                    <div className="space-y-4">
                                        <ImageUploader
                                            images={uploadedImages}
                                            onChange={setUploadedImages}
                                            maxImages={5}
                                            variationIndex={0}
                                        />
                                        
                                        <Button 
                                            className="w-full" 
                                            onClick={handleAIGeneration}
                                            disabled={uploadedImages.length === 0 || isGenerating}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                'Generate Product'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            case 1:
                return <ProductInfoForm handleSubmit={handleSubmit} formData={formData} updateFormData={updateFormData} />
            case 2:
                return <ProductVariationsForm formData={formData} updateFormData={updateFormData} />
            case 3:
                return <SearchabilityDetailsForm formData={formData} updateFormData={updateFormData} />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen flex flex-col py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full mx-auto space-y-8">
                <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">New Product</h1>
                    <p className="text-sm text-gray-500">Create a new product listing</p>
                </div>

                {/* Progress and Steps Indicator */}
                <div className="space-y-4">
                    <div className="flex justify-between mt-2">
                        {steps.map((stepItem, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => index < step && setStep(index + 1)}
                                className={`flex flex-col items-center ${
                                    index <= step || isSubmitting ? 'text-indigo-600' : 'text-muted-foreground'
                                }`}
                                disabled={index > step || isSubmitting}
                            >
                                <div className={`rounded-full p-2 ${
                                    index <= step || isSubmitting ? 'bg-indigo-600 text-white' : 'bg-muted'
                                }`}>
                                    {index < step || isSubmitting ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        stepItem.icon
                                    )}
                                </div>
                                <span className="mt-2 text-sm font-medium">{stepItem.title}</span>
                            </button>
                        ))}
                    </div>

                    <div>
                        <Progress 
                            value={isSubmitting ? 100 : (step) * (100 / steps.length)} 
                            className="w-full bg-indigo-100" 
                        />
                    </div>
                </div>

                {/* Main content */}
                <div className="bg-white rounded-lg">
                    {renderStepContent()}
                </div>

                {/* Bottom buttons */}
                {!isSubmitting && (
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={step === 0}
                                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>

                            <Button
                                onClick={handleNextStep}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                disabled={isSubmitting}
                            >
                                {step === 3 ? 'Submit Product' : (
                                    <>
                                        Next
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}