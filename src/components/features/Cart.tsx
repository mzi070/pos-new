import { useCartStore } from '@/stores/cartStore';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const tax = +(subtotal * 0.07).toFixed(2); // 7% tax
  const discount = 0; // Placeholder for discount logic
  const total = subtotal + tax - discount;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4 min-w-[320px]">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Cart</h2>
        <button className="text-xs text-red-600 hover:underline" onClick={clearCart}>Clear</button>
      </div>
      <div className="divide-y">
        {items.length === 0 && <div className="text-gray-400 text-center py-8">Cart is empty</div>}
        {items.map(item => (
          <div key={item.productId} className="flex items-center justify-between py-2">
            <div className="flex-1">
              <div className="font-medium">{item.product.name}</div>
              <div className="text-xs text-gray-500">${item.product.price.toFixed(2)} x {item.quantity}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
              <button className="ml-2 text-xs text-red-600 hover:underline" onClick={() => removeItem(item.productId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax (7%)</span><span>${tax.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>${discount.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>
      <button className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 mt-2">Checkout</button>
    </div>
  );
}
