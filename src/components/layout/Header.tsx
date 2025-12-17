import { LogOut, User, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800">Modern POS System</h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <User size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut size={20} className="text-gray-600" />
        </button>
      </div>
    </header>
  )
}
