import { useTransactionStore } from '@/stores/transactionStore';
import { useCustomerStore } from '@/stores/customerStore';
import { useState } from 'react';

export default function Transactions() {
  const { transactions } = useTransactionStore();
  const { customers } = useCustomerStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function getCustomerName(customerId?: string) {
    if (!customerId) return 'Walk-in';
    return customers.find(c => c.id === customerId)?.name || 'Unknown';
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
          <p>No transactions yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map(txn => (
            <div key={txn.id} className="bg-white rounded-lg shadow">
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === txn.id ? null : txn.id)}
              >
                <div className="flex-1 text-left">
                  <div className="font-semibold">TXN {txn.transactionNumber}</div>
                  <div className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{getCustomerName(txn.customerId)} • {txn.paymentMethod}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-primary-600">${txn.total.toFixed(2)}</div>
                  <div className="text-xs text-green-600">{txn.status}</div>
                </div>
              </button>
              {expandedId === txn.id && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="space-y-2 mb-4">
                    {txn.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.product.name} x {item.quantity}</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 space-y-1 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>${txn.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tax</span><span>${txn.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Discount</span><span>${txn.discount.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold"><span>Total</span><span>${txn.total.toFixed(2)}</span></div>
                  </div>
                  <button className="w-full mt-3 px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200">
                    Print Receipt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
