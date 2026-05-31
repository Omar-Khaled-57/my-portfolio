import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight, Github } from "lucide-react";
import { toSlug } from "../utils/slug";
import { useI18n } from "../i18n";

const CardProject = ({ img, title, title_ar, description, description_ar, link: ProjectLink, github, id }) => {
  const { t, language } = useI18n();
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      console.log("ProjectLink is empty");
      e.preventDefault();
      alert(t("project.liveDemoMissing"));
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      console.log("ID is empty");
      e.preventDefault();
      alert(t("project.detailsMissing"));
    }
  };

  return (
    <div className="group relative w-full h-full">
      <div className="relative overflow-hidden rounded-xl glass-card transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:-translate-y-2 border border-primary hover:border-accent-primary/50">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative p-5 z-10">
          <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-[inset_0_2px_15px_rgba(255,255,255,0.05)] bg-black/20 aspect-[16/8] group/img transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 z-10 pointer-events-none mix-blend-overlay"></div>
            {img && img !== 'null' ? (
              <img
                src={img}
                alt={title}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='%231e1e2f' width='800' height='400'/%3E%3Ctext fill='%236366f1' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${encodeURIComponent(title)}%3C/text%3E%3C/svg%3E`;
                }}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-[#1e1e2f] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
                <span className="text-[#6366f1] font-bold text-center px-4">{title}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>

          <div className="mt-6 space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h3 className="text-xl font-bold pb-2 pt-1 leading-relaxed bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent group-hover:from-accent-primary group-hover:to-accent-secondary transition-all duration-300">
              {language === 'ar' && title_ar ? title_ar : title}
            </h3>

            <p className="text-secondary text-sm leading-relaxed line-clamp-2 font-medium">
              {language === 'ar' && description_ar ? description_ar : description}
            </p>

            <div className="pt-4 flex items-center justify-between border-t border-primary/50">
              <div className="flex items-center gap-3">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors"
                    aria-label="GitHub Repository"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {ProjectLink && (
                  <a
                    href={ProjectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLiveDemo}
                    className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors duration-300 font-semibold text-sm group/link"
                  >
                    <span>{t("project.liveDemo")}</span>
                    <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>

              {id ? (
                <Link
                  to={`/project/${toSlug(title)}`}
                  onClick={handleDetails}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-primary hover:bg-accent-primary hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none shadow-sm hover:shadow-md"
                >
                  <span className="text-sm font-bold">{t("project.details")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-secondary/50 text-xs italic">
                  {t("project.detailsUnavailable")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
