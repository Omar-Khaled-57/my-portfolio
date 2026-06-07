import React from 'react';
import { Download, Sun, Moon, Languages, ArrowLeft } from 'lucide-react';
import { useI18n } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { CVContent } from '../components/CVModal';
import { useNavigate } from 'react-router-dom';

const CVPage = () => {
    const { t, language, toggleLanguage } = useI18n();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-primary flex flex-col transition-colors duration-300">

            {/* ── TOP BAR ── */}
            <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 border-b border-primary bg-secondary/80 backdrop-blur-xl flex-shrink-0" dir="ltr">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-secondary border border-primary text-secondary hover:text-primary hover:border-accent-primary/50 transition-all duration-300"
                        title={t("common.goBack")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-accent-primary uppercase tracking-widest hidden sm:inline">
                        {t("cv.pageTitle", { name: t("about.name") })}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* File name: OmarKhaledElKhouly.pdf (was CV-ATS.pdf) */}
                    <a
                        href="/OmarKhaledElKhouly.pdf"
                        download
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-lg border"
                        style={{
                            background: 'rgba(99,102,241,0.15)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            borderColor: 'rgba(99,102,241,0.4)',
                            color: 'var(--accent-primary)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.28)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('about.actualDownload')}</span>
                        <span className="sm:hidden">{t("cv.pdfLabel")}</span>
                    </a>

                    <button
                        onClick={toggleLanguage}
                        className="p-2.5 rounded-xl bg-secondary border border-primary text-secondary hover:text-primary hover:bg-secondary/80 transition-all duration-300"
                        title={t("language.toggle")}
                    >
                        <Languages className="w-5 h-5" />
                        <span className="sr-only">{t("language.toggle")}</span>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-secondary border border-primary text-secondary hover:text-primary hover:bg-secondary/80 transition-all duration-300"
                        title={t("theme.toggle")}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="sr-only">{t("theme.toggle")}</span>
                    </button>
                </div>
            </header>

            {/* ── CV BODY ── */}
            <main className="flex-1 flex flex-col">
                {/* Glassmorphic padded card on md+ */}
                <div className="flex-1 flex flex-col md:p-6">
                    <div className="flex-1 relative md:rounded-3xl overflow-hidden border border-primary shadow-2xl">
                        {/* Glow ring */}
                        <div className="absolute -inset-[1px] md:rounded-3xl bg-gradient-to-br from-accent-primary/30 via-accent-secondary/20 to-accent-primary/30 pointer-events-none" />
                        {/* Content — CVContent handles its own scroll */}
                        <div className="relative bg-primary md:rounded-3xl overflow-hidden h-full">
                            <CVContent />
                        </div>
                    </div>
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="text-center py-4 text-xs text-secondary border-t border-primary transition-colors duration-300">
                {t("cv.footerCredit", { name: t("about.name"), year: new Date().getFullYear() })}
            </footer>
        </div>
    );
};

export default CVPage;
