export type OrderStatus = 'pending' | 'processing' | 'ready_for_shipping' | 'shipped' | 'delivered';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  image: string;
  quantity: number;
  processedQuantity: number;
  price: number;
  customization?: string;
  isCustomizationVerified: boolean;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  items: OrderItem[];
  status: OrderStatus;
  amount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}