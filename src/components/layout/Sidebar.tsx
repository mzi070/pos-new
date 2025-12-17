import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, BarChart3, Package, Receipt, Users, Boxes, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'POS', path: '/pos' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Boxes, label: 'Inventory', path: '/inventory' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: Users, label: 'Customers', path: '/customers' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed md:hidden bottom-4 right-4 z-50 bg-primary-600 text-white p-3 rounded-lg shadow-lg hover:bg-primary-700"
      >
        <Menu size={24} />
      </button>

      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 z-40`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">POS System</h1>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary-100 text-primary-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-xs text-gray-500">v1.0.0</p>
        </div>
      </aside>
    </>
  )
}
