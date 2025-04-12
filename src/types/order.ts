// Filter statuses used for API calls
export type FilterStatus = 'ACTIVE' | 'IN_TRANSIT' | 'COMPLETED' | 'FAILED';

// Detailed order statuses used for displaying orders
export type OrderStatus = 
  | 'NEW' 
  | 'ACTIVE'
  | 'PROCESSING' 
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'PARTIALLY_RETURNED'
  | 'RETURNED'
  | 'PARTIALLY_CANCELLED'
  | 'CANCELLED'
  | 'CLOSED';

export type OrderItemStatus = 
  | 'CREATED'
  | 'ACCEPTED'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'CANCELLED';

export interface OrderItem {
  id: number;
  productCode: string;
  sku: string;
  productName: string;
  variantId: string;
  variantName: string;
  instructions: string | null;
  quantity: number;
  price: number;
  discountApplied: number | null;
  status: OrderItemStatus;
  orderId: string;
  createdAt: string;
  totalPrice: string;
  processedQuantity?: number;
  isCustomizationVerified?: boolean;
}

export interface Order {
  id: string;
  subTotal: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  expectedBy: string;
}