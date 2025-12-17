import { useProductStore } from '@/stores/productStore';
import { useRef } from 'react';

export default function ProductBulkImportExport() {
  const { products, setProducts } = useProductStore();
  const fileInput = useRef<HTMLInputElement>(null);

  function handleExport() {
    const csv = [
      ['Name', 'Price', 'SKU', 'CategoryId', 'Quantity', 'Image'],
      ...products.map(p => [p.name, p.price, p.sku, p.categoryId, p.quantity, p.image || ''])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const [header, ...rows] = text.split(/\r?\n/);
      const keys = header.split(',');
      const imported = rows.filter(Boolean).map(row => {
        const values = row.split(',');
        return {
          id: Math.random().toString(36).slice(2),
          name: values[keys.indexOf('Name')] || '',
          price: Number(values[keys.indexOf('Price')] || 0),
          sku: values[keys.indexOf('SKU')] || '',
          categoryId: values[keys.indexOf('CategoryId')] || '',
          quantity: Number(values[keys.indexOf('Quantity')] || 0),
          image: values[keys.indexOf('Image')] || '',
          description: '',
          cost: 0,
          minQuantity: 5,
          barcode: '',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
      setProducts([...products, ...imported]);
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex gap-2 items-center my-4">
      <button className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700" onClick={handleExport}>
        Export CSV
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInput}
        className="hidden"
        onChange={handleImport}
      />
      <button className="px-4 py-2 rounded bg-primary-100 text-primary-700 border border-primary-200" onClick={() => fileInput.current?.click()}>
        Import CSV
      </button>
    </div>
  );
}
