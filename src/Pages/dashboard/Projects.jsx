import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabase";
import {
  Plus,
  Trash2,
  Upload,
  FolderGit2,
  X,
  ImageIcon,
  ExternalLink,
  Github,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";
import { useI18n } from "../../i18n";
import Swal from "sweetalert2";

const Card = ({ children, className = "" }) => (
  <div className={`bg-indigo-500/[0.06] rounded-2xl border border-indigo-500/10 shadow-xl shadow-black/20 overflow-hidden relative noise-bg hover:shadow-2xl hover:border-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] to-transparent pointer-events-none" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent pointer-events-none" />
    {children}
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs text-accent-primary uppercase tracking-wider font-semibold">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-secondary border border-primary rounded-xl px-4 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/20 transition-all"
    />
  </div>
);

const SkeletonCard = () => (
  <div className="bg-secondary border border-primary rounded-2xl p-4 flex flex-col gap-3">
      <div className="w-full aspect-[16/8] bg-primary/20 animate-pulse rounded-xl" />
      <div className="h-4 bg-primary/20 animate-pulse rounded-lg w-2/3" />
      <div className="h-3 bg-primary/20 animate-pulse rounded-lg w-full" />
      <div className="h-3 bg-primary/20 animate-pulse rounded-lg w-4/5" />
      <div className="flex gap-1.5 mt-1">
        <div className="h-5 w-16 bg-primary/20 animate-pulse rounded-full" />
        <div className="h-5 w-12 bg-primary/20 animate-pulse rounded-full" />
        <div className="h-5 w-20 bg-primary/20 animate-pulse rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-primary mt-auto">
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-primary/20 animate-pulse rounded-lg" />
          <div className="w-7 h-7 bg-primary/20 animate-pulse rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="w-14 h-7 bg-primary/20 animate-pulse rounded-lg" />
          <div className="w-16 h-7 bg-primary/20 animate-pulse rounded-lg" />
        </div>
      </div>
  </div>
);

const ProjectCard = ({ project, onDelete, onEdit, onTogglePublish }) => {
  const { t } = useI18n();
  const [imgLoaded, setImgLoaded] = useState(false);
  const isHidden = project.is_published === false;

  return (
    <Card>
      <div className="p-4 flex flex-col h-full">
        {project.img && (
          <div className="w-full aspect-[16/8] rounded-xl mb-4 relative overflow-hidden border border-primary bg-black/20">
            {!imgLoaded && (
              <div className="w-full h-full animate-pulse bg-primary/20" />
            )}
            <img
              src={project.img}
              alt={project.title}
              onLoad={() => setImgLoaded(true)}
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
    </Card>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <div
      className="relative z-10 w-full max-w-2xl flex flex-col"
      style={{ maxHeight: "calc(100vh - 24px)" }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-20 pointer-events-none" />
      <div className="relative bg-secondary border border-primary rounded-2xl flex flex-col overflow-hidden strong-shadow">
        {/* Fixed header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary shrink-0">
          <h2 className="text-base font-semibold text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-secondary hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  </div>
);

const ProjectForm = ({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
  uploading,
}) => {
  const { t } = useI18n();
  const [form, setForm] = useState({
    Title: initial?.title || "",
    TitleAr: initial?.title_ar || "",
    Description: initial?.description || "",
    DescriptionAr: initial?.description_ar || "",
    TechStack: Array.isArray(initial?.tech_stack)
      ? initial.tech_stack.join(", ")
      : initial?.tech_stack || "",
    Features: Array.isArray(initial?.features)
      ? initial.features.join(", ")
      : initial?.features || "",
    Link: initial?.link || "",
    Github: initial?.github || "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.img || null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
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
          <InputField
            label={t("dashboard.projectTitle") || "Project Title"}
            value={form.Title}
            onChange={set("Title")}
            placeholder={t("dashboard.projectTitlePlaceholder") || "Enter project title"}
            required
          />
        </div>
        
        <div className="sm:col-span-2">
          <InputField
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

        <InputField
          label={t("dashboard.techStackInput")}
          value={form.TechStack}
          onChange={set("TechStack")}
          placeholder={t("dashboard.techStackPlaceholder")}
        />
        <InputField
          label={t("dashboard.featuresInput")}
          value={form.Features}
          onChange={set("Features")}
          placeholder={t("dashboard.featuresPlaceholder")}
        />
        <InputField
          label={t("dashboard.liveUrl")}
          value={form.Link}
          onChange={set("Link")}
            placeholder={t("dashboard.liveUrlPlaceholder")}
        />
        <InputField
          label={t("dashboard.githubUrl")}
          value={form.Github}
          onChange={set("Github")}
            placeholder={t("dashboard.githubUrlPlaceholder")}
        />

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs text-accent-primary uppercase tracking-wider font-semibold">
            {t("dashboard.projectImage")}
          </label>
          <label className="flex items-center gap-4 w-full bg-secondary border border-dashed border-primary rounded-xl px-4 py-4 cursor-pointer hover:border-accent-primary/40 hover:bg-primary/5 transition-all">
            {preview ? (
              <img
                src={preview}
                className="h-16 w-24 object-cover rounded-lg border border-primary"
                alt="preview"
              />
            ) : (
              <div className="w-24 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary">
                <ImageIcon className="w-5 h-5 text-secondary" />
              </div>
            )}
            <div>
              <p className="text-sm text-primary">
                {preview ? t("dashboard.changeImage") : t("dashboard.uploadImage")}
              </p>
              <p className="text-xs text-secondary mt-0.5">
                {t("dashboard.imageSupport")}
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");

  const visibleProjects = projects.filter((p) => p.is_published !== false);
  const hiddenProjects = projects.filter((p) => p.is_published === false);
  const filteredProjects = filter === "all" ? projects : filter === "visible" ? visibleProjects : hiddenProjects;

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const uploadImage = async (f) => {
    const fileName = `${Date.now()}-${f.name}`;
    const { error: uploadError } = await supabase.storage.from("project-images").upload(fileName, f);
    if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
    
    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCreate = async (form, file) => {
    try {
      setUploading(true);
      let imgUrl = "";
      if (file) imgUrl = await uploadImage(file);
      const { error } = await supabase.from("projects").insert({
        title: form.Title,
        title_ar: form.TitleAr || null,
        description: form.Description,
        description_ar: form.DescriptionAr || null,
        img: imgUrl,
        tech_stack: form.TechStack.split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        features: form.Features.split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        link: form.Link,
        github: form.Github,
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
    } catch (error) {
      console.error("Error creating project:", error);
      Swal.fire({
        icon: 'error',
        title: t('common.errorTitle') || 'Error',
        text: error.message || t("dashboard.createProjectFailed"),
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (form, file) => {
    try {
      setUploading(true);
      let imgUrl = editProject.img || "";
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
          features: form.Features.split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          link: form.Link,
          github: form.Github,
        })
        .eq("id", editProject.id);

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
    } catch (error) {
      console.error("Error updating project:", error);
      Swal.fire({
        icon: 'error',
        title: t('common.errorTitle') || 'Error',
        text: error.message || t("dashboard.updateProjectFailed"),
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteProject = async (id) => {
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
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: t("common.errorTitle"),
          text: error.message,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        });
      }
    }
  };

  const handleTogglePublish = async (project) => {
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
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: t("common.errorTitle"),
          text: error.message,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        });
      }
    }
  };

  const filterOptions = useMemo(() => [
    { key: "all", label: `${t("dashboard.filterAll")} (${projects.length})` },
    { key: "visible", label: `${t("dashboard.filterVisible")} (${visibleProjects.length})` },
    { key: "hidden", label: `${t("dashboard.filterHidden")} (${hiddenProjects.length})` },
  ], [t, projects.length, visibleProjects.length, hiddenProjects.length]);

  return (
    <div className="space-y-6z ">
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
              {loading ? t("common.loading") : t("dashboard.projectsCountOf", { count: filteredProjects.length, total: projects.length })}
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
        <Modal title={t("dashboard.addProject")} onClose={() => setShowCreate(false)}>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitLabel={t("dashboard.saveProject")}
            uploading={uploading}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editProject && (
        <Modal title={t("dashboard.editProject")} onClose={() => setEditProject(null)}>
          <ProjectForm
            initial={editProject}
            onSubmit={handleEdit}
            onCancel={() => setEditProject(null)}
            submitLabel={t("dashboard.updateProject")}
            uploading={uploading}
          />
        </Modal>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <FolderGit2 className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {filter === "hidden" ? t("dashboard.noHiddenProjects") : filter === "visible" ? t("dashboard.noVisibleProjects") : t("dashboard.noProjects")}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={deleteProject}
              onEdit={setEditProject}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      )}
    </div>
  );
}
