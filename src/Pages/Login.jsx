import React, { useState } from 'react'
import { supabase } from "../supabase";
import { useNavigate } from 'react-router-dom'
import { useTheme } from "../context/ThemeContext"
import { Mail, Lock, LogIn, Sparkles, Eye, EyeOff, Sun, Moon, Languages, ArrowLeft } from 'lucide-react'
import { useI18n } from "../i18n"

export default function Login() {
  const { t, language, toggleLanguage } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { alert(error.message); setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', data.user.id).single()

    if (profile?.role !== 'admin') {
      alert(t('login.accessDenied'))
      await supabase.auth.signOut()
      setLoading(false)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative bg-[var(--bg-primary)]">
      {/* Back Button */}
      <div className="absolute top-6 left-6 flex items-center gap-3" dir="ltr">
        <button
          onClick={() => navigate('/')}
          className="p-2.5 rounded-xl bg-secondary border border-primary text-secondary hover:text-primary hover:bg-secondary/80 transition-all duration-300 flex items-center gap-2 group"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium hidden md:block">Back to Home</span>
        </button>
      </div>
      {/* Toggles */}
      <div className="absolute top-6 right-6 flex items-center gap-3" dir="ltr">
        <button
          onClick={toggleLanguage}
          className="p-2.5 rounded-xl bg-secondary border border-primary text-secondary hover:text-primary hover:bg-secondary/80 transition-all duration-300"
          title="Toggle Language"
        >
          <Languages className="w-5 h-5" />
          <span className="sr-only">Toggle Language</span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-secondary border border-primary text-secondary hover:text-primary hover:bg-secondary/80 transition-all duration-300"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="sr-only">Toggle Theme</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-700" />
          <div className="relative glass-card border border-primary rounded-2xl p-8 space-y-7 strong-shadow">

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20">
                <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
                <span className="text-accent-primary text-xs font-medium">{t("login.adminPortal")}</span>
              </div>
              <h1 className="text-3xl font-bold text-primary">{t("login.welcome")}</h1>
              <p className="text-secondary text-sm">{t("login.subtitle")}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-secondary uppercase tracking-wider font-semibold">{t("login.email")}</label>
                <div className="flex items-center bg-secondary border border-primary rounded-xl overflow-hidden focus-within:border-accent-primary/60 transition-colors">
                  <Mail className="w-4 h-4 text-secondary ms-4 shrink-0" />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent px-3 py-3 text-primary placeholder-secondary text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-secondary uppercase tracking-wider font-semibold">{t("login.password")}</label>
                <div className="flex items-center bg-secondary border border-primary rounded-xl overflow-hidden focus-within:border-accent-primary/60 transition-colors">
                  <Lock className="w-4 h-4 text-secondary ms-4 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent px-3 py-3 text-primary placeholder-secondary text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="me-4 shrink-0 text-secondary hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="relative group/btn w-full mt-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-70 blur group-hover/btn:opacity-100 transition duration-300" />
                <div className="relative h-11 bg-[var(--bg-primary)] rounded-xl border border-primary flex items-center justify-center gap-2 overflow-hidden">
                  <div className="absolute inset-0 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20" />
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="relative text-sm font-medium text-primary">{t("login.signIn")}</span>
                      <LogIn className="relative w-4 h-4 text-primary group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
