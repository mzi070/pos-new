// Core Type Definitions for POS System

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  categoryId: string;
  sku: string;
  barcode: string;
  quantity: number;
  minQuantity: number;
  image?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  discount?: number;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  customerId?: string;
  customer?: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'check' | 'digital';
  status: 'completed' | 'pending' | 'refunded' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryLog {
  id: string;
  productId: string;
  product?: Product;
  type: 'sale' | 'purchase' | 'adjustment' | 'return';
  quantity: number;
  reference?: string;
  notes?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalSales: number;
  totalTransactions: number;
  averageTransaction: number;
  productsCount: number;
  lowStockProducts: number;
  topProducts: Product[];
  recentTransactions: Transaction[];
}
