'use client'

import { useRouter, useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Store, Clipboard, Layers, Check, Search, Wand2, Pencil, ArrowLeftCircle, Loader2, Sparkles, Banana, Coffee, Wrench, Rocket } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import ProductInfoForm from '@/components/product-configuration/product-info-form'
import SearchabilityDetailsForm from '@/components/product-configuration/searchability'
import ProductVariationsForm from '@/components/product-configuration/product-variations-form'
import AIGenerator from '@/components/product-configuration/AIGenerator'
import apiService from '@/services/api'
import { Card } from "@/components/ui/card"
import ImageUploader from '@/components/ImageUploader'
import MonkeyLoadingScreen from '@/components/MonkeyLoadingScreen'
import { AnimatingButton } from '@/components/animatingbutton'

const AI_LOADING_MESSAGES = [
    "Monkeys are analyzing your images... 🐵",
    "Our AI monkeys are brainstorming... 🧠",
    "One monkey spilled coffee on the keyboard... ☕",
    "The monkeys are arguing about the perfect description... 🗣️",
    "Someone brought bananas to the meeting... 🍌",
    "The monkeys are doing their final checks... ✅",
    "A monkey just discovered the copy-paste shortcut... 📋",
    "The coffee machine is working overtime... ☕",
    "Monkeys are debating color schemes... 🎨",
    "Someone found the emoji keyboard... 😅"
]

