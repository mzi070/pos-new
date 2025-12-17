import ProductGrid from '@/components/features/ProductGrid';
import Cart from '@/components/features/Cart';
import BarcodeInput from '@/components/features/BarcodeInput';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { useState } from 'react';

export default function POS() {
  const { products } = useProductStore();
  const { addItem } = useCartStore();
  const [quickIds] = useState(() => products.slice(0, 5).map(p => p.id));

  function handleScan(barcode: string) {
    const found = products.find(p => p.barcode === barcode || p.sku === barcode);
    if (found) addItem(found);
    // Optionally show feedback if not found
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
        <BarcodeInput onScan={handleScan} />
        <ProductGrid quickIds={quickIds} />
      </div>
      <div className="w-full md:w-[380px]">
        <Cart />
      </div>
    </div>
  );
}
