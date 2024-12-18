import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { X, ImageIcon, Plus, Loader2, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cropper from 'react-easy-crop'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import apiService from '@/services/api'

interface ImageResponse {
    id: string
    url: string
}

interface Image {
    imgId: string
    thumbnail: boolean
    url: string
}

interface ImageUploaderProps {
    images: Image[]
    onChange: (images: Image[]) => void
    maxImages?: number
}

interface ImageUploaderProps {
    images: Image[]
    onChange: (images: Image[]) => void
    maxImages?: number
    variationIndex: number
}

export default function ImageUploader({ images = [], onChange, maxImages = 4, variationIndex }: ImageUploaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [currentFile, setCurrentFile] = useState<File | null>(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const fileInputId = `file-upload-${variationIndex}`

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setCurrentFile(file)
            setPreviewUrl(objectUrl)
            setIsOpen(true)
            // Reset input
            e.target.value = ''
        }
    }

    // Clean up object URL when component unmounts or preview changes
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const handleCropSubmit = async () => {
        if (!currentFile || !croppedAreaPixels) return

        setIsUploading(true)
        try {
            // Create a canvas with the cropped image
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const image = new Image()
            image.src = previewUrl!

            await new Promise((resolve) => {
                image.onload = resolve
            })

            canvas.width = croppedAreaPixels.width
            canvas.height = croppedAreaPixels.height
            ctx?.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            )

            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve) => 
                canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.95)
            )

            // Create FormData and upload
            const formData = new FormData()
            formData.append('file', blob, currentFile.name)

            const response = await fetch('http://localhost:5000/files/upload', {
                method: 'POST',
                body: formData,
            })
            const data: ImageResponse = await response.json()

            // Use the URL directly from the response
            const newImage: Image = {
                imgId: data.id,
                thumbnail: images.length === 0,
                url: data.url
            }

            onChange([...images, newImage])
        } catch (error) {
            console.error('Upload failed:', error)
        } finally {
            setIsUploading(false)
            setIsOpen(false)
            setCurrentFile(null)
            setPreviewUrl(null)
        }
    }

    const handleThumbnailChange = (imgId: string) => {
        const updatedImages = images.map(img => ({
            ...img,
            thumbnail: img.imgId === imgId
        }))
        onChange(updatedImages)
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                    <div key={image.imgId} className="space-y-2">
                        <div className="relative aspect-square">
                            <img
                                src={image.url}
                                alt="Product"
                                className="w-full h-full object-contain rounded bg-gray-50"
                            />
                            <Button
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2"
                                onClick={() => {
                                    const updatedImages = images.filter(img => img.imgId !== image.imgId)
                                    if (image.thumbnail && updatedImages.length > 0) {
                                        updatedImages[0].thumbnail = true;
                                    }
                                    onChange(updatedImages)
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <RadioGroup
                            value={images.find(img => img.thumbnail)?.imgId || ''}
                            onValueChange={handleThumbnailChange}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={image.imgId}
                                    id={`thumbnail-${image.imgId}`}
                                />
                                <Label htmlFor={`thumbnail-${image.imgId}`}>Thumbnail</Label>
                            </div>
                        </RadioGroup>
                    </div>
                ))}
                
                {images.length < maxImages && (
                    <div 
                        onClick={() => document.getElementById(fileInputId)?.click()}
                        className="aspect-square border-2 border-dashed rounded flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
                    >
                        <input
                            id={fileInputId}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageSelect}
                        />
                        <Plus className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Add Image</span>
                    </div>
                )}
            </div>

            {isOpen && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Crop Image</DialogTitle>
                        </DialogHeader>
                        <div className="relative h-[400px]">
                            {previewUrl && (
                                <Cropper
                                    image={previewUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    classes={{
                                        containerClassName: "relative h-[400px]",
                                        mediaClassName: "max-h-full"
                                    }}
                                    showGrid={true}
                                />
                            )}
                        </div>
                        <div className="px-4">
                            <Label>Zoom</Label>
                            <Slider
                                value={[zoom]}
                                min={1}
                                max={3}
                                step={0.1}
                                onValueChange={([value]) => setZoom(value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCropSubmit} 
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
} 