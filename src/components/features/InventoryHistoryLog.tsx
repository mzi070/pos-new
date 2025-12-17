import { useInventoryStore } from '@/stores/inventoryStore';
import { useProductStore } from '@/stores/productStore';
import { useState } from 'react';

export default function InventoryHistoryLog() {
  const { logs } = useInventoryStore();
  const { products } = useProductStore();
  const [filter, setFilter] = useState<'all' | 'sale' | 'purchase' | 'adjustment' | 'return'>('all');

  const filtered = logs.filter(log => filter === 'all' || log.type === filter);

  function getProductName(productId: string): string {
    return products.find(p => p.id === productId)?.name || 'Unknown';
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="font-semibold text-lg">Inventory History</h2>

      <div className="flex gap-2 flex-wrap">
        <button
          className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${filter === 'sale' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('sale')}
        >
          Sales
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${filter === 'purchase' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('purchase')}
        >
          Purchases
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${filter === 'adjustment' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('adjustment')}
        >
          Adjustments
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${filter === 'return' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('return')}
        >
          Returns
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No inventory logs found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Product</th>
                <th className="text-left py-2">Type</th>
                <th className="text-right py-2">Quantity</th>
                <th className="text-left py-2">Reference</th>
                <th className="text-left py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-2 font-medium">{getProductName(log.productId)}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        log.type === 'sale'
                          ? 'bg-red-100 text-red-800'
                          : log.type === 'purchase'
                          ? 'bg-green-100 text-green-800'
                          : log.type === 'return'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 text-right font-semibold">{log.quantity}</td>
                  <td className="py-2 text-gray-500">{log.reference || '-'}</td>
                  <td className="py-2 text-gray-500">{log.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
