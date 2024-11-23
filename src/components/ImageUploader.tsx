import React from 'react'
import { Button } from "@/components/ui/button"
import { X, ImageIcon, Plus } from 'lucide-react'

interface Image {
    imgId: string
    thumbnail: boolean
    preview: string
}

interface ImageUploaderProps {
    images: Image[]
    onChange: (images: Image[]) => void
    maxImages?: number
}

export default function ImageUploader({ images, onChange, maxImages = 4 }: ImageUploaderProps) {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        
        if (images.length + files.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`)
            return
        }

        const newImages = files.map((file, i) => ({
            imgId: `img-${Date.now()}-${i}`,
            thumbnail: images.length === 0 && i === 0,
            preview: URL.createObjectURL(file)
        }))

        onChange([...images, ...newImages])
    }

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
        onChange(updatedImages)
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, imgIndex) => (
                <div key={image.imgId} className="relative">
                    <img
                        src={image.preview}
                        alt={`Product ${imgIndex + 1}`}
                        className="w-full h-24 object-cover rounded"
                    />
                    <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeImage(imgIndex)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            {images.length < maxImages && (
                <div className="w-full h-24 border-2 border-dashed rounded flex items-center justify-center">
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                        <Plus className="h-8 w-8 text-gray-400" />
                    </label>
                </div>
            )}
        </div>
    )
} 