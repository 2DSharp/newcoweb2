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

export default function ProductCreationWizard() {
    const router = useRouter()
    const params = useParams()
    
    const [step, setStep] = useState(1)
    const [draftId, setDraftId] = useState(null)
    const [formData, setFormData] = useState({})
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
            // Only fetch if it's the initial load and we have a draftId
            if (isInitialLoad && draftId) {
                try {
                    const response = await apiService.products.getDraft(draftId)
                    setFormData(prev => ({
                        ...prev,
                        ...response.data
                    }))
                } catch (error) {
                    console.error('Failed to load draft:', error)
                } finally {
                    setIsInitialLoad(false) // Mark initial load as complete
                }
            }
        }

        loadDraftData()
    }, [draftId, isInitialLoad])

    // Update URL when step or draftId changes
    useEffect(() => {
        if (draftId) {
            router.push(`/products/create-new/${draftId}/${step}`, { shallow: true })
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

    const handleNextStep = async () => {
        if (step === 1) {
            try {
                if (draftId) {
                    await apiService.products.updateDraft(draftId, {
                        ...formData,
                        searchability: {
                            keywords: formData.searchability?.keywords || [],
                            audience: formData.searchability?.audience || []
                        },
                        materialType: formData.materialType || []
                    })
                } else {
                    const draftData = {
                        name: formData.name,
                        description: formData.description,
                        category: formData.category,
                        subCategory: formData.subCategory,
                        finalCategory: formData.finalCategory,
                        manufacturingType: formData.manufacturingType,
                        searchability: {
                            keywords: formData.searchability?.keywords || [],
                            audience: formData.searchability?.audience || []
                        },
                        materialType: formData.materialType || []
                    }
                    const response = await apiService.products.createDraft(draftData)
                    setDraftId(response.data)
                }
                setStep(prev => prev + 1)
            } catch (error) {
                console.error('Failed to save draft:', error)
            }
        } else if (step === 2) {
            try {
                await apiService.products.updateDraft(draftId, {
                    ...formData,
                    keywords: formData.keywords || [],
                    audience: formData.audience || [],
                    materialType: formData.materialType || []
                })
                setStep(prev => prev + 1)
            } catch (error) {
                console.error('Failed to update draft:', error)
            }
        } else if (step === 3) {
            handleSubmit()
        }
    }

    const handleSubmit = async (e) => {
        e?.preventDefault()
        if (step === 3) {
            try {
                const submitData = {
                    ...formData,
                    category: formData.category,
                    subCategory: formData.subCategory,
                    finalCategory: formData.finalCategory
                }
                await apiService.products.submitProduct(submitData)
                router.push('/products')
            } catch (error) {
                console.error('Failed to submit product:', error)
            }
        } else {
            handleNextStep()
        }
    }

    const validateVariations = () => {
        return formData.variations.every(variation =>
            variation.name &&
            variation.price > 0 &&
            variation.stock >= 0 &&
            variation.sku &&
            variation.images.length >= 1 &&
            variation.images.length <= 4
        )
    }

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleBack = async () => {
        try {
            if (draftId) {
                
                await apiService.products.updateDraft(draftId, formData)
            }
            setStep(prev => prev - 1)
        } catch (error) {
            console.error('Failed to save draft on back navigation:', error)
            // Still allow back navigation even if save fails
            setStep(prev => prev - 1)
        }
    }

    const steps = [
        { title: "Product Info", icon: <Store className="w-4 h-4" /> },
        { title: "Searchability", icon: <Search className="w-4 h-4" /> },
        { title: "Variations", icon: <Layers className="w-4 h-4" /> }
    ]

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <ProductInfoForm handleSubmit={handleSubmit} formData={formData} updateFormData={updateFormData} />
            case 2:
                return <SearchabilityDetailsForm formData={formData} updateFormData={updateFormData} />
            case 3:
                return <ProductVariationsForm formData={formData} updateFormData={updateFormData} />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen flex flex-col py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-900 text-center">
                    Create New Product
                </h1>

                {/* Progress and Steps Indicator */}
                <div>

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
                    <div className="space-y-4"></div>
                        <Progress 
                            value={(step) * (100 / steps.length)} 
                        className="w-full space-y-4 bg-indigo-100" 
                    />
                </div>

                {/* Main content */}
                <div className="bg-white rounded-lg">
                    {renderStepContent()}

                    {step === 3 && !validateVariations() && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>
                                Please ensure all variations have a name, SKU, price, and 1-4 images.
                            </AlertDescription>
                        </Alert>
                    )}
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
                            disabled={step === 3 && !validateVariations()}
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