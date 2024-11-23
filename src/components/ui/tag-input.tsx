import React, { useState } from 'react'
import { Input } from "./input"
import { Button } from "./button"
import { Badge } from "./badge"
import { X, Info } from 'lucide-react'
import { Label } from "./label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

interface TagInputProps {
    placeholder: string;
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

export function TagInput({
    placeholder,
    tags,
    onTagsChange,
}: TagInputProps) {
    const [currentTag, setCurrentTag] = useState('')

    const addTag = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (currentTag && !tags.includes(currentTag)) {
            onTagsChange([...tags, currentTag])
            setCurrentTag('')
        }
    }

    const removeTag = (tag: string) => {
        onTagsChange(tags.filter(t => t !== tag))
    }

    return (
        <div className="space-y-2">
            <div className="flex space-x-2">
                <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder={placeholder}
                    onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                    className="focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <Button type="button" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    )
} 