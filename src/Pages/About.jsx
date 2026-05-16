import React, { useEffect, useState, memo, useMemo } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, UserCheck, FolderGit2 } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useI18n } from "../i18n"
import CVModal from "../components/CVModal"

// Memoized Components
const Header = memo(({ t }) => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2 
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-2" 
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        {t("about.title")}
      </h2>
    </div>
    <p 
      className="mt-2 text-[var(--text-secondary)] max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 text-purple-400" />
      {t("about.subtitle")}
      <Sparkles className="w-5 h-5 text-purple-400" />
    </p>
  </div>
));

const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div 
      className="relative group" 
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Optimized gradient backgrounds with reduced complexity for mobile */}
      <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-full blur-2xl animate-spin-slower" />
        <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 rounded-full blur-2xl animate-float opacity-50" />
      </div>

      <div className="relative">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)] transform transition-all duration-700 group-hover:scale-105">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />
          
          {/* Optimized overlay effects - disabled on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-blue-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />
          
          <img
            src="/ME.jpg"
            alt="Profile"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
          />

          {/* Advanced hover effects - desktop only */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
            <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="relative z-10 glass-card rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 text-[var(--text-primary)]" />
        </div>
        <span 
          className="text-4xl font-bold text-[var(--text-primary)]"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {value}
        </span>
      </div>

      <div>
        <p 
          className="text-sm uppercase tracking-wider text-[var(--text-secondary)] mb-2"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p 
            className="text-xs text-[var(--text-secondary)]"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-[var(--text-secondary)] opacity-50 group-hover:text-[var(--text-primary)] transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

const AboutPage = () => {
  const { t } = useI18n();
  const [isCVModalOpen, setIsCVModalOpen] = React.useState(false);
  // Dynamic stats calculation
  const [stats, setStats] = useState({
    totalProjects: 26,
    totalCertificates: 0,
    accessibleProjects: 0
  });

  useEffect(() => {
    const updateStats = () => {
      try {
        const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
        setStats({
          totalProjects: 26,
          totalCertificates: storedCertificates.length,
          accessibleProjects: storedProjects.filter(p => p.github || p.link).length
        });
      } catch (e) {
        console.error("Error parsing stats", e);
      }
    };

    updateStats();
    
    // Listen for custom event from Portfolio.jsx
    window.addEventListener('portfolioDataLoaded', updateStats);
    // Listen for cross-tab updates
    window.addEventListener('storage', updateStats);
    
    return () => {
      window.removeEventListener('portfolioDataLoaded', updateStats);
      window.removeEventListener('storage', updateStats);
    };
  }, []);

  const { totalProjects, totalCertificates, accessibleProjects } = stats;

  // Optimized AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: false, 
      });
    };

    initAOS();
    
    // Debounced resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#6366f1] to-[#a855f7]",
      value: totalProjects,
      label: t("about.totalProjects"),
      description: t("about.totalProjectsDescription"),
      animation: "fade-right",
    },
    {
      icon: Award,
      color: "from-[#a855f7] to-[#6366f1]",
      value: totalCertificates,
      label: t("about.certificates"),
      description: t("about.certificatesDescription"),
      animation: "fade-up",
    },
    {
      icon: FolderGit2,
      color: "from-[#6366f1] to-[#a855f7]",
      value: accessibleProjects,
      label: t("about.accessibleProjects"),
      description: t("about.accessibleProjectsDescription"),
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, accessibleProjects, t]);

  return (
    <div
      className="h-auto pb-[10%] text-[var(--text-primary)] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0" 
      id="About"
     itemScope
  itemType="https://schema.org/Person"

    >
      <Header t={t} />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-start"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-2">
                {t("about.greeting")}
              </span>
              <span 
                className="block mt-2 text-[var(--text-primary)]"
                data-aos="fade-right"
                data-aos-duration="1300"
                itemProp="name"
              >
                {t("about.name")}
              </span>
            </h2>
            
            <p 
              className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
        {t("about.description")}
                  </p>

               {/* Quote Section */}
      <div 
        className="relative glass-card rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
        data-aos="fade-up"
        data-aos-duration="1700"
      >
        {/* Floating orbs background */}
        <div className="absolute top-2 end-4 w-16 h-16 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -start-2 w-12 h-12 bg-gradient-to-r from-[#a855f7]/20 to-[#6366f1]/20 rounded-full blur-lg"></div>
        
        {/* Quote icon */}
        <div className="absolute top-3 start-4 text-[var(--accent-primary)] opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
        </div>
        
        <blockquote className="text-[var(--text-secondary)] text-center lg:text-start italic font-medium text-sm relative z-10 ps-6">
          "{t("about.quote")}"
        </blockquote>
      </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 lg:px-0 w-full">
              <button 
                data-aos="fade-up"
                data-aos-duration="800"
                onClick={() => setIsCVModalOpen(true)}
                className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 border"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderColor: 'rgba(99,102,241,0.45)',
                  color: 'var(--accent-primary)',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.18)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.28)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.28)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.18)';
                }}
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> {t("about.downloadCv")}
              </button>
              <a href="#Portfolio" className="w-full lg:w-auto">
              <button 
                data-aos="fade-up"
                data-aos-duration="1000"
                className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-[#a855f7]/50 text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-[#a855f7]/10 "
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5" /> {t("about.viewProjects")}
              </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        <a href="#Portfolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>

      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slower {
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);
