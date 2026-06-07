import React, { useState, useEffect, useMemo } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useI18n } from "../i18n";
import { useTheme } from "../context/ThemeContext";
import CVModal from "./CVModal";

const Navbar = () => {
    const { isRtl, language, toggleLanguage, t } = useI18n();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [isCVModalOpen, setIsCVModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    
    const navItems = useMemo(() => [
        { href: "#Home", label: t("nav.home") },
        { href: "#About", label: t("nav.about") },
        { href: "#Portfolio", label: t("nav.portfolio") },
        { href: "#Contact", label: t("nav.contact") },
    ], [t]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section => 
                currentPosition >= section.offset && 
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navItems]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            const top = section.offsetTop - 100;
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                isOpen
                    ? "bg-[var(--bg-primary)]"
                    : scrolled
                    ? "bg-[var(--nav-bg)] backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent"
                        >
                            {t("nav.logo")}
                        </a>
                    </div>
        
                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ms-8 flex items-center gap-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="group relative px-1 py-2 text-sm font-medium"
                                >
                                    <span
                                        className={`relative z-10 transition-colors duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                                : "text-secondary group-hover:text-primary"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                    <span
                                        className={`absolute bottom-0 start-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left rtl:origin-right transition-transform duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    />
                                </a>
                            ))}
                             <button
                                type="button"
                                onClick={() => setIsCVModalOpen(true)}
                                className="rounded-full border border-primary bg-secondary/50 px-3 py-1.5 text-xs font-bold text-accent-primary hover:bg-accent-primary/10 transition-all duration-300"
                            >
                                {t("about.downloadCv")}
                            </button>
                            <button
                                type="button"
                                onClick={toggleLanguage}
                                aria-label={t("language.label")}
                                className="rounded-full border border-primary bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-secondary hover:border-accent-primary/50 hover:text-primary transition-colors"
                            >
                                {language === "en" ? "AR" : "EN"}
                            </button>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="rounded-full border border-primary bg-secondary/50 p-1.5 text-secondary hover:border-accent-primary/50 hover:text-primary transition-colors"
                                aria-label={t("theme.toggle")}
                            >
                                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
        
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={t("nav.toggleMenu")}
                            className={`relative p-2 text-secondary hover:text-primary transition-transform duration-300 ease-in-out transform ${
                                isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                            }`}
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        
            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-6 space-y-4">
                    {navItems.map((item, index) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease ${
                                activeSection === item.href.substring(1)
                                    ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                    : "text-secondary hover:text-primary"
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transform: isOpen ? "translateX(0)" : `translateX(${isRtl ? "-50px" : "50px"})`,
                                opacity: isOpen ? 1 : 0,
                            }}
                        >
                            {item.label}
                        </a>
                    ))}
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        className="block w-full text-start px-4 py-3 text-lg font-medium text-secondary hover:text-primary transition-all duration-300 ease"
                        style={{
                            transitionDelay: `${navItems.length * 100}ms`,
                            transform: isOpen ? "translateX(0)" : `translateX(${isRtl ? "-50px" : "50px"})`,
                            opacity: isOpen ? 1 : 0,
                        }}
                    >
                        {language === "en" ? t("language.arabic") : t("language.english")}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsCVModalOpen(true);
                            setIsOpen(false);
                        }}
                        className="block w-full text-start px-4 py-3 text-lg font-bold text-accent-primary hover:text-accent-secondary transition-all duration-300 ease"
                        style={{
                            transitionDelay: `${(navItems.length + 1) * 100}ms`,
                            transform: isOpen ? "translateX(0)" : `translateX(${isRtl ? "-50px" : "50px"})`,
                            opacity: isOpen ? 1 : 0,
                        }}
                    >
                        {t("about.downloadCv")}
                    </button>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex w-full items-center gap-2 px-4 py-3 text-lg font-medium text-secondary hover:text-primary transition-all duration-300 ease"
                        style={{
                            transitionDelay: `${(navItems.length + 2) * 100}ms`,
                            transform: isOpen ? "translateX(0)" : `translateX(${isRtl ? "-50px" : "50px"})`,
                            opacity: isOpen ? 1 : 0,
                        }}
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        {theme === "dark" ? t("theme.lightMode") : t("theme.darkMode")}
                    </button>
                </div>
            </div>
            
            <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />
        </nav>
    );
};

export default Navbar;
