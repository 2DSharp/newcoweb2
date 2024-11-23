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

    return (
        <div className="space-y-6 p-4 bg-white rounded-lg">
            <TagInput
                label="Keywords"
                icon={<Tag size={16} />}
                tooltip="Add keywords to improve product searchability"
                placeholder="Add keyword"
                tags={formData.searchability?.keywords || []}
                onTagsChange={(newTags) => 
                    updateFormData('searchability', {
                        ...formData.searchability,
                        keywords: newTags
                    })
                }
                iconColor="text-blue-500"
            />

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

                <div className="space-y-2">
                    {audiences.map((audience) => (
                        <div key={audience.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={audience.value}
                                checked={(formData.searchability?.audience || []).includes(audience.value)}
                                onCheckedChange={() => handleAudienceChange(audience.value)}
                            />
                            <Label htmlFor={audience.value}>{audience.label}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <TagInput
                label="Materials"
                icon={<Scissors size={16} />}
                tooltip="List all materials used in creating your product"
                placeholder="E.g., Organic Cotton, Recycled Polyester"
                tags={formData.materialType || []}
                onTagsChange={(newTags) => updateFormData('materialType', newTags)}
                description="Specify the materials used in your product."
                iconColor="text-green-500"
            />

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