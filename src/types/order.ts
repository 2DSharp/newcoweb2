export type OrderStatus = 'NEW' | 'ACTIVE' | 'IN_TRANSIT' | 'COMPLETED' | 'FAILED';

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
  status: string;
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