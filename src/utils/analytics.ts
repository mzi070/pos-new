import type { Transaction, Product, Category } from '@/types';

export interface DailySales {
  date: string;
  revenue: number;
  transactions: number;
}

export interface CategorySales {
  category: string;
  revenue: number;
  count: number;
}

export interface TopProduct {
  product: Product;
  quantity: number;
  revenue: number;
}

export function getSalesByPeriod(transactions: Transaction[], days: number): DailySales[] {
  const grouped: { [key: string]: DailySales } = {};
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    grouped[dateStr] = { date: dateStr, revenue: 0, transactions: 0 };
  }

  transactions.forEach(txn => {
    const dateStr = new Date(txn.createdAt).toISOString().split('T')[0];
    if (grouped[dateStr]) {
      grouped[dateStr].revenue += txn.total;
      grouped[dateStr].transactions += 1;
    }
  });

  return Object.values(grouped).reverse();
}

export function getTopProducts(transactions: Transaction[]): TopProduct[] {
  const products: { [key: string]: TopProduct } = {};

  transactions.forEach(txn => {
    txn.items.forEach(item => {
      if (!products[item.productId]) {
        products[item.productId] = {
          product: item.product,
          quantity: 0,
          revenue: 0,
        };
      }
      products[item.productId].quantity += item.quantity;
      products[item.productId].revenue += item.product.price * item.quantity;
    });
  });

  return Object.values(products).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
}

export function getSalesByCategory(transactions: Transaction[], categories: Category[]): CategorySales[] {
  const categoryMap: { [key: string]: CategorySales } = {};

  categories.forEach(cat => {
    categoryMap[cat.id] = { category: cat.name, revenue: 0, count: 0 };
  });

  transactions.forEach(txn => {
    txn.items.forEach(item => {
      const catId = item.product.categoryId;
      if (categoryMap[catId]) {
        categoryMap[catId].revenue += item.product.price * item.quantity;
        categoryMap[catId].count += item.quantity;
      }
    });
  });

  return Object.values(categoryMap).filter(c => c.revenue > 0);
}

export function getTotalSales(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.total, 0);
}

export function getAverageOrderValue(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  return getTotalSales(transactions) / transactions.length;
}

export function exportToCSV(data: Record<string, string | number>[], filename: string) {
  const headers = Object.keys(data[0] || {});
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
