import { useCustomerStore } from '@/stores/customerStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMemo } from 'react';
import { TrendingUp, Users, AlertTriangle, Star } from 'lucide-react';
import {
  getTopCustomers,
  getAtRiskCustomers,
  getNewCustomers,
  calculateCustomerSegments,
} from '@/utils/customerAnalytics';

export default function CustomerAnalytics() {
  const { customers } = useCustomerStore();
  const { transactions } = useTransactionStore();

  const topCustomers = useMemo(() => getTopCustomers(customers, transactions, 10), [customers, transactions]);
  const atRiskCustomers = useMemo(() => getAtRiskCustomers(customers, transactions), [customers, transactions]);
  const newCustomers = useMemo(() => getNewCustomers(customers), [customers]);
  const segments = useMemo(() => calculateCustomerSegments(customers, transactions), [customers, transactions]);

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgCustomerValue = customers.length > 0 ? totalRevenue / customers.length : 0;

  const stats = [
    {
      label: 'Total Customers',
      value: customers.length,
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Avg Customer Value',
      value: `$${avgCustomerValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'At Risk Customers',
      value: atRiskCustomers.length,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Customer Segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Purchase Frequency */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Customer Segments</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Frequent Buyers</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded h-2">
                  <div
                    className="bg-green-600 h-2 rounded"
                    style={{ width: `${customers.length > 0 ? (segments.frequent.count / customers.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-8 text-right">{segments.frequent.count}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Regular Customers</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded h-2">
                  <div
                    className="bg-blue-600 h-2 rounded"
                    style={{ width: `${customers.length > 0 ? (segments.regular.count / customers.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-8 text-right">{segments.regular.count}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Occasional Buyers</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded"
                    style={{ width: `${customers.length > 0 ? (segments.occasional.count / customers.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-8 text-right">{segments.occasional.count}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Rare Buyers</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded h-2">
                  <div
                    className="bg-gray-600 h-2 rounded"
                    style={{ width: `${customers.length > 0 ? (segments.rare.count / customers.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-8 text-right">{segments.rare.count}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Customer Health</h2>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded border border-red-200">
              <p className="text-sm text-red-700 font-medium">At-Risk Customers</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{atRiskCustomers.length}</p>
              <p className="text-xs text-red-600 mt-1">No purchases in 90+ days</p>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-green-700 font-medium">New Customers</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{newCustomers.length}</p>
              <p className="text-xs text-green-600 mt-1">Added in last 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Top 10 Customers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Rank</th>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-right py-2">Total Spent</th>
                <th className="text-right py-2">Orders</th>
                <th className="text-right py-2">Loyalty Pts</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map(customer => (
                <tr key={customer.customerId} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-bold text-primary-600">#{customer.rank}</td>
                  <td className="py-2 font-medium">{customer.customerName}</td>
                  <td className="py-2 text-gray-600">{customer.email || '-'}</td>
                  <td className="py-2 text-right font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</td>
                  <td className="py-2 text-right">{customer.transactionCount}</td>
                  <td className="py-2 text-right font-semibold text-primary-600">{customer.loyaltyPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* At Risk Customers */}
      {atRiskCustomers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h2 className="font-semibold text-lg mb-4 text-red-700">At-Risk Customers (No activity 90+ days)</h2>
          <div className="space-y-2">
            {atRiskCustomers.slice(0, 5).map(customer => (
              <div key={customer.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-xs text-gray-600">{customer.email || customer.phone || 'No contact'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${customer.totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">{customer.loyaltyPoints} points</p>
                </div>
              </div>
            ))}
            {atRiskCustomers.length > 5 && (
              <p className="text-xs text-gray-500 pt-2">+{atRiskCustomers.length - 5} more at-risk customers</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
