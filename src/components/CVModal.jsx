import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Download, Mail, MapPin, Phone,
    Github, Linkedin, ExternalLink, Sun, Moon, Languages,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useTheme } from '../context/ThemeContext';

const findSocialUrl = (links, platform) => {
    const match = links?.find(l => l.platform?.toLowerCase() === platform.toLowerCase());
    return match?.url || '';
};

const loadDBString = (key, fallback) => {
    try {
        const val = localStorage.getItem("personalInfo_" + key);
        return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
};

const loadDBLinks = () => {
    try {
        const val = localStorage.getItem("personalInfo_socialLinks");
        return val ? JSON.parse(val) : [];
    } catch { return []; }
};

/* ─────────────────────────────────────────────
   Scroll-lock: compensates scrollbar width
───────────────────────────────────────────── */
function lockScroll() {
    const w = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.paddingRight = `${w}px`;
}
function unlockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.paddingRight = '';
}

/* ─────────────────────────────────────────────
   Bilingual CV data
───────────────────────────────────────────── */
const getContact = () => {
    const links = loadDBLinks();
    return {
        location: loadDBString("address", '6th of October, Giza'),
        email: loadDBString("email", 'khaledelkhly57@gmail.com'),
        phone: loadDBString("phone", '+20 112 302 9406'),
        github: findSocialUrl(links, 'github') || 'https://github.com/Omar-Khaled-57',
        linkedin: findSocialUrl(links, 'linkedin') || 'https://linkedin.com/in/omar-khaled-el-khouly-0a0690313/',
    };
};

const getContactAr = () => {
    const links = loadDBLinks();
    return {
        location: loadDBString("addressAr", 'السادس من أكتوبر، الجيزة'),
        email: loadDBString("email", 'khaledelkhly57@gmail.com'),
        phone: loadDBString("phone", '+20 112 302 9406'),
        github: findSocialUrl(links, 'github') || 'https://github.com/Omar-Khaled-57',
        linkedin: findSocialUrl(links, 'linkedin') || 'https://linkedin.com/in/omar-khaled-el-khouly-0a0690313/',
    };
};

