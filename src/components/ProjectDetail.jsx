import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Star,
  ChevronRight,
  Layers,
  Layout,
  Globe,
  Package,
  Cpu,
  Code,
  Sun,
  Moon,
  Languages,
} from "lucide-react";
import Swal from "sweetalert2";
import { toSlug } from "../utils/slug";
import { useI18n } from "../i18n";
import { useTheme } from "../context/ThemeContext";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 rounded-xl cursor-default transition-all duration-300 hover:scale-105 hover:shadow-accent-primary/10 border border-primary"
      style={{
        background: 'rgba(var(--color-accent-primary-rgb, 99 102 241) / 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Glassmorphic shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/0 to-accent-secondary/0 group-hover:from-accent-primary/15 group-hover:to-accent-secondary/15 transition-all duration-500 rounded-xl" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%)' }}
      />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent-primary transition-colors" />
        <span className="text-xs md:text-sm font-medium text-secondary group-hover:text-primary transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group/feature relative flex items-start gap-3 p-2.5 md:p-3.5 rounded-xl transition-all duration-500 ease-out border border-primary hover:scale-[1.05] hover:shadow-md hover:shadow-accent-primary/10 overflow-hidden"
      style={{
        '--hover-bg': 'rgba(99,102,241,0.07)',
      }}
    >
      {/* Glassmorphic background */}
      <div className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.03) 100%)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Sheen Animation - isolated to this feature tag */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover/feature:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />

      <div className="relative mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-full blur opacity-100 transition-opacity duration-300" />
        <div className="relative w-1.5 h-1.5 md:w-2 h-2 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary group-hover/feature:scale-125 transition-transform duration-300" />
      </div>
      <span className="relative text-sm md:text-base text-primary transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project, t }) => {
  const techStackCount = project?.tech_stack?.length || 0;
  const featuresCount = project?.features?.length || 0;

  const StatItem = ({ icon: Icon, value, label, color }) => {
    const glowColor = color.includes('6366f1') ? 'rgba(99,102,241,0.3)' : 'rgba(168,85,247,0.3)';
    const passiveGlow = color.includes('6366f1') ? 'rgba(99,102,241,0.1)' : 'rgba(168,85,247,0.1)';
    
    return (
      <div className="relative group h-full">
        <div 
          className="relative z-10 glass-card rounded-2xl p-3 md:p-4 transition-all duration-300 hover:scale-105 h-full flex flex-col justify-between overflow-hidden shadow-lg border border-primary"
          style={{
            '--hover-shadow': glowColor,
            '--passive-shadow': passiveGlow
          }}
        >
          <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
          
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-primary/10 transition-transform group-hover:rotate-6">
              <Icon className="w-4 h-4 md:w-6 md:h-6 text-[var(--text-primary)]" />
            </div>
            <span className="text-xl md:text-3xl font-bold text-[var(--text-primary)]">
              {value}
            </span>
          </div>

          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              {label}
            </p>
          </div>
        </div>

        <style jsx>{`
          .glass-card {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 10px var(--passive-shadow);
          }
          .group:hover .glass-card {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 20px var(--hover-shadow);
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 my-6">
      <StatItem 
        icon={Code2} 
        value={techStackCount} 
        label={t("project.totalTechnologies")} 
        color="from-[#6366f1] to-[#a855f7]"
      />
      <StatItem 
        icon={Layers} 
        value={featuresCount} 
        label={t("project.keyFeatureCount")} 
        color="from-[#a855f7] to-[#6366f1]"
      />
    </div>
  );
};

const handleGithubClick = (githubLink, t) => {
  if (githubLink === "Private") {
    Swal.fire({
      icon: "info",
      title: t("project.privateTitle"),
      text: t("project.privateText"),
      confirmButtonText: t("project.privateConfirm"),
      confirmButtonColor: "#3085d6",
      background: "#030014",
      color: "#ffffff",
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { t, toggleLanguage, language } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    // Cari project berdasarkan slug yang di-generate dari title
    const selectedProject = storedProjects.find(
      (p) => toSlug(p.title) === slug,
    );

    if (selectedProject) {
      const enhancedProject = {
        ...selectedProject,
        features: selectedProject.features || [],
        tech_stack: selectedProject.tech_stack || [],
        github: selectedProject.github || "https://github.com/Omar-Khaled-57",
      };
      setProject(enhancedProject);
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-primary">
            {t("project.loading")}
          </h2>
        </div>
      </div>
    );
  }

  const projectUrl = `https://github.com/Omar-Khaled-57/project/${toSlug(project.title)}`;

  return (
    <>
      <Helmet>
        <title>{project.title} — Omar Khaled El-Khouly</title>
        <meta
          name="description"
          content={
            project.description
              ? project.description.slice(0, 155)
              : `Project ${project.title} oleh Omar Khaled El-Khouly — Frontend Web Developer.`
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={projectUrl} />
        <meta
          property="og:title"
          content={`${project.title} — Omar Khaled El-Khouly`}
        />
        <meta
          property="og:description"
          content={project.description?.slice(0, 155)}
        />
        <meta property="og:url" content={projectUrl} />
        <meta property="og:type" content="website" />
        {project.img && <meta property="og:image" content={project.img} />}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": "${project.title}",
            "description": "${project.description?.replace(/"/g, '\\"')}",
            "url": "${projectUrl}",
            "author": {
              "@type": "Person",
              "name": "Omar Khaled El-Khouly",
              "url": "https://github.com/Omar-Khaled-57"
            }
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-primary px-[2%] sm:px-0 relative overflow-hidden transition-colors duration-300">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -inset-[10px] opacity-[var(--blob-opacity)]">
            <div className="absolute top-0 -start-4 w-72 md:w-96 h-72 md:h-96 bg-accent-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-0 -end-4 w-72 md:w-96 h-72 md:h-96 bg-accent-primary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          </div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12 animate-fadeIn">
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="group inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-secondary border border-primary text-secondary hover:text-primary hover:bg-secondary/80 transition-all duration-300 text-sm md:text-base shadow-sm rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
                  <span>{t("common.back")}</span>
                </button>
                <div className="flex items-center gap-1 md:gap-2 text-sm md:text-base text-secondary">
                  <span>{t("portfolio.projects")}</span>
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-primary font-medium truncate">{project.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="p-2.5 rounded-xl bg-secondary border border-primary text-secondary hover:text-primary hover:bg-secondary/80 transition-all duration-300 shadow-sm"
                  title={t("language.label")}
                >
                  <Languages className="w-5 h-5" />
                  <span className="sr-only">{language === "en" ? "AR" : "EN"}</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-secondary border border-primary text-secondary hover:text-primary hover:bg-secondary/80 transition-all duration-300 shadow-sm"
                  title="Toggle Theme"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
              <div className="space-y-6 md:space-y-10 animate-slideInLeft">
                <div className="space-y-4 md:space-y-6">
                  <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent leading-tight">
                    {project.title}
                  </h1>
                  <div className="relative h-1.5 w-16 md:w-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur-sm" />
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-base md:text-lg text-secondary leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <ProjectStats project={project} t={t} />

                <div className="flex flex-wrap gap-3 md:gap-4">
                  {/* Live Demo button — glassmorphic */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-1.5 md:gap-2 px-4 md:px-8 py-2.5 md:py-4 rounded-xl transition-all duration-300 overflow-hidden text-sm md:text-base shadow-lg hover:scale-105 border border-primary"
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    {/* Ambient Glow background */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                    
                    {/* Hover shimmer fill */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 group-hover:from-accent-primary/20 group-hover:to-accent-secondary/20 transition-all duration-500 rounded-xl" />
                    <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">{t("project.liveDemo")}</span>
                  </a>

                  {/* GitHub button — glassmorphic */}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-1.5 md:gap-2 px-4 md:px-8 py-2.5 md:py-4 rounded-xl transition-all duration-300 overflow-hidden text-sm md:text-base shadow-lg hover:scale-105 border border-primary"
                    style={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      color: 'var(--accent-secondary)',
                    }}
                    onClick={(e) =>
                      !handleGithubClick(project.github, t) && e.preventDefault()
                    }
                  >
                    {/* Ambient Glow background */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-secondary/20 to-accent-primary/20 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />

                    {/* Hover shimmer fill */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-secondary/10 to-accent-primary/10 group-hover:from-accent-secondary/20 group-hover:to-accent-primary/20 transition-all duration-500 rounded-xl" />
                    <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">Github</span>
                  </a>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold text-primary mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                    <Code2 className="w-4 h-4 md:w-5 md:h-5 text-accent-primary" />
                    {t("project.technologiesUsed")}
                  </h3>
                  {project.tech_stack.length > 0 ? (
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {project.tech_stack.map((tech, index) => (
                        <TechBadge key={index} tech={tech} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-secondary/60 font-medium italic">
                      {t("project.noTechnologies")}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6 md:space-y-10 animate-slideInRight">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group transition-all duration-500 hover:shadow-accent-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-110"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-accent-primary/20 transition-colors duration-300 rounded-2xl" />
                </div>

                <div className="bg-secondary/30 backdrop-blur-xl rounded-2xl p-6 md:p-8 space-y-6 transition-all duration-300 group shadow-lg border border-primary">
                  <h3 className="text-xl font-semibold text-primary flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                    {t("project.keyFeatures")}
                  </h3>
                  {project.features.length > 0 ? (
                    <ul className="list-none space-y-3">
                      {project.features.map((feature, index) => (
                        <FeatureItem key={index} feature={feature} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-secondary/60 font-medium italic">
                      {t("project.noFeatures")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 10s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-fadeIn {
            animation: fadeIn 0.7s ease-out;
          }
          .animate-slideInLeft {
            animation: slideInLeft 0.7s ease-out;
          }
          .animate-slideInRight {
            animation: slideInRight 0.7s ease-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default ProjectDetails;
