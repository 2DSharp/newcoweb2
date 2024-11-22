'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Store, Clipboard, Layers, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import ProductInfoForm from './product-info-form'
import ProductDetailsForm from './product-details-form'
import ProductVariationsForm from './product-variations-form'
import apiService from '@/services/api'

export default function ProductCreationWizard() {
    const [step, setStep] = useState(1)
    const [draftId, setDraftId] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        subCategory: '',
        manufacturingType: '',
        keywords: [],
        materialType: [],
        description: '',
        variations: []
    })

    useEffect(() => {
        if (formData.variations.length === 0) {
            setFormData(prev => ({
                ...prev,
                variations: [{
                    id: 1,
                    name: '',
                    type: 'FIXED_VARIANT',
                    stock: 0,
                    price: 0,
                    processingTime: 1,
                    sku: '',
                    isCustom: false,
                    images: []
                }]
            }))
        }
    }, [])

    // const handleSubmit = () => {
    //     console.log('Form submitted:', formData)
    //     // Here you would make your API call with the formData
    // }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleNextStep();

    };

    const createProductDraft = async () => {
        const draftData = {
            name: formData.name,
            category: formData.category,
            subCategory: formData.subCategory,
            finalCategory: formData.finalCategory,
            manufacturingType: formData.manufacturingType
        };

        try {
            const response = await apiService.products.createDraft(draftData);
            updateFormData('draftId', response.data);
            setStep(prev => prev + 1);
        } catch (error) {
            console.error('Failed to create draft:', error);
            return false;
        }
    };


    const handleNextStep = () => {
        if (step === 1) {
            createProductDraft()
        } else if (step === 3) {
            handleSubmit()
        } else {
            setStep(prev => prev + 1)
        }
    }

    const steps = [
        { title: "Product Info", icon: <Store className="w-4 h-4" /> },
        { title: "Details", icon: <Clipboard className="w-4 h-4" /> },
        { title: "Variations", icon: <Layers className="w-4 h-4" /> }
    ]

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <ProductInfoForm handleSubmit={handleSubmit} formData={formData} updateFormData={updateFormData} />
            case 2:
                return <ProductDetailsForm formData={formData} updateFormData={updateFormData} />
            case 3:
                return <ProductVariationsForm formData={formData} updateFormData={updateFormData} />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create New Product</h1>

                {/* Progress and Steps Indicator */}
                <div className="mb-8">
                    <Progress 
                        value={(step) * (100 / steps.length)} 
                        className="w-full bg-indigo-100" 
                    />
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
                </div>

                <div className="mt-10 bg-white rounded-lg space-y-8">
                    {renderStepContent()}

                    {step === 3 && !validateVariations() && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>
                                Please ensure all variations have a name, SKU, price, and 1-4 images.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-between mt-8">
                        <Button
                            variant="outline"
                            onClick={() => setStep(prev => prev - 1)}
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