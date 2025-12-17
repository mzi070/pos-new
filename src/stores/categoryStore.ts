import { create } from 'zustand';
import type { Category } from '@/types';
import { getFromStorage, saveToStorage } from '@/utils/storage';

interface CategoryState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
}

const STORAGE_KEY = 'categories';

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: getFromStorage<Category[]>(STORAGE_KEY, []),
  setCategories: (categories) => {
    set({ categories });
    saveToStorage(STORAGE_KEY, categories);
  },
  addCategory: (category) => {
    const categories = [...get().categories, category];
    set({ categories });
    saveToStorage(STORAGE_KEY, categories);
  },
  updateCategory: (category) => {
    const categories = get().categories.map((c) => (c.id === category.id ? category : c));
    set({ categories });
    saveToStorage(STORAGE_KEY, categories);
  },
  removeCategory: (id) => {
    const categories = get().categories.filter((c) => c.id !== id);
    set({ categories });
    saveToStorage(STORAGE_KEY, categories);
  },
}));
