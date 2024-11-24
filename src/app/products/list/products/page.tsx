"use client";

import { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Info, Plus, Pencil, Trash2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import apiService from '@/services/api'
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { PrimaryButton } from '@/components/ui/primary-button';
import { Edit2 } from 'lucide-react'
import StockEditModal from '@/components/StockEditModal'
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useToast } from '@/hooks/use-toast';

export default function ProductsListPage() {
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [drafts, setDrafts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [showDrafts, setShowDrafts] = useState(false)
    const { toast } = useToast()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [draftToDelete, setDraftToDelete] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (showDrafts) {
                    const response = await apiService.products.getDrafts()
                    setDrafts(response.data)
                } else {
                    const response = await apiService.products.getList()
                    setProducts(response.data)
                }
            } catch (error) {
                console.error('Failed to fetch products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [showDrafts])

    const getStockInfo = (variants = []) => {
        const fixedVariants = variants?.filter(v => v.type === 'FIXED_VARIANT') || []
        const customVariants = variants?.filter(v => v.type === 'CUSTOM') || []
        
        const totalFixedStock = fixedVariants.reduce((sum, v) => sum + v.stock, 0)
        const allFixedZero = fixedVariants.length > 0 && fixedVariants.every(v => v.stock === 0)
        const anyLowStock = fixedVariants.some(v => v.stock > 0 && v.stock < 8)
        
        let stockText = ''
        let stockClass = ''
        
        if (fixedVariants.length === 0 && customVariants.length > 0) {
            stockText = 'Custom'
            stockClass = 'bg-gray-100'
        } else if (allFixedZero) {
            stockText = 'Out of Stock'
            stockClass = 'bg-red-100'
        } else if (customVariants.length > 0) {
            stockText = `${totalFixedStock} + Custom`
            stockClass = anyLowStock ? 'bg-orange-100' : 'bg-green-100'
        } else {
            stockText = totalFixedStock.toString()
            stockClass = anyLowStock ? 'bg-orange-100' : 'bg-green-100'
        }
        
        return { text: stockText, className: stockClass }
    }

    const hasFixedVariants = (variants) => {
        return variants.some(v => v.type === 'FIXED_VARIANT')
    }

    const handleStockUpdate = async () => {
        const response = await apiService.products.getList()
        setProducts(response.data)
    }

    const handleDeleteClick = (draft) => {
        setDraftToDelete(draft)
        setDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            await apiService.products.deleteDraft(draftToDelete.id)
            toast({
                title: "Draft deleted",
                description: "The draft has been successfully deleted.",
            })
            // Refresh drafts list
            const response = await apiService.products.getDrafts()
            setDrafts(response.data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete draft. Please try again.",
                variant: "destructive",
            })
        } finally {
            setDeleteModalOpen(false)
            setDraftToDelete(null)
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div>Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500">Manage your product listings</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className={showDrafts ? 'bg-gray-100' : ''}
                        onClick={() => setShowDrafts(!showDrafts)}
                    >
                        {showDrafts ? 'View Products' : 'View Drafts'}
                    </Button>
                    <a href="/products/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </a>
                </div>
            </div>

            <Card className="bg-white rounded-lg shadow">
                <div className="p-4 md:p-6 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-gray-600">Image</TableHead>
                                <TableHead className="text-gray-600">Name</TableHead>
                                <TableHead className="text-gray-600">Status</TableHead>
                                <TableHead className="text-gray-600">Price</TableHead>
                                <TableHead className="text-gray-600">
                                    <div className="flex items-center">
                                        <span>Stock</span>
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button 
                                                        className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                        }}
                                                    >
                                                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent 
                                                    side="top" 
                                                    className="p-3 max-w-xs"
                                                >
                                                    <div className="space-y-2">
                                                        <p className="font-medium">Stock Calculation</p>
                                                        <p>The sum of all fixed variants stock + custom variants stock</p>
                                                        <div className="space-y-1">
                                                            <p>🔴 Red: Out of stock</p>
                                                            <p>🟠 Orange: Low stock (&lt; 8)</p>
                                                            <p>🟢 Green: Good stock level</p>
                                                            <p>⚫ Gray: Custom order only</p>
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableHead>
                                <TableHead className="text-gray-600">Category</TableHead>
                                <TableHead className="text-gray-600">Date Created</TableHead>
                                <TableHead className="text-gray-600">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(showDrafts ? drafts : products).map((item) => {
                                const stockInfo = getStockInfo(item.variants)
                                const baseVariant = item.variants?.[0]
                                
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.thumbnail ?
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.name}
                                                width={50}
                                                height={50}
                                                className="rounded-md"
                                            />
                                            : <div className="w-10 h-10 bg-gray-100 rounded-md"></div>
                                        }
                                        </TableCell>
                                        <TableCell>
                                            {item.name}
                                            {item.variants?.length > 1 && (
                                                <div className="text-sm text-gray-500">
                                                    + {item.variants.length - 1} variants
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                showDrafts 
                                                    ? 'bg-gray-100 text-gray-800'
                                                    : item.active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {showDrafts ? 'Unpublished' : (item.active ? 'Active' : 'Inactive')}
                                            </span>
                                        </TableCell>
                                        <TableCell>{(baseVariant && baseVariant.price) ? `₹${baseVariant.price.toFixed(2)}` : 'Not set'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded ${stockInfo.className}`}>
                                                    {stockInfo.text}
                                                </span>
                                                {!showDrafts && hasFixedVariants(item.variants) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedProduct(item)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.category} &gt; {item.subCategory}
                                            {item.finalCategory && ` > ${item.finalCategory}`}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                
                                                {showDrafts ? (
                                                  <>
                                                     <Button
                                                     size="sm"
                                                     variant="ghost"
                                                     onClick={() => {
                                                      router.push(`/products/new/${item.id}/1`)
                                                     }}
                                                 >
                                                     <Pencil className="h-4 w-4" />
                                                 </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    </>
                                                ):
                                                <Button
                                                    size="sm"
                                                    className="bg-gray-100 text-black hover:bg-black hover:text-white"
                                                    onClick={() => {
                                                        if (showDrafts) {
                                                            router.push(`/products/new/${item.id}/1`)
                                                        } else {
                                                            router.push(`/products/${item.id}`)
                                                        }
                                                    }}
                                                >
                                                    Manage
                                                </Button>
                                                }
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {selectedProduct && (
                <StockEditModal
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    variants={selectedProduct.variants}
                    productId={selectedProduct.id}
                    onStockUpdate={handleStockUpdate}
                />
            )}

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setDraftToDelete(null)
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Draft"
                description={`Are you sure you want to delete "${draftToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    )
}