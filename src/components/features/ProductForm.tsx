import { useState } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useProductStore } from '@/stores/productStore';
import type { Product } from '@/types';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { categories } = useCategoryStore();
  const { addProduct, updateProduct } = useProductStore();
  const [form, setForm] = useState<Product>(
    product || {
      id: '',
      name: '',
      description: '',
      price: 0,
      cost: 0,
      categoryId: '',
      sku: '',
      barcode: '',
      quantity: 0,
      minQuantity: 5,
      image: '',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'price' || name === 'cost' || name === 'quantity' || name === 'minQuantity' ? Number(value) : value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.id) {
      updateProduct(form.id, { ...form, updatedAt: new Date() });
    } else {
      addProduct({ ...form, id: Math.random().toString(36).slice(2), createdAt: new Date(), updatedAt: new Date() });
    }
    onClose();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input name="sku" value={form.sku} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required className="border rounded px-3 py-2 w-full">
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Stock Quantity</label>
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">{form.id ? 'Update' : 'Add'} Product</button>
      </div>
    </form>
  );
}
