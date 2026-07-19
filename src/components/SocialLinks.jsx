import { useEffect, useState } from "react";
import {
  Linkedin,
  Github,
  Instagram,
  Youtube,
  ExternalLink,
  Globe,
} from "lucide-react";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import useAOS from "../hooks/useAOS";
import { useI18n } from "../i18n";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../supabase";

const platformMeta = {
  LinkedIn: { icon: Linkedin, color: "#0A66C2", gradient: "from-[#0A66C2] to-[#0077B5]", isPrimary: true },
  GitHub: { icon: Github, color: "#333", gradient: "from-[#333] to-[#24292e]" },
  WhatsApp: { icon: WhatsAppIcon, color: "#25D366", gradient: "from-[#25D366] to-[#128C7E]" },
  Instagram: { icon: Instagram, color: "#E4405F", gradient: "from-[#E4405F] to-[#833AB4]" },
  YouTube: { icon: Youtube, color: "#FF0000", gradient: "from-[#FF0000] to-[#cc0000]" },
};

const defaults = [
  { platform: "LinkedIn", url: "https://linkedin.com/in/omar-khaled-el-khouly-0a0690313/" },
  { platform: "GitHub", url: "https://github.com/Omar-Khaled-57" },
  { platform: "WhatsApp", url: "https://wa.me/201123029406" },
];

const platformShortLabel = {
  LinkedIn: "linkedin.com/in/omar...",
  GitHub: "github.com/Omar-Khaled-57",
  WhatsApp: "wa.me/201123029406",
};

const SocialLinks = () => {
  const { t } = useI18n();
  const { theme: currentTheme } = useTheme();
  const [socialLinks, setSocialLinks] = useState(defaults);

  const ghColor = currentTheme === "dark" ? "#f0f0f0" : "#333";

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "personalInfo_socialLinks")
        .single();

      if (data?.value) {
        try {
          const parsed = JSON.parse(data.value);
          if (parsed.length > 0) setSocialLinks(parsed);
        } catch {}
      }
    };
    fetchLinks();
  }, []);

  const linksWithMeta = socialLinks.map((link) => {
    const meta = platformMeta[link.platform] || { icon: Globe, color: "#888", gradient: "from-[#666] to-[#444]" };
    if (link.platform === "GitHub") meta.color = ghColor;
    return { ...link, ...meta };
  });

  const linkedIn = linksWithMeta.find((link) => link.isPrimary);
  const otherLinks = linksWithMeta.filter((link) => !link.isPrimary);

  useAOS({ offset: 10 });

  return (
    <div className="w-full glass-card rounded-2xl p-6 py-8">
      <h3
        className="text-xl font-semibold text-primary mb-6 flex items-center gap-2"
        data-aos="fade-down" 
      >
        <span className="inline-block w-8 h-1 bg-indigo-500 rounded-full"></span>
        {t("social.title")}
      </h3>

      <div className="flex flex-col gap-4">
        {linkedIn && (
          <a
            href={linkedIn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between p-4 rounded-lg 
                       bg-secondary border border-primary overflow-hidden
                       hover:border-accent-primary/20 transition-all duration-500 shadow-md hover:shadow-xl strong-shadow"
            data-aos="fade-up"
            data-aos-delay="100" 
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                         bg-gradient-to-r ${linkedIn.gradient}`}
            />

            <div className="relative flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20 rounded-md transition-all duration-500
                                 group-hover:scale-110 group-hover:opacity-30"
                  style={{ backgroundColor: linkedIn.color }}
                />
                <div className="relative p-2 rounded-md">
                  <linkedIn.icon
                    className="w-6 h-6 transition-all duration-500 group-hover:scale-105"
                    style={{ color: linkedIn.color }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-bold pt-[0.2rem] text-primary tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                  {t("social.linkedinCta")}
                </span>
                <span className="text-sm text-secondary group-hover:text-secondary transition-colors duration-300">
                  {t("social.linkedinSubText")}
                </span>
              </div>
            </div>

            <ExternalLink
              className="relative w-5 h-5 text-gray-500 shrink-0 transition-colors duration-300"
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              />
            </div>
          </a>
        )}

        <div className="flex flex-col gap-4">
          {otherLinks.map((link, index) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 p-4 rounded-xl 
                               bg-secondary border border-primary overflow-hidden
                               hover:border-accent-primary/20 transition-all duration-500 shadow-md hover:shadow-xl strong-shadow"
              data-aos="fade-up" 
              data-aos-delay={200 + index * 100} 
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                                     bg-gradient-to-r ${link.gradient}`}
              />

              <div className="relative flex items-center justify-center shrink-0">
                <div
                  className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500
                                       group-hover:scale-125 group-hover:opacity-30"
                  style={{ backgroundColor: link.color }}
                />
                <div className="relative p-2 rounded-lg">
                  <link.icon
                    className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
                    style={{ color: link.color }}
                  />
                </div>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-primary group-hover:text-primary transition-colors duration-300">
                  {link.platform}
                </span>
                <span className="text-xs text-secondary truncate group-hover:text-secondary transition-colors duration-300">
                  {platformShortLabel[link.platform] || link.url}
                </span>
              </div>

              <ExternalLink
            className="w-5 h-5 text-gray-500 shrink-0 transition-colors duration-300"
              />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                />
              </div>
            </a>
          ))}
        </div>
  
      </div>
    </div>
  );
};

export default SocialLinks;
