import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabase";
import {
  MessageSquare,
  Pin,
  Trash2,
  PinOff,
  Calendar,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
} from "lucide-react";
import { useI18n } from "../../i18n";
import Swal from "sweetalert2";

const PAGE_SIZE = 10;

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500 pointer-events-none" />
    <div className="relative glass-card rounded-2xl h-full border border-primary strong-shadow">
      {children}
    </div>
  </div>
);

export default function Comments() {
  const { language, t } = useI18n();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isFrozen, setIsFrozen] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("portfolio_comments")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    setComments(data || []);

    // Fetch frozen state
    const { data: settingsData } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "comments_frozen")
      .single();
    
    if (settingsData) {
      setIsFrozen(settingsData.value === "true");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const pin = async (id, value) => {
    try {
      const { error } = await supabase
        .from("portfolio_comments")
        .update({ is_pinned: value })
        .eq("id", id);
      if (error) throw error;
      fetchComments();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      });
    }
  };

  const toggleFreeze = async () => {
    const newValue = !isFrozen;
    setIsFrozen(newValue); // optimistic update
    try {
      const { error } = await supabase
        .from("app_settings")
        .update({ value: newValue ? "true" : "false" })
        .eq("key", "comments_frozen");
      
      if (error) {
          throw error;
      }
      
      Swal.fire({
        icon: 'success',
        title: newValue ? t('dashboard.commentsFrozen') : t('dashboard.commentsUnfrozen'),
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      });
    } catch (error) {
      console.error(error);
      setIsFrozen(!newValue); // revert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update settings. Did you run the SQL script to create app_settings?',
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      });
    }
  };

  const remove = async (id) => {
    const result = await Swal.fire({
      title: t("dashboard.deleteCommentConfirm"),
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
        const { error } = await supabase.from("portfolio_comments").delete().eq("id", id);
        if (error) throw error;
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        });
        fetchComments();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        });
      }
    }
  };

  const pinnedCount = comments.filter((c) => c.is_pinned).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter + search
  const filtered = useMemo(() => {
    let result =
      filter === "pinned" ? comments.filter((c) => c.is_pinned) : comments;
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (c) =>
          (c.user_name || "").toLowerCase().includes(q) ||
          (c.content || "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [comments, filter, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl blur opacity-50 pointer-events-none" />
            <div className="relative w-9 h-9 bg-primary rounded-xl border border-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-accent-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              {t("comments.title")}
            </h1>
            <p className="text-secondary text-xs">
              {t("dashboard.commentsTotal", { total: comments.length, pinned: pinnedCount })}
            </p>
          </div>
        </div>

        {/* Freeze comments toggle */}
        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={toggleFreeze}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              isFrozen 
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
            }`}
          >
            {isFrozen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span className="text-sm font-medium">
                {isFrozen ? t('dashboard.commentsFrozen') : t('dashboard.freezeComments')}
            </span>
          </button>
        </div>

        {/* Filter tabs */}
        <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
          {[
            { value: "all", label: t("dashboard.filterAll"), count: comments.length },
            { value: "pinned", label: t("dashboard.filterPinned"), count: pinnedCount },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`group relative min-w-0 overflow-hidden rounded-2xl px-4 py-3 text-xs sm:text-sm transition-all duration-300 ${
                filter === tab.value
                  ? "glass-card text-primary strong-shadow shadow-accent-primary/10"
                  : "text-secondary hover:text-primary hover:bg-secondary/70 hover:shadow-lg"
              }`}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur transition-opacity duration-300 pointer-events-none ${
                filter === tab.value ? "opacity-20" : "opacity-0 group-hover:opacity-20"
              }`} />
              <div className="relative flex items-center justify-between gap-3">
                <span className="truncate font-semibold">{tab.label}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors duration-300 ${
                  filter === tab.value
                    ? "bg-accent-primary/20 text-accent-primary"
                    : "bg-primary/10 text-secondary group-hover:text-accent-primary"
                }`}>
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("dashboard.total"), value: comments.length, color: "text-accent-primary" },
          { label: t("dashboard.pinned"), value: pinnedCount, color: "text-accent-secondary" },
          {
            label: t("dashboard.unpinned"),
            value: comments.length - pinnedCount,
            color: "text-blue-500",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="p-3 sm:p-4">
              <p className="text-secondary text-xs mb-1 font-medium">{stat.label}</p>
              <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("dashboard.searchComments")}
          className="w-full bg-secondary border border-primary rounded-xl ps-10 pe-10 py-2.5 text-primary placeholder-secondary text-sm outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result count when searching */}
      {search && (
        <p className="text-xs text-gray-500 -mt-3">
          {t("dashboard.searchResults", {
            count: filtered.length,
            plural: filtered.length !== 1 && language === "en" ? "s" : "",
            query: search,
          })}
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <Card>
          <div className="p-14 text-center">
            <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {search
                ? t("dashboard.noSearchComments")
                : filter === "pinned"
                  ? t("dashboard.noPinnedComments")
                  : t("dashboard.noComments")}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {paginated.map((comment) => (
            <div key={comment.id} className="relative group">
              {comment.is_pinned && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl blur opacity-15 pointer-events-none" />
              )}
              <div
                className={`relative bg-secondary backdrop-blur-xl border rounded-2xl px-4 py-4 sm:px-5 transition-all duration-200 ${
                  comment.is_pinned
                    ? "border-accent-primary/30"
                    : "border-primary hover:border-accent-primary/25"
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-primary flex items-center justify-center shrink-0">
                    <img
                      src={comment.profile_image || "/default-avatar.jpg"}
                      alt="Avatar"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-primary">
                        {/* Highlight search match in name */}
                        {highlightMatch(
                          comment.user_name || "Anonymous",
                          search,
                        )}
                      </span>
                      {comment.is_pinned && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-primary/15 border border-accent-primary/25 text-accent-primary text-xs font-medium">
                          <Pin className="w-2.5 h-2.5" /> {t("dashboard.pinned")}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-secondary text-xs ms-auto shrink-0">
                        <Calendar className="w-3 h-3" />
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-primary text-sm leading-relaxed opacity-80">
                      {/* Highlight search match in content */}
                      {highlightMatch(comment.content || "", search)}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => pin(comment.id, !comment.is_pinned)}
                      title={comment.is_pinned ? t("dashboard.unpin") : t("dashboard.pin")}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        comment.is_pinned
                          ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                          : "border-white/10 text-gray-500 hover:text-indigo-400 hover:border-indigo-500/25"
                      }`}
                    >
                      {comment.is_pinned ? (
                        <PinOff className="w-3.5 h-3.5" />
                      ) : (
                        <Pin className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => remove(comment.id)}
                      className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-secondary">
            {t("dashboard.showing", {
              from: (page - 1) * PAGE_SIZE + 1,
              to: Math.min(page * PAGE_SIZE, filtered.length),
              total: filtered.length,
            })}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-primary text-secondary hover:text-primary hover:border-accent-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, i, arr) => {
                if (i > 0 && arr[i - 1] !== p - 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="px-2 text-secondary text-xs"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs border transition-all duration-200 ${
                      page === p
                        ? "bg-accent-primary/20 border-accent-primary/40 text-accent-primary font-medium"
                        : "border-primary text-secondary hover:text-primary hover:border-accent-primary/20"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-primary text-secondary hover:text-primary hover:border-accent-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Highlight matching text
function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const regex = new RegExp(
    `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-indigo-500/30 text-indigo-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
