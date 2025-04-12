'use client';

import { useState, useEffect } from 'react';
import { Order, OrderItem, OrderStatus, OrderItemStatus } from '@/types/order';
import { 
  MapPin, Phone, Mail, PlayCircle, TruckIcon, CheckCircleIcon, 
  PackageIcon, HammerIcon, TicketIcon, CircleCheckIcon, PackageCheck
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import apiService from '@/services/api';

interface OrderDetailsProps {
  order: Order;
  onOrderUpdate: (order: Order) => void;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  item: OrderItem | null;
  processedCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function OrderDetails({ order, onOrderUpdate }: OrderDetailsProps) {
  const [processingItems, setProcessingItems] = useState<{ [key: number]: boolean }>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemProcessCounts, setItemProcessCounts] = useState<{ [key: number]: number }>({});
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>({
    isOpen: false,
    item: null,
    processedCount: 0,
    onConfirm: () => {},
    onCancel: () => {}
  });

  useEffect(() => {
    console.log('OrderDetails - Order Status:', order.status);
    
    // Initialize item process counts
    const initialCounts: { [key: number]: number } = {};
    order.items.forEach(item => {
      // For items that are already fully processed in the database
      if (item.processedQuantity === item.quantity) {
        initialCounts[item.id] = item.quantity;
      } 
      // For items with no processing yet, set to 0 (will display as Process Item 1/x)
      else if (!item.processedQuantity) {
        initialCounts[item.id] = 0;
      }
      // For partially processed items, use the database value
      else {
        initialCounts[item.id] = item.processedQuantity;
      }
    });
    setItemProcessCounts(initialCounts);
  }, [order.id]);

  const handleStartProcessing = async () => {
    try {
      setIsUpdating(true);
      const response = await apiService.orders.updateOrderStatus(order.id, 'PROCESSING');
      
      if (response.successful) {
        const updatedOrder: Order = {
          ...order,
          status: 'PROCESSING',
          items: order.items.map(item => ({
            ...item,
            status: 'PROCESSING'
          }))
        };
        onOrderUpdate(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReadyToShip = async () => {
    try {
      setIsUpdating(true);
      const response = await apiService.orders.updateOrderStatus(order.id, 'READY_TO_SHIP');
      
      if (response.successful) {
        const updatedOrder: Order = {
          ...order,
          status: 'READY_TO_SHIP'
        };
        onOrderUpdate(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShipOrder = async () => {
    try {
      setIsUpdating(true);
      const response = await apiService.orders.updateOrderStatus(order.id, 'SHIPPED');
      
      if (response.successful) {
        const updatedOrder: Order = {
          ...order,
          status: 'SHIPPED',
          items: order.items.map(item => ({
            ...item,
            status: 'SHIPPED'
          }))
        };
        onOrderUpdate(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProcessItemClick = (item: OrderItem) => {
    const currentCount = itemProcessCounts[item.id] || 0;
    const newCount = currentCount + 1;
    
    // If we reach the item's quantity, we cap it at the maximum
    const finalCount = Math.min(newCount, item.quantity);
    
    // Update the counter
    setItemProcessCounts({
      ...itemProcessCounts,
      [item.id]: finalCount
    });
  };

  const handleFinishProcessing = (item: OrderItem) => {
    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      item: item,
      processedCount: item.quantity,
      onConfirm: () => finishProcessItem(item, item.quantity),
      onCancel: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
    });
  };

  const finishProcessItem = async (item: OrderItem, processedQuantity: number) => {
    try {
      setIsUpdating(true);
      
      const response = await apiService.orders.processOrderItem(
        item.id,
        order.id,
        processedQuantity,
        !!item.isCustomizationVerified
      );
      
      if (response.successful) {
        // Update local state with API response data if available
        const updatedItem = response.data?.item || {
          ...item,
          processedQuantity,
          status: 'PROCESSED' as OrderItemStatus
        };
        
        const updatedOrder: Order = {
          ...order,
          items: order.items.map(i => 
            i.id === item.id ? updatedItem : i
          )
        };
        
        // Update order state in parent component
        onOrderUpdate(updatedOrder);
        
        // Reset process counts to reflect completed status
        setItemProcessCounts(prev => ({
          ...prev,
          [item.id]: processedQuantity
        }));
        
        // Close dialog
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    } catch (error) {
      console.error('Error processing item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCustomizationVerify = (itemId: number, verified: boolean) => {
    const updatedOrder: Order = {
      ...order,
      items: order.items.map(item =>
        item.id === itemId
          ? { ...item, isCustomizationVerified: verified }
          : item
      )
    };
    onOrderUpdate(updatedOrder);
  };

  // Map API statuses to UI actions
  // NEW is part of ACTIVE in the filter
  const canStartProcessing = order.status === 'NEW' || order.status === 'ACTIVE';
  
  // Only allow Ready to Ship when order is in PROCESSING state AND all items are processed
  const allItemsProcessed = order.items.length > 0 && order.items.every(item => 
    item.processedQuantity === item.quantity || 
    ['PROCESSED', 'DELIVERED', 'SHIPPED', 'RETURNED'].includes(item.status as OrderItemStatus)
  );
  const canMarkReadyToShip = order.status === 'PROCESSING' && allItemsProcessed;
  
  const canShip = order.status === 'READY_TO_SHIP';
  // SHIPPED, DELIVERED etc. are part of IN_TRANSIT or COMPLETED filter
  const isShipped = ['SHIPPED', 'DELIVERED', 'PARTIALLY_RETURNED', 'RETURNED', 'CLOSED'].includes(order.status);
  const isCompleted = ['DELIVERED', 'PARTIALLY_RETURNED', 'RETURNED', 'CLOSED'].includes(order.status);
  const isCancelled = ['PARTIALLY_CANCELLED', 'CANCELLED'].includes(order.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      case 'READY_TO_SHIP':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'PARTIALLY_RETURNED':
      case 'RETURNED':
        return 'bg-orange-100 text-orange-800';
      case 'PARTIALLY_CANCELLED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const humanizeStatus = (status: OrderStatus | OrderItemStatus): string => {
    switch (status) {
      case 'NEW':
        return 'New';
      case 'ACTIVE':
        return 'Active';
      case 'PROCESSING':
        return 'Processing';
      case 'READY_TO_SHIP':
        return 'Ready to Ship';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Delivered';
      case 'PARTIALLY_RETURNED':
        return 'Partially Returned';
      case 'RETURNED':
        return 'Returned';
      case 'PARTIALLY_CANCELLED':
        return 'Partially Cancelled';
      case 'CANCELLED':
        return 'Cancelled';
      case 'CLOSED':
        return 'Closed';
      case 'ACCEPTED':
        return 'Accepted';
      default:
        return status.toString().replace(/_/g, ' ').replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && confirmDialog.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Item Processing</h3>
            <div className="mb-4">
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>All {confirmDialog.processedCount} out of {confirmDialog.item.quantity} items have been processed.</li>
                {confirmDialog.item.instructions && (
                  <>
                    <li>The personalization text - "{confirmDialog.item.instructions}" was considered.</li>
                    <li>The customization request was verified and implemented.</li>
                  </>
                )}
              </ul>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={confirmDialog.onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <CircleCheckIcon className="inline-block mr-1 h-4 w-4" /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-lg font-semibold text-gray-900">Order #{order.id}</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
              {humanizeStatus(order.status)}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Created: {formatDate(order.createdAt)}
          </p>
          <p className="text-sm text-gray-500">
            Updated: {formatDate(order.updatedAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(order.subTotal)}
          </p>
          <p className="text-sm text-gray-500">
            Expected by: {formatDate(order.expectedBy)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="font-medium text-gray-900">Order Items</p>
          <div className="flex space-x-2">
            {canStartProcessing && (
              <button
                onClick={handleStartProcessing}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
              >
                <HammerIcon className="mr-2 h-4 w-4" /> Start Processing
              </button>
            )}
            {canMarkReadyToShip && (
              <button
                onClick={handleReadyToShip}
                disabled={isUpdating}
                className="px-4 py-2 bg-[#FF7F50] text-white rounded-lg hover:bg-[#FF6347] transition-colors disabled:bg-[#FFAA99] flex items-center"
              >
                <PackageIcon className="mr-2 h-4 w-4" /> Ready to Ship
              </button>
            )}
            {canShip && (
              <button
                onClick={handleShipOrder}
                disabled={isUpdating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 flex items-center"
              >
                <TruckIcon className="mr-2 h-4 w-4" /> Mark as Shipped
              </button>
            )}
          </div>
        </div>
        {order.items.map((item) => {
          const processedCount = itemProcessCounts[item.id] || 0;
          const isFullyProcessed = processedCount >= item.quantity;
          const isProcessing = processedCount > 0 && !isFullyProcessed;
          
          return (
            <div
              key={item.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{item.productName}</h4>
                  <p className="text-sm text-gray-500">{item.variantName}</p>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              {item.instructions && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Instructions:</span> {item.instructions}
                  </p>
                  {order.status === 'PROCESSING' && (
                    <div className="mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={item.isCustomizationVerified}
                          onChange={(e) => handleCustomizationVerify(item.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">
                          Customization verified
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-2 flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  item.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800' :
                  item.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800' :
                  item.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {humanizeStatus(item.status)}
                </span>
                
                {order.status === 'PROCESSING' && (
                  <div className="flex items-center space-x-2">
                    {/* Show Completed button if the item is already processed in the database
                        or if the status indicates it's been processed */}
                    { ['PROCESSED', 'DELIVERED', 'SHIPPED', 'RETURNED'].includes(item.status as OrderItemStatus) ? (
                      <button
                        disabled={true}
                        className="px-4 py-2 rounded text-sm font-medium flex items-center bg-gray-100 text-gray-600"
                      >
                        <CheckCircleIcon className="mr-2 h-4 w-4" /> Completed
                      </button>
                    ) : (
                      <>
                        {/* Process Item button */}
                        {!isFullyProcessed && (
                          <button
                            onClick={() => handleProcessItemClick(item)}
                            disabled={
                              isUpdating || 
                              (item.instructions && !item.isCustomizationVerified)
                            }
                            className={`px-4 py-2 rounded text-sm font-medium flex items-center ${
                              (isUpdating || 
                              (item.instructions && !item.isCustomizationVerified))
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <HammerIcon className="mr-2 h-4 w-4" /> Process Item {Math.max(1, processedCount)}/{item.quantity}
                          </button>
                        )}
                        
                        {/* Finish Processing button (only shown when fully processed) */}
                        {isFullyProcessed && (
                          <button
                            onClick={() => handleFinishProcessing(item)}
                            disabled={
                              isUpdating || 
                              (item.instructions && !item.isCustomizationVerified)
                            }
                            className={`px-4 py-2 rounded text-sm font-medium flex items-center ${
                              (isUpdating || 
                              (item.instructions && !item.isCustomizationVerified))
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            <CircleCheckIcon className="mr-2 h-4 w-4" /> Finish Processing
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}