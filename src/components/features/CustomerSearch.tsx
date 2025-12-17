import { useCustomerStore } from '@/stores/customerStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import { calculateCustomerAnalytics, exportCustomerList } from '@/utils/customerAnalytics';

export default function CustomerSearch() {
  const { customers } = useCustomerStore();
  const { transactions } = useTransactionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'name' | 'email' | 'phone' | 'city'>('name');
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'loyaltyPoints' | 'createdAt'>('name');

  const filtered = useMemo(() => {
    let results = customers;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(c => {
        if (filterType === 'name') return c.name.toLowerCase().includes(query);
        if (filterType === 'email') return c.email?.toLowerCase().includes(query) || false;
        if (filterType === 'phone') return c.phone?.toLowerCase().includes(query) || false;
        if (filterType === 'city') return c.city?.toLowerCase().includes(query) || false;
        return true;
      });
    }

    // Sort
    const sorted = [...results].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'totalSpent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'loyaltyPoints') return b.loyaltyPoints - a.loyaltyPoints;
      if (sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return sorted;
  }, [customers, searchQuery, filterType, sortBy]);

  const handleExport = () => {
    exportCustomerList(filtered);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex-1 min-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as 'name' | 'email' | 'phone' | 'city')}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">By Name</option>
            <option value="email">By Email</option>
            <option value="phone">By Phone</option>
            <option value="city">By City</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'name' | 'totalSpent' | 'loyaltyPoints' | 'createdAt')}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Sort by Name</option>
            <option value="totalSpent">Sort by Total Spent</option>
            <option value="loyaltyPoints">Sort by Loyalty Points</option>
            <option value="createdAt">Sort by Date Added</option>
          </select>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{customers.length}</span> customers
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No customers found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Phone</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">City</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold">Total Spent</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold">Purchases</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold">Loyalty Pts</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(customer => {
                  const analytics = calculateCustomerAnalytics(customer, transactions);
                  return (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium">{customer.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{customer.email || '-'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{customer.phone || '-'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{customer.city || '-'}</td>
                      <td className="px-6 py-3 text-right text-sm font-semibold">${customer.totalSpent.toFixed(2)}</td>
                      <td className="px-6 py-3 text-right text-sm">{analytics.totalPurchases}</td>
                      <td className="px-6 py-3 text-right text-sm font-semibold text-primary-600">{customer.loyaltyPoints}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
