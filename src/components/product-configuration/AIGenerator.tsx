import React from 'react'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'

interface Image {
    imgId: string
    thumbnail: boolean
    url: string
}

interface AIGeneratorProps {
    uploadedImages: Image[]
    setUploadedImages: (images: Image[]) => void
    isGenerating: boolean
    onGenerate: () => void
}

export default function AIGenerator({ uploadedImages, setUploadedImages, isGenerating, onGenerate }: AIGeneratorProps) {
    const handleImageChange = (newImages: Image[]) => {
        console.log('Images changed:', newImages)
        setUploadedImages(newImages)
    }

    return (
        <div className="space-y-6">
            <div className="transition-all duration-300 ease-in-out">
                <div className="space-y-4">
                    <div className="text-center space-y-2 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Let AI Create Your Product Listing</h2>
                        <p className="text-gray-600">Upload photos of your handmade product and our AI will automatically generate a detailed description, saving you time and effort.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        <div className="flex items-center space-x-2 p-2 bg-indigo-50 rounded-lg">
                            <span className="text-indigo-600">✨</span>
                            <span className="text-sm text-indigo-700">Clear, well-lit photos</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-indigo-50 rounded-lg">
                            <span className="text-indigo-600">📐</span>
                            <span className="text-sm text-indigo-700">Multiple angles</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-indigo-50 rounded-lg">
                            <span className="text-indigo-600">🎯</span>
                            <span className="text-sm text-indigo-700">Close-up and good lighting</span>
                        </div>
                    </div>
                    <ImageUploader
                        images={uploadedImages}
                        onChange={handleImageChange}
                        maxImages={5}
                        variationIndex={0}
                    />
                    
                    <Button 
                        className="w-full relative overflow-hidden group" 
                        onClick={onGenerate}
                        disabled={uploadedImages.length === 0 || isGenerating}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Generate'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
} 