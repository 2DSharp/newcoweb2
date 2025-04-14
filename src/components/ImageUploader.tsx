import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { X, ImageIcon, Plus, Loader2, Trash2, Camera, Upload, Expand, Edit, Check, RotateCw, SwitchCamera } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cropper from 'react-easy-crop'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    variationIndex: number
    showThumbnailSelector?: boolean
    action?: 'edit' | 'delete'
}

const UPLOAD_MESSAGES = [
    "Uploading...",
    "Adjusting image...",
    "Optimizing quality...",
    "Processing...",
    "Almost done..."
]

export default function ImageUploader({ 
    images = [], 
    onChange, 
    maxImages = 4, 
    variationIndex,
    showThumbnailSelector = true,
    action = 'delete'
}: ImageUploaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [currentFile, setCurrentFile] = useState<File | null>(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isCameraSource, setIsCameraSource] = useState(false)
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)
    const [uploadingImages, setUploadingImages] = useState<{ [key: string]: number }>({})
    const [error, setError] = useState<string | null>(null)
    const [previewImage, setPreviewImage] = useState<Image | null>(null)
    const [imageToReplace, setImageToReplace] = useState<string | null>(null)
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')

    const fileInputId = `file-upload-${variationIndex}`

    const handleImageAction = (image: Image, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening preview
        
        if (action === 'delete') {
            const updatedImages = images.filter(img => img.imgId !== image.imgId);
            if (image.thumbnail && updatedImages.length > 0) {
                updatedImages[0].thumbnail = true;
            }
            onChange(updatedImages);
        } else if (action === 'edit') {
            // Open the upload dialog for replacing this image
            document.getElementById(fileInputId)?.click();
            // Store the image ID to be replaced
            setImageToReplace(image.imgId);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setCurrentFile(file)
            setPreviewUrl(objectUrl)
            setIsOpen(true)
            setIsCameraSource(false)
            e.target.value = ''
        }
    }

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

        const tempId = `temp-${Date.now()}`
        setUploadingImages(prev => ({ ...prev, [tempId]: 0 }))
        setError(null)
        
        // Close the modal immediately
        setIsOpen(false)
        const tempPreviewUrl = previewUrl
        setPreviewUrl(null)
        setCurrentFile(null)
        
        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const image = new Image()
            image.src = tempPreviewUrl!

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

            const blob = await new Promise<Blob>((resolve) => 
                canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.95)
            )

            const formData = new FormData()
            formData.append('file', blob, currentFile.name)

            const data = await apiService.files.upload(formData)

            // If we're replacing an image, use the same thumbnail status and remove the old one
            if (imageToReplace) {
                const replacedImage = images.find(img => img.imgId === imageToReplace);
                const isThumbnail = replacedImage?.thumbnail || images.length === 0;
                
                // Filter out the image being replaced
                const filteredImages = images.filter(img => img.imgId !== imageToReplace);
                
                // Add the new image
                const newImage: Image = {
                    imgId: data.id,
                    thumbnail: isThumbnail,
                    url: data.url
                };
                
                // Update images array
                onChange([...filteredImages, newImage]);
                setImageToReplace(null);
            } else {
                // Create a temporary image object with the server URL
                const newImage: Image = {
                    imgId: data.id,
                    thumbnail: images.length === 0,
                    url: data.url
                }

                // Update the images array with the new image
                const updatedImages = [...images, newImage]
                onChange(updatedImages)
            }

        } catch (error) {
            console.error('Upload failed:', error)
            setError('Failed to upload image, please try again')
        } finally {
            setUploadingImages(prev => {
                const { [tempId]: _, ...rest } = prev
                return rest
            })
            // Clean up the temporary preview URL
            if (tempPreviewUrl) {
                URL.revokeObjectURL(tempPreviewUrl)
            }
        }
    }

    const handleThumbnailChange = (imgId: string) => {
        const updatedImages = images.map(img => ({
            ...img,
            thumbnail: img.imgId === imgId
        }))
        onChange(updatedImages)
    }

    const handleCameraCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: facingMode 
                } 
            })
            setVideoStream(stream)
            setIsCameraSource(true)
            setIsOpen(true)
        } catch (error) {
            console.error('Error accessing camera:', error)
        }
    }

    const toggleCameraFacing = async () => {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop())
            setVideoStream(null)
            setVideoRef(null)
        }
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
        await handleCameraCapture()
    }

    const retakePhoto = async () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
            setCurrentFile(null)
        }
        await handleCameraCapture()
    }

    const capturePhoto = () => {
        if (!videoRef || !videoStream) return

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) return

        // Maintain aspect ratio from video
        const aspectRatio = videoRef.videoWidth / videoRef.videoHeight
        const width = 800 // Fixed width for consistency
        const height = width / aspectRatio

        canvas.width = width
        canvas.height = height
        context.drawImage(videoRef, 0, 0, width, height)

        // Stop the video stream
        videoStream.getTracks().forEach(track => track.stop())
        setVideoStream(null)
        setVideoRef(null)

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
                const objectUrl = URL.createObjectURL(file)
                setCurrentFile(file)
                setPreviewUrl(objectUrl)
                setIsCameraSource(false) // Switch to crop mode after capture
            }
        }, 'image/jpeg', 0.95)
    }

    // Clean up video stream when component unmounts or dialog closes
    useEffect(() => {
        return () => {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop())
            }
        }
    }, [videoStream])

    const openImagePreview = (image: Image) => {
        setPreviewImage(image)
    }

    return (
        <div className="space-y-6">
         
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {images.map((image) => (
                    <div key={image.imgId} className="flex flex-col gap-2">
                        <div className="group relative aspect-square">
                            <div 
                                className="absolute inset-0 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl cursor-pointer"
                                onClick={() => openImagePreview(image)}
                            >
                                <img
                                    src={image.url}
                                    alt="Product"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="bg-white/90 hover:bg-white text-gray-900 hover:text-red-500 h-8 w-8 p-0 rounded-full"
                                        onClick={(e) => handleImageAction(image, e)}
                                    >
                                        {action === 'delete' ? (
                                            <Trash2 className="h-4 w-4" />
                                        ) : (
                                            <Edit className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="bg-white/90 hover:bg-white text-gray-900 h-8 w-8 p-0 rounded-full"
                                    >
                                        <Expand className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {showThumbnailSelector && (
                            <div className="flex justify-center mt-1">
                                <RadioGroup
                                    value={images.find(img => img.thumbnail)?.imgId || ''}
                                    onValueChange={handleThumbnailChange}
                                    className="flex items-center"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={image.imgId}
                                            id={`thumbnail-${image.imgId}`}
                                            className="h-4 w-4 border-gray-400"
                                        />
                                        <Label htmlFor={`thumbnail-${image.imgId}`} className="text-sm text-gray-700">Set as thumbnail</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}
                    </div>
                ))}
                
                {Object.entries(uploadingImages).map(([tempId, progress]) => (
                    <div key={tempId} className="relative aspect-square">
                        <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Uploading"
                                    className="w-full h-full object-cover opacity-50"
                                />
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="relative w-12 h-12 mb-3">
                                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 animate-spin" 
                                         style={{ borderRightColor: 'transparent', borderTopColor: 'transparent' }}></div>
                                </div>
                                <div className="h-6 overflow-hidden">
                                    <div className="animate-scroll-up">
                                        {UPLOAD_MESSAGES.map((message, index) => (
                                            <div 
                                                key={index}
                                                className="text-sm text-gray-600 text-center"
                                                style={{
                                                    animationDelay: `${index * 2}s`,
                                                    animationDuration: `${UPLOAD_MESSAGES.length * 2}s`
                                                }}
                                            >
                                                {message}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {images.length + Object.keys(uploadingImages).length < maxImages && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div 
                                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <Plus className="h-6 w-6 text-gray-400 group-hover:text-gray-600" />
                                </div>
                                <span className="text-sm text-gray-500 group-hover:text-gray-700">Add Image</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => document.getElementById(fileInputId)?.click()} className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                <span>Upload from device</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCameraCapture} className="cursor-pointer">
                                <Camera className="mr-2 h-4 w-4" />
                                <span>Take a photo</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <input
                    id={fileInputId}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                />
            </div>

            {isOpen && (
                <Dialog open={isOpen} onOpenChange={(open) => {
                    if (!open && videoStream) {
                        videoStream.getTracks().forEach(track => track.stop())
                        setVideoStream(null)
                        setVideoRef(null)
                    }
                    setIsOpen(open)
                }}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-0">
                        <DialogHeader className="px-6 pt-6 sticky top-0 bg-white z-10">
                            <DialogTitle className="text-xl font-semibold">{isCameraSource ? 'Take Photo' : 'Crop Image'}</DialogTitle>
                        </DialogHeader>
                        <div className="relative h-[400px] bg-gray-50 mt-4">
                            {isCameraSource && videoStream ? (
                                <div className="relative h-full">
                                    <video
                                        ref={(ref) => {
                                            if (ref && videoStream) {
                                                ref.srcObject = videoStream
                                                ref.play()
                                            }
                                            setVideoRef(ref)
                                        }}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        playsInline
                                    />
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                                        <Button
                                            className="h-12 w-12 rounded-full bg-white/90 hover:bg-white text-black shadow-lg"
                                            onClick={toggleCameraFacing}
                                        >
                                            <SwitchCamera className="h-6 w-6" />
                                        </Button>
                                        <Button
                                            className="h-12 w-12 rounded-full bg-white/90 hover:bg-white text-black shadow-lg"
                                            onClick={capturePhoto}
                                        >
                                            <Camera className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                            ) : previewUrl ? (
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
                                    showGrid={!isCameraSource}
                                    objectFit="contain"
                                />
                            ) : null}
                        </div>
                        {!isCameraSource && (
                            <div className="px-6 py-1 border-t">
                                <div className="flex items-center justify-between mb-1">
                                    <Label className="text-sm font-medium">Zoom</Label>
                                    <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                                </div>
                                <Slider
                                    value={[zoom]}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onValueChange={([value]) => setZoom(value)}
                                    className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-indigo-600 [&_[role=slider]]:shadow-lg [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:transition-transform [&_[role=track]]:h-1"
                                />
                            </div>
                        )}
                        <DialogFooter className="px-6 py-4 border-t bg-gray-50 sticky bottom-0 bg-white z-10">
                            <div className="flex items-center justify-center gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        if (videoStream) {
                                            videoStream.getTracks().forEach(track => track.stop())
                                            setVideoStream(null)
                                            setVideoRef(null)
                                        }
                                        if (previewUrl) {
                                            URL.revokeObjectURL(previewUrl)
                                            setPreviewUrl(null)
                                        }
                                        setIsOpen(false)
                                    }}
                                    className="border-gray-300 hover:bg-gray-100 h-9 px-2"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                </Button>
                                {isCameraSource ? (
                                    <Button 
                                        onClick={capturePhoto}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-2"
                                    >
                                        <Camera className="mr-1 h-4 w-4" />
                                        Capture
                                    </Button>
                                ) : (
                                    <>
                                        <Button 
                                            onClick={retakePhoto}
                                            variant="outline"
                                            className="border-gray-300 hover:bg-gray-100 h-9 px-2"
                                        >
                                            <Camera className="mr-1 h-4 w-4" />
                                            Retake
                                        </Button>
                                        <Button 
                                            onClick={handleCropSubmit}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-2"
                                        >
                                            <Check className="mr-1 h-4 w-4" />
                                            Accept
                                        </Button>
                                    </>
                                )}
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <Dialog open={previewImage !== null} onOpenChange={(open) => !open && setPreviewImage(null)}>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden">
                        <DialogHeader className="p-6">
                            <DialogTitle className="text-xl font-semibold">Image Preview</DialogTitle>
                        </DialogHeader>
                        <div className="relative flex items-center justify-center bg-gray-50 p-4">
                            <img 
                                src={previewImage.url} 
                                alt="Preview" 
                                className="max-h-[70vh] max-w-full object-contain"
                            />
                        </div>
                        <DialogFooter className="px-6 py-4 border-t bg-gray-50">
                            <Button 
                                variant="outline" 
                                onClick={() => setPreviewImage(null)}
                                className="border-gray-300 hover:bg-gray-100"
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            <style jsx global>{`
                @keyframes scroll-up {
                    0% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    15% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    20% {
                        transform: translateY(-20%);
                        opacity: 0;
                    }
                    25% {
                        transform: translateY(-20%);
                        opacity: 1;
                    }
                    40% {
                        transform: translateY(-20%);
                        opacity: 1;
                    }
                    45% {
                        transform: translateY(-40%);
                        opacity: 0;
                    }
                    50% {
                        transform: translateY(-40%);
                        opacity: 1;
                    }
                    65% {
                        transform: translateY(-40%);
                        opacity: 1;
                    }
                    70% {
                        transform: translateY(-60%);
                        opacity: 0;
                    }
                    75% {
                        transform: translateY(-60%);
                        opacity: 1;
                    }
                    90% {
                        transform: translateY(-60%);
                        opacity: 1;
                    }
                    95% {
                        transform: translateY(-80%);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(-80%);
                        opacity: 1;
                    }
                }

                .animate-scroll-up {
                    animation: scroll-up ${UPLOAD_MESSAGES.length * 3}s infinite;
                }
            `}</style>
               {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 