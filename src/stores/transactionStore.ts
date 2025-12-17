import { create } from 'zustand';
import type { Transaction } from '@/types';
import { getFromStorage, saveToStorage } from '@/utils/storage';

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
}

const STORAGE_KEY = 'transactions';

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: getFromStorage<Transaction[]>(STORAGE_KEY, []),
  setTransactions: (transactions) => {
    set({ transactions });
    saveToStorage(STORAGE_KEY, transactions);
  },
  addTransaction: (transaction) => {
    const transactions = [...get().transactions, transaction];
    set({ transactions });
    saveToStorage(STORAGE_KEY, transactions);
  },
  updateTransaction: (transaction) => {
    const transactions = get().transactions.map((t) => (t.id === transaction.id ? transaction : t));
    set({ transactions });
    saveToStorage(STORAGE_KEY, transactions);
  },
  removeTransaction: (id) => {
    const transactions = get().transactions.filter((t) => t.id !== id);
    set({ transactions });
    saveToStorage(STORAGE_KEY, transactions);
  },
}));
