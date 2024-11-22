import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { X, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RichTextEditor from "@/components/RichTextEditor";

export default function ProductDetailsForm({ formData, updateFormData }) {
    const [currentKeyword, setCurrentKeyword] = useState('')
    const [currentMaterial, setCurrentMaterial] = useState('')

    const addKeyword = () => {
        if (currentKeyword && formData.keywords && !formData.keywords.includes(currentKeyword)) {
            updateFormData('keywords', [...(formData.keywords || []), currentKeyword])
            setCurrentKeyword('')
        }
    }

    const removeKeyword = (keyword) => {
        if (formData.keywords) {
            updateFormData('keywords', formData.keywords.filter(k => k !== keyword))
        }
    }

    const addMaterial = () => {
        if (currentMaterial && formData.materialType && !formData.materialType.includes(currentMaterial)) {
            updateFormData('materialType', [...(formData.materialType || []), currentMaterial])
            setCurrentMaterial('')
        }
    }

    const removeMaterial = (material) => {
        if (formData.materialType) {
            updateFormData('materialType', formData.materialType.filter(m => m !== material))
        }
    }

    return (
        <div className="space-y-6 p-4 bg-white rounded-lg">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Label>Keywords</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><Info size={16} className="text-gray-400" /></TooltipTrigger>
                                <TooltipContent>
                                    <p>Add keywords to improve product searchability and discoverability</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Input
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        placeholder="E.g., Eco-friendly, Sustainable"
                        onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                        className="focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <Button onClick={addKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.keywords && formData.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="px-2 py-1">
                            {keyword}
                            <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                        </Badge>
                    ))}
                </div>
                <p className="text-sm text-gray-500">Add relevant keywords to improve product discoverability.</p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Label>Materials</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><Info size={16} className="text-gray-400" /></TooltipTrigger>
                                <TooltipContent>
                                    <p>List all materials used in creating your product</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Input
                        value={currentMaterial}
                        onChange={(e) => setCurrentMaterial(e.target.value)}
                        placeholder="E.g., Organic Cotton, Recycled Polyester"
                        onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
                        className="focus:ring-2 focus:ring-green-200 transition-all"
                    />
                    <Button onClick={addMaterial}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.materialType && formData.materialType.map((material, index) => (
                        <Badge key={index} variant="secondary" className="px-2 py-1">
                            {material}
                            <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeMaterial(material)} />
                        </Badge>
                    ))}
                </div>
                <p className="text-sm text-gray-500">Specify the materials used in your product.</p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="description">Description</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><Info size={16} className="text-gray-400" /></TooltipTrigger>
                                <TooltipContent>
                                    <p>Write a compelling description that highlights your product's unique features</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <RichTextEditor
                    id="description"
                    value={formData.description}
                    onChange={(e) => {
                        updateFormData('description', e)
                    }}
                    placeholder="Describe your product's key features, benefits, and what makes it special"
                    className="h-32 focus:ring-2 focus:ring-purple-200 transition-all"
                />
                <p className="text-sm text-gray-500">Provide a detailed description of your product, including its features and benefits.</p>
            </div>
        </div>
    )
}