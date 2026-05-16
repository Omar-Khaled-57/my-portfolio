import { useState } from 'react'
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Projects from './dashboard/Projects'
import Certificates from './dashboard/Certificates'
import Comments from './dashboard/Comments'
import Emails from './dashboard/Emails'
import { useTheme } from "../context/ThemeContext"
import { FolderGit2, Award, MessageSquare, LogOut, LayoutDashboard, Menu, Sun, Moon, Languages, Home, Mail } from 'lucide-react'
import { useI18n } from "../i18n"

export default function Dashboard() {
  const { t, language, toggleLanguage } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const NAV_ITEMS = [
    { to: '/', label: 'Home', icon: Home, external: true },
    { to: 'projects', label: t('portfolio.projects'), icon: FolderGit2 },
    { to: 'certificates', label: t('portfolio.certificates'), icon: Award },
    { to: 'comments', label: t('comments.title'), icon: MessageSquare },
    { to: 'emails', label: t('dashboard.emailsTitle'), icon: Mail },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-5 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-1 shrink-0">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
          <div className="relative w-9 h-9 bg-primary rounded-xl border border-primary flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-accent-primary" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{t("dashboard.title")}</p>
          <p className="text-xs text-secondary">{t("dashboard.adminPanel")}</p>
        </div>
      </div>

      {/* Badge */}
      <div className="shrink-0 px-4 py-2.5 rounded-xl glass-card border-accent-primary/20 flex items-center gap-3 strong-shadow relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center w-2 h-2">
          <span className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-75" />
          <span className="relative w-1.5 h-1.5 rounded-full bg-accent-primary" />
        </div>
        <span className="text-primary text-xs font-semibold tracking-wide uppercase">{t("dashboard.manager")}</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1.5 flex-1 min-h-0">
        <p className="text-[10px] text-secondary uppercase tracking-widest px-4 mb-2 shrink-0 opacity-60 font-bold">{t("dashboard.menu")}</p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = to !== '/' && location.pathname.includes(to)
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium shrink-0 relative ${
                active
                  ? 'glass-card border-accent-primary/40 text-primary strong-shadow shadow-accent-primary/10'
                  : 'text-secondary hover:text-primary hover:bg-secondary/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors duration-300 ${active ? 'text-accent-primary' : 'group-hover:text-primary'}`} />
              <span className="relative z-10">{label}</span>
              {active && (
                <div className="ms-auto relative flex items-center justify-center w-4 h-4">
                  <div className="absolute inset-0 bg-accent-primary rounded-full blur-[6px] animate-pulse opacity-70" />
                  <div className="absolute inset-0 bg-accent-primary rounded-full animate-ping opacity-20" />
                  <div className="relative w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto space-y-2 shrink-0">
        <div className="flex gap-2 mb-4" dir="ltr" style={{ direction: 'ltr' }}>
          <button
            onClick={toggleLanguage}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-secondary hover:text-primary hover:bg-secondary border border-primary transition-all duration-200 text-xs font-medium"
          >
            <Languages className="w-4 h-4" />
            {language === "en" ? "AR" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-secondary hover:text-primary hover:bg-secondary border border-primary transition-all duration-200 text-xs font-medium"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-secondary hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/15 transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {t("dashboard.signOut")}
        </button>
      </div>
    </div>
  )

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
        <SidebarContent />
      </aside>

      {/* Sidebar - mobile drawer */}
      <aside
        className={`fixed inset-y-0 start-0 z-30 w-60 flex flex-col bg-secondary/80 backdrop-blur-2xl transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
        }`}
        style={{ boxShadow: 'inset -1px 0 0 0 rgba(99,102,241,0.12), 8px 0 48px -4px rgba(0,0,0,0.4)' }}
      >
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-primary/10 bg-secondary/50 backdrop-blur-xl shrink-0">
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
            <Route index element={<Navigate to="projects" replace />} />
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
