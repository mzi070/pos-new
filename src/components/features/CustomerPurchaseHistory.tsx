import { useCustomerStore } from '@/stores/customerStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CustomerPurchaseHistory() {
  const { customers } = useCustomerStore();
  const { transactions } = useTransactionStore();
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);

  const customersWithHistory = customers
    .map(customer => ({
      customer,
      purchases: transactions.filter(t => t.customerId === customer.id).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }))
    .filter(item => item.purchases.length > 0)
    .sort((a, b) => b.purchases.length - a.purchases.length);

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow p-4 border-b">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{customersWithHistory.length}</span> customers with purchase history
        </p>
      </div>

      {customersWithHistory.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
          No purchase history yet.
        </div>
      ) : (
        <div className="space-y-2">
          {customersWithHistory.map(({ customer, purchases }) => (
            <div key={customer.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpandedCustomerId(expandedCustomerId === customer.id ? null : customer.id)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div className="flex-1 text-left">
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-sm text-gray-600">{purchases.length} purchases • ${customer.totalSpent.toFixed(2)} spent</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    {purchases.length} orders
                  </span>
                  {expandedCustomerId === customer.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>

              {/* Details */}
              {expandedCustomerId === customer.id && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="space-y-3">
                    {purchases.length === 0 ? (
                      <p className="text-sm text-gray-500">No transactions</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {purchases.map(transaction => (
                          <div key={transaction.id} className="bg-white rounded p-3 border">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <p className="text-sm font-medium">
                                  Transaction #{transaction.transactionNumber}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(transaction.createdAt).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {transaction.items.length} item(s) • Payment: {transaction.paymentMethod}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-primary-600">${transaction.total.toFixed(2)}</p>
                                <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                                  transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                  transaction.status === 'refunded' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {transaction.status}
                                </span>
                              </div>
                            </div>

                            {/* Items breakdown */}
                            <div className="mt-2 pt-2 border-t text-xs space-y-1">
                              {transaction.items.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex justify-between text-gray-600">
                                  <span>{item.product.name} x{item.quantity}</span>
                                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                              {transaction.items.length > 3 && (
                                <p className="text-gray-500">+{transaction.items.length - 3} more items</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
