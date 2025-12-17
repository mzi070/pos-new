import { useSettingsStore } from '@/stores/settingsStore';
import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

export default function StoreSettings() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value });
    setSaved(false);
  };

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      resetSettings();
      setFormData(resetSettings as any);
    }
  };

  return (
    <div className="space-y-6">
      {/* Save notification */}
      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
          Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={e => handleChange('storeName', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={e => handleChange('storeAddress', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.storeCity}
                  onChange={e => handleChange('storeCity', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={formData.storePostalCode}
                  onChange={e => handleChange('storePostalCode', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.storePhone}
                onChange={e => handleChange('storePhone', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.storeEmail}
                onChange={e => handleChange('storeEmail', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Financial Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.taxRate}
                onChange={e => handleChange('taxRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Applied to all transactions</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={e => handleChange('currency', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="CAD">Canadian Dollar (C$)</option>
                <option value="AUD">Australian Dollar (A$)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                maxLength={3}
                value={formData.currencySymbol}
                onChange={e => handleChange('currencySymbol', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Receipt Settings */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h3 className="font-semibold text-lg mb-4">Receipt Customization</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Header</label>
              <textarea
                value={formData.receiptHeader}
                onChange={e => handleChange('receiptHeader', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Footer</label>
              <textarea
                value={formData.receiptFooter}
                onChange={e => handleChange('receiptFooter', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.receiptShowLogo}
                  onChange={e => handleChange('receiptShowLogo', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show Store Logo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.printReceipt}
                  onChange={e => handleChange('printReceipt', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Auto Print Receipt</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailReceipt}
                  onChange={e => handleChange('emailReceipt', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Email Receipt</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
