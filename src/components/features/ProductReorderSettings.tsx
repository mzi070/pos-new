import { useProductStore } from '@/stores/productStore';
import { useState } from 'react';
import { AlertCircle, Save } from 'lucide-react';

export default function ProductReorderSettings() {
  const { products, updateProduct } = useProductStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ minQuantity: 0, reorderPoint: 0, reorderQuantity: 0 });

  const handleEdit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData({
        minQuantity: product.minQuantity || 0,
        reorderPoint: product.reorderPoint || 0,
        reorderQuantity: product.reorderQuantity || 0,
      });
      setEditingId(productId);
    }
  };

  const handleSave = () => {
    if (editingId) {
      const product = products.find(p => p.id === editingId);
      if (product) {
        updateProduct(editingId, {
          minQuantity: formData.minQuantity,
          reorderPoint: formData.reorderPoint,
          reorderQuantity: formData.reorderQuantity,
        });
        setEditingId(null);
      }
    }
  };

  const productsNeedingReorder = products.filter(p => p.quantity <= (p.reorderPoint || p.minQuantity || 10));

  return (
    <div className="space-y-6">
      {/* Reorder Alerts */}
      {productsNeedingReorder.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800">Products Need Reordering</h3>
              <p className="text-sm text-yellow-700 mt-1">{productsNeedingReorder.length} product(s) below reorder point</p>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                {productsNeedingReorder.map(p => (
                  <li key={p.id}>
                    • {p.name}: {p.quantity} units (Reorder: {p.reorderPoint || p.minQuantity || 10} units)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Settings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-lg">Inventory Reorder Points</h2>
          <p className="text-sm text-gray-500 mt-1">Configure minimum quantities and reorder settings for each product</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Product</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Current Qty</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Min Quantity</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Reorder Point</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Reorder Qty</th>
                <th className="text-center px-6 py-3 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  {editingId === product.id ? (
                    <>
                      <td className="px-6 py-3">{product.name}</td>
                      <td className="px-6 py-3 text-right text-sm">{product.quantity}</td>
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          min="0"
                          value={formData.minQuantity}
                          onChange={e => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
                          className="w-16 px-2 py-1 border rounded text-sm text-right"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          min="0"
                          value={formData.reorderPoint}
                          onChange={e => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })}
                          className="w-16 px-2 py-1 border rounded text-sm text-right"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          min="0"
                          value={formData.reorderQuantity}
                          onChange={e => setFormData({ ...formData, reorderQuantity: parseInt(e.target.value) || 0 })}
                          className="w-16 px-2 py-1 border rounded text-sm text-right"
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-3 font-medium">{product.name}</td>
                      <td className="px-6 py-3 text-right text-sm">{product.quantity}</td>
                      <td className="px-6 py-3 text-right text-sm">{product.minQuantity || 0}</td>
                      <td className="px-6 py-3 text-right text-sm">{product.reorderPoint || 0}</td>
                      <td className="px-6 py-3 text-right text-sm">{product.reorderQuantity || 0}</td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
