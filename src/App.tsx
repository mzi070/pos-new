import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ProtectedRoute } from '@/hooks/useAuth'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Loading } from '@/components/common/Loading'
import Layout from '@/components/layout/Layout'
import Login from '@/pages/Login'

// Lazy load all pages for code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Products = lazy(() => import('@/pages/Products'))
const Transactions = lazy(() => import('@/pages/Transactions'))
const Customers = lazy(() => import('@/pages/Customers'))
const Inventory = lazy(() => import('@/pages/Inventory'))
const POS = lazy(() => import('@/pages/POS'))
const Settings = lazy(() => import('@/pages/Settings'))

import './App.css'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <Route element={<Layout />}>
              <Route path="/dashboard" element={
                <Suspense fallback={<Loading fullScreen message="Loading Dashboard..." />}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/pos"
                element={
                  <ProtectedRoute requiredRole="cashier">
                    <Suspense fallback={<Loading fullScreen message="Loading POS..." />}>
                      <POS />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <Suspense fallback={<Loading fullScreen message="Loading Products..." />}>
                      <Products />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <Suspense fallback={<Loading fullScreen message="Loading Transactions..." />}>
                      <Transactions />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <Suspense fallback={<Loading fullScreen message="Loading Customers..." />}>
                      <Customers />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <Suspense fallback={<Loading fullScreen message="Loading Inventory..." />}>
                      <Inventory />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route path="/settings" element={
                <Suspense fallback={<Loading fullScreen message="Loading Settings..." />}>
                  <Settings />
                </Suspense>
              } />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
