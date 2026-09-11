import { useEffect, useState, useMemo, useCallback } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "../../supabase";
import {
  Plus,
  Trash2,
  Upload,
  FolderGit2,
  X,
  ExternalLink,
  Github,
  Pencil,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Check,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { useSharedData } from "../../context/DataContext";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import { getToolImage } from "../../utils/techTools";
import { useDragOrder } from "../../hooks/useDragOrder";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardModal from "../../components/dashboard/DashboardModal";
import DashboardInput from "../../components/dashboard/DashboardInput";
import DashboardImageUpload from "../../components/dashboard/DashboardImageUpload";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import DragGrid from "../../components/dashboard/DragGrid";
import Swal from "sweetalert2";
import type { Project, ProjectFormData, TechTool } from "../../types";
import { errMessage } from "../../types";

const parseIds = (str: string): string[] =>
  [...new Set((str || "").split(",").map((s) => s.trim()).filter(Boolean))];

const ProjectCard = ({
  project,
  index,
  total,
  onDelete,
  onEdit,
  onTogglePublish,
  onMove,
}: {
  project: Project;
  index: number;
  total: number;
  onDelete: (id: string) => void;
  onEdit: (project: Project) => void;
  onTogglePublish: (project: Project) => void;
  onMove: (targetIndex: number) => void;
}) => {
  const { t } = useI18n();
  const [imgLoaded, setImgLoaded] = useState(false);
  const isHidden = project.is_published === false;

  return (
    <DashboardCard>
      <div className="p-4 flex flex-col h-full">
        {project.img && (
          <div className="w-full aspect-[16/8] rounded-xl mb-4 relative overflow-hidden border border-primary bg-black/20 group/img">
            {!imgLoaded && (
              <div className="w-full h-full animate-pulse bg-primary/20" />
            )}
            <img
              src={project.img}
              alt={project.title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}`}
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-primary text-sm">
            {project.title}
          </h3>
          {isHidden && (
            <span className="px-2 py-0.5 rounded-md bg-yellow-500/15 text-yellow-400 text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20">
              {t("dashboard.hidden")}
            </span>
          )}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => onMove(index - 1)}
              disabled={index === 0}
              aria-label={t("dashboard.toolMoveUp")}
              title={t("dashboard.toolMoveUp")}
              className="p-1 rounded-lg border border-primary text-primary/50 hover:text-primary hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => onMove(index + 1)}
              disabled={index === total - 1}
              aria-label={t("dashboard.toolMoveDown")}
              title={t("dashboard.toolMoveDown")}
              className="p-1 rounded-lg border border-primary text-primary/50 hover:text-primary hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </div>
        {project.description && (
          <p className="text-primary/80 text-xs mb-3 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech_stack.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-primary/20 text-primary/70 text-[10px] font-medium border border-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-primary">
          <div className="flex gap-2">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("project.liveDemo")}
                title={t("project.liveDemo")}
                className="p-1.5 rounded-lg border border-primary text-primary/60 hover:text-primary hover:border-white/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("project.githubRepoLabel")}
                title={t("project.githubRepoLabel")}
                className="p-1.5 rounded-lg border border-primary text-primary/60 hover:text-primary hover:border-white/20 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onTogglePublish(project)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                isHidden
                  ? "border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10"
                  : "border-amber-500/25 text-amber-400 hover:bg-amber-500/10"
              }`}
              aria-label={isHidden ? t("dashboard.revealProject") : t("dashboard.hideProject")}
            >
              {isHidden ? (
                <><Eye className="w-3 h-3" /> {t("dashboard.reveal")}</>
              ) : (
                <><EyeOff className="w-3 h-3" /> {t("dashboard.hide")}</>
              )}
            </button>
            <button
              onClick={() => onEdit(project)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/10 text-xs transition-colors"
            >
              <Pencil className="w-3 h-3" /> {t("common.edit")}
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition-colors"
            >
              <Trash2 className="w-3 h-3" /> {t("common.delete")}
            </button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

const ProjectForm = ({
  initial,
  tools,
  onSubmit,
  onCancel,
  submitLabel,
  uploading,
}: {
  initial?: Project | null;
  tools: TechTool[];
  onSubmit: (form: ProjectFormData, file: File | null) => void;
  onCancel: () => void;
  submitLabel: string;
  uploading: boolean;
}) => {
  const { t } = useI18n();
  const { theme } = useCustomTheme();
  const toolById = useMemo(() => new Map((tools || []).map((tool) => [tool.id, tool])), [tools]);

  const [form, setForm] = useState<ProjectFormData>({
    Title: initial?.title || "",
    TitleAr: initial?.title_ar || "",
    Description: initial?.description || "",
    DescriptionAr: initial?.description_ar || "",
    TechStack: initial?.tech_stack ? initial.tech_stack.join(", ") : "",
    TechIds: initial?.tech_ids ? initial.tech_ids.join(", ") : "",
    Features: initial?.features ? initial.features.join(", ") : "",
    Link: initial?.link || "",
    Github: initial?.github || "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.img || null);

  const set =
    (key: keyof ProjectFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const typedIds = useMemo(() => parseIds(form.TechIds), [form.TechIds]);

  const toggleId = (id: string) => {
    const next = new Set(typedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setForm((f) => ({ ...f, TechIds: [...next].join(", ") }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, file);
      }}
      className="p-5 sm:p-6 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <DashboardInput
            label={t("dashboard.projectTitle") || "Project Title"}
            value={form.Title}
            onChange={set("Title")}
            placeholder={t("dashboard.projectTitlePlaceholder") || "Enter project title"}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <DashboardInput
            label={(t("dashboard.projectTitle") || "Project Title") + t("common.arabicSuffix")}
            value={form.TitleAr}
            onChange={set("TitleAr")}
            placeholder={t("dashboard.titleArPlaceholder")}
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-accent-primary uppercase tracking-wider font-semibold">
            {t("dashboard.description") || "Description"}
          </label>
          <textarea
            value={form.Description}
            onChange={set("Description")}
            placeholder={t("dashboard.descriptionPlaceholder") || "Project description"}
            rows={3}
            className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all resize-none"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-accent-primary uppercase tracking-wider font-semibold">
            {(t("dashboard.description") || "Description") + t("common.arabicSuffix")}
          </label>
          <textarea
            value={form.DescriptionAr}
            onChange={set("DescriptionAr")}
            placeholder={t("dashboard.descriptionArPlaceholder")}
            rows={3}
            className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all resize-none"
            dir="rtl"
          />
        </div>

        <DashboardInput
          label={t("dashboard.techStackInput")}
          value={form.TechStack}
          onChange={set("TechStack")}
          placeholder={t("dashboard.techStackPlaceholder")}
        />
        <DashboardInput
          label={t("dashboard.featuresInput")}
          value={form.Features}
          onChange={set("Features")}
          placeholder={t("dashboard.featuresPlaceholder")}
        />

        <div className="sm:col-span-2 space-y-2">
          <label className="block">
            <span className="text-xs text-accent-primary uppercase tracking-wider font-semibold">
              {t("dashboard.techIdsInput")}
            </span>
          </label>

          <div className="flex flex-wrap gap-1.5">
            {typedIds.map((id) => {
              const tool = toolById.get(id);
              return tool ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/20 border border-primary text-[11px] text-primary font-medium"
                >
                  <img src={getToolImage(tool, theme)} alt="" className="w-4 h-4 object-contain" />
                  {tool.name}
                  <button type="button" onClick={() => toggleId(id)} className="text-secondary hover:text-primary">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  {id} <span className="text-red-400/70">({t("dashboard.techIdsUnknown")})</span>
                  <button type="button" onClick={() => toggleId(id)} className="text-red-400/60 hover:text-red-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>

          {(tools || []).length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 pt-1">
              {(tools || [])
                .slice()
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((tool) => {
                  const active = typedIds.includes(tool.id);
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => toggleId(tool.id)}
                      aria-pressed={active}
                      title={tool.name}
                      className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border text-[10px] font-medium transition-colors ${
                        active
                          ? "border-accent-primary/60 bg-accent-primary/15 text-primary"
                          : "border-primary bg-primary/10 text-secondary hover:border-white/20"
                      }`}
                    >
                      {active && (
                        <span className="absolute top-0.5 end-0.5 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-accent-primary text-white">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                      <img src={getToolImage(tool, theme)} alt="" className="w-7 h-7 object-contain" />
                      <span className="w-full truncate text-center leading-tight">{tool.name}</span>
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        <DashboardInput
          label={t("dashboard.liveUrl")}
          value={form.Link}
          onChange={set("Link")}
          placeholder={t("dashboard.liveUrlPlaceholder")}
        />
        <DashboardInput
          label={t("dashboard.githubUrl")}
          value={form.Github}
          onChange={set("Github")}
          placeholder={t("dashboard.githubUrlPlaceholder")}
        />

        <div className="sm:col-span-2">
          <DashboardImageUpload
            aspect="wide"
            label={t("dashboard.projectImage")}
            preview={preview}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors"
        >
          {t("common.cancel")}
        </button>
        <button type="submit" disabled={uploading} className="relative group/s">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300" />
          <div className="relative flex items-center gap-2 px-5 py-2 bg-[#030014] rounded-xl border border-white/10">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-sm text-gray-200">
              {uploading ? t("common.saving") : submitLabel}
            </span>
          </div>
        </button>
      </div>
    </form>
  );
};

export default function Projects() {
  const { t } = useI18n();
  const { techTools } = useSharedData();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });
    setProjects((data || []) as unknown as Project[]);
    setLoading(false);
  }, []);

  const { sortedItems: sortedProjects, reorder } = useDragOrder({
    items: projects,
    setItems: setProjects,
    table: "projects",
    orderField: "order_index",
    onSaved: fetchProjects,
  });

  const visibleProjects = sortedProjects.filter((p) => p.is_published !== false);
  const hiddenProjects = sortedProjects.filter((p) => p.is_published === false);
  const filteredProjects = filter === "all" ? sortedProjects : filter === "visible" ? visibleProjects : hiddenProjects;

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const uploadImage = async (f: File): Promise<string> => {
    const fileName = `${Date.now()}-${f.name}`;
    const { error: uploadError } = await supabase.storage.from("project-images").upload(fileName, f, { cacheControl: "604800" });
    if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCreate = async (form: ProjectFormData, file: File | null) => {
    try {
      const unknown = parseIds(form.TechIds).filter((id) => !techTools.find((tool) => tool.id === id));
      if (unknown.length > 0) {
        Swal.fire({
          icon: "warning",
          title: t("dashboard.techIdsUnknownTitle"),
          text: `${t("dashboard.techIdsUnknown")}: ${unknown.join(", ")}`,
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
        });
        return;
      }
      setUploading(true);
      let imgUrl = "";
      if (file) imgUrl = await uploadImage(file);
      const maxOrder = projects.reduce((m, p) => Math.max(m, p.order_index || 0), 0);
      const { error } = await supabase.from("projects").insert({
        title: form.Title,
        title_ar: form.TitleAr || null,
        description: form.Description,
        description_ar: form.DescriptionAr || null,
        img: imgUrl,
        tech_stack: form.TechStack.split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tech_ids: parseIds(form.TechIds),
        features: form.Features.split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        link: form.Link,
        github: form.Github,
        order_index: maxOrder + 1,
      });

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: t('common.successTitle') || 'Success!',
        text: t("dashboard.projectCreated"),
        timer: 2000,
        showConfirmButton: false,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      });

      setShowCreate(false);
      fetchProjects();
    } catch (error: unknown) {
      console.error("Error creating project:", error);
      Swal.fire({
        icon: 'error',
        title: t('common.errorTitle') || 'Error',
        text: errMessage(error) || t("dashboard.createProjectFailed"),
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (form: ProjectFormData, file: File | null) => {
    try {
      const unknown = parseIds(form.TechIds).filter((id) => !techTools.find((tool) => tool.id === id));
      if (unknown.length > 0) {
        Swal.fire({
          icon: "warning",
          title: t("dashboard.techIdsUnknownTitle"),
          text: `${t("dashboard.techIdsUnknown")}: ${unknown.join(", ")}`,
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
        });
        return;
      }
      setUploading(true);
      let imgUrl = editProject?.img || "";
      if (file) imgUrl = await uploadImage(file);
      const { error } = await supabase
        .from("projects")
        .update({
          title: form.Title,
          title_ar: form.TitleAr || null,
          description: form.Description,
          description_ar: form.DescriptionAr || null,
          img: imgUrl,
          tech_stack: form.TechStack.split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          tech_ids: parseIds(form.TechIds),
          features: form.Features.split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          link: form.Link,
          github: form.Github,
        })
        .eq("id", editProject?.id || "");

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: t('common.successTitle') || 'Success!',
        text: t("dashboard.projectUpdated"),
        timer: 2000,
        showConfirmButton: false,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      });

      setEditProject(null);
      fetchProjects();
    } catch (error: unknown) {
      console.error("Error updating project:", error);
      Swal.fire({
        icon: 'error',
        title: t('common.errorTitle') || 'Error',
        text: errMessage(error) || t("dashboard.updateProjectFailed"),
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteProject = async (id: string) => {
    const result = await Swal.fire({
      title: t("dashboard.deleteProjectConfirm"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("common.delete"),
      cancelButtonText: t("common.cancel"),
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw error;

        Swal.fire({
          icon: 'success',
          title: t("common.deleted"),
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        });
        fetchProjects();
      } catch (error: unknown) {
        Swal.fire({
          icon: 'error',
          title: t("common.errorTitle"),
          text: errMessage(error),
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        });
      }
    }
  };

  const handleTogglePublish = async (project: Project) => {
    const newPublished = project.is_published === false ? true : false;

    const result = await Swal.fire({
      title: newPublished ? t("dashboard.revealConfirm") : t("dashboard.hideConfirm"),
      text: newPublished ? t("dashboard.revealConfirmText") : t("dashboard.hideConfirmText"),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newPublished ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: newPublished ? t("dashboard.yesReveal") : t("dashboard.yesHide"),
      cancelButtonText: t("common.cancel"),
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from("projects")
          .update({ is_published: newPublished })
          .eq("id", project.id);

        if (error) throw error;

        Swal.fire({
          icon: 'success',
          title: newPublished ? t("dashboard.projectRevealed") : t("dashboard.projectHidden"),
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        });

        fetchProjects();
      } catch (error: unknown) {
        Swal.fire({
          icon: 'error',
          title: t("common.errorTitle"),
          text: errMessage(error),
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        });
      }
    }
  };

  const handleMove = (projectId: string) => (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= filteredProjects.length) return;
    const targetId = filteredProjects[targetIndex].id;
    if (targetId === projectId) return;
    const next = [...filteredProjects];
    const idx = next.findIndex((project) => project.id === projectId);
    next.splice(idx, 1);
    next.splice(targetIndex, 0, filteredProjects[idx]);
    reorder(next, filteredProjects);
  };

  const filterOptions = useMemo(() => [
    { key: "all" as const, label: `${t("dashboard.filterAll")} (${sortedProjects.length})` },
    { key: "visible" as const, label: `${t("dashboard.filterVisible")} (${visibleProjects.length})` },
    { key: "hidden" as const, label: `${t("dashboard.filterHidden")} (${hiddenProjects.length})` },
  ], [t, sortedProjects.length, visibleProjects.length, hiddenProjects.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-primary rounded-xl border border-primary flex items-center justify-center">
              <FolderGit2 className="w-4 h-4 text-accent-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              {t("portfolio.projects")}
            </h1>
            <p className="text-secondary text-xs">
              {loading ? t("common.loading") : t("dashboard.projectsCountOf", { count: filteredProjects.length, total: sortedProjects.length })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-secondary border border-primary rounded-xl p-1">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border ${
                  filter === opt.key
                    ? "glass-card text-primary strong-shadow shadow-accent-primary/10"
                    : "text-secondary hover:text-primary border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="relative group shrink-0"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl opacity-50 blur group-hover:opacity-80 transition duration-300" />
            <div className="relative flex items-center gap-2 px-4 py-2.5 bg-primary rounded-xl border border-primary">
              <Plus className="w-4 h-4 text-accent-primary" />
              <span className="text-sm text-primary">{t("dashboard.newProject")}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <DashboardModal title={t("dashboard.addProject")} onClose={() => setShowCreate(false)}>
          <ProjectForm
            tools={techTools}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitLabel={t("dashboard.saveProject")}
            uploading={uploading}
          />
        </DashboardModal>
      )}

      {/* Edit Modal */}
      {editProject && (
        <DashboardModal title={t("dashboard.editProject")} onClose={() => setEditProject(null)}>
          <ProjectForm
            initial={editProject}
            tools={techTools}
            onSubmit={handleEdit}
            onCancel={() => setEditProject(null)}
            submitLabel={t("dashboard.updateProject")}
            uploading={uploading}
          />
        </DashboardModal>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <DashboardSkeleton key={i} variant="project" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <DashboardCard>
          <div className="p-16 text-center">
            <FolderGit2 className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {filter === "hidden" ? t("dashboard.noHiddenProjects") : filter === "visible" ? t("dashboard.noVisibleProjects") : t("dashboard.noProjects")}
            </p>
          </div>
        </DashboardCard>
      ) : (
        <DragGrid
          items={filteredProjects}
          onReorder={(next) => reorder(next, filteredProjects)}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {(project, index) => (
            <ProjectCard
              project={project}
              index={index}
              total={filteredProjects.length}
              onDelete={deleteProject}
              onEdit={setEditProject}
              onTogglePublish={handleTogglePublish}
              onMove={handleMove(project.id)}
            />
          )}
        </DragGrid>
      )}
    </div>
  );
}