import { useCustomerStore } from '@/stores/customerStore';
import { useState } from 'react';
import { Gift, Plus, Minus } from 'lucide-react';

export default function LoyaltyRewards() {
  const { customers, updateCustomer } = useCustomerStore();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [operation, setOperation] = useState<'add' | 'redeem'>('add');
  const [points, setPoints] = useState<number | ''>('');
  const [note, setNote] = useState('');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !points) return;

    const pointsValue = typeof points === 'number' ? points : parseInt(points, 10);
    const newPoints =
      operation === 'add'
        ? selectedCustomer!.loyaltyPoints + pointsValue
        : Math.max(0, selectedCustomer!.loyaltyPoints - pointsValue);

    updateCustomer(selectedCustomerId, { loyaltyPoints: newPoints });
    setPoints('');
    setNote('');
    setSelectedCustomerId('');
  };

  const rewardTiers = [
    { points: 100, reward: '$5 Discount', icon: '🎁' },
    { points: 250, reward: '$15 Discount', icon: '🎉' },
    { points: 500, reward: '$35 Discount', icon: '👑' },
    { points: 1000, reward: '$80 Discount', icon: '💎' },
  ];

  const topCustomersWithPoints = customers
    .filter(c => c.loyaltyPoints > 0)
    .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Manage Points Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Manage Loyalty Points</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Choose a customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.loyaltyPoints} pts)
                </option>
              ))}
            </select>
          </div>

          {selectedCustomer && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">{selectedCustomer.name}</span> currently has{' '}
                <span className="font-bold text-blue-600">{selectedCustomer.loyaltyPoints}</span> loyalty points
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOperation('add')}
                  className={`flex-1 py-2 px-3 rounded border font-medium flex items-center justify-center gap-2 ${
                    operation === 'add'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setOperation('redeem')}
                  className={`flex-1 py-2 px-3 rounded border font-medium flex items-center justify-center gap-2 ${
                    operation === 'redeem'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  Redeem
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
              <input
                type="number"
                min="0"
                value={points}
                onChange={e => setPoints(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g., Birthday bonus, Purchase reward, etc."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
          >
            {operation === 'add' ? 'Add Points' : 'Redeem Points'}
          </button>
        </form>
      </div>

      {/* Reward Tiers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-yellow-500" />
          Reward Tiers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {rewardTiers.map((tier, idx) => (
            <div
              key={idx}
              className="border-2 border-gray-200 rounded-lg p-4 text-center hover:border-primary-300 transition"
            >
              <p className="text-2xl mb-2">{tier.icon}</p>
              <p className="text-sm text-gray-600">Earn</p>
              <p className="text-2xl font-bold text-primary-600 my-1">{tier.points}</p>
              <p className="text-xs text-gray-500 mb-2">points</p>
              <p className="text-sm font-semibold text-gray-800">{tier.reward}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Customers earn 1 loyalty point for every $1 spent
        </p>
      </div>

      {/* Top Loyalty Customers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Top Loyalty Members</h2>
        {topCustomersWithPoints.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No customers with loyalty points yet.</p>
        ) : (
          <div className="space-y-2">
            {topCustomersWithPoints.map((customer, idx) => {
              const earnedTier = rewardTiers.filter(t => t.points <= customer.loyaltyPoints).pop();
              return (
                <div
                  key={customer.id}
                  className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded border border-amber-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-amber-600">#{idx + 1}</span>
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-gray-600">${customer.totalSpent.toFixed(2)} spent</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-600">{customer.loyaltyPoints}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {earnedTier ? `→ ${earnedTier.reward}` : 'Keep shopping!'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
