// Order Storage Utility
// Handles saving and retrieving orders from localStorage

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned';

export interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  orderDate: string;
  deliveryDate?: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  tax?: number;
  paymentMethod: string;
  paymentId?: string; // Razorpay payment ID
  razorpayOrderId?: string; // Razorpay order ID
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const STORAGE_KEY = 'userOrders';

// Get all orders from localStorage
export function getOrders(): Order[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

// Get orders for a specific user (by username/email)
export function getOrdersByUser(userIdentifier: string): Order[] {
  const allOrders = getOrders();
  return allOrders.filter((order) => {
    // Match by username or email in shipping address name or payment info
    return (
      order.shippingAddress.name.toLowerCase().includes(userIdentifier.toLowerCase()) ||
      order.shippingAddress.phone.includes(userIdentifier)
    );
  });
}

// Save a new order
export function saveOrder(order: Order): void {
  try {
    const existingOrders = getOrders();
    const updatedOrders = [order, ...existingOrders]; // Newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('ordersUpdated'));
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

// Update an existing order
export function updateOrder(orderId: string, updates: Partial<Order>): void {
  try {
    const orders = getOrders();
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, ...updates } : order
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event('ordersUpdated'));
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

// Generate order number
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}-${month}${day}-${random}`;
}

// Generate order ID
export function generateOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Calculate estimated delivery date (3-7 days from order date)
export function calculateDeliveryDate(orderDate: string): string {
  const date = new Date(orderDate);
  const deliveryDays = Math.floor(Math.random() * 5) + 3; // 3-7 days
  date.setDate(date.getDate() + deliveryDays);
  return date.toISOString().split('T')[0];
}

// Generate tracking number
export function generateTrackingNumber(): string {
  return `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

