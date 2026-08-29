import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Code2, Github, Globe, User } from 'lucide-react';
import { useI18n } from "../i18n";

const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 blur-2xl animate-float" />
  </div>
);

const IconButton = ({ Icon }) => (
  <div className="relative group hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300" />
    <div className="relative p-2 sm:p-3 bg-secondary backdrop-blur-sm rounded-full border border-primary">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
    </div>
  </div>
);

const SPLASH_DURATION_MS = 800;
const EXIT_DURATION_MS = 350;

const WelcomeScreen = ({ onLoadingComplete, heroReady }) => {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const finishedRef = useRef(false);

  const complete = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsLoading(false);
    setTimeout(() => onLoadingComplete?.(), EXIT_DURATION_MS);
  }, [onLoadingComplete]);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (minTimeElapsed && heroReady) complete();
  }, [minTimeElapsed, heroReady, complete]);

  useEffect(() => {
    const skip = () => {
      if (heroReady) complete();
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('scroll', skip, { passive: true });
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('scroll', skip);
    };
  }, [complete, heroReady]);

  return (
    <>
      <style>{`@keyframes welcome-fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div
        className={`fixed inset-0 bg-primary transition-opacity duration-[350ms] ease-in-out pointer-events-none ${
          isLoading ? "opacity-100 animate-[welcome-fade-in_0.4s_ease-out] pointer-events-auto" : "opacity-0"
        }`}
        onPointerDown={heroReady ? complete : undefined}
      >
        <BackgroundEffect />

        <div className="relative min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-4xl mx-auto">
            {/* Icons */}
            <div className="flex justify-center gap-3 sm:gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-12">
              {[Code2, User, Github].map((Icon, index) => (
                <div key={index}>
                  <IconButton Icon={Icon} />
                </div>
              ))}
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold space-y-2 sm:space-y-4">
                <div className="mb-2 sm:mb-4">
                  <span className="inline-block px-2 bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent py-2">
                    {t("welcome.one")}
                  </span>{' '}
                  <span className="inline-block px-2 bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent py-2">
                    {t("welcome.two")}
                  </span>{' '}
                  <span className="inline-block px-2 bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent py-2">
                    {t("welcome.three")}
                  </span>
                </div>
                <div>
                  <span className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent py-2">
                    {t("welcome.four")}
                  </span>{' '}
                  <span className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent py-2">
                    {t("welcome.five")}
                  </span>
                </div>
              </h1>
            </div>

            {/* Website Link */}
            <div className="text-center">
              <a
                href="https://omar-el-khouly.vercel.app"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full relative group hover:scale-105 transition-transform duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                <div className="relative flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    omar-el-khouly.vercel.app
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen;