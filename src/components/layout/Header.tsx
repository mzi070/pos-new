import { LogOut, User, Settings, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { HelpModal } from '@/components/common/HelpModal'
import { Tooltip } from '@/components/common/Tooltip'

export default function Header() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  useKeyboardShortcuts()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  return (
    <>
      <header className="bg-white shadow h-16 flex items-center justify-between px-6">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">Modern POS System</h2>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {currentUser?.name} <span className="text-xs text-gray-500">({currentUser?.role})</span>
          </span>
          <Tooltip content="Help & Shortcuts (F1)">
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Help & Shortcuts (F1)"
            >
              <HelpCircle size={20} className="text-gray-600" />
            </button>
          </Tooltip>
          <Tooltip content="Settings (F8)">
            <button 
              onClick={handleSettings}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Settings (F8)"
            >
              <Settings size={20} className="text-gray-600" />
            </button>
          </Tooltip>
          <Tooltip content="Profile">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Profile">
              <User size={20} className="text-gray-600" />
            </button>
          </Tooltip>
          <Tooltip content="Logout (F10)">
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600" 
              title="Logout (F10)"
            >
              <LogOut size={20} />
            </button>
          </Tooltip>
        </div>
      </header>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  )
}
