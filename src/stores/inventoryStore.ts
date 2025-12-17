import { create } from 'zustand';
import type { InventoryLog } from '@/types';
import { getFromStorage, saveToStorage } from '@/utils/storage';

interface InventoryState {
  logs: InventoryLog[];
  setLogs: (logs: InventoryLog[]) => void;
  addLog: (log: InventoryLog) => void;
  removeLog: (id: string) => void;
}

const STORAGE_KEY = 'inventoryLogs';

export const useInventoryStore = create<InventoryState>((set, get) => ({
  logs: getFromStorage<InventoryLog[]>(STORAGE_KEY, []),
  setLogs: (logs) => {
    set({ logs });
    saveToStorage(STORAGE_KEY, logs);
  },
  addLog: (log) => {
    const logs = [...get().logs, log];
    set({ logs });
    saveToStorage(STORAGE_KEY, logs);
  },
  removeLog: (id) => {
    const logs = get().logs.filter((l) => l.id !== id);
    set({ logs });
    saveToStorage(STORAGE_KEY, logs);
  },
}));
