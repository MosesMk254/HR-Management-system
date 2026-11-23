import { LogOut, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { DEPT_META } from '@/data/constants'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const dept = currentUser?.department
  const meta = DEPT_META[dept] ?? {}

  return (
    <nav className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-10">
      {/* Left — Branding */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
          <FileText size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">HR File Tracking System</p>
        </div>
      </div>

      {/* Right — User info */}
      <div className="flex items-center gap-4">
        {/* Department badge */}
        <span className={`hidden sm:inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full ${meta.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${meta.dot}`} />
          {dept}
        </span>

        {/* User card */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-xs font-bold text-indigo-600">
              {currentUser?.name?.charAt(0) ?? '?'}
            </span>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{currentUser?.name}</p>
            <p className="text-xs text-gray-400 leading-tight">{currentUser?.username}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  )
}
