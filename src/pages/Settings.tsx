import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StoreSettings from '@/components/features/StoreSettings';
import ThemeSettings from '@/components/features/ThemeSettings';
import DataManagement from '@/components/features/DataManagement';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';

export default function Settings() {
  const { currentUser, isAdmin } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-primary-100">Manage store configuration, preferences, and data</p>
      </div>

      {/* Current User Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Logged in as:</span> {currentUser?.name} ({currentUser?.role})
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {isAdmin ? '✓ You have admin access to all settings' : 'Some settings are restricted to administrators'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">Store Settings</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <StoreSettings />
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <ThemeSettings />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          {!isAdmin ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Admin Access Required</p>
                <p className="text-sm text-gray-500 mt-1">
                  Only administrators can access data backup and restore functions
                </p>
              </div>
            </div>
          ) : (
            <DataManagement />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
