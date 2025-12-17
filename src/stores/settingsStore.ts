import { create } from 'zustand';
import { getFromStorage, saveToStorage } from '@/utils/storage';

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  storeCity: string;
  storePostalCode: string;
  storePhone: string;
  storeEmail: string;
  taxRate: number; // percentage
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  currencySymbol: string;
  receiptHeader: string;
  receiptFooter: string;
  receiptShowLogo: boolean;
  theme: 'light' | 'dark';
  printReceipt: boolean;
  emailReceipt: boolean;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'My POS Store',
  storeAddress: '123 Main Street',
  storeCity: 'City',
  storePostalCode: '12345',
  storePhone: '+1 (555) 123-4567',
  storeEmail: 'info@pos.local',
  taxRate: 10,
  currency: 'USD',
  currencySymbol: '$',
  receiptHeader: 'Thank you for your purchase!',
  receiptFooter: 'Visit us again soon.',
  receiptShowLogo: true,
  theme: 'light',
  printReceipt: true,
  emailReceipt: false,
};

interface SettingsState {
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = 'storeSettings';

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: getFromStorage<StoreSettings>(STORAGE_KEY, DEFAULT_SETTINGS),

  updateSettings: (updates) => {
    set((state) => {
      const newSettings = { ...state.settings, ...updates };
      saveToStorage(STORAGE_KEY, newSettings);
      
      // Apply theme immediately
      if (updates.theme) {
        applyTheme(updates.theme);
      }
      
      return { settings: newSettings };
    });
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
    saveToStorage(STORAGE_KEY, DEFAULT_SETTINGS);
    applyTheme('light');
  },
}));

function applyTheme(theme: 'light' | 'dark') {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

// Apply saved theme on initial load
const savedSettings = getFromStorage<StoreSettings>(STORAGE_KEY, DEFAULT_SETTINGS);
applyTheme(savedSettings.theme);
