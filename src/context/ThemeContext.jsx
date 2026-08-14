/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "portfolio-theme";

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return getSystemTheme();
};

const hasSavedTheme = () => {
  if (typeof window === "undefined") return false;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "dark" || saved === "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#030014" : "#f8fafc");
    }
  }, [theme]);

  // Persist only when the user explicitly chooses a theme.
  const handleSetTheme = useCallback((next) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }, [theme]);

  // Follow the OS theme while the user hasn't chosen one explicitly.
  useEffect(() => {
    if (!window.matchMedia) return;

    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (event) => {
      if (!hasSavedTheme()) {
        setTheme(event.matches ? "light" : "dark");
      }
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: handleSetTheme,
      toggleTheme,
      isDark: theme === "dark",
    }),
    [theme, handleSetTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
