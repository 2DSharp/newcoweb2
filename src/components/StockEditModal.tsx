import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus, Save, Check } from "lucide-react"
import apiService from '@/services/api'
import { PrimaryButton } from './ui/primary-button'
import Image from 'next/image'

interface Variant {
    variantId: string
    name: string
    sku: string
    stock: number
    type: string
}

interface StockEditModalProps {
    isOpen: boolean
    onClose: () => void
    variants: Variant[]
    productId: string
    onStockUpdate: () => void
}

export default function StockEditModal({ isOpen, onClose, variants, productId, onStockUpdate }: StockEditModalProps) {
    const [stockValues, setStockValues] = useState(
        variants.reduce((acc, variant) => ({
            ...acc,
            [variant.variantId]: variant.stock
        }), {})
    )
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

    const handleStockChange = (variantId: string, value: number) => {
        setStockValues(prev => ({
            ...prev,
            [variantId]: Math.max(0, value) // Prevent negative values
        }))
    }

    const handleSave = async (variantId: string) => {
        setLoading(prev => ({ ...prev, [variantId]: true }))
        try {
            await apiService.products.updateStock(
                productId,
                variantId,
                stockValues[variantId]
            )
            onStockUpdate() // Refresh the product list
        } catch (error) {
            console.error('Failed to update stock:', error)
            // You might want to add a toast notification here
        } finally {
            setLoading(prev => ({ ...prev, [variantId]: false }))
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Stock Levels</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    {variants.map(variant => (
                        variant.type === 'FIXED_VARIANT' ? (
                            <div key={variant.variantId} className="flex items-center justify-between space-x-2 p-2 border rounded-lg">
                            
                                <div className="flex-1">
                                    <p className="font-medium">{variant.name}</p>
                                    <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleStockChange(variant.variantId, stockValues[variant.variantId] - 1)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={stockValues[variant.variantId]}
                                        onChange={(e) => handleStockChange(variant.variantId, parseInt(e.target.value) || 0)}
                                        className="w-20 text-center"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleStockChange(variant.variantId, stockValues[variant.variantId] + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <PrimaryButton
                                        onClick={() => handleSave(variant.variantId)}
                                        disabled={loading[variant.variantId]}
                                    >
                                        {loading[variant.variantId] ? (
                                            <div className="animate-spin">...</div>
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </PrimaryButton>
                                </div>
                            </div>
                        ) : (
                            <div key={variant.variantId} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                                <div>
                                    <p className="font-medium">{variant.name}</p>
                                    <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                                </div>
                                <span className="text-gray-500">Custom</span>
                            </div>
                        )
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
} 