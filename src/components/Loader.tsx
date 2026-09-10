import { useI18n } from "../i18n";

const ICONS = [
  "/tools/react.svg",
  "/tools/vite.svg",
  "/tools/kotlin.svg",
  "/tools/electron.svg",
  "/tools/supabase.svg",
  "/tools/postgres.svg",
  "/tools/nodejs.svg",
];

const STEP_MS = 10 / 7;

const Loader = () => {
  const { t } = useI18n();
  return (
    <div
      className="loader-board relative rotate-45"
      role="status"
      aria-label={t("common.loading")}
    >
      {ICONS.map((src, i) => (
        <div
          key={src}
          className="loader-square animate-square-walk"
          style={{ animationDelay: `${-STEP_MS * i}s` }}
        >
          <img
            src={src}
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
            decoding="async"
            className="w-6 h-6 object-contain rotate-[-45deg]"
          />
        </div>
      ))}
    </div>
  );
};

export default Loader;