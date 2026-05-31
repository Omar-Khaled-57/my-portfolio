/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "portfolio-theme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return window.localStorage.getItem(STORAGE_KEY) || "dark";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
    
    // Also update body background explicitly if needed for some browsers/mobile
    // document.body.style.backgroundColor = theme === "dark" ? "#030014" : "#f8fafc";
  }, [theme]);

  const value = useMemo(() => {
    const toggleTheme = () => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return {
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === "dark",
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
