import { useCartStore } from '@/stores/cartStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCustomerStore } from '@/stores/customerStore';
import { useState, useMemo } from 'react';

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'check', label: 'Check' },
  { value: 'digital', label: 'Digital Payment' },
];

export default function CheckoutModal({ onClose, onComplete }: { onClose: () => void; onComplete: (txnId: string) => void }) {
  const { items, clearCart } = useCartStore();
  const { addTransaction } = useTransactionStore();
  const { customers } = useCustomerStore();

  // eslint-disable-next-line react-hooks/purity
  const timestamp = useMemo(() => Date.now(), []);
  
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const tax = +(subtotal * 0.07).toFixed(2);
  const discount = 0;
  const total = subtotal + tax - discount;
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  const [split, setSplit] = useState({ cash: '', card: '' });
  const [customerId, setCustomerId] = useState('');
  const [email, setEmail] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [txnId, setTxnId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (paymentMethod === 'cash') {
      const paid = Number(cashReceived) || 0;
      if (paid < total) return alert('Insufficient cash received.');
    }
    if (paymentMethod === 'digital') {
      const paid = Number(cashReceived) || 0;
      if (paid < total) return alert('Insufficient digital payment.');
    }
    const id = crypto.randomUUID();
    addTransaction({
      id,
      transactionNumber: `TXN${timestamp}`,
      customerId: customerId || undefined,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: paymentMethod as 'cash' | 'card' | 'check' | 'digital',
      status: 'completed',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    clearCart();
    setTxnId(id);
    setShowReceipt(true);
    if (onComplete) onComplete(id);
  }

  function renderReceipt() {
    return (
      <div className="p-4">
        <h2 className="font-bold text-lg mb-2">Receipt</h2>
        <div className="text-xs text-gray-500 mb-2">Transaction #{txnId}</div>
        <ul className="mb-2">
          {items.map(i => (
            <li key={i.productId} className="flex justify-between">
              <span>{i.product.name} x {i.quantity}</span>
              <span>${(i.product.price * i.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Total</span><span>${total.toFixed(2)}</span></div>
        <div className="mt-4 text-center">
          <button className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 mr-2" onClick={() => window.print()}>Print</button>
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  if (showReceipt) return renderReceipt();

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="font-bold text-lg">Checkout</h2>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Payment Method</label>
        <select className="border rounded px-3 py-2" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>
      {paymentMethod === 'cash' && (
        <div>
          <label className="font-medium">Cash Received</label>
          <input type="number" className="border rounded px-3 py-2 w-full" value={cashReceived} onChange={e => setCashReceived(e.target.value ? Number(e.target.value) : '')} required />
          {cashReceived !== '' && Number(cashReceived) >= total && (
            <div className="text-green-600 text-xs mt-1">Change: ${(Number(cashReceived) - total).toFixed(2)}</div>
          )}
        </div>
      )}
      {paymentMethod === 'split' && (
        <div className="flex gap-2">
          <div>
            <label className="font-medium">Cash</label>
            <input type="number" className="border rounded px-3 py-2 w-full" value={split.cash} onChange={e => setSplit(s => ({ ...s, cash: e.target.value }))} required />
          </div>
          <div>
            <label className="font-medium">Card</label>
            <input type="number" className="border rounded px-3 py-2 w-full" value={split.card} onChange={e => setSplit(s => ({ ...s, card: e.target.value }))} required />
          </div>
        </div>
      )}
      <div>
        <label className="font-medium">Customer (optional)</label>
        <select className="border rounded px-3 py-2 w-full" value={customerId} onChange={e => setCustomerId(e.target.value)}>
          <option value="">Walk-in</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="font-medium">Email Receipt (optional)</label>
        <input type="email" className="border rounded px-3 py-2 w-full" value={email} onChange={e => setEmail(e.target.value)} placeholder="customer@email.com" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">Complete Sale</button>
      </div>
    </form>
  );
}
