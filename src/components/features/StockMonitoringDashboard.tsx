import { useProductStore } from '@/stores/productStore';
import { useSupplierStore } from '@/stores/supplierStore';
import { AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

export default function StockMonitoringDashboard() {
  const { products } = useProductStore();
  const { suppliers } = useSupplierStore();

  const criticalStock = products.filter(p => p.quantity < (p.minQuantity || 10));
  const lowStock = products.filter(p => p.quantity >= (p.minQuantity || 10) && p.quantity <= (p.reorderPoint || p.minQuantity * 1.5 || 15));
  const normalStock = products.filter(p => p.quantity > (p.reorderPoint || p.minQuantity * 1.5 || 15) && p.quantity < (p.maxQuantity || 1000));
  const overstockItems = products.filter(p => p.maxQuantity && p.quantity > p.maxQuantity);

  const stats = [
    {
      label: 'Critical Stock',
      value: criticalStock.length,
      color: 'bg-red-100 text-red-800',
      icon: AlertTriangle,
    },
    {
      label: 'Low Stock',
      value: lowStock.length,
      color: 'bg-yellow-100 text-yellow-800',
      icon: AlertCircle,
    },
    {
      label: 'Normal Stock',
      value: normalStock.length,
      color: 'bg-green-100 text-green-800',
      icon: TrendingUp,
    },
    {
      label: 'Overstock',
      value: overstockItems.length,
      color: 'bg-blue-100 text-blue-800',
      icon: AlertCircle,
    },
  ];

  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return 'N/A';
    return suppliers.find(s => s.id === supplierId)?.name || 'Unknown';
  };

  const getSupplierLeadTime = (supplierId?: string) => {
    if (!supplierId) return 0;
    return suppliers.find(s => s.id === supplierId)?.leadTime || 0;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`rounded-lg p-4 ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-50" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical & Low Stock Items */}
      {(criticalStock.length > 0 || lowStock.length > 0) && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg">Action Required</h2>

          {criticalStock.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <h3 className="font-semibold text-red-800 mb-3">Critical Stock Alert</h3>
              <div className="space-y-2">
                {criticalStock.map(product => (
                  <div key={product.id} className="flex justify-between items-start text-sm text-red-700">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs mt-1">Current: {product.quantity} | Min: {product.minQuantity || 0}</p>
                      <p className="text-xs text-red-600 mt-1">
                        Supplier: {getSupplierName(product.supplierId)} (Lead time: {getSupplierLeadTime(product.supplierId)} days)
                      </p>
                    </div>
                    <span className="font-bold text-lg">{product.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lowStock.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-semibold text-yellow-800 mb-3">Low Stock Warning</h3>
              <div className="space-y-2">
                {lowStock.map(product => (
                  <div key={product.id} className="flex justify-between items-start text-sm text-yellow-700">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs mt-1">Current: {product.quantity} | Reorder: {product.reorderPoint || product.minQuantity || 0}</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Suggest ordering {product.reorderQuantity || 0} units
                      </p>
                    </div>
                    <span className="font-bold text-lg">{product.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overstock Items */}
      {overstockItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg">Overstock Items</h2>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-blue-700 mb-3">{overstockItems.length} product(s) exceeding maximum stock levels</p>
            <div className="space-y-2">
              {overstockItems.map(product => (
                <div key={product.id} className="flex justify-between text-sm text-blue-700">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs">Current: {product.quantity} | Max: {product.maxQuantity || 'N/A'}</p>
                  </div>
                  <span className="font-bold">{product.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock Status Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Stock Status Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-4">
            <p className="text-sm text-green-700 font-medium">Healthy Stock</p>
            <p className="text-2xl font-bold text-green-800 mt-2">{normalStock.length}</p>
            <p className="text-xs text-green-600 mt-1">{((normalStock.length / products.length) * 100).toFixed(0)}% of inventory</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded p-4">
            <p className="text-sm text-orange-700 font-medium">At Risk</p>
            <p className="text-2xl font-bold text-orange-800 mt-2">{criticalStock.length + lowStock.length}</p>
            <p className="text-xs text-orange-600 mt-1">{(((criticalStock.length + lowStock.length) / products.length) * 100).toFixed(0)}% of inventory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
