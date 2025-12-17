import { LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800">Modern POS System</h2>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {currentUser?.name} <span className="text-xs text-gray-500">({currentUser?.role})</span>
        </span>
        <button 
          onClick={handleSettings}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
          title="Settings"
        >
          <Settings size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Profile">
          <User size={20} className="text-gray-600" />
        </button>
        <button 
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600" 
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
