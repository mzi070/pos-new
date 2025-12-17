import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockMonitoringDashboard from '@/components/features/StockMonitoringDashboard';
import InventoryHistoryLog from '@/components/features/InventoryHistoryLog';
import StockAdjustmentInterface from '@/components/features/StockAdjustmentInterface';
import ProductReorderSettings from '@/components/features/ProductReorderSettings';
import SupplierManager from '@/components/features/SupplierManager';
import { useProductStore } from '@/stores/productStore';
import { calculateStockValuation, formatCurrency } from '@/utils/valuation';

export default function Inventory() {
  const { products } = useProductStore();
  const valuation = calculateStockValuation(products);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-primary-100">Monitor stock levels, adjust inventory, and manage reorder points</p>
      </div>

      {/* Stock Valuation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Total Stock Value</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">{formatCurrency(valuation.totalValue)}</p>
          <p className="text-xs text-gray-500 mt-2">{valuation.itemCount} items in stock</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Average Cost Per Item</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(valuation.averageCostPerItem)}</p>
          <p className="text-xs text-gray-500 mt-2">Weighted average</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Products in Stock</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{products.length}</p>
          <p className="text-xs text-gray-500 mt-2">Total SKUs</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="reorder">Reorder</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <StockMonitoringDashboard />
          </div>
        </TabsContent>

        <TabsContent value="adjustment" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <StockAdjustmentInterface />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <InventoryHistoryLog />
          </div>
        </TabsContent>

        <TabsContent value="reorder" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <ProductReorderSettings />
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <SupplierManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

