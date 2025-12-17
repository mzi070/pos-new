import { getFromStorage } from '@/utils/storage';

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    products: unknown;
    categories: unknown;
    customers: unknown;
    transactions: unknown;
    inventory: unknown;
    suppliers: unknown;
    settings: unknown;
    users?: unknown;
  };
}

const STORAGE_KEYS = [
  'products',
  'categories',
  'customers',
  'transactions',
  'inventory',
  'suppliers',
  'storeSettings',
  'users',
];

export function createBackup(): BackupData {
  const backupData: BackupData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    data: {
      products: getFromStorage('products', []),
      categories: getFromStorage('categories', []),
      customers: getFromStorage('customers', []),
      transactions: getFromStorage('transactions', []),
      inventory: getFromStorage('inventory', []),
      suppliers: getFromStorage('suppliers', []),
      settings: getFromStorage('storeSettings', {}),
      users: getFromStorage('users', []),
    },
  };

  return backupData;
}

export function exportBackup(): void {
  const backup = createBackup();
  const filename = `pos-backup-${new Date().toISOString().split('T')[0]}.json`;
  const dataStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function restoreBackup(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup: BackupData = JSON.parse(content);

        // Validate backup structure
        if (!backup.version || !backup.data) {
          resolve({ success: false, message: 'Invalid backup file format' });
          return;
        }

        // Restore all data
        Object.entries(backup.data).forEach(([key, value]) => {
          if (value) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });

        resolve({ success: true, message: 'Data restored successfully. Please refresh the page.' });
      } catch (error) {
        resolve({ success: false, message: `Error restoring backup: ${error instanceof Error ? error.message : 'Unknown error'}` });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, message: 'Error reading file' });
    };

    reader.readAsText(file);
  });
}

export function clearAllData(): void {
  if (window.confirm('⚠️ This will permanently delete all data. Are you sure?')) {
    STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    window.location.reload();
  }
}

export function getBackupSize(): string {
  const backup = createBackup();
  const sizeInBytes = new Blob([JSON.stringify(backup)]).size;

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
