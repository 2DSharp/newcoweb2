import React, { useEffect, useState } from 'react'
import { Info, Tag, Package, Cog, FileText, PencilLine } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CategorySearch, { Category } from '@/components/CategorySearch'
import apiService from '@/services/api'
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from '@/components/ui/button'
  
export default function ProductInfoForm({ formData, updateFormData, handleSubmit }) {
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
        if (formData && categories.length > 0) {
            const categoryPath = categories.find(cat => cat.name === formData.category);
            const subCategory = categoryPath?.children?.find(sub => sub.name === formData.subCategory);
            const finalCategory = subCategory?.children?.find(final => final.name === formData.finalCategory);
            
            if (categoryPath) {
                const selectedCats = [
                    categoryPath,
                    subCategory,
                    finalCategory
                ].filter(Boolean); // Remove undefined values
                
                setSelectedCategories(selectedCats);
            }
        }
    }, [formData, categories]);

    // Handle category selection
    const handleCategorySelect = (selected: Category[]) => {
        setSelectedCategories(selected)
        
        // Update form data with selected categories
        if (selected.length > 0) {
            updateFormData('category', selected[0]?.name || '')
            updateFormData('subCategory', selected[1]?.name || '')
            updateFormData('finalCategory', selected[2]?.name || '')
        } else {
            // Clear category data if nothing is selected
            updateFormData('category', '')
            updateFormData('subCategory', '')
            updateFormData('finalCategory', '')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg ">
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="name" className="flex items-center">
                        <PencilLine className="mr-2 text-blue-500" size={16} />
                        Product Name
                    </Label>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger type="button"><Info size={16} className="text-gray-400" /></TooltipTrigger>
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
                            <TooltipTrigger type="button"><Info size={16} className="text-gray-400" /></TooltipTrigger>
                            <TooltipContent>
                                <p>Select the primary category that best represents your product</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                    Helps customers find your product more easily
                </p>
            
                <CategorySearch 
                    categories={categories} 
                    onCategorySelect={handleCategorySelect}
                    initialSelected={selectedCategories}
                />
              
            </div>

            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="description" className="flex items-center">
                        <FileText className="mr-2 text-purple-500" size={16} />
                        Description
                    </Label>
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                    Write a detailed description of your product to help customers understand what sets you apart
                </p>
                <RichTextEditor
                    id="description"
                    value={formData.description || ''}
                    onChange={(value) => updateFormData('description', value)}
                    placeholder="Describe your product's key features, benefits, and what makes it special"
                    className="text-sm"
                />
            </div>
        </form>
    )
}