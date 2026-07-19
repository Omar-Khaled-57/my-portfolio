import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useSharedData } from "../context/DataContext";

const Footer = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { socialLinks } = useSharedData();
  const currentYear = new Date().getFullYear();
  const githubUrl = socialLinks?.find((s) => s.platform === "GitHub")?.url || "https://github.com/Omar-Khaled-57";
  const [portrait, setPortrait] = useState(false);
  const starClicks = useRef(0);
  const starTimer = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const handler = (e) => setPortrait(e.matches);
    setPortrait(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleStarClick = useCallback(() => {
    starClicks.current += 1;
    if (starClicks.current === 3) {
      starClicks.current = 0;
      clearTimeout(starTimer.current);
      navigate("/dashboard");
      return;
    }
    clearTimeout(starTimer.current);
    starTimer.current = setTimeout(() => { starClicks.current = 0; }, 1000);
  }, [navigate]);

  return (
    <footer className="px-[5%] lg:px-[10%]">
      <hr className="my-3 border-primary opacity-15 lg:my-6" />
      <p className="text-sm pb-4 text-secondary text-center">
        © {currentYear}{" "}
        <a href={githubUrl} className="hover:underline">
          {t("footer.authorName", { name: "Omar Khaled" })}
        </a>
        . {t("footer.rights")}
        {portrait && (
          <button
            onClick={handleStarClick}
            className="inline-flex items-center justify-center ms-1 w-5 h-5 text-xs text-secondary/40 hover:text-accent-primary transition-colors align-middle"
            title=""
          >
            ★
          </button>
        )}
      </p>
    </footer>
  );
};

export default Footer;
