import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'cashier';
}

export function ProtectedRoute({ children, requiredRole = 'cashier' }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser, hasPermission } = useAuthStore();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function useAuth() {
  const { currentUser, isAuthenticated, login, logout, hasPermission } = useAuthStore();

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    isAdmin: currentUser?.role === 'admin',
    isManager: currentUser?.role === 'manager',
    isCashier: currentUser?.role === 'cashier',
  };
}
