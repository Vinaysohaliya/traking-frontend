export type OrderStatus =
  | 'ORDER_RECEIVED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  'ORDER_RECEIVED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  menuItem: MenuItem;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  address: string;
  phone: string;
  items: { menuItemId: string; quantity: number }[];
}
