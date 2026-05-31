import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Projects from './dashboard/Projects'
import Certificates from './dashboard/Certificates'
import Comments from './dashboard/Comments'
import Emails from './dashboard/Emails'
import PersonalInfo from './dashboard/PersonalInfo'
import Sidebar from '../components/Sidebar'
import { useTheme } from "../context/ThemeContext"
import { Menu, Sun, Moon, Languages } from 'lucide-react'
import { useI18n } from "../i18n"

export default function Dashboard() {
  const { t, toggleLanguage } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    // Key: DO NOT use overflow-hidden here so the main scrollbar can be interacted with normally
    <div className="flex text-primary bg-primary" style={{ height: '100dvh' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - desktop: sticky, tinggi 100dvh */}
      <aside
        className="hidden lg:flex w-60 shrink-0 flex-col bg-secondary/30 backdrop-blur-2xl relative z-10"
        style={{
          height: '100dvh',
          position: 'sticky',
          top: 0,
          boxShadow: 'inset -1px 0 0 0 rgba(99,102,241,0.12), 12px 0 40px -12px rgba(0,0,0,0.25)'
        }}
      >
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* Sidebar - mobile drawer */}
      <aside
        className={`fixed inset-y-0 start-0 z-30 w-60 flex flex-col bg-secondary/80 backdrop-blur-2xl transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
        }`}
        style={{ boxShadow: 'inset -1px 0 0 0 rgba(99,102,241,0.12), 8px 0 48px -4px rgba(0,0,0,0.4)' }}
      >
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-secondary/50 backdrop-blur-xl shrink-0 shadow-[0_1px_0_0_rgba(99,102,241,0.12)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg border border-primary text-secondary hover:text-primary transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-primary">{t("dashboard.title")}</span>
          <div className="ms-auto flex items-center gap-2" dir="ltr">
             <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg border border-primary text-secondary hover:text-primary transition-colors"
            >
              <Languages className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-primary text-secondary hover:text-primary transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Only the main content area has overflow-y-auto so the scrollbar behaves normally */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-primary">
          <Routes>
            <Route index element={<Navigate to="/dashboard/personal-info" replace />} />
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="projects" element={<Projects />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="comments" element={<Comments />} />
            <Route path="emails" element={<Emails />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
