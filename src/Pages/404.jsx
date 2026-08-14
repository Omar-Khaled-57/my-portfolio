import React from "react";
import { Helmet } from "react-helmet-async";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";
import { useI18n } from "../i18n";

export default function NotFoundPage() {
  const { t, isRtl } = useI18n();
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <>
      <Helmet>
        <title>{t("notFound.metaTitle")}</title>
        <meta name="description" content={t("notFound.metaDescription")} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://omar-el-khouly.vercel.app/" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center px-4 py-16">
        <div className="text-center w-full max-w-md mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl font-bold mb-4 animate-bounce bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] mx-auto rounded-full"></div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4">
              {t("notFound.title")}
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              {t("notFound.description")}
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto glass-card rounded-full flex items-center justify-center mb-6">
              <FileQuestion size={40} strokeWidth={1.5} className="text-[var(--accent-primary)]" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--card-bg)] border border-primary text-[var(--text-primary)] rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-xl"
            >
              <ArrowLeft size={20} className={isRtl ? "rotate-180" : ""} />
              {t("notFound.back")}
            </button>

            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg"
            >
              <Home size={20} />
              {t("notFound.home")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
