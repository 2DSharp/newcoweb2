"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronLeft, ChevronDown, Search } from 'lucide-react'

export interface Category {
  id: number
  name: string
  path: string
  children?: Category[]
}

interface CategorySearchProps {
  categories: Category[]
  onCategorySelect: (selectedCategories: Category[]) => void
}

export default function CategorySearch({ categories, onCategorySelect }: CategorySearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [currentCategories, setCurrentCategories] = useState<Category[]>(categories)
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [isListVisible, setIsListVisible] = useState(true)
    useEffect(() => {
        resetSearch()
    }, [categories])
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return currentCategories;

    const searchLower = searchTerm.toLowerCase();
    
    interface CategoryWithFullPath extends Category {
      fullPath?: string;
    }

    const findMatchingWithFullPath = (
      categories: Category[], 
      parentPath: string = ""
    ): CategoryWithFullPath[] => {
      const results: CategoryWithFullPath[] = [];
      
      for (const category of categories) {
        const currentPath = parentPath ? `${parentPath} > ${category.name}` : category.name;
        const matches = category.name.toLowerCase().includes(searchLower);
        const hasChildren = category.children && category.children.length > 0;
        
        if (matches) {
          if (hasChildren) {
            // If it's a parent category that matches, include it with its children
            results.push({
              ...category,
              // Don't add fullPath for parent categories
            });
          } else {
            // If it's a leaf category that matches, include it with its full path
            results.push({
              ...category,
              fullPath: currentPath
            });
          }
        }
        
        // Always check children for matches
        if (category.children) {
          const childMatches = findMatchingWithFullPath(category.children, currentPath);
          if (!matches) { // Only add child matches if parent didn't match
            results.push(...childMatches);
          }
        }
      }
      
      return results;
    };

    const filtered = findMatchingWithFullPath(categories);
    
    // Auto-expand matched parent categories
    const matchedParentIds = filtered
      .filter(cat => cat.children && cat.children.length > 0)
      .map(cat => cat.id);
    
    setExpandedCategories(new Set(matchedParentIds));
    
    return filtered;
  }, [searchTerm, categories]);

  const handleCategoryClick = (category: Category) => {
    // Find the complete path to this category
    const findCategoryPath = (
      categories: Category[],
      targetId: number,
      path: Category[] = []
    ): Category[] | null => {
      for (const cat of categories) {
        if (cat.id === targetId) {
          return [...path, cat]
        }
        if (cat.children) {
          const found = findCategoryPath(cat.children, targetId, [...path, cat])
          if (found) return found
        }
      }
      return null
    }

    const categoryPath = findCategoryPath(categories, category.id) || [category]
    setSelectedCategories(categoryPath)
    
    if (category.children && category.children.length > 0) {
      // If it has children, expand/collapse it
      setExpandedCategories(prev => {
        const newSet = new Set(prev)
        if (newSet.has(category.id)) {
          newSet.delete(category.id)
        } else {
          newSet.add(category.id)
        }
        return newSet
      })
    } else {
      // If it's a leaf node, hide the list and set the search term
      setIsListVisible(false)
      setSearchTerm(category.name)
    }
    
    onCategorySelect(categoryPath)
  }

  const handleBackClick = () => {
    if (selectedCategories.length > 1) {
      // Get the parent category (second to last in the array)
      const parentCategory = selectedCategories[selectedCategories.length - 2];
      const newSelected = selectedCategories.slice(0, -1);

      // Update states
      setSelectedCategories(newSelected);
      setCurrentCategories(parentCategory.children || [parentCategory]);
      setIsListVisible(true);
      setSearchTerm(parentCategory.name);
      
      // Expand the parent category to show its children
      setExpandedCategories(new Set([parentCategory.id]));
      
      onCategorySelect(newSelected);
    } else {
      // If at root level, reset everything
      resetSearch();
      setIsListVisible(true);
    }
  };

  const handleSelectedCategoryClick = (category: Category, index: number) => {
    if (index === selectedCategories.length - 1 && !category.children) {
      return // Don't do anything if clicking the leaf category
    }

    const newSelected = selectedCategories.slice(0, index + 1)
    setSelectedCategories(newSelected)
    setIsListVisible(true)
    setSearchTerm(category.name)
    
    setExpandedCategories(new Set([category.id]))
    
    if (category.children) {
      setCurrentCategories(category.children)
    }
    onCategorySelect(newSelected)
  }

  const resetSearch = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setCurrentCategories(categories)
    setExpandedCategories(new Set())
    setIsListVisible(true)
    onCategorySelect([])
  }

  const handleInputFocus = () => {
    setIsListVisible(true)
    setSearchTerm("")
  }

  const renderCategories = (categories: Category[], level = 0) => {
    return categories.map((category) => {
      const isSelected = selectedCategories.some(selected => selected.id === category.id);
      const hasChildren = category.children && category.children.length > 0;
      const isLeafSelected = selectedCategories[selectedCategories.length - 1]?.id === category.id && !hasChildren;
      const shouldShowChildren = hasChildren && (
        expandedCategories.has(category.id) || 
        (searchTerm && category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      // Use fullPath only for leaf nodes in search results
      const displayName = searchTerm && (category as any).fullPath && !hasChildren
        ? (category as any).fullPath 
        : category.name;
      
      return (
        <div key={category.id} style={{ marginLeft: `${level * 24}px` }}>
          <Button
            type="button"
            onClick={() => handleCategoryClick(category)}
            className={`w-full justify-start min-h-[2.5rem] h-auto mb-2 ${
              isLeafSelected ? 'ring-2 ring-blue-500' : 
              isSelected ? 'text-blue-500' : ''
            }`}
            variant="ghost"
          >
            {(hasChildren && (!searchTerm || category.name.toLowerCase().includes(searchTerm.toLowerCase()))) && (
              shouldShowChildren ? 
              <ChevronDown className="mr-2 h-4 w-4" /> : 
              <ChevronRight className="mr-2 h-4 w-4" />
            )}
           <span style={{textAlign: 'left'}} className="break-words whitespace-pre-wrap"> {displayName} </span> 
          </Button>
          {shouldShowChildren && (
            <div >{renderCategories(category.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Top section: Input and selected categories */}
      <div className="space-y-4">
        <div className="relative w-full max-w-[600px]">
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            className="w-full pr-10"
          />
          <Search 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
          />
        </div>
        {selectedCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    {isListVisible && (
  <Button 
            type="button"
            onClick={handleBackClick} 
            disabled={selectedCategories.length === 0 && currentCategories === categories}
            size="icon"
            variant="ghost"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
                    )}
          {selectedCategories.map((category, index) => (
            <div key={category.id} className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                className="p-1 hover:text-blue-500"
                onClick={() => handleSelectedCategoryClick(category, index)}
              >
                {category.name}
              </Button>
              {index < selectedCategories.length - 1 && <ChevronRight className="h-4 w-4" />}
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Bottom section: Category list */}
      {isListVisible && (
        <ScrollArea className="h-[300px] w-full max-w-[600px] rounded-md border p-4">
          {(searchTerm ? filteredCategories : currentCategories).length > 0 ? (
            renderCategories(searchTerm ? filteredCategories : currentCategories)
          ) : (
            <div className="text-center text-gray-500">
              <p>No categories found</p>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  )
}

