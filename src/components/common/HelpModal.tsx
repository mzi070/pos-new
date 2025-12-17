import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { getShortcutsList } from '@/hooks/useKeyboardShortcuts';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'help'>('shortcuts');
  const shortcuts = getShortcutsList();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Help & Documentation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex-1 px-4 py-3 font-medium transition ${
              activeTab === 'shortcuts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Keyboard Shortcuts
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 px-4 py-3 font-medium transition ${
              activeTab === 'help'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Help Guide
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'shortcuts' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <kbd className="px-3 py-1 bg-gray-900 text-white rounded font-mono text-sm font-bold">
                      {shortcut.key}
                    </kbd>
                    <span className="text-gray-700">{shortcut.action}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Common Actions</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>
                  <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl</kbd> +
                  <kbd className="px-2 py-1 bg-gray-200 rounded ml-1">S</kbd> - Save (coming soon)
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl</kbd> +
                  <kbd className="px-2 py-1 bg-gray-200 rounded ml-1">P</kbd> - Print (coming soon)
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl</kbd> +
                  <kbd className="px-2 py-1 bg-gray-200 rounded ml-1">Z</kbd> - Undo (coming soon)
                </p>
                <p>
                  <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl</kbd> +
                  <kbd className="px-2 py-1 bg-gray-200 rounded ml-1">Y</kbd> - Redo (coming soon)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-gray-700">
              <section>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Getting Started</h3>
                <p>
                  Welcome to the POS System! This application helps you manage your retail operations efficiently.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Main Sections</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Dashboard:</strong> Overview of sales, inventory, and business metrics
                  </li>
                  <li>
                    <strong>POS:</strong> Point of Sale system for processing customer transactions
                  </li>
                  <li>
                    <strong>Products:</strong> Manage product catalog, prices, and categories
                  </li>
                  <li>
                    <strong>Inventory:</strong> Track stock levels, reorder points, and supplier information
                  </li>
                  <li>
                    <strong>Customers:</strong> Manage customer information and loyalty rewards
                  </li>
                  <li>
                    <strong>Transactions:</strong> View and export transaction history
                  </li>
                  <li>
                    <strong>Settings:</strong> Configure store settings, theme, and backup/restore data
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Tips & Tricks</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Use keyboard shortcuts (F1-F8) to quickly navigate between sections
                  </li>
                  <li>
                    • Scan barcodes directly in the POS interface for faster checkout
                  </li>
                  <li>
                    • Backup your data regularly from Settings → Data Management
                  </li>
                  <li>
                    • Set up reorder points in Inventory to get notified of low stock
                  </li>
                  <li>
                    • Use the Customer Search to find customer info and purchase history
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Support</h3>
                <p className="text-sm">
                  For additional help or to report issues, please contact your system administrator or support team.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
