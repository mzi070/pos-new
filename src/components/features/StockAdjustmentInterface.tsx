import { useProductStore } from '@/stores/productStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function StockAdjustmentInterface() {
  const { products, updateProduct } = useProductStore();
  const { addLog } = useInventoryStore();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [type, setType] = useState<'add' | 'remove'>('add');
  const [reference, setReference] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  function handleAdjustment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProductId || !quantity) return;

    const qty = typeof quantity === 'number' ? quantity : parseInt(quantity, 10);
    const newQuantity = type === 'add' ? selectedProduct!.quantity + qty : selectedProduct!.quantity - qty;

    if (newQuantity < 0) {
      alert('Cannot reduce stock below zero');
      return;
    }

    updateProduct(selectedProductId, { quantity: newQuantity, updatedAt: new Date() });
    addLog({
      id: Math.random().toString(36).slice(2),
      productId: selectedProductId,
      product: selectedProduct!,
      type: type === 'add' ? 'purchase' : 'adjustment',
      quantity: qty,
      reference: reference || undefined,
      notes: `${type === 'add' ? 'Stock added' : 'Stock removed'}`,
      createdAt: new Date(),
    });

    setSelectedProductId('');
    setQuantity('');
    setReference('');
    alert('Inventory adjusted successfully!');
  }

  const lowStockProducts = products.filter(p => p.quantity <= p.minQuantity);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Adjust Stock</h2>
        <form className="space-y-4" onSubmit={handleAdjustment}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Product</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                required
              >
                <option value="">Select product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current: {p.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Type</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={type}
                onChange={e => setType(e.target.value as 'add' | 'remove')}
              >
                <option value="add">Add Stock</option>
                <option value="remove">Remove Stock</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Quantity</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full"
                value={quantity}
                onChange={e => setQuantity(e.target.value ? parseInt(e.target.value, 10) : '')}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Reference (optional)</label>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                value={reference}
                onChange={e => setReference(e.target.value)}
                placeholder="PO number, notes..."
              />
            </div>
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            Adjust Inventory
          </button>
        </form>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Low Stock Alert</h3>
              <ul className="space-y-1 text-sm text-yellow-800">
                {lowStockProducts.map(p => (
                  <li key={p.id}>
                    <strong>{p.name}</strong>: {p.quantity} units (minimum: {p.minQuantity})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
