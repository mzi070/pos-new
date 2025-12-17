import { useCategoryStore } from '@/stores/categoryStore';
import { useState } from 'react';

export default function CategoryManager() {
  const { categories, addCategory, updateCategory, removeCategory } = useCategoryStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', id: '' });

  function handleEdit(categoryId: string) {
    const cat = categories.find(c => c.id === categoryId);
    if (cat) {
      setForm({ name: cat.name, description: cat.description || '', id: cat.id });
      setEditing(cat.id);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      updateCategory({ ...categories.find(c => c.id === editing)!, ...form });
    } else {
      addCategory({
        id: Math.random().toString(36).slice(2),
        name: form.name,
        description: form.description,
        image: '',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    setForm({ name: '', description: '', id: '' });
    setEditing(null);
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this category?')) removeCategory(id);
  }

  return (
    <div className="space-y-4">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          className="border rounded px-3 py-2"
          placeholder="Category name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <button type="submit" className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && (
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => { setEditing(null); setForm({ name: '', description: '', id: '' }); }}>
            Cancel
          </button>
        )}
      </form>
      <ul className="divide-y">
        {categories.map(cat => (
          <li key={cat.id} className="flex items-center justify-between py-2">
            <div>
              <span className="font-medium">{cat.name}</span>
              {cat.description && <span className="ml-2 text-xs text-gray-500">{cat.description}</span>}
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 hover:underline text-xs" onClick={() => handleEdit(cat.id)}>Edit</button>
              <button className="text-red-600 hover:underline text-xs" onClick={() => handleDelete(cat.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
