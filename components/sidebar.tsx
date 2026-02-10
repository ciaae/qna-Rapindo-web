import { useState } from 'react'
import { LogOut, FileText, HelpCircle, ChevronDown } from 'lucide-react'

interface User {
  name: string
  email: string
  role: string
}

interface HeaderProps {
  activeTab: 'qna' | 'notes'
  onTabChange: (tab: 'qna' | 'notes') => void
  onLogout: () => void
  user: User | null
}


export function Sidebar({ activeTab, onTabChange, onLogout, user }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = () => {
    setIsDropdownOpen(false)
    onLogout()
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? 'U'
  console.log('User in Sidebar:', user?.name)

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-slate-900">Q&A Dashboard</h1>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-8">
            <button
              onClick={() => onTabChange('qna')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${activeTab === 'qna'
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <HelpCircle size={18} />
              Q&A
            </button>

            <button
              onClick={() => onTabChange('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${activeTab === 'notes'
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <FileText size={18} />
              Catatan
            </button>
          </nav>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {initial}
              </div>

              <span className="text-sm font-medium text-slate-900 hidden sm:block">
                {user?.name ?? 'User'}
              </span>

              <ChevronDown size={16} className="text-slate-600" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                  <p className="font-semibold text-slate-900 text-sm">
                    {(user?.role
                      ? user.role.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
                      : 'User') + ' Profile'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {user?.email ?? 'No email available'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  )
}
