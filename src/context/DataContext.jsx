import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [socialLinks, setSocialLinks] = useState(() => {
    try {
      const cached = localStorage.getItem("personalInfo_socialLinks");
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [projects, setProjects] = useState(() => {
    try {
      const cached = localStorage.getItem("projects");
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  const [certificates, setCertificates] = useState(() => {
    try {
      const cached = localStorage.getItem("certificates");
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });

  const fetchData = useCallback(async () => {
    const [socialRes, projectsRes, certsRes] = await Promise.all([
      supabase
        .from("app_settings")
        .select("value")
        .eq("key", "personalInfo_socialLinks")
        .single(),
      supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("id", { ascending: false }),
      supabase
        .from("certificates")
        .select("*")
        .order("id", { ascending: false }),
    ]);

    if (socialRes.data?.value) {
      try {
        const parsed = JSON.parse(socialRes.data.value);
        setSocialLinks(parsed);
        localStorage.setItem("personalInfo_socialLinks", JSON.stringify(parsed));
      } catch {}
    }

    if (!projectsRes.error && projectsRes.data) {
      setProjects(projectsRes.data);
      localStorage.setItem("projects", JSON.stringify(projectsRes.data));
    }

    if (!certsRes.error && certsRes.data) {
      setCertificates(certsRes.data);
      localStorage.setItem("certificates", JSON.stringify(certsRes.data));
    }

    window.dispatchEvent(new Event("portfolioDataLoaded"));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={{ socialLinks, projects, certificates, refetch: fetchData }}>
      {children}
    </DataContext.Provider>
  );
}

export const useSharedData = () => useContext(DataContext);
