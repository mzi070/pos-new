import { create } from 'zustand';
import type { User } from '@/types';
import { getFromStorage, saveToStorage } from '@/utils/storage';

interface UserWithPassword extends User {
  password: string;
}

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  hasPermission: (requiredRole: 'admin' | 'manager' | 'cashier') => boolean;
}

const STORAGE_KEY = 'currentUser';
const USERS_STORAGE_KEY = 'users';

// Default admin user
const DEFAULT_ADMIN: UserWithPassword = {
  id: '1',
  email: 'admin@pos.local',
  name: 'Admin User',
  password: 'admin123', // In production, this should be hashed
  role: 'admin',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function getStoredUsers(): UserWithPassword[] {
  const stored = getFromStorage<UserWithPassword[]>(USERS_STORAGE_KEY, []);
  if (stored.length === 0) {
    const users = [DEFAULT_ADMIN];
    saveToStorage(USERS_STORAGE_KEY, users);
    return users;
  }
  return stored;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: getFromStorage<User | null>(STORAGE_KEY, null),
  isAuthenticated: !!getFromStorage<User | null>(STORAGE_KEY, null),

  login: (email: string, password: string) => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password && u.active);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      set({ currentUser: userWithoutPassword, isAuthenticated: true });
      saveToStorage(STORAGE_KEY, userWithoutPassword);
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
    saveToStorage(STORAGE_KEY, null);
  },

  setCurrentUser: (user: User | null) => {
    set({ currentUser: user, isAuthenticated: !!user });
    if (user) {
      saveToStorage(STORAGE_KEY, user);
    } else {
      saveToStorage(STORAGE_KEY, null);
    }
  },

  hasPermission: (requiredRole: 'admin' | 'manager' | 'cashier') => {
    const { currentUser } = get();
    if (!currentUser) return false;

    // Admin has all permissions
    if (currentUser.role === 'admin') return true;

    // Manager can access everything except user management
    if (currentUser.role === 'manager') {
      return requiredRole !== 'admin';
    }

    // Cashier can only access POS and view limited data
    return requiredRole === 'cashier';
  },
}));
