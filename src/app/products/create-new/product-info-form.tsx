import React, { useEffect, useState } from 'react'
import { Info, Tag, Package, Cog } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CategorySearch, { Category } from '@/components/CategorySearch'
import apiService from '@/services/api'

  
export default function ProductInfoForm({ formData, updateFormData }) {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiService.cms.getCategories(3);
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategories.length > 0) {
            const [category, subCategory, finalCategory] = selectedCategories;
            updateFormData('category', category?.name || '');
            updateFormData('subCategory', subCategory?.name || '');
            updateFormData('finalCategory', finalCategory?.name || '');
        }
    }, [selectedCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
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
            return true;
        } catch (error) {
            console.error('Failed to create draft:', error);
            return false;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg">
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="name" className="flex items-center">
                        <Tag className="mr-2 text-blue-500" size={16} />
                        Product Name
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><Info size={16} className="text-gray-400" /></TooltipTrigger>
                            <TooltipContent>
                                <p>Choose a clear, descriptive name that highlights your product's key features</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="E.g., Organic Cotton T-Shirt"
                    className="focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                />
                <p className="text-sm text-gray-500 flex items-center">
                    Create a name that captures attention and describes your product
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="category" className="flex items-center">
                        <Package className="mr-2 text-green-500" size={16} />
                        Category
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><Info size={16} className="text-gray-400" /></TooltipTrigger>
                            <TooltipContent>
                                <p>Select the primary category that best represents your product</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                    Helps customers find your product more easily
                </p>
            
                <CategorySearch categories={categories} onCategorySelect={setSelectedCategories} />
              
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
                <Select onValueChange={(value) => updateFormData('manufacturingType', value)}>
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
        </form>
    )
}