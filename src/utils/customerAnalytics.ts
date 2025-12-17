import type { Customer, Transaction } from '@/types';

export interface CustomerAnalytics {
  customerId: string;
  customerName: string;
  email?: string;
  phone?: string;
  totalPurchases: number;
  totalSpent: number;
  averageOrderValue: number;
  lastPurchaseDate?: Date;
  firstPurchaseDate?: Date;
  daysSinceLastPurchase?: number;
  loyaltyPoints: number;
  purchaseFrequency: 'rare' | 'occasional' | 'regular' | 'frequent';
  customerLifetimeValue: number;
  transactionCount: number;
}

export interface CustomerRanking {
  rank: number;
  customerId: string;
  customerName: string;
  email?: string;
  totalSpent: number;
  transactionCount: number;
  loyaltyPoints: number;
}

export function calculateCustomerAnalytics(
  customer: Customer,
  transactions: Transaction[]
): CustomerAnalytics {
  const customerTransactions = transactions.filter(t => t.customerId === customer.id);
  const totalSpent = customer.totalSpent;
  const transactionCount = customerTransactions.length;
  const averageOrderValue = transactionCount > 0 ? totalSpent / transactionCount : 0;

  // Calculate last purchase date
  let lastPurchaseDate: Date | undefined;
  if (customerTransactions.length > 0) {
    lastPurchaseDate = new Date(
      Math.max(...customerTransactions.map(t => new Date(t.createdAt).getTime()))
    );
  }

  // Calculate first purchase date
  let firstPurchaseDate: Date | undefined;
  if (customerTransactions.length > 0) {
    firstPurchaseDate = new Date(
      Math.min(...customerTransactions.map(t => new Date(t.createdAt).getTime()))
    );
  }

  // Days since last purchase
  let daysSinceLastPurchase: number | undefined;
  if (lastPurchaseDate) {
    const now = new Date();
    daysSinceLastPurchase = Math.floor((now.getTime() - lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Purchase frequency
  let purchaseFrequency: 'rare' | 'occasional' | 'regular' | 'frequent' = 'rare';
  if (transactionCount >= 50) {
    purchaseFrequency = 'frequent';
  } else if (transactionCount >= 20) {
    purchaseFrequency = 'regular';
  } else if (transactionCount >= 5) {
    purchaseFrequency = 'occasional';
  }

  // Customer lifetime value (total spent)
  const customerLifetimeValue = totalSpent;

  return {
    customerId: customer.id,
    customerName: customer.name,
    email: customer.email,
    phone: customer.phone,
    totalPurchases: transactionCount,
    totalSpent,
    averageOrderValue,
    lastPurchaseDate,
    firstPurchaseDate,
    daysSinceLastPurchase,
    loyaltyPoints: customer.loyaltyPoints,
    purchaseFrequency,
    customerLifetimeValue,
    transactionCount,
  };
}

export function getTopCustomers(
  customers: Customer[],
  transactions: Transaction[],
  limit: number = 10
): CustomerRanking[] {
  return customers
    .map((customer, index) => ({
      rank: index + 1,
      customerId: customer.id,
      customerName: customer.name,
      email: customer.email,
      totalSpent: customer.totalSpent,
      transactionCount: transactions.filter(t => t.customerId === customer.id).length,
      loyaltyPoints: customer.loyaltyPoints,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit)
    .map((customer, index) => ({
      ...customer,
      rank: index + 1,
    }));
}

export function getAtRiskCustomers(
  customers: Customer[],
  transactions: Transaction[],
  daysSinceLastPurchase: number = 90
): Customer[] {
  const now = new Date();
  return customers.filter(customer => {
    const customerTransactions = transactions.filter(t => t.customerId === customer.id);
    if (customerTransactions.length === 0) return false;

    const lastPurchase = new Date(
      Math.max(...customerTransactions.map(t => new Date(t.createdAt).getTime()))
    );

    const daysDiff = Math.floor((now.getTime() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > daysSinceLastPurchase;
  });
}

export function getNewCustomers(
  customers: Customer[],
  daysNew: number = 30
): Customer[] {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - daysNew * 24 * 60 * 60 * 1000);

  return customers.filter(customer => new Date(customer.createdAt) > cutoffDate);
}

export function getCustomersByPurchaseFrequency(
  customers: Customer[],
  transactions: Transaction[],
  frequency: 'rare' | 'occasional' | 'regular' | 'frequent'
): Customer[] {
  return customers.filter(customer => {
    const analytics = calculateCustomerAnalytics(customer, transactions);
    return analytics.purchaseFrequency === frequency;
  });
}

export function calculateCustomerSegments(
  customers: Customer[],
  transactions: Transaction[]
) {
  const frequent = getCustomersByPurchaseFrequency(customers, transactions, 'frequent');
  const regular = getCustomersByPurchaseFrequency(customers, transactions, 'regular');
  const occasional = getCustomersByPurchaseFrequency(customers, transactions, 'occasional');
  const rare = getCustomersByPurchaseFrequency(customers, transactions, 'rare');
  const atRisk = getAtRiskCustomers(customers, transactions);
  const newCustomers = getNewCustomers(customers);

  return {
    frequent: { count: frequent.length, revenue: frequent.reduce((sum, c) => sum + c.totalSpent, 0) },
    regular: { count: regular.length, revenue: regular.reduce((sum, c) => sum + c.totalSpent, 0) },
    occasional: { count: occasional.length, revenue: occasional.reduce((sum, c) => sum + c.totalSpent, 0) },
    rare: { count: rare.length, revenue: rare.reduce((sum, c) => sum + c.totalSpent, 0) },
    atRisk: { count: atRisk.length, revenue: atRisk.reduce((sum, c) => sum + c.totalSpent, 0) },
    new: { count: newCustomers.length, revenue: newCustomers.reduce((sum, c) => sum + c.totalSpent, 0) },
  };
}

export function exportCustomerList(customers: Customer[], filename: string = 'customers.csv'): void {
  if (customers.length === 0) {
    alert('No customers to export');
    return;
  }

  const headers = ['Name', 'Email', 'Phone', 'Address', 'City', 'Postal Code', 'Total Spent', 'Loyalty Points', 'Created Date'];
  const rows = customers.map(c => [
    c.name,
    c.email || '',
    c.phone || '',
    c.address || '',
    c.city || '',
    c.postalCode || '',
    c.totalSpent,
    c.loyaltyPoints,
    new Date(c.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}
