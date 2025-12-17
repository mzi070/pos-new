import type { Product } from '@/types';

export interface StockValuation {
  totalValue: number;
  byCategoryValue: Record<string, number>;
  byProduct: Array<{
    id: string;
    name: string;
    quantity: number;
    costPerUnit: number;
    totalValue: number;
    category: string;
  }>;
  averageCostPerItem: number;
  itemCount: number;
}

export function calculateStockValuation(products: Product[]): StockValuation {
  const byProduct = products
    .filter(p => p.quantity > 0)
    .map(p => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      costPerUnit: p.cost || 0,
      totalValue: (p.cost || 0) * p.quantity,
      category: p.category || 'Other',
    }));

  const totalValue = byProduct.reduce((sum, item) => sum + item.totalValue, 0);
  const itemCount = byProduct.reduce((sum, item) => sum + item.quantity, 0);

  const byCategoryValue: Record<string, number> = {};
  byProduct.forEach(item => {
    const category = item.category || 'Other';
    byCategoryValue[category] = (byCategoryValue[category] || 0) + item.totalValue;
  });

  return {
    totalValue,
    byCategoryValue,
    byProduct: byProduct.sort((a, b) => b.totalValue - a.totalValue),
    averageCostPerItem: itemCount > 0 ? totalValue / itemCount : 0,
    itemCount,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
