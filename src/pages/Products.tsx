import { useState } from 'react';
import ProductList from '@/components/features/ProductList';
import ProductForm from '@/components/features/ProductForm';
import CategoryManager from '@/components/features/CategoryManager';
import ProductBulkImportExport from '@/components/features/ProductBulkImportExport';
import { useProductStore } from '@/stores/productStore';

export default function Products() {
  const { products } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const editingProduct = products.find(p => p.id === editId) || undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700" onClick={() => { setEditId(null); setShowForm(true); }}>
            Add Product
          </button>
        </div>
      </div>
      <ProductBulkImportExport />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ProductList onEdit={id => { setEditId(id); setShowForm(true); }} />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Categories</h2>
          <CategoryManager />
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <ProductForm product={editingProduct} onClose={() => { setShowForm(false); setEditId(null); }} />
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => { setShowForm(false); setEditId(null); }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
