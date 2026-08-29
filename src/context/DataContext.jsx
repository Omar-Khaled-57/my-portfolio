/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";

const DataContext = createContext(null);

const DATA_FETCH_DELAY_MS = 600;

const readCache = (key, fallback) => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : fallback;
  } catch { return fallback; }
};

const SETTINGS_KEYS = [
  "personalInfo_email",
  "personalInfo_socialLinks",
  "personalInfo_totalProjects",
  "personalInfo_yearsExperience",
  "personalInfo_showYearsExperience",
  "personalInfo_profileImage",
  "personalInfo_fullName",
  "personalInfo_fullNameAr",
  "personalInfo_quote",
  "personalInfo_quoteAr",
  "emails_frozen",
  "comments_frozen",
];

export function DataProvider({ children }) {
  const [socialLinks, setSocialLinks] = useState(() => readCache("personalInfo_socialLinks", null));
  const [projects, setProjects] = useState(() => readCache("projects", []));
  const [certificates, setCertificates] = useState(() => readCache("certificates", []));
  const [techTools, setTechTools] = useState(() => readCache("tech_tools", []));
  const [appSettings, setAppSettings] = useState(() => readCache("app_settings", {}));

  const fetchData = useCallback(async () => {
    const [settingsRes, projectsRes, certsRes, toolsRes] = await Promise.all([
      supabase
        .from("app_settings")
        .select("key, value")
        .in("key", SETTINGS_KEYS),
      supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("certificates")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("tech_tools")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    if (settingsRes.data) {
      const map = {};
      settingsRes.data.forEach(({ key, value }) => {
        map[key] = value;
      });
      setAppSettings(map);
      localStorage.setItem("app_settings", JSON.stringify(map));
      if (map.personalInfo_socialLinks) {
        try {
          const parsed = JSON.parse(map.personalInfo_socialLinks);
          setSocialLinks(parsed);
          localStorage.setItem("personalInfo_socialLinks", JSON.stringify(parsed));
        } catch {}
      }
      SETTINGS_KEYS.forEach((key) => {
        if (map[key] !== undefined && key !== "personalInfo_socialLinks") {
          localStorage.setItem(key, map[key]);
        }
      });
    }

    if (!projectsRes.error && projectsRes.data) {
      setProjects(projectsRes.data);
      localStorage.setItem("projects", JSON.stringify(projectsRes.data));
    }

    if (!certsRes.error && certsRes.data) {
      setCertificates(certsRes.data);
      localStorage.setItem("certificates", JSON.stringify(certsRes.data));
    }

    if (!toolsRes.error && toolsRes.data) {
      setTechTools(toolsRes.data);
      localStorage.setItem("tech_tools", JSON.stringify(toolsRes.data));
    }

    window.dispatchEvent(new Event("portfolioDataLoaded"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) fetchData();
    }, DATA_FETCH_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fetchData]);

  return (
    <DataContext.Provider value={{ socialLinks, projects, certificates, techTools, appSettings, refetch: fetchData }}>
      {children}
    </DataContext.Provider>
  );
}

export const useSharedData = () => useContext(DataContext);