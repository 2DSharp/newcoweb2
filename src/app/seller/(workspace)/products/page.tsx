"use client";

import { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Info, Plus, Pencil, Trash2, TicketPercent, BadgeIndianRupee, IndianRupee } from "lucide-react"
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import apiService from '@/services/api'
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Edit2 } from 'lucide-react'
import StockEditModal from './StockEditModal'
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProductManagementOverlay } from '@/components/product-management/ProductManagementOverlay';
import PriceEditOverlay from './PriceEditModal';
import ActivationModal from './ActivationModal';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon } from "lucide-react"

// Add this helper component for empty state
const EmptyState = ({ showDrafts, activeTab }) => (
    <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
            {showDrafts 
                ? "No drafts found. Create a new product to get started."
                : activeTab === "active"
                    ? "No active products found. Activate some products or create new ones."
                    : "No inactive products found."
            }
        </p>
    </div>
);

export default function ProductsListPage() {
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [drafts, setDrafts] = useState([])
    const [loading, setLoading] = useState(true)
    const [editStock, setEditStock] = useState(null)
    const [showDrafts, setShowDrafts] = useState(false)
    const { toast } = useToast()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [draftToDelete, setDraftToDelete] = useState(null)
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [editPrice, setEditPrice] = useState(null);
    const [editActivation, setEditActivation] = useState(null);
    const [activeProducts, setActiveProducts] = useState([]);
    const [inactiveProducts, setInactiveProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("active");

    useEffect(() => {
        const loadDrafts = async () => {
            try {
                setLoading(true);
                const response = await apiService.products.getDrafts();
                setDrafts(response.data);
            } catch (error) {
                console.error('Failed to load drafts:', error);
                toast({
                    title: "Error",
                    description: "Failed to load drafts",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (showDrafts) {
            loadDrafts();
        }
    }, [showDrafts]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await apiService.products.getList();
                const active = response.data.filter(product => product.active);
                const inactive = response.data.filter(product => !product.active);
                
                setActiveProducts(active);
                setInactiveProducts(inactive);
                setProducts(activeTab === "inactive" ? inactive : active);
            } catch (error) {
                console.error('Failed to load products:', error);
                toast({
                    title: "Error",
                    description: "Failed to load products",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (!showDrafts) {
            loadProducts();
        }
    }, [showDrafts]);

    useEffect(() => {
        setProducts(activeTab === "inactive" ? inactiveProducts : activeProducts);
    }, [activeTab, activeProducts, inactiveProducts]);

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

    const handleManageClick = (productId: string) => {
        setSelectedProductId(productId);
    };

    const handlePriceUpdate = async () => {
        const response = await apiService.products.getList();
        setProducts(response.data);
    };

    const handleActivationUpdate = async () => {
        const response = await apiService.products.getList();
        setProducts(response.data);
    };

    const ProductsTable = () => (
        <>
            {(showDrafts ? drafts : products).length === 0 ? (
                <EmptyState showDrafts={showDrafts} activeTab={activeTab} />
            ) : (
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                            <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-semibold py-4"></TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Name</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Status</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <div className="flex items-center gap-1.5">
                                    Price
                                    <IndianRupee className="h-3.5 w-3.5" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <div className="flex items-center gap-1.5">
                                    Discount
                                    <TicketPercent className="h-3.5 w-3.5 text-green-600" />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <div className="flex items-center">
                                    <span>Inventory</span>
                                    <TooltipProvider delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button 
                                                    className="ml-1.5 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                    }}
                                                >
                                                    <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent 
                                                side="top" 
                                                className="p-3 max-w-xs bg-white shadow-lg border border-gray-100"
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
                            <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Category</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Date Created</TableHead>
                            <TableHead className="text-xs uppercase tracking-wider text-gray-500 font-semibold"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(showDrafts ? drafts : products).map((item) => {
                            const stockInfo = getStockInfo(item.variants)
                            const baseVariant = item.variants?.[0]
                            
                            return (
                                <TableRow 
                                    key={item.id}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                >
                                    <TableCell className="py-3 px-4 w-[70px]">{item.thumbnail ?
                                        <div className="w-12 h-12 relative rounded-lg shadow-sm overflow-hidden">
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.name}
                                                fill
                                                sizes="3rem"
                                                className="object-cover"
                                            />
                                        </div>
                                        : <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <ImageIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                    }
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/products/${item.id}`} className="hover:text-indigo-600 transition-colors">
                                            <div className="font-medium max-w-[280px] truncate" title={item.name}>{item.name}</div>
                                            {item.variants?.length > 1 && (
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    + {item.variants.length - 1} variants
                                                </div>
                                            )}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                item.active 
                                                    ? 'bg-green-50 text-green-700 border border-green-200' 
                                                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                                            }`}>
                                                {item.active ? 'Active' : 'Inactive'}
                                            </span>
                                            {!showDrafts && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditActivation(item)}
                                                    className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                                                >
                                                    <Edit2 className="h-3.5 w-3.5 text-gray-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            {(baseVariant?.activePricing) ? (
                                                <div className="font-medium">₹{baseVariant.activePricing.price.toFixed(2)}</div>
                                            ) : <span className="text-gray-500 text-sm">Not set</span>}
                                            {!showDrafts && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditPrice(item)}
                                                    className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                                                >
                                                    <Edit2 className="h-3.5 w-3.5 text-gray-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {baseVariant?.activePricing?.discount && baseVariant.activePricing.discount.active ? 
                                            <span className="text-sm font-medium text-green-600">
                                                {baseVariant.activePricing.discount.name}
                                            </span>
                                        : <span className="text-sm text-gray-500">None</span>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                                stockInfo.className === 'bg-red-100' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                stockInfo.className === 'bg-orange-100' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                                stockInfo.className === 'bg-green-100' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                'bg-gray-50 text-gray-600 border border-gray-200'
                                            }`}>
                                                {stockInfo.text}
                                            </span>
                                            {!showDrafts && hasFixedVariants(item.variants) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditStock(item)}
                                                    className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
                                                >
                                                    <Edit2 className="h-3.5 w-3.5 text-gray-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm max-w-[300px] truncate" title={`${item.category} › ${item.subCategory}${item.finalCategory ? ` › ${item.finalCategory}` : ''}`}>
                                            <span className="text-gray-900">{item.category}</span>
                                            <span className="text-gray-500"> › {item.subCategory}</span>
                                            {item.finalCategory && <span className="text-gray-500"> › {item.finalCategory}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-600">
                                            {item.createdAt 
                                                ? format(new Date(item.createdAt), 'MMM d, yyyy') 
                                                : item.lastUpdatedAt 
                                                    ? format(new Date(item.lastUpdatedAt), 'MMM d, yyyy') 
                                                    : ''}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-1">
                                            {showDrafts ? (
                                              <>
                                                 <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        router.push(`/seller/products/new/${item.id}/1`)
                                                    }}
                                                    className="h-8 w-8 p-0 rounded-full hover:bg-indigo-50"
                                                >
                                                    <Pencil className="h-4 w-4 text-indigo-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="h-8 w-8 p-0 rounded-full hover:bg-red-50 text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                </>
                                            ):
                                            <Button
                                                size="sm"
                                                className="bg-gray-900 text-white hover:bg-black rounded-md font-medium shadow-sm"
                                                onClick={() => handleManageClick(item.id)}
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
            )}
        </>
    );

    const ProductsAccordion = () => (
        <>
            {(showDrafts ? drafts : products).length === 0 ? (
                <EmptyState showDrafts={showDrafts} activeTab={activeTab} />
            ) : (
                <Accordion type="single" collapsible className="w-full">
                    {(showDrafts ? drafts : products).map((item) => {
                        const stockInfo = getStockInfo(item.variants);
                        const baseVariant = item.variants?.[0];
                        
                        return (
                            <AccordionItem value={item.id} key={item.id} className="border rounded-lg mb-2">
                                <AccordionTrigger className="px-4 hover:no-underline">
                                    <div className="flex items-center gap-4 w-full">
                                        {item.thumbnail ? (
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.name}
                                                width={40}
                                                height={40}
                                                className="rounded-md"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 rounded-md" />
                                        )}
                                        <div className="flex-1 text-left">
                                            <h3 className="font-medium">{item.name}</h3>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                    <div className="space-y-3 pt-4">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-gray-500">Status</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                                                        item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {item.active ? 'Active' : 'Inactive'}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditActivation(item)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Price</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {(baseVariant?.activePricing) ? (
                                                        <div>
                                                            <div className="font-medium">₹{baseVariant.activePricing.price.toFixed(2)}</div>
                                                            {baseVariant.activePricing.discount && (
                                                                <div className="text-sm text-green-600">
                                                                    {baseVariant.activePricing.discount.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : 'Not set'}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditPrice(item)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Stock</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`inline-block px-2 py-1 rounded ${stockInfo.className}`}>
                                                        {stockInfo.text}
                                                    </span>
                                                    {!showDrafts && hasFixedVariants(item.variants) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setEditStock(item)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Category</p>
                                                <p className="mt-1">{item.category} &gt; {item.subCategory}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Created</p>
                                                <p className="mt-1">{item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : ''}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 flex items-center gap-2">
                                                    <TicketPercent className="h-4 w-4 text-green-600" />
                                                    Discount
                                                </p>
                                                <div className="mt-1">
                                                    {baseVariant?.activePricing?.discount ? (
                                                        <div className="text-green-600 font-medium">
                                                            {baseVariant.activePricing.discount.name}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">None</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 pt-2">
                                            {showDrafts ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => router.push(`/seller/products/new/${item.id}/1`)}
                                                        className="flex-1"
                                                    >
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-gray-100 text-black hover:bg-black hover:text-white"
                                                    onClick={() => handleManageClick(item.id)}
                                                >
                                                    Manage
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            )}
        </>
    );

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
                    <a href="/seller/products/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </a>
                </div>
            </div>

            {!showDrafts && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                        <TabsTrigger value="active" className="flex items-center gap-2">
                            Active
                            {activeProducts.length > 0 && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {activeProducts.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="inactive" className="flex items-center gap-2">
                            Inactive
                            {inactiveProducts.length > 0 && (
                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                    {inactiveProducts.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            )}

            <Card className="bg-white rounded-xl shadow-sm">
                <div className="hidden md:block">
                    <ProductsTable />
                </div>
                <div className="md:hidden">
                    <ProductsAccordion />
                </div>
            </Card>

            {editStock && (
                <StockEditModal
                    isOpen={!!editStock}
                    onClose={() => setEditStock(null)}
                    variants={editStock.variants}
                    productId={editStock.id}
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

            <ProductManagementOverlay
                productId={selectedProductId}
                isOpen={!!selectedProductId}
                onClose={() => setSelectedProductId(null)}
            />

            {editPrice && (
                <PriceEditOverlay
                    isOpen={!!editPrice}
                    onClose={() => setEditPrice(null)}
                    variants={editPrice?.variants || []}
                    productId={editPrice?.id}
                    onPriceUpdate={handlePriceUpdate}
                />
            )}

            {editActivation && (
                <ActivationModal
                    isOpen={!!editActivation}
                    onClose={() => setEditActivation(null)}
                    product={editActivation}
                    onActivationUpdate={handleActivationUpdate}
                />
            )}
        </div>
    )
}