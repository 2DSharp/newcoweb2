'use client'

import { useRouter, useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Store, Clipboard, Layers, Check, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import ProductInfoForm from '../product-info-form'
import SearchabilityDetailsForm from '../searchability'
import ProductVariationsForm from '../product-variations-form'
import apiService from '@/services/api'
import { Card } from "@/components/ui/card"

export default function ProductCreationWizard() {
    const router = useRouter()
    const params = useParams()
    
    const [step, setStep] = useState(1)
    const [draftId, setDraftId] = useState(null)
    const [formData, setFormData] = useState({
        variations: [{}]
    })
    const [isInitialLoad, setIsInitialLoad] = useState(true)

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
                        variations: response.data.stock?.variations?.map(variation => ({
                            ...variation,
                            isCustom: variation.type === 'CUSTOM',
                            details: variation.details || {}, // Ensure details are preserved
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
                        console.log("Step ! 3")
                        const data = await apiService.products.publishDraft(draftId)
                        router.push('/products/' + data.data)
                    } catch (error) {
                        console.error('Failed to submit product:', error)
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
            setStep(prev => prev + 1)
        } catch (error) {
            console.error('Failed to save draft:', error)
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
        { title: "Product Info", icon: <Store className="w-4 h-4" /> },
        { title: "Stock & Pricing", icon: <Layers className="w-4 h-4" /> },
        { title: "Searchability", icon: <Search className="w-4 h-4" /> }
    ]

    const renderStepContent = () => {
        switch (step) {
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
                                    index < step ? 'text-indigo-600' : 'text-muted-foreground'
                                }`}
                                disabled={index > step - 1}
                            >
                                <div className={`rounded-full p-2 ${
                                    index < step ? 'bg-indigo-600 text-white' : 'bg-muted'
                                }`}>
                                    {index < step - 1 ? (
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
                            value={(step) * (100 / steps.length)} 
                            className="w-full bg-indigo-100" 
                        />
                    </div>
                </div>

                {/* Main content */}
                <div className="bg-white rounded-lg">
                    {renderStepContent()}
                </div>

                {/* Bottom buttons */}
                <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={step === 1}
                            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>

                        <Button
                            onClick={handleNextStep}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
            </div>
        </div>
    )
}