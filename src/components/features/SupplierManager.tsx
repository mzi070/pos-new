import { useSupplierStore } from '@/stores/supplierStore';
import { useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface SupplierForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  leadTime: number;
}

export default function SupplierManager() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SupplierForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    leadTime: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      if (editingId) {
        updateSupplier(editingId, formData);
        setEditingId(null);
      } else {
        addSupplier(formData);
      }
      setFormData({ name: '', email: '', phone: '', address: '', leadTime: 3 });
      setShowForm(false);
    }
  };

  const handleEdit = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      setFormData({
        name: supplier.name,
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        leadTime: supplier.leadTime || 3,
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', address: '', leadTime: 3 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Suppliers</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (days)</label>
              <input
                type="number"
                min="0"
                value={formData.leadTime}
                onChange={e => setFormData({ ...formData, leadTime: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                {editingId ? 'Update' : 'Add'} Supplier
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {suppliers.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No suppliers yet. Add one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Phone</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold">Lead Time (days)</th>
                  <th className="text-center px-6 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(supplier => (
                  <tr key={supplier.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{supplier.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{supplier.email || '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{supplier.phone || '-'}</td>
                    <td className="px-6 py-3 text-right text-sm">{supplier.leadTime}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(supplier.id)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSupplier(supplier.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
