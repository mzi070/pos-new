import { useState } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useProductStore } from '@/stores/productStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { DailySalesChart, TransactionCountChart, CategorySalesChart } from '@/components/features/Charts';
import { getSalesByPeriod, getTopProducts, getSalesByCategory, getTotalSales, getAverageOrderValue, exportToCSV } from '@/utils/analytics';
import { Download } from 'lucide-react';

export default function Dashboard() {
  const { transactions } = useTransactionStore();
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const [period, setPeriod] = useState<7 | 30 | 90>(7);

  const dailySales = getSalesByPeriod(transactions, period);
  const topProducts = getTopProducts(transactions);
  const categorySales = getSalesByCategory(transactions, categories);
  const totalSales = getTotalSales(transactions);
  const avgOrderValue = getAverageOrderValue(transactions);

  function handleExportReport() {
    const reportData = transactions.map(t => ({
      'Transaction #': t.transactionNumber,
      'Date': new Date(t.createdAt).toLocaleString(),
      'Total': t.total.toFixed(2),
      'Payment Method': t.paymentMethod,
      'Items Count': t.items.length,
    }));
    exportToCSV(reportData, 'sales-report.csv');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700" onClick={handleExportReport}>
          <Download size={18} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Sales</p>
          <p className="text-3xl font-bold text-primary-600">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Transactions</p>
          <p className="text-3xl font-bold text-primary-600">{transactions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Avg Order Value</p>
          <p className="text-3xl font-bold text-primary-600">${avgOrderValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Products</p>
          <p className="text-3xl font-bold text-primary-600">{products.length}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button className={`px-4 py-2 rounded ${period === 7 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`} onClick={() => setPeriod(7)}>7 Days</button>
        <button className={`px-4 py-2 rounded ${period === 30 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`} onClick={() => setPeriod(30)}>30 Days</button>
        <button className={`px-4 py-2 rounded ${period === 90 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`} onClick={() => setPeriod(90)}>90 Days</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailySalesChart data={dailySales} />
        <TransactionCountChart data={dailySales} />
      </div>

      {categorySales.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategorySalesChart data={categorySales} />
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-4">Top Selling Products</h3>
            <div className="space-y-2">
              {topProducts.map((tp, idx) => (
                <div key={tp.product.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{idx + 1}. {tp.product.name}</div>
                    <div className="text-xs text-gray-500">{tp.quantity} sold</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-600">${tp.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Transaction</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Items</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(-10).reverse().map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">#{t.transactionNumber}</td>
                  <td className="py-2 text-gray-600">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="py-2">{t.items.length}</td>
                  <td className="py-2 text-right font-bold text-primary-600">${t.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
