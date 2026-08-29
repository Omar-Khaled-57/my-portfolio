import { ImageIcon } from "lucide-react";
import { useI18n } from "../../i18n";

const DashboardImageUpload = ({ label, hint, preview, onChange, aspect = "wide" }) => {
  const { t } = useI18n();

  return (
  <div className="space-y-1.5">
    <label className="text-xs text-accent-primary uppercase tracking-wider font-semibold">
      {label}
    </label>
    <label className="flex items-center gap-4 w-full bg-secondary border border-dashed border-primary rounded-xl px-4 py-4 cursor-pointer hover:border-accent-primary/40 hover:bg-primary/5 transition-all">
      {preview ? (
        <img
          src={preview}
          alt="preview"
          className={
            aspect === "square"
              ? "h-16 w-16 object-contain rounded-lg border border-primary bg-white/10 p-1 shrink-0"
              : "h-16 w-24 object-cover rounded-lg border border-primary shrink-0"
          }
        />
      ) : (
        <div
          className={
            aspect === "square"
              ? "h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary shrink-0"
              : "h-16 w-24 rounded-lg bg-primary/10 flex items-center justify-center border border-primary shrink-0"
          }
        >
          <ImageIcon className="w-5 h-5 text-secondary" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-primary">
          {preview ? t("dashboard.changeImage") : t("dashboard.uploadImage")}
        </p>
        <p className="text-xs text-secondary mt-0.5">{t("dashboard.imageSupport")}</p>
        {hint && <p className="text-[11px] text-secondary/70 mt-1 leading-snug">{hint}</p>}
      </div>
      <input type="file" accept="image/*" onChange={onChange} className="hidden" />
    </label>
  </div>
  );
};

export default DashboardImageUpload;