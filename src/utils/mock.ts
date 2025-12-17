import type { Product, Category, Customer, Transaction, InventoryLog } from '@/types';

function randomId() {
  return Math.random().toString(36).substring(2, 10);
}

export function generateMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: randomId(),
    name: `Product ${randomId()}`,
    description: 'Sample product',
    price: +(Math.random() * 100).toFixed(2),
    cost: +(Math.random() * 50).toFixed(2),
    categoryId: '',
    sku: `SKU${randomId()}`,
    barcode: `BAR${randomId()}`,
    quantity: Math.floor(Math.random() * 100),
    minQuantity: 5,
    image: '',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function generateMockCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: randomId(),
    name: `Category ${randomId()}`,
    description: 'Sample category',
    image: '',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function generateMockCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    id: randomId(),
    name: `Customer ${randomId()}`,
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    loyaltyPoints: 0,
    totalSpent: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function generateMockTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: randomId(),
    transactionNumber: `TXN${randomId()}`,
    customerId: '',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    paymentMethod: 'cash',
    status: 'completed',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function generateMockInventoryLog(overrides: Partial<InventoryLog> = {}): InventoryLog {
  return {
    id: randomId(),
    productId: '',
    type: 'sale',
    quantity: 1,
    reference: '',
    notes: '',
    createdAt: new Date(),
    ...overrides,
  };
}
