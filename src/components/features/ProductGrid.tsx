import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { useState } from 'react';

export default function ProductGrid({ quickIds = [] }: { quickIds?: string[] }) {
  const { products } = useProductStore();
  const { addItem } = useCartStore();
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const quickProducts = products.filter(p => quickIds.includes(p.id));

  return (
    <div className="space-y-4">
      <input
        className="border rounded px-3 py-2 w-full mb-2"
        placeholder="Search products by name or SKU..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {quickProducts.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold text-xs text-gray-500 mb-1">Quick Items</div>
          <div className="flex gap-2 flex-wrap">
            {quickProducts.map(p => (
              <button
                key={p.id}
                className="bg-primary-100 text-primary-700 px-3 py-2 rounded shadow hover:bg-primary-200"
                onClick={() => addItem(p)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(product => (
          <button
            key={product.id}
            className="bg-white border rounded-lg shadow p-3 flex flex-col items-center hover:bg-primary-50"
            onClick={() => addItem(product)}
          >
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded mb-2" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 mb-2">No Image</div>
            )}
            <div className="font-medium text-sm text-center">{product.name}</div>
            <div className="text-xs text-gray-500">${product.price.toFixed(2)}</div>
          </button>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-gray-400 text-center">No products found.</div>}
      </div>
    </div>
  );
}
