import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  Mail,
  Lock,
  Unlock,
  ShieldOff,
  ShieldCheck,
  Inbox,
} from "lucide-react";
import { useI18n } from "../../i18n";
import Swal from "sweetalert2";

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500 pointer-events-none" />
    <div className="relative glass-card rounded-2xl h-full border border-primary strong-shadow">
      {children}
    </div>
  </div>
);

export default function Emails() {
  const { t } = useI18n();
  const [isFrozen, setIsFrozen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "emails_frozen")
      .single();

    if (data) {
      setIsFrozen(data.value === "true");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchState();
  }, []);

  const toggleFreeze = async () => {
    const newValue = !isFrozen;
    setIsFrozen(newValue); // optimistic update

    try {
      const { error } = await supabase
        .from("app_settings")
        .upsert(
          { key: "emails_frozen", value: newValue ? "true" : "false" },
          { onConflict: "key" }
        );

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: newValue
          ? t("dashboard.emailsFrozen")
          : t("dashboard.emailsUnfrozen"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      });
    } catch (err) {
      console.error(err);
      setIsFrozen(!newValue); // revert on failure
      Swal.fire({
        icon: "error",
        title: t("common.errorTitle"),
        text:
          err.message ||
          t("dashboard.updateSettingFailed"),
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl blur opacity-50 pointer-events-none" />
            <div className="relative w-9 h-9 bg-primary rounded-xl border border-primary flex items-center justify-center">
              <Mail className="w-4 h-4 text-accent-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              {t("dashboard.emailsTitle")}
            </h1>
            <p className="text-secondary text-xs">
              {t("dashboard.emailsSubtitle")}
            </p>
          </div>
        </div>

        {/* Freeze toggle button */}
        <button
          onClick={toggleFreeze}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            isFrozen
              ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20"
          }`}
        >
          {isFrozen ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isFrozen
              ? t("dashboard.emailsFrozen")
              : t("dashboard.freezeEmails")}
          </span>
        </button>
      </div>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Current status card */}
          <Card>
            <div className="p-6 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isFrozen
                    ? "bg-red-500/10 border border-red-500/20"
                    : "bg-emerald-500/10 border border-emerald-500/20"
                }`}
              >
                {isFrozen ? (
                  <ShieldOff className="w-6 h-6 text-red-400" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-secondary font-medium uppercase tracking-widest mb-1">
                  {t("dashboard.emailsStatus")}
                </p>
                <p
                  className={`text-lg font-bold ${
                    isFrozen ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {isFrozen
                    ? t("dashboard.emailsFrozen")
                    : t("dashboard.emailsAccepting")}
                </p>
              </div>
            </div>
          </Card>

          {/* Info card */}
          <Card>
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                <Inbox className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-secondary font-medium uppercase tracking-widest mb-1">
                  {t("dashboard.emailsInfoLabel")}
                </p>
                <p className="text-sm text-primary leading-relaxed">
                  {t("dashboard.emailsInfoText")}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* How it works panel */}
      <Card>
        <div className="p-6 space-y-3">
          <h2 className="text-sm font-bold text-primary flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent-primary" />
            {t("dashboard.emailsHowItWorks")}
          </h2>
          <ul className="space-y-2 text-sm text-secondary list-disc list-inside leading-relaxed">
            <li>{t("dashboard.emailsHint1")}</li>
            <li>{t("dashboard.emailsHint2")}</li>
            <li>{t("dashboard.emailsHint3")}</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
