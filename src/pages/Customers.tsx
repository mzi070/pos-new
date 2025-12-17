import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerSearch from '@/components/features/CustomerSearch';
import CustomerManager from '@/components/features/CustomerManager';
import CustomerAnalytics from '@/components/features/CustomerAnalytics';
import CustomerPurchaseHistory from '@/components/features/CustomerPurchaseHistory';
import LoyaltyRewards from '@/components/features/LoyaltyRewards';
import { useCustomerStore } from '@/stores/customerStore';

export default function Customers() {
  const { customers } = useCustomerStore();
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Customer Relationship Management</h1>
        <p className="text-primary-100">Manage customers, track purchases, and administer loyalty rewards</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Total Customers</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600 mt-2">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Loyalty Points Issued</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalPoints}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="manager">Manager</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <CustomerSearch />
          </div>
        </TabsContent>

        <TabsContent value="manager" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <CustomerManager />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <CustomerAnalytics />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <CustomerPurchaseHistory />
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <LoyaltyRewards />
        </TabsContent>
      </Tabs>
    </div>
  );
}

