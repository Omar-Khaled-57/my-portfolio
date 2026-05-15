import { useEffect } from "react";
import {
  Linkedin,
  Github,
  Instagram,
  Youtube,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import PresenceWidget from "./PresenceWidget";
import { useI18n } from "../i18n";

const socialLinks = [
  {
    name: "LinkedIn",
    displayName: "Let's Connect",
    subText: "on LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/in/omar-khaled-el-khouly-0a0690313/",
    color: "#0A66C2",
    gradient: "from-[#0A66C2] to-[#0077B5]",
    isPrimary: true,
  },
  {
    name: "GitHub",
    displayName: "Github",
    subText: "@Omar-Khaled-57",
    icon: Github,
    url: "https://github.com/Omar-Khaled-57",
    color: "#ffffff",
    gradient: "from-[#333] to-[#24292e]",
  },
  {
    name: "WhatsApp",
    displayName: "WhatsApp",
    subText: "+20 112 302 9406",
    icon: MessageCircle,
    url: "https://wa.me/201123029406",
    color: "#25D366",
    gradient: "from-[#25D366] to-[#128C7E]",
  },
];

const SocialLinks = () => {
  const { t } = useI18n();
  const linkedIn = socialLinks.find((link) => link.isPrimary);
  const otherLinks = socialLinks.filter((link) => !link.isPrimary);

  useEffect(() => {
    AOS.init({
      offset: 10,
     
    });
  }, []);

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
        {/* LinkedIn - Primary Row */}
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
            {/* Hover Gradient Background */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                         bg-gradient-to-r ${linkedIn.gradient}`}
            />

            {/* Content Container */}
            <div className="relative flex items-center gap-4">
              {/* Icon Container */}
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

              {/* Text Container */}
              <div className="flex flex-col">
                <span className="text-lg font-bold pt-[0.2rem] text-primary tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                  {t("social.linkedinCta")}
                </span>
                <span className="text-sm text-secondary group-hover:text-secondary transition-colors duration-300">
                  {t("social.linkedinSubText")}
                </span>
              </div>
            </div>

            {/* External Link */}
            <ExternalLink
              className="relative w-5 h-5 text-gray-500 group-hover:text-white
                         opacity-0 group-hover:opacity-100 transition-all duration-300
                         transform group-hover:translate-x-0 -translate-x-1 rtl:translate-x-1"
            />

            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              />
            </div>
          </a>
        )}

        {/* Other Links Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherLinks.map((link, index) => (
            <a
              key={link.name}
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

              <div className="relative flex items-center justify-center">
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

              {/* Text Container */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-primary group-hover:text-primary transition-colors duration-300">
                  {link.displayName}
                </span>
                <span className="text-xs text-secondary truncate group-hover:text-secondary transition-colors duration-300">
                  {link.subText}
                </span>
              </div>

              <ExternalLink
            className="w-4 h-4 text-gray-500 group-hover:text-white ms-auto
                                       opacity-0 group-hover:opacity-100 transition-all duration-300
                                       transform group-hover:translate-x-0 -translate-x-2 rtl:translate-x-2"
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
