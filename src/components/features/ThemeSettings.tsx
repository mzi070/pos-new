import { useSettingsStore } from '@/stores/settingsStore';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSettings() {
  const { settings, updateSettings } = useSettingsStore();

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateSettings({ theme });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Theme Settings</h3>

        {/* Theme Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Light Mode */}
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-6 rounded-lg border-2 transition ${
              settings.theme === 'light'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              <Sun className={`w-12 h-12 ${settings.theme === 'light' ? 'text-primary-600' : 'text-gray-400'}`} />
            </div>
            <p className="font-semibold text-gray-900">Light Mode</p>
            <p className="text-sm text-gray-600 mt-1">Clean and bright interface</p>
            {settings.theme === 'light' && (
              <div className="mt-3 text-xs font-semibold text-primary-600">✓ Active</div>
            )}
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-6 rounded-lg border-2 transition ${
              settings.theme === 'dark'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              <Moon className={`w-12 h-12 ${settings.theme === 'dark' ? 'text-primary-600' : 'text-gray-400'}`} />
            </div>
            <p className="font-semibold text-gray-900">Dark Mode</p>
            <p className="text-sm text-gray-600 mt-1">Easier on the eyes at night</p>
            {settings.theme === 'dark' && (
              <div className="mt-3 text-xs font-semibold text-primary-600">✓ Active</div>
            )}
          </button>
        </div>

        {/* Theme Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Current Theme:</span> {settings.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Theme preference is automatically saved and applied to your next login.
          </p>
        </div>
      </div>

      {/* Color Scheme Preview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Color Scheme</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="w-full h-24 bg-primary-50 rounded border border-gray-200"></div>
            <p className="text-xs font-medium text-gray-600">Primary Light</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-24 bg-primary-500 rounded border border-gray-200"></div>
            <p className="text-xs font-medium text-gray-600">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-24 bg-green-500 rounded border border-gray-200"></div>
            <p className="text-xs font-medium text-gray-600">Success</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-24 bg-red-500 rounded border border-gray-200"></div>
            <p className="text-xs font-medium text-gray-600">Error</p>
          </div>
        </div>
      </div>
    </div>
  );
}