const MONKEY_ACTIONS = [
    { emoji: "🐵", action: "typing furiously" },
    { emoji: "🙈", action: "covering eyes" },
    { emoji: "🙉", action: "covering ears" },
    { emoji: "🙊", action: "covering mouth" },
    { emoji: "🐒", action: "swinging on chair" },
    { emoji: "🦍", action: "thinking deeply" }
]

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
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(0)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [currentMonkeyAction, setCurrentMonkeyAction] = useState(0)
    const [chaosElements, setChaosElements] = useState([])
    const [randomMessages, setRandomMessages] = useState([])
    const [showSparkles, setShowSparkles] = useState(false)

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

    useEffect(() => {
        let messageInterval
        let monkeyInterval
        let chaosInterval

        if (isGenerating) {
            // Select 3 random messages
            const shuffled = [...AI_LOADING_MESSAGES].sort(() => 0.5 - Math.random())
            setRandomMessages(shuffled.slice(0, 3))

            // Rotate through random messages
            messageInterval = setInterval(() => {
                setRandomMessages(prev => {
                    const newMessages = [...prev]
                    newMessages.shift()
                    const remainingMessages = AI_LOADING_MESSAGES.filter(msg => !newMessages.includes(msg))
                    if (remainingMessages.length > 0) {
                        newMessages.push(remainingMessages[Math.floor(Math.random() * remainingMessages.length)])
                    }
                    return newMessages
                })
            }, 3000)

            // Rotate through monkey actions
            monkeyInterval = setInterval(() => {
                setCurrentMonkeyAction(prev => (prev + 1) % MONKEY_ACTIONS.length)
            }, 2000)

            // Add random chaos elements
            chaosInterval = setInterval(() => {
                setChaosElements(prev => {
                    const newElements = [...prev]
                    if (newElements.length > 3) newElements.shift()
                    newElements.push({
                        id: Date.now(),
                        type: Math.random() > 0.5 ? 'banana' : 'coffee',
                        position: {
                            x: Math.random() * 80 + 10,
                            y: Math.random() * 40 + 10
                        }
                    })
                    return newElements
                })
            }, 1500)
        }

        return () => {
            clearInterval(messageInterval)
            clearInterval(monkeyInterval)
            clearInterval(chaosInterval)
        }
    }, [isGenerating])

    useEffect(() => {
        if (showSparkles) {
            const timer = setTimeout(() => setShowSparkles(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [showSparkles])

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
                        await apiService.products.publishDraft(draftId)
                        console.log("Product published successfully")
                        await router.push('/seller/products')
                        return
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
        setLoadingProgress(0)
        setCurrentLoadingMessage(0)
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
            setLoadingProgress(100)
            
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
            if (step === 0 && showImageUploader) {
                setShowImageUploader(false)
                setUploadedImages([]) // Clear uploaded images
                return
            }
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

        if (isGenerating) {
            return <MonkeyLoadingScreen progress={loadingProgress} />
        }

        switch (step) {
            case 0:
                return (
                    <div className="space-y-8 p-6">
                        {!showImageUploader ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card 
                                    className="p-6 cursor-pointer relative overflow-hidden transform transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-purple-500 via-orange-500 to-violet-500"
                                    onClick={() => {
                                        setShowSparkles(true)
                                        setShowImageUploader(true)
                                    }}
                                >
                                    {showSparkles && (
                                        <div className="absolute inset-0 overflow-hidden">
                                            {[...Array(20)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle"
                                                    style={{
                                                        left: `${Math.random() * 100}%`,
                                                        top: `${Math.random() * 100}%`,
                                                        animationDelay: `${Math.random() * 1}s`,
                                                        transform: `scale(${Math.random() * 0.5 + 0.5})`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                        <div className="relative z-20">
                                            <div className="relative">
                                                <Wand2 className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">AI Magic</h3>
                                        <p className="text-white/90">
                                            Upload images and let us magically generate product details using AI!
                                        </p>
                                    </div>
                                </Card>
                                
                                <Card 
                                    className="p-6 cursor-pointer transform transition-transform duration-300 hover:scale-105 bg-white"
                                    onClick={() => setStep(1)}
                                >
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="relative z-20">
                                            <div className="relative">
                                                <Pencil className="w-12 h-12 text-indigo-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-indigo-600">Manual Entry</h3>
                                        <p className="text-gray-700">
                                            Fill in all product details manually
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <AIGenerator
                                uploadedImages={uploadedImages}
                                setUploadedImages={setUploadedImages}
                                isGenerating={isGenerating}
                                onGenerate={handleAIGeneration}
                            />
                        )}
                    </div>
                )
            case 1:
                return <ProductInfoForm handleSubmit={handleSubmit} formData={formData} updateFormData={updateFormData} />
            case 2:
                return <ProductVariationsForm formData={formData} updateFormData={updateFormData} />
            case 3:
                return (
                        <SearchabilityDetailsForm formData={formData} updateFormData={updateFormData} />
                        
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Create New Product
                    </h1>
                    <p className="text-sm text-gray-500">Let's bring your product to life</p>
                </div>

                {/* Progress and Steps Indicator */}
                <div className="space-y-4">
                    <div className="flex justify-between mt-2">
                        {steps.map((stepItem, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => index < step && setStep(index + 1)}
                                className={`flex flex-col items-center group ${
                                    index <= step || isSubmitting ? 'text-indigo-600' : 'text-muted-foreground'
                                }`}
                                disabled={index > step || isSubmitting}
                            >
                                <div className={`rounded-full p-3 transition-all duration-300 flex items-center justify-center ${
                                    index <= step || isSubmitting 
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200' 
                                        : 'bg-gray-100 group-hover:bg-gray-200'
                                }`}>
                                    {index < step || isSubmitting ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <div className="w-5 h-5 flex items-center justify-center">{stepItem.icon}</div>
                                    )}
                                </div>
                                <span className="mt-2 text-sm font-medium">{stepItem.title}</span>
                              
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-between">
                            {steps.map((_, index) => (
                                <div key={index} className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                    index <= step || isSubmitting ? 'bg-indigo-500' : 'bg-gray-200'
                                }`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {renderStepContent()}
                </div>

                {/* Bottom buttons */}
                {!isSubmitting && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={step === 0 && !showImageUploader}
                                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>

                            <Button
                                onClick={handleNextStep}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-200/50 transition-all duration-200"
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

            <style jsx global>{`
                @keyframes sparkle {
                    0% {
                        transform: scale(0) rotate(0deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1) rotate(180deg);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0) rotate(360deg);
                        opacity: 0;
                    }
                }

                .animate-sparkle {
                    animation: sparkle 1.5s ease-out forwards;
                }
            `}</style>
        </div>
    )
}