const cvData = {
    en: {
        name: 'Omar Khaled El-Khouly',
        title: 'Software Developer',
        sections: {
            contact: 'Contact',
            skills: 'Skills',
            languages: 'Languages',
            courses: 'Courses',
            summary: 'Professional Summary',
            education: 'Education',
            internship: 'Internship Experience',
            achievements: 'Achievements',
            projects: 'Projects',
        },
        contact: getContact(),
        skills: {
            frontend: { label: 'Frontend', items: ['HTML5, CSS3, JavaScript', 'TypeScript, React, Next.js', 'Tailwind CSS, Vite'] },
            backend: { label: 'Backend & Tools', items: ['Node.js, REST APIs', 'PostgreSQL, Git', 'Vue.js, Django'] },
        },
        languages: ['Arabic — Native', 'English — C2 Proficient'],
        courses: [
            'AI — ITI (July 2024)',
            'Applied Deep Learning — ITI',
            'Computer Vision — Kaggle',
            'Intro to Deep Learning — Kaggle',
            'Python — Cisco',
            'Data Science — Cisco',
        ],
        summary: 'Software Engineering student (Year 3) focused on high-performance web applications and intelligent systems. Specialized in React, Next.js, and TypeScript with strong interest in AI, Deep Learning, and Computer Vision. Experienced in bilingual (AR/EN) systems and clean, scalable architectures.',
        education: {
            university: 'October Technological University',
            faculty: 'Faculty of Technology of Industry & Energy — IT Major (Software Engineering)',
            year: 'Third Year · Expected Graduation 2026/2027',
        },
        internship: {
            title: 'ICT Intern — Afro Academy',
            period: '20 Feb 2024 – 8 May 2024',
            items: ['Worked on modern frontend development practices', 'Built responsive UI and improved performance'],
        },
        achievement: {
            title: '4th Place in Africa — ATC Mobile App Dev',
            period: '28 Jul 2025 – 27 Aug 2025',
            items: ['Ranked among top teams across Africa', 'Completed intensive training program during competition'],
        },
        projects: [
            {
                title: 'Zenith — System Health Monitor',
                tag: 'Tauri + React',
                items: [
                    'Glassmorphic system monitor with Tauri v2, React, and Rust backend',
                    'Real-time CPU thermal intelligence, core delta analysis, hardware warnings',
                    'Dual precision gauges, multi-core monitoring, live RAM & Disk tracking',
                ],
            },
            {
                title: 'StoryBox — Local AI Photo Storyteller',
                items: [
                    'AI-powered storytelling using Ollama, Moondream, and Llama3',
                    'Fully local processing — no server uploads, strong privacy focus',
                    'Auto story generation every 12 hours, smart cleanup & pin system',
                ],
            },
            {
                title: 'Hodor — RFID/QR Attendance System',
                tag: 'Devora',
                items: [
                    'Premium bilingual attendance management (AR/EN, RTL/LTR)',
                    'QR-based self-editing, glassmorphic UI with Framer Motion transitions',
                ],
            },
            {
                title: 'QueueLess — Multi-language Queue System',
                items: [
                    'Real-time turn tracking with live socket updates',
                    'Built with Next.js, React, TypeScript, and PostgreSQL',
                ],
            },
        ],
    },
    ar: {
        name: 'عمر خالد الخولي',
        title: 'مطور برمجيات',
        sections: {
            contact: 'التواصل',
            skills: 'المهارات',
            languages: 'اللغات',
            courses: 'الدورات',
            summary: 'الملخص المهني',
            education: 'التعليم',
            internship: 'خبرة التدريب',
            achievements: 'الإنجازات',
            projects: 'المشاريع',
        },
        contact: getContactAr(),
        skills: {
            frontend: { label: 'الواجهة الأمامية', items: ['HTML5, CSS3, JavaScript', 'TypeScript, React, Next.js', 'Tailwind CSS, Vite'] },
            backend: { label: 'الخلفية والأدوات', items: ['Node.js, REST APIs', 'PostgreSQL, Git', 'Vue.js, Django'] },
        },
        languages: ['العربية — اللغة الأم', 'الإنجليزية — مستوى C2 متقدم'],
        courses: [
            'الذكاء الاصطناعي — ITI (يوليو 2024)',
            'التعلم العميق التطبيقي — ITI',
            'رؤية الحاسوب — Kaggle',
            'مقدمة في التعلم العميق — Kaggle',
            'لغة Python — Cisco',
            'علم البيانات — Cisco',
        ],
        summary: 'طالب هندسة برمجيات (السنة الثالثة) متخصص في بناء تطبيقات ويب عالية الأداء وأنظمة ذكية. متخصص في React و Next.js و TypeScript مع اهتمام قوي بالذكاء الاصطناعي والتعلم العميق ورؤية الحاسوب. لديه خبرة في الأنظمة ثنائية اللغة (عربي/إنجليزي) والبنى المعمارية النظيفة والقابلة للتوسع.',
        education: {
            university: 'جامعة أكتوبر التكنولوجية',
            faculty: 'كلية تكنولوجيا الصناعة والطاقة — تخصص تقنية المعلومات (هندسة البرمجيات)',
            year: 'السنة الثالثة · التخرج المتوقع 2026/2027',
        },
        internship: {
            title: 'متدرب ICT — أكاديمية أفرو',
            period: '20 فبراير 2024 – 8 مايو 2024',
            items: ['العمل على ممارسات تطوير الواجهة الأمامية الحديثة', 'بناء واجهات مستجيبة وتحسين الأداء'],
        },
        achievement: {
            title: 'المركز الرابع أفريقياً — ATC تطوير تطبيقات الجوال',
            period: '28 يوليو 2025 – 27 أغسطس 2025',
            items: ['تصنيف ضمن أفضل الفرق في أفريقيا', 'إتمام برنامج تدريبي مكثف خلال المسابقة'],
        },
        projects: [
            {
                title: 'Zenith — مراقب صحة النظام',
                tag: 'Tauri + React',
                items: [
                    'مراقب نظام زجاجي باستخدام Tauri v2 و React و Rust',
                    'ذكاء حراري للمعالج في الوقت الفعلي مع تحليل الفارق وتحذيرات الأجهزة',
                    'مقاييس مزدوجة دقيقة، ومراقبة متعددة الأنوية، وتتبع RAM والقرص',
                ],
            },
            {
                title: 'StoryBox — راوي الصور بالذكاء الاصطناعي',
                items: [
                    'تطبيق سرد قصصي بالذكاء الاصطناعي باستخدام Ollama و Moondream و Llama3',
                    'معالجة محلية بالكامل — لا رفع للخوادم، تركيز قوي على الخصوصية',
                    'توليد قصص تلقائي كل 12 ساعة، مع نظام تنظيف ذكي وتثبيت',
                ],
            },
            {
                title: 'حضور — نظام حضور RFID/QR',
                tag: 'Devora',
                items: [
                    'واجهة إدارة حضور ثنائية اللغة (عربي/إنجليزي، RTL/LTR)',
                    'نظام تعديل ذاتي بالـ QR، واجهة زجاجية مع مؤثرات Framer Motion',
                ],
            },
            {
                title: 'QueueLess — نظام الطابور متعدد اللغات',
                items: [
                    'تتبع الدور في الوقت الفعلي مع تحديثات Socket الحية',
                    'مبني بـ Next.js و React و TypeScript و PostgreSQL',
                ],
            },
        ],
    },
};

