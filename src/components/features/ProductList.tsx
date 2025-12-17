import { useProductStore } from '@/stores/productStore';
import { useCategoryStore } from '@/stores/categoryStore';
import ProductCard from './ProductCard';
import { useState } from 'react';

export default function ProductList({ onEdit }: { onEdit: (id: string) => void }) {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || p.categoryId === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center mb-4">
        <input
          className="border rounded px-3 py-2 w-full md:w-64"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 w-full md:w-48"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            category={categories.find(c => c.id === product.categoryId)}
            onEdit={() => onEdit(product.id)}
          />
        ))}
        {filtered.length === 0 && <div className="col-span-full text-gray-400 text-center">No products found.</div>}
      </div>
    </div>
  );
}
