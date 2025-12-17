import { create } from 'zustand';
import type { Customer } from '@/types';
import { getFromStorage, saveToStorage } from '@/utils/storage';

interface CustomerState {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  removeCustomer: (id: string) => void;
}

const STORAGE_KEY = 'customers';

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: getFromStorage<Customer[]>(STORAGE_KEY, []),
  setCustomers: (customers) => {
    set({ customers });
    saveToStorage(STORAGE_KEY, customers);
  },
  addCustomer: (customer) => {
    const customers = [...get().customers, customer];
    set({ customers });
    saveToStorage(STORAGE_KEY, customers);
  },
  updateCustomer: (customer) => {
    const customers = get().customers.map((c) => (c.id === customer.id ? customer : c));
    set({ customers });
    saveToStorage(STORAGE_KEY, customers);
  },
  removeCustomer: (id) => {
    const customers = get().customers.filter((c) => c.id !== id);
    set({ customers });
    saveToStorage(STORAGE_KEY, customers);
  },
}));