/* ─────────────────────────────────────────────
   Framer Motion variants
───────────────────────────────────────────── */
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.08 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const sidebarVariants = {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ─────────────────────────────────────────────
   Shared CV content — bilingual, theme-reactive
───────────────────────────────────────────── */
export const CVContent = () => {
    const { t, language } = useI18n();
    const isAr = language === 'ar';
    const contact = isAr ? getContactAr() : getContact();
    const d = cvData[language] || cvData.en;

    return (
        <div
            className="overflow-x-hidden w-full h-full hide-scrollbar"
            dir={isAr ? 'rtl' : 'ltr'}
            style={{ fontFamily: isAr ? "'Cairo', sans-serif" : "'Poppins', system-ui, sans-serif" }}
        >
            <div className="flex flex-col md:flex-row min-h-full">

                {/* ── LEFT SIDEBAR (equal height via flex stretch) ── */}
                <motion.div
                    variants={sidebarVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full md:w-[300px] md:min-w-[300px] p-6 md:p-8 border-b md:border-b-0 md:border-e border-primary flex-shrink-0 transition-colors duration-300"
                    style={{ background: 'var(--bg-secondary)' }}
                >
                    <div className="mb-6">
                        <h1 className="text-xl md:text-2xl font-bold text-primary mb-1 transition-colors duration-300">
                            {d.name}
                        </h1>
                        <p className="text-accent-primary font-semibold text-sm tracking-wide">
                            {d.title}
                        </p>
                    </div>

                    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">

                        {/* Contact */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 border-b border-primary pb-2">
                                {d.sections.contact}
                            </h2>
                            <div className="space-y-3 text-[13px] text-secondary">
                                {[
                                    { Icon: MapPin, content: contact.location },
                                    { Icon: Mail, content: contact.email, cls: 'break-all', dir: 'ltr' },
                                    { Icon: Phone, content: contact.phone, dir: 'ltr' },
                                ].map(({ Icon, content, cls, dir }) => (
                                    <div key={content} className="flex items-start gap-2.5">
                                        <Icon className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
                                        <span className={cls} dir={dir}>{content}</span>
                                    </div>
                                ))}
                                <div className="flex items-start gap-2.5">
                                    <Github className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
                                    <a href={contact.github} target="_blank" rel="noopener noreferrer"
                                        className="hover:text-accent-primary transition-colors duration-200">{t("social.githubLabel")}</a>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Linkedin className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
                                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                                        className="hover:text-accent-primary transition-colors duration-200">{t("social.linkedinLabel")}</a>
                                </div>
                            </div>
                        </motion.section>

                        {/* Skills */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 border-b border-primary pb-2">
                                {d.sections.skills}
                            </h2>
                            <div className="space-y-3">
                                {[d.skills.frontend, d.skills.backend].map(skill => (
                                    <div key={skill.label}>
                                        <h3 className="text-[13px] font-bold text-primary mb-1.5">{skill.label}</h3>
                                        <ul className="text-[13px] text-secondary space-y-1 list-disc list-inside leading-relaxed">
                                            {skill.items.map(i => <li key={i}>{i}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Languages */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 border-b border-primary pb-2">
                                {d.sections.languages}
                            </h2>
                            <p className="text-[13px] text-secondary leading-relaxed">
                                {d.languages.map((l, i) => (
                                    <React.Fragment key={l}>{l}{i < d.languages.length - 1 && <br />}</React.Fragment>
                                ))}
                            </p>
                        </motion.section>

                        {/* Courses */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 border-b border-primary pb-2">
                                {d.sections.courses}
                            </h2>
                            <ul className="text-[13px] text-secondary space-y-1.5 list-disc list-inside leading-relaxed">
                                {d.courses.map(c => <li key={c}>{c}</li>)}
                            </ul>
                        </motion.section>

                    </motion.div>
                </motion.div>

                {/* ── RIGHT CONTENT ── */}
                <div className="flex-1 p-6 md:p-8 bg-primary min-w-0 transition-colors duration-300">
                    <motion.div
                        className="space-y-7"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >

                        {/* Summary */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 border-b border-primary pb-2">
                                {d.sections.summary}
                            </h2>
                            <p className="text-[13px] text-secondary leading-relaxed">{d.summary}</p>
                        </motion.section>

                        {/* Education */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 border-b border-primary pb-2">
                                {d.sections.education}
                            </h2>
                            <div>
                                <h3 className="text-base font-bold text-primary">{d.education.university}</h3>
                                <p className="text-[13px] text-accent-primary mt-1">{d.education.faculty}</p>
                                <p className="text-[12px] text-secondary mt-1.5 italic">{d.education.year}</p>
                            </div>
                        </motion.section>

                        {/* Internship */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 border-b border-primary pb-2">
                                {d.sections.internship}
                            </h2>
                            <div>
                                <h3 className="text-base font-bold text-primary">{d.internship.title}</h3>
                                <p className="text-[12px] text-secondary italic mt-1 mb-2">{d.internship.period}</p>
                                <ul className="text-[13px] text-secondary space-y-1.5 list-disc list-inside">
                                    {d.internship.items.map(i => <li key={i}>{i}</li>)}
                                </ul>
                            </div>
                        </motion.section>

                        {/* Achievements */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 border-b border-primary pb-2">
                                {d.sections.achievements}
                            </h2>
                            <div>
                                <h3 className="text-base font-bold text-primary">{d.achievement.title}</h3>
                                <p className="text-[12px] text-secondary italic mt-1 mb-2">{d.achievement.period}</p>
                                <ul className="text-[13px] text-secondary space-y-1.5 list-disc list-inside">
                                    {d.achievement.items.map(i => <li key={i}>{i}</li>)}
                                </ul>
                            </div>
                        </motion.section>

                        {/* Projects */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-[11px] uppercase tracking-widest text-secondary font-bold mb-3 border-b border-primary pb-2">
                                {d.sections.projects}
                            </h2>
                            <div className="space-y-5">
                                {d.projects.map(proj => (
                                    <motion.div key={proj.title} variants={itemVariants}>
                                        <h3 className="text-sm font-bold text-primary">
                                            {proj.title}
                                            {proj.tag && <span className="text-secondary font-normal"> ({proj.tag})</span>}
                                        </h3>
                                        <ul className="text-[13px] text-secondary mt-1.5 space-y-1 list-disc list-inside leading-relaxed">
                                            {proj.items.map(item => <li key={item}>{item}</li>)}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Modal wrapper — Framer Motion open/close
───────────────────────────────────────────── */
const CVModal = ({ isOpen, onClose }) => {
    const { t, language, toggleLanguage } = useI18n();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (isOpen) lockScroll(); else unlockScroll();
        return unlockScroll;
    }, [isOpen]);

    const handleKey = useCallback(e => { if (e.key === 'Escape') onClose(); }, [onClose]);
    useEffect(() => {
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [handleKey]);

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="cv-backdrop"
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                    style={{
                        backdropFilter: 'blur(8px)',
                        /* Explicit coordinates ensure fixed always anchors to viewport,
                           not to a transformed ancestor. */
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/65 pointer-events-none" />

                    <motion.div
                        key="cv-card"
                        className="relative w-full max-w-5xl z-10"
                        style={{ maxHeight: '90vh' }}
                        initial={{ opacity: 0, y: 48, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 32, scale: 0.97 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Glow ring */}
                        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-primary opacity-50 blur-sm pointer-events-none" />

                        {/* Shell */}
                        <div
                            className="relative w-full rounded-3xl border border-white/10 shadow-2xl flex flex-col"
                            style={{ maxHeight: '90vh', background: 'var(--bg-primary)' }}
                        >
                            {/* ── TOP BAR ── */}
                            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-primary rounded-t-3xl"
                                style={{ background: 'var(--bg-secondary)' }}>
                                <span className="text-xs font-bold text-accent-primary uppercase tracking-widest">{t("cv.title")}</span>

                                <div className="flex items-center gap-1.5" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                    <a href="/cv" target="_blank" rel="noopener noreferrer"
                                        className="p-2 rounded-xl bg-primary/60 border border-primary text-secondary hover:text-primary hover:border-accent-primary/50 transition-all duration-300"
                                        title={t("common.openInNewTab")}>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>

                                    {/* File: OmarKhaledElKhouly.pdf (was CV-ATS.pdf) */}
                                    <a href="/OmarKhaledElKhouly.pdf" download
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

                                    <button onClick={toggleLanguage}
                                        className="p-2 rounded-xl bg-primary/60 border border-primary text-secondary hover:text-primary hover:border-accent-primary/50 transition-all duration-300"
                                        title={t("language.toggle")}>
                                        <Languages className="w-4 h-4" />
                                    </button>

                                    <button onClick={toggleTheme}
                                        className="p-2 rounded-xl bg-primary/60 border border-primary text-secondary hover:text-primary hover:border-accent-primary/50 transition-all duration-300"
                                        title={t("theme.toggle")}>
                                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                    </button>

                                    <button onClick={onClose}
                                        className="p-2 rounded-xl bg-primary/60 border border-primary text-secondary hover:text-red-400 hover:border-red-400/50 transition-all duration-300"
                                        title={t("common.close")}>
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* ── BODY (single scrollbar) ── */}
                            <div className="flex-1 overflow-y-auto min-h-0 rounded-b-3xl">
                                <CVContent />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CVModal;
