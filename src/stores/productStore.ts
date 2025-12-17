import { create } from 'zustand';
import type { Product } from '@/types';
import { getFromStorage, saveToStorage } from '@/utils/storage';

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
}

const STORAGE_KEY = 'products';

export const useProductStore = create<ProductState>((set, get) => ({
  products: getFromStorage<Product[]>(STORAGE_KEY, []),
  setProducts: (products) => {
    set({ products });
    saveToStorage(STORAGE_KEY, products);
  },
  addProduct: (product) => {
    const products = [...get().products, product];
    set({ products });
    saveToStorage(STORAGE_KEY, products);
  },
  updateProduct: (id, updates) => {
    const products = get().products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    set({ products });
    saveToStorage(STORAGE_KEY, products);
  },
  removeProduct: (id) => {
    const products = get().products.filter((p) => p.id !== id);
    set({ products });
    saveToStorage(STORAGE_KEY, products);
  },
}));
