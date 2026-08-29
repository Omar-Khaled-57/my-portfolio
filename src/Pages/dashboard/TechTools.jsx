import { useEffect, useState, useMemo, useCallback } from "react";
import { Reorder } from "framer-motion";
import { supabase } from "../../supabase";
import {
  Boxes,
  Plus,
  Trash2,
  Upload,
  Pencil,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import { getToolImage } from "../../utils/techTools";
import { useDragOrder } from "../../hooks/useDragOrder";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardModal from "../../components/dashboard/DashboardModal";
import DashboardInput from "../../components/dashboard/DashboardInput";
import DashboardImageUpload from "../../components/dashboard/DashboardImageUpload";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import Swal from "sweetalert2";

const typeOptions = (t) => [
  { value: "Main", label: t("dashboard.toolTypeMain") },
  { value: "Other", label: t("dashboard.toolTypeOther") },
];

const ToolForm = ({ initial, onSubmit, onCancel, submitLabel, uploading }) => {
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: initial?.name || "",
    type: initial?.type || "Main",
    tags: Array.isArray(initial?.tags) ? initial.tags.join(", ") : initial?.tags || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageLightFile, setImageLightFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(initial?.image || null);
  const [previewImageLight, setPreviewImageLight] = useState(initial?.image_light || null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleImageFile = (e, target) => {
    const f = e.target.files[0];
    if (!f) return;
    if (target === "image") {
      setImageFile(f);
      setPreviewImage(URL.createObjectURL(f));
    } else {
      setImageLightFile(f);
      setPreviewImageLight(URL.createObjectURL(f));
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...form, imageFile, imageLightFile });
      }}
      className="p-5 sm:p-6 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardInput
          label={t("dashboard.toolName")}
          value={form.name}
          onChange={set("name")}
          placeholder={t("dashboard.toolNamePlaceholder")}
          required
        />

        <div className="space-y-1.5">
          <label className="text-xs text-accent-primary uppercase tracking-wider font-semibold">
            {t("dashboard.toolType")}
          </label>
          <div className="flex gap-1 bg-secondary border border-primary rounded-xl p-1 w-fit">
            {typeOptions(t).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: opt.value }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border ${
                  form.type === opt.value
                    ? "glass-card text-primary strong-shadow shadow-accent-primary/10"
                    : "text-secondary hover:text-primary border-transparent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <DashboardInput
            label={t("dashboard.toolTags")}
            value={form.tags}
            onChange={set("tags")}
            placeholder={t("dashboard.toolTagsPlaceholder")}
          />
        </div>

        <div className="sm:col-span-2">
          <DashboardImageUpload
            aspect="square"
            label={t("dashboard.toolImage")}
            hint={t("dashboard.toolImageHint")}
            preview={previewImage}
            onChange={(e) => handleImageFile(e, "image")}
          />
        </div>

        <div className="sm:col-span-2">
          <DashboardImageUpload
            aspect="square"
            label={t("dashboard.toolImageLight")}
            preview={previewImageLight}
            onChange={(e) => handleImageFile(e, "light")}
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

const ToolCard = ({ tool, index, total, onDelete, onEdit, onMove }) => {
  const { t } = useI18n();
  const { theme: currentTheme } = useCustomTheme();
  const resolvedImage = getToolImage(tool, currentTheme);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <DashboardCard className="h-full">
      <div className="flex flex-col h-full items-center p-4 text-center gap-3">
        <div className="relative">
          {!imgLoaded && <div className="w-16 h-16 bg-primary/20 animate-pulse rounded-xl" />}
          <img
            src={resolvedImage}
            alt={t("dashboard.toolImageAlt", { name: tool.name })}
            onLoad={() => setImgLoaded(true)}
            className={`h-16 w-16 object-contain transition-opacity ${imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
          />
          {tool.image_light && (
            <span
              title={t("dashboard.toolImageLight")}
              className="absolute -top-1.5 -end-1.5 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-amber-400 to-sky-400 border border-white/40"
            />
          )}
        </div>

        <div className="min-h-0 w-full">
          <h3 className="font-semibold text-primary text-sm truncate">{tool.name}</h3>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
              tool.type === "Main"
                ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                : "bg-cyan-500/15 text-cyan-400 border-cyan-500/25"
            }`}
          >
            {tool.type === "Main" ? t("dashboard.toolTypeMain") : t("dashboard.toolTypeOther")}
          </span>
        </div>

        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {tool.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-primary/20 text-primary/60 text-[10px] border border-primary"
              >
                {tag}
              </span>
            ))}
            {tool.tags.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary/60 text-[10px] border border-primary">
                +{tool.tags.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-2 w-full flex items-center justify-between gap-1 border-t border-primary">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onMove(index - 1)}
              disabled={index === 0}
              aria-label={t("dashboard.toolMoveUp")}
              title={t("dashboard.toolMoveUp")}
              className="p-1.5 rounded-lg border border-primary text-primary/50 hover:text-primary hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onMove(index + 1)}
              disabled={index === total - 1}
              aria-label={t("dashboard.toolMoveDown")}
              title={t("dashboard.toolMoveDown")}
              className="p-1.5 rounded-lg border border-primary text-primary/50 hover:text-primary hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <span aria-hidden className="hidden sm:block p-1 text-primary/30 cursor-grab">
              <GripVertical className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(tool)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/10 text-xs transition-colors"
            >
              <Pencil className="w-3 h-3" /> {t("common.edit")}
            </button>
            <button
              onClick={() => onDelete(tool)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default function TechTools() {
  const { t } = useI18n();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editTool, setEditTool] = useState(null);

  const filteredTools = useMemo(() => {
    if (filter === "all") return sortedTools;
    return sortedTools.filter((tool) => tool.type === filter);
  }, [sortedTools, filter]);

  const mainCount = useMemo(() => tools.filter((tool) => tool.type === "Main").length, [tools]);
  const otherCount = useMemo(() => tools.filter((tool) => tool.type === "Other").length, [tools]);

  const fetchTools = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tech_tools")
      .select("*")
      .order("sort_order", { ascending: true });
    setTools(data || []);
    setLoading(false);
  }, []);

  const { sortedItems: sortedTools, reorder } = useDragOrder({
    items: tools,
    setItems: setTools,
    table: "tech_tools",
    orderField: "sort_order",
    onSaved: fetchTools,
  });

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const uploadImage = async (file) => {
    const fileName = `tool-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("tool-images")
      .upload(fileName, file);
    if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
    const { data } = supabase.storage.from("tool-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleCreate = async (form) => {
    try {
      setUploading(true);
      const image = form.imageFile ? await uploadImage(form.imageFile) : null;
      if (!image) throw new Error("Tool image is required");
      const image_light = form.imageLightFile ? await uploadImage(form.imageLightFile) : null;
      const maxOrder = tools.reduce((m, tool) => Math.max(m, tool.sort_order || 0), 0);
      const { error } = await supabase.from("tech_tools").insert({
        name: form.name.trim(),
        type: form.type,
        tags: form.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        image,
        image_light,
        sort_order: maxOrder + 1,
      });
      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: t("dashboard.toolCreated"),
        timer: 2000,
        showConfirmButton: false,
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      });
      setShowCreate(false);
      fetchTools();
    } catch (error) {
      console.error("Error creating tool:", error);
      Swal.fire({
        icon: "error",
        title: t("common.errorTitle"),
        text: error.message || t("dashboard.toolCreateFailed"),
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (form) => {
    try {
      setUploading(true);
      let image = editTool.image;
      let image_light = editTool.image_light;
      if (form.imageFile) image = await uploadImage(form.imageFile);
      if (form.imageLightFile) image_light = await uploadImage(form.imageLightFile);

      const { error } = await supabase
        .from("tech_tools")
        .update({
          name: form.name.trim(),
          type: form.type,
          tags: form.tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          image,
          image_light,
        })
        .eq("id", editTool.id);
      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: t("dashboard.toolUpdated"),
        timer: 2000,
        showConfirmButton: false,
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      });
      setEditTool(null);
      fetchTools();
    } catch (error) {
      console.error("Error updating tool:", error);
      Swal.fire({
        icon: "error",
        title: t("common.errorTitle"),
        text: error.message || t("dashboard.toolUpdateFailed"),
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteTool = async (tool) => {
    const result = await Swal.fire({
      title: t("dashboard.deleteToolConfirm"),
      text: tool.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("common.delete"),
      cancelButtonText: t("common.cancel"),
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from("tech_tools").delete().eq("id", tool.id);
        if (error) throw error;

        Swal.fire({
          icon: "success",
          title: t("common.deleted"),
          timer: 1500,
          showConfirmButton: false,
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
        });
        fetchTools();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: t("common.errorTitle"),
          text: error.message,
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
        });
      }
    }
  };

  const handleMove = (toolId) => (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= filteredTools.length) return;
    const targetId = filteredTools[targetIndex].id;
    if (targetId === toolId) return;
    const next = [...filteredTools];
    const idx = next.findIndex((tool) => tool.id === toolId);
    next.splice(idx, 1);
    next.splice(targetIndex, 0, filteredTools[idx]);
    reorder(next, filteredTools);
  };

  const filterOptions = useMemo(
    () => [
      { key: "all", label: `${t("dashboard.filterAll")} (${tools.length})` },
      { key: "Main", label: `${t("dashboard.toolTypeMain")} (${mainCount})` },
      { key: "Other", label: `${t("dashboard.toolTypeOther")} (${otherCount})` },
    ],
    [t, tools.length, mainCount, otherCount],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-primary rounded-xl border border-primary flex items-center justify-center">
              <Boxes className="w-4 h-4 text-accent-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">{t("portfolio.techStack")}</h1>
            <p className="text-secondary text-xs">
              {loading
                ? t("common.loading")
                : t("dashboard.toolsCountOf", { count: filteredTools.length, total: tools.length })}
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

          <button onClick={() => setShowCreate(true)} className="relative group shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl opacity-50 blur group-hover:opacity-80 transition duration-300" />
            <div className="relative flex items-center gap-2 px-4 py-2.5 bg-primary rounded-xl border border-primary">
              <Plus className="w-4 h-4 text-accent-primary" />
              <span className="text-sm text-primary">{t("dashboard.newTool")}</span>
            </div>
          </button>
        </div>
      </div>

      {showCreate && (
        <DashboardModal title={t("dashboard.addTool")} onClose={() => setShowCreate(false)}>
          <ToolForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
            submitLabel={t("dashboard.saveTool")}
            uploading={uploading}
          />
        </DashboardModal>
      )}

      {editTool && (
        <DashboardModal title={t("dashboard.editTool")} onClose={() => setEditTool(null)}>
          <ToolForm
            initial={editTool}
            onSubmit={handleEdit}
            onCancel={() => setEditTool(null)}
            submitLabel={t("dashboard.updateTool")}
            uploading={uploading}
          />
        </DashboardModal>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <DashboardSkeleton key={i} variant="tool" />
          ))}
        </div>
      ) : filteredTools.length === 0 ? (
        <DashboardCard>
          <div className="p-16 text-center">
            <Boxes className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t("dashboard.noTools")}</p>
          </div>
        </DashboardCard>
      ) : (
        <Reorder.Group
          as="div"
          axis="both"
          values={filteredTools}
          onReorder={(next) => reorder(next, filteredTools)}
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
        >
          {filteredTools.map((tool, index) => (
            <Reorder.Item
              as="div"
              key={tool.id}
              value={tool}
              layout
              className="cursor-grab active:cursor-grabbing"
            >
              <ToolCard
                tool={tool}
                index={index}
                total={filteredTools.length}
                onDelete={deleteTool}
                onEdit={setEditTool}
                onMove={handleMove(tool.id)}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}