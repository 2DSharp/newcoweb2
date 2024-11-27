import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Info, Cog, Tag, SquareStack, Scissors, Users } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { TagInput } from "@/components/ui/tag-input"

const audiences = [
    { value: "NEWBORN", label: "Newborn (0-1)" },
    { value: "INFANTS", label: "Infants (1-2)" },
    { value: "CHILDREN", label: "Children (4-12)" },
    { value: "TEENS", label: "Teens (13-19)" },
    { value: "ADULTS", label: "Adults (20+)" },
    { value: "ALL", label: "All Ages" },
]

type AgeGroup = 'NEWBORN' | 'INFANTS' | 'CHILDREN' | 'TEENS' | 'ADULTS' | 'ALL';

interface SearchabilityData {
    keywords: string[];
    audience: AgeGroup[];
}

interface FormProps {
    formData: {
        searchability?: SearchabilityData;
        materialType?: string[];
        manufacturingType?: string;
    };
    updateFormData: (field: string, value: any) => void;
}

export default function SearchabilityDetailsForm({ formData, updateFormData }: FormProps) {
    useEffect(() => {
        if (!formData.searchability) {
            updateFormData('searchability', {
                keywords: [],
                audience: []
            })
        }
        if (!formData.materialType) {
            updateFormData('materialType', [])
        }
    }, [])

    const handleAudienceChange = (audienceValue: AgeGroup) => {
        const currentAudiences = formData.searchability?.audience || []
        const updatedAudiences = currentAudiences.includes(audienceValue)
            ? currentAudiences.filter(a => a !== audienceValue)
            : [...currentAudiences, audienceValue]
        updateFormData('searchability', {
            ...formData.searchability,
            audience: updatedAudiences
        })
    }

    return (
        <div className="space-y-6 p-4 bg-white rounded-lg">
            
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Label className="flex items-center">
                        <Tag className="mr-2 text-blue-500" size={16} />
                        Keywords
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger type="button">
                                <Info size={16} className="text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Add keywords to improve product searchability</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <p className="text-sm text-gray-500">
                    Search terms to help customers find your product
                </p>
                <TagInput
                    placeholder="Add keyword"
                    tags={formData.searchability?.keywords || []}
                    onTagsChange={(newTags) => 
                        updateFormData('searchability', {
                            ...formData.searchability,
                            keywords: newTags
                        })
                    }
                />
         
            </div>

            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Label className="flex items-center">
                        <Users className="mr-2 text-purple-500" size={16} />
                        Target Audience
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger type="button">
                                <Info size={16} className="text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Select your product's target audience</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <p className="text-sm text-gray-500">Who is your product for?</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {audiences.map((audience) => (
                        <div 
                            key={audience.value} 
                            className="flex items-center p-3 space-x-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
                            onClick={() => handleAudienceChange(audience.value)}
                        >
                            <Checkbox
                                id={audience.value}
                                checked={(formData.searchability?.audience || []).includes(audience.value)}
                                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                            />
                            <Label 
                                htmlFor={audience.value} 
                                className="cursor-pointer font-medium text-gray-700"
                            >
                                {audience.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Label className="flex items-center">
                        <Scissors className="mr-2 text-green-500" size={16} />
                        Materials
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger type="button">
                                <Info size={16} className="text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>List all materials used in creating your product</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <p className="text-sm text-gray-500">
                    Specify the materials used in your product.
                </p>
                <TagInput
                    placeholder="E.g., Organic Cotton, Recycled Polyester"
                    tags={formData.materialType || []}
                    onTagsChange={(newTags) => updateFormData('materialType', newTags)}
                />
              
            </div>

            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="manufacturingType" className="flex items-center">
                        <Cog className="mr-2 text-orange-500" size={16} />
                        Manufacturing Type
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><Info size={16} className="text-gray-400" /></TooltipTrigger>
                            <TooltipContent> 
                                <p>Specify whether your product is handmade or machine-produced</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Select 
                    onValueChange={(value) => updateFormData('manufacturingType', value)}
                    value={formData.manufacturingType || ''}
                >
                    <SelectTrigger className="focus:ring-2 focus:ring-orange-200 transition-all">
                        <SelectValue placeholder="Select manufacturing type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="HANDMADE">Handmade</SelectItem>
                        <SelectItem value="MACHINE">Machine Made</SelectItem>
                        <SelectItem value="HYBRID">Hybrid - A combination of both</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 flex items-center">
                    Transparency about your product's creation process
                </p>
            </div>
        </div>
    )
}