import React, { useEffect, useState } from 'react'
import { Info, Tag, Package, Cog, FileText, PencilLine } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CategorySearch, { Category } from '@/components/CategorySearch'
import apiService from '@/services/api'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ForwardRefEditor } from '@/components/ForwardRefEditor'
import { listsPlugin, toolbarPlugin, BoldItalicUnderlineToggles, ListsToggle, MDXEditorMethods } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

export default function ProductInfoForm({ formData, updateFormData, handleSubmit }) {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
    const editorRef = React.useRef<MDXEditorMethods>(null)
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

    // Add new useEffect to handle initial description
    useEffect(() => {
        if (formData?.description && editorRef.current) {
            editorRef.current.setMarkdown(formData.description);
        }
    }, [formData?.description]);

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

    // Handle description change
    const handleDescriptionChange = (markdown: string) => {
        updateFormData('description', markdown);
    };

    // Convert HTML to Markdown when loading existing content
    const getMarkdownContent = () => {
        if (!formData.description) return '';
        return formData.description;
    };

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
                   <Switch
                       id="personalizationText"
                       checked={formData.personalizationText || false}
                       onCheckedChange={(checked) => updateFormData('personalizationText', checked)}
                   />
                    <Label htmlFor="personalizationText">Allow customers to add personalized messages</Label>
               </div>
               <p className="text-sm text-gray-500">
                   When enabled, customers can add custom text or messages during checkout
               </p>
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
                <div className="border rounded-md overflow-hidden">
                    <ForwardRefEditor
                        ref={editorRef}
                        markdown={getMarkdownContent()}
                        onChange={handleDescriptionChange}
                        contentEditableClassName="prose max-w-none"
                        plugins={[
                            listsPlugin({
                                taskListItems: false
                            }),
                            toolbarPlugin({
                                toolbarContents: () => (
                                    <>
                                        <BoldItalicUnderlineToggles options={["Bold", "Italic"]} />
                                        <ListsToggle options={["number", "bullet"]} />
                                    </>
                                )
                            })
                        ]}
                    />
                    <style jsx global>{`
                        .mdxeditor {
                            --mdxeditor-font-family: inherit;
                            --mdxeditor-font-size: 14px;
                            --mdxeditor-line-height: 1.5;
                        }
                        .mdxeditor ul {
                            list-style-type: disc;
                            padding-left: 1.5em;
                            margin: 0.5em 0;
                        }
                        .mdxeditor ol {
                            list-style-type: decimal;
                            padding-left: 1.5em;
                            margin: 0.5em 0;
                        }
                        .mdxeditor li {
                            margin: 0.25em 0;
                        }
                    `}</style>
                </div>
            </div>
        </form>
    )
}