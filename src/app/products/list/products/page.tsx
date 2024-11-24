"use client";

import { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Info, Plus } from "lucide-react"
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import apiService from '@/services/api'
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { PrimaryButton } from '@/components/ui/primary-button';
import { Edit2 } from 'lucide-react'
import StockEditModal from '@/components/StockEditModal'

export default function ProductsListPage() {
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiService.products.getList()
                setProducts(response.data)
            } catch (error) {
                console.error('Failed to fetch products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const getStockInfo = (variants) => {
        const fixedVariants = variants.filter(v => v.type === 'FIXED_VARIANT')
        const customVariants = variants.filter(v => v.type === 'CUSTOM')
        
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
                <a href="/products/new">
                    <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </a>
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => {
                                const stockInfo = getStockInfo(product.variants)
                                const baseVariant = product.variants[0]
                                
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Image
                                                src={product.thumbnail}
                                                alt={product.name}
                                                width={50}
                                                height={50}
                                                className="rounded-md"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {product.name}
                                            {product.variants.length > 1 && (
                                                <div className="text-sm text-gray-500">
                                                    + {product.variants.length - 1} variants
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {product.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell>₹{baseVariant.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                               
                                                <span className={`px-2 py-1 rounded ${stockInfo.className}`}>
                                                                {stockInfo.text}
                                                            </span>
                                                {hasFixedVariants(product.variants) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedProduct(product)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {product.category} &gt; {product.subCategory}
                                            {product.finalCategory && ` > ${product.finalCategory}`}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(product.createdAt), 'MMM d, yyyy')}
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
        </div>
    )
}