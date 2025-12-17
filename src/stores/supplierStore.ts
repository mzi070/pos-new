import { create } from 'zustand';
import { getFromStorage, saveToStorage } from '@/utils/storage';

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  leadTime: number; // days
  createdAt: Date;
  updatedAt: Date;
}

interface SupplierState {
  suppliers: Supplier[];
  setSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
}

const STORAGE_KEY = 'suppliers';

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: getFromStorage<Supplier[]>(STORAGE_KEY, []),
  setSuppliers: (suppliers) => {
    set({ suppliers });
    saveToStorage(STORAGE_KEY, suppliers);
  },
  addSupplier: (supplier) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const suppliers = [...get().suppliers, newSupplier];
    set({ suppliers });
    saveToStorage(STORAGE_KEY, suppliers);
  },
  updateSupplier: (id, updates) => {
    const suppliers = get().suppliers.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s));
    set({ suppliers });
    saveToStorage(STORAGE_KEY, suppliers);
  },
  deleteSupplier: (id) => {
    const suppliers = get().suppliers.filter((s) => s.id !== id);
    set({ suppliers });
    saveToStorage(STORAGE_KEY, suppliers);
  },
}));
