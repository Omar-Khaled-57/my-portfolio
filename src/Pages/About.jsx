import React, { useEffect, useState, memo, useMemo } from "react"
import { FileText, Code, Award, ArrowUpRight, Sparkles, FolderGit2, Briefcase } from "lucide-react"
import useAOS, { refreshAOS } from "../hooks/useAOS"
import { useI18n } from "../i18n"
import { supabase } from "../supabase"
import CVModal from "../components/CVModal"
// Memoized Components
const Header = memo(({ t }) => (
  <div className="text-center lg:mb-8 mb-2 px-[5%] lg:px-[10%]">
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

const ProfileImage = memo(({ imageUrl }) => {
  const { t } = useI18n();
  return (
    <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
      <div 
        className="relative group" 
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-full blur-2xl animate-spin-slower" />
          <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 rounded-full blur-2xl animate-float opacity-50" />
        </div>

        <div className="relative">
          <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)] transform transition-all duration-700 group-hover:scale-105">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-blue-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />
            
            <img
              src={imageUrl || "/Photo.png"}
              alt={t("about.profileAlt")}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
              loading="lazy"
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
              <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

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
  const { t, language } = useI18n();
  const [isCVModalOpen, setIsCVModalOpen] = React.useState(false);
  const [showYearsExp, setShowYearsExp] = useState(false);
  const [yearsExpValue, setYearsExpValue] = useState(0);
  const [manualTotalProjects, setManualTotalProjects] = useState(26);
  // Dynamic stats calculation
  const countAccessible = (projects) =>
    projects.filter(p => p.is_published !== false && ((p.github && p.github.trim()) || (p.link && p.link.trim()))).length;

  const [profileImage, setProfileImage] = useState("");
  const [fullName, setFullName] = useState("");
  const [fullNameAr, setFullNameAr] = useState("");
  const [quote, setQuote] = useState("");
  const [quoteAr, setQuoteAr] = useState("");

  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem("projects");
      if (cached) {
        const projects = JSON.parse(cached);
        return { totalCertificates: 0, accessibleProjects: countAccessible(projects) };
      }
    } catch {}
    return { totalCertificates: 0, accessibleProjects: 0 };
  });

  const cacheLocally = (fields) => {
    try {
      localStorage.setItem("personalInfo_totalProjects", JSON.stringify(manualTotalProjects));
      localStorage.setItem("personalInfo_yearsExperience", JSON.stringify(yearsExpValue));
      localStorage.setItem("personalInfo_showYearsExperience", JSON.stringify(showYearsExp));
      if (fields?.profileImage) localStorage.setItem("personalInfo_profileImage", fields.profileImage);
      if (fields?.fullName) localStorage.setItem("personalInfo_fullName", fields.fullName);
      if (fields?.fullNameAr) localStorage.setItem("personalInfo_fullNameAr", fields.fullNameAr);
      if (fields?.quote) localStorage.setItem("personalInfo_quote", fields.quote);
      if (fields?.quoteAr) localStorage.setItem("personalInfo_quoteAr", fields.quoteAr);
    } catch {}
  };

  useEffect(() => {
    const fetchAll = async () => {
      const [projectsRes, certsRes, settingsRes] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase.from("certificates").select("*").order("id", { ascending: false }),
        supabase.from("app_settings").select("key, value").in("key", [
          "personalInfo_totalProjects",
          "personalInfo_yearsExperience",
          "personalInfo_showYearsExperience",
          "personalInfo_profileImage",
          "personalInfo_fullName",
          "personalInfo_fullNameAr",
          "personalInfo_quote",
          "personalInfo_quoteAr",
        ]),
      ]);

      const projects = projectsRes.error ? [] : (projectsRes.data || []);

      if (projects.length > 0) {
        localStorage.setItem("projects", JSON.stringify(projects));
      }

      const certs = certsRes.error ? [] : (certsRes.data || []);

      setStats({
        totalCertificates: certs.length,
        accessibleProjects: countAccessible(projects),
      });

      if (settingsRes.data) {
        const map = {};
        settingsRes.data.forEach(({ key, value }) => {
          map[key.replace("personalInfo_", "")] = value;
        });
        if (map.totalProjects !== undefined) {
          try { setManualTotalProjects(JSON.parse(map.totalProjects)); } catch { setManualTotalProjects(map.totalProjects); }
        }
        if (map.yearsExperience !== undefined) {
          try { setYearsExpValue(JSON.parse(map.yearsExperience)); } catch { setYearsExpValue(map.yearsExperience); }
        }
        if (map.showYearsExperience !== undefined) {
          setShowYearsExp(map.showYearsExperience === "true");
        }
        if (map.profileImage) setProfileImage(map.profileImage);
        if (map.fullName) setFullName(map.fullName);
        if (map.fullNameAr) setFullNameAr(map.fullNameAr);
        if (map.quote) setQuote(map.quote);
        if (map.quoteAr) setQuoteAr(map.quoteAr);
        cacheLocally({ profileImage: map.profileImage, fullName: map.fullName, fullNameAr: map.fullNameAr, quote: map.quote, quoteAr: map.quoteAr });
      } else {
        cacheLocally({});
      }
    };

    fetchAll();

    window.addEventListener('portfolioDataLoaded', fetchAll);
    window.addEventListener('storage', (e) => {
      if (e.key === "projects") {
        try { setStats(prev => ({ ...prev, accessibleProjects: countAccessible(JSON.parse(e.newValue)) })); } catch {}
      }
      if (e.key?.startsWith("personalInfo_")) {
        try {
          const key = e.key.replace("personalInfo_", "");
          if (key === "totalProjects") setManualTotalProjects(JSON.parse(e.newValue));
          if (key === "yearsExperience") setYearsExpValue(JSON.parse(e.newValue));
          if (key === "showYearsExperience") setShowYearsExp(e.newValue === "true");
          if (key === "profileImage") setProfileImage(e.newValue);
          if (key === "fullName") setFullName(e.newValue);
          if (key === "fullNameAr") setFullNameAr(e.newValue);
          if (key === "quote") setQuote(e.newValue);
          if (key === "quoteAr") setQuoteAr(e.newValue);
        } catch {}
      }
    });

    return () => {
      window.removeEventListener('portfolioDataLoaded', fetchAll);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { totalCertificates, accessibleProjects } = stats;

  useAOS({ once: false });

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshAOS, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Memoized stats data
  const statsData = useMemo(() => {
    const base = [
      {
        icon: Code,
        color: "from-[#6366f1] to-[#a855f7]",
        value: manualTotalProjects,
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
    ];
    if (showYearsExp) {
      base.splice(1, 0, {
        icon: Briefcase,
        color: "from-[#a855f7] to-[#6366f1]",
        value: yearsExpValue,
        label: t("about.yearsExperience"),
        description: t("about.yearsExperienceDescription"),
        animation: "fade-up",
      });
    }
    return base;
  }, [manualTotalProjects, totalCertificates, accessibleProjects, showYearsExp, yearsExpValue, t]);

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
                className="block mt-2 text-[var(--text-primary)] whitespace-nowrap"
                data-aos="fade-right"
                data-aos-duration="1300"
                itemProp="name"
              >
                {language === 'ar' && fullNameAr ? fullNameAr : (fullName || t("about.name"))}
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
        
        <blockquote className="text-[var(--text-secondary)] text-center lg:text-start italic font-medium text-sm relative z-10 ps-6 whitespace-pre-wrap">
          {language === 'ar' && quoteAr ? `"${quoteAr}"` : (quote ? `"${quote}"` : `"${t("about.quote")}"`)}
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

          <ProfileImage imageUrl={profileImage} />
        </div>

        <a href="#Portfolio">
          <div className={`grid grid-cols-1 ${showYearsExp ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6 mt-16 cursor-pointer`}>
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>

      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />

      <style>{`
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
