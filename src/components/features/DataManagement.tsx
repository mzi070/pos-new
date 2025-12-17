import { useState, useRef } from 'react';
import { Download, Upload, Trash2, Database } from 'lucide-react';
import { exportBackup, restoreBackup, clearAllData, getBackupSize } from '@/utils/backup';

export default function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleExportBackup = () => {
    try {
      exportBackup();
      setRestoreStatus({ type: 'success', message: 'Backup exported successfully!' });
      setTimeout(() => setRestoreStatus(null), 3000);
    } catch {
      setRestoreStatus({ type: 'error', message: 'Failed to export backup' });
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    const result = await restoreBackup(file);
    setRestoreStatus({ type: result.success ? 'success' : 'error', message: result.message });
    setIsRestoring(false);

    if (result.success) {
      setTimeout(() => window.location.reload(), 2000);
    }

    // Reset input
    e.target.value = '';
  };

  const handleClearData = () => {
    clearAllData();
  };

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {restoreStatus && (
        <div
          className={`p-4 rounded-lg border ${
            restoreStatus.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {restoreStatus.message}
        </div>
      )}

      {/* Backup Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg">Backup & Restore</h3>
            <p className="text-sm text-gray-500 mt-1">Download or restore your POS data</p>
          </div>
          <Database className="w-8 h-8 text-primary-600" />
        </div>

        <div className="space-y-4">
          {/* Backup Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Current backup size:</span> {getBackupSize()}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Includes: Products, Categories, Customers, Transactions, Inventory, Suppliers, Settings, and Users
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleExportBackup}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
            >
              <Download className="w-4 h-4" />
              Export Backup
            </button>

            <button
              onClick={handleRestoreClick}
              disabled={isRestoring}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              {isRestoring ? 'Restoring...' : 'Restore Backup'}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Backup Guidelines */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Best Practices</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="text-primary-600 font-bold flex-shrink-0">1.</span>
            <span>Regularly export backups of your data (at least weekly)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary-600 font-bold flex-shrink-0">2.</span>
            <span>Store backups in a secure location with proper access control</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary-600 font-bold flex-shrink-0">3.</span>
            <span>Test restore functionality periodically to ensure backups are valid</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary-600 font-bold flex-shrink-0">4.</span>
            <span>Keep multiple backup versions for disaster recovery</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary-600 font-bold flex-shrink-0">5.</span>
            <span>Document backup and restore procedures for your team</span>
          </li>
        </ul>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg text-red-800 mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h3>
        <div className="space-y-4">
          <p className="text-sm text-red-700">
            Clearing all data will permanently delete everything from your system. This action cannot be undone.
          </p>
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
