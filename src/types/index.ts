import type { LucideIcon } from "lucide-react";
import type { ComponentType, CSSProperties, ReactNode } from "react";

export interface Project {
  id: string;
  title: string;
  title_ar: string | null;
  description: string;
  description_ar: string | null;
  img: string;
  tech_stack: string[];
  tech_ids: string[];
  features: string[];
  link: string | null;
  github: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export interface TechTool {
  id: string;
  name: string;
  type: "Main" | "Other";
  tags: string[];
  image: string;
  image_light: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  img: string;
  sort_order: number;
  created_at: string;
}

export interface PortfolioComment {
  id: string;
  user_name: string | null;
  profile_image: string | null;
  content: string | null;
  is_pinned: boolean;
  created_at: string;
}

export interface AppSetting {
  key: string;
  value: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export type SettingsKey =
  | "personalInfo_email"
  | "personalInfo_socialLinks"
  | "personalInfo_totalProjects"
  | "personalInfo_yearsExperience"
  | "personalInfo_showYearsExperience"
  | "personalInfo_profileImage"
  | "personalInfo_fullName"
  | "personalInfo_fullNameAr"
  | "personalInfo_quote"
  | "personalInfo_quoteAr"
  | "emails_frozen"
  | "comments_frozen";

export interface Orderable {
  id: string;
  created_at?: string;
  order_index?: number;
  sort_order?: number;
}

export type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

export type IconProp = LucideIcon | IconComponent;

export interface TranslationMap {
  [key: string]: string | string[];
}

export interface TFunction {
  (key: "home.words", params?: Record<string, string | number>): string[];
  (key: string, params?: Record<string, string | number>): string;
}

export interface I18nContextValue {
  language: "en" | "ar";
  direction: "rtl" | "ltr";
  isRtl: boolean;
  setLanguage: (next: "en" | "ar") => void;
  toggleLanguage: () => void;
  t: TFunction;
}

export interface ThemeContextValue {
  theme: "dark" | "light";
  setTheme: (next: "dark" | "light") => void;
  toggleTheme: () => void;
  isDark: boolean;
}

export interface DataContextValue {
  socialLinks: SocialLink[] | null;
  projects: Project[];
  certificates: Certificate[];
  techTools: TechTool[];
  appSettings: Record<string, string> | null;
  refetch: () => Promise<void>;
}

export interface ProjectFormData {
  Title: string;
  TitleAr: string;
  Description: string;
  DescriptionAr: string;
  TechStack: string;
  TechIds: string;
  Features: string;
  Link: string;
  Github: string;
}

export interface ToolFormData {
  name: string;
  type: string;
  tags: string;
}

export interface CommentSubmitPayload {
  newComment: string;
  userName: string;
  imageFile: File | null;
}

export type ChildrenProp = { children: ReactNode };

export const errMessage = (error: unknown, fallback = "Something went wrong"): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return fallback;
};