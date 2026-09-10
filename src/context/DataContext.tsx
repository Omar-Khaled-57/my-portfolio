/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { supabase } from "../supabase";
import type {
  AppSetting,
  Certificate,
  DataContextValue,
  Project,
  SettingsKey,
  SocialLink,
  TechTool,
} from "../types";

const DataContext = createContext<DataContextValue | null>(null);

const DATA_FETCH_DELAY_MS = 600;

const readCache = <T,>(key: string, fallback: T): T => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? (JSON.parse(cached) as T) : fallback;
  } catch {
    return fallback;
  }
};

const SETTINGS_KEYS: SettingsKey[] = [
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

export function DataProvider({ children }: { children: ReactNode }) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[] | null>(() =>
    readCache<SocialLink[] | null>("personalInfo_socialLinks", null),
  );
  const [projects, setProjects] = useState<Project[]>(() => readCache<Project[]>("projects", []));
  const [certificates, setCertificates] = useState<Certificate[]>(() =>
    readCache<Certificate[]>("certificates", []),
  );
  const [techTools, setTechTools] = useState<TechTool[]>(() =>
    readCache<TechTool[]>("tech_tools", []),
  );
  const [appSettings, setAppSettings] = useState<Record<string, string>>(() =>
    readCache<Record<string, string>>("app_settings", {}),
  );

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
      const map: Record<string, string> = {};
      (settingsRes.data as AppSetting[]).forEach(({ key, value }) => {
        map[key] = value;
      });
      setAppSettings(map);
      localStorage.setItem("app_settings", JSON.stringify(map));
      if (map.personalInfo_socialLinks) {
        try {
          const parsed = JSON.parse(map.personalInfo_socialLinks) as SocialLink[];
          setSocialLinks(parsed);
          localStorage.setItem("personalInfo_socialLinks", JSON.stringify(parsed));
        } catch {
          /* keep cached value */
        }
      }
      SETTINGS_KEYS.forEach((key) => {
        if (map[key] !== undefined && key !== "personalInfo_socialLinks") {
          localStorage.setItem(key, map[key]);
        }
      });
    }

    if (!projectsRes.error && projectsRes.data) {
      const rows = projectsRes.data as unknown as Project[];
      setProjects(rows);
      localStorage.setItem("projects", JSON.stringify(rows));
    }

    if (!certsRes.error && certsRes.data) {
      const rows = certsRes.data as unknown as Certificate[];
      setCertificates(rows);
      localStorage.setItem("certificates", JSON.stringify(rows));
    }

    if (!toolsRes.error && toolsRes.data) {
      const rows = toolsRes.data as unknown as TechTool[];
      setTechTools(rows);
      localStorage.setItem("tech_tools", JSON.stringify(rows));
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

  const value: DataContextValue = {
    socialLinks,
    projects,
    certificates,
    techTools,
    appSettings,
    refetch: fetchData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useSharedData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useSharedData must be used within a DataProvider");
  }
  return context;
};