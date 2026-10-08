import React, { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Plus,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  FileVideo,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Save,
  X,
  Scissors,
  Eye,
  Film
} from "lucide-react";
import { httpService } from "@/utils/httpService.ts";
import VideoTrimmerBar from "./portfolio/VideoTrimmerBar";

const CATEGORIES = [
  "Brand Trailer",
  "Explainer Videos",
  "Motion Graphics",
  "Ad Creatives",
  "Social Content",
  "Graphic Design",
  "All",
];

const FILTER_CATEGORIES = [
  "All",
  "Brand Trailer",
  "Explainer Videos",
  "Motion Graphics",
  "Ad Creatives",
  "Social Content",
  "Graphic Design",
];

export type PortfolioItem = {
  id?: string | number;
  _id?: string;
  uuid?: string;
  category: string;
  video?: string;
  file?: string;
  filepath?: string;
  fileUrl?: string;
  url?: string;
  cover?: string;
  coverpath?: string;
  coverUrl?: string;
  preview?: string;
  previewpath?: string;
  previewUrl?: string;
  createdat?: string;
  createdAt?: string;
};

export default function PortfoliosManager() {
  // Upload States
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [enableTrim, setEnableTrim] = useState(true);
  const [pstart, setPstart] = useState<number>(0);
  const [pend, setPend] = useState<number>(10);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStage, setUploadStage] = useState<"idle" | "uploading" | "processing">("idle");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  // List & Filter & Pagination States
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filterCategory, setFilterCategory] = useState("All");
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  // Edit States
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editCategory, setEditCategory] = useState<string>("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editCover, setEditCover] = useState<File | null>(null);
  const [editRecut, setEditRecut] = useState<boolean>(false);
  const [editPstart, setEditPstart] = useState<number>(0);
  const [editPend, setEditPend] = useState<number>(10);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [updateProgress, setUpdateProgress] = useState<number>(0);

  const fetchPortfolios = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const res: any = await httpService.get(`/portfolio/list?page=${page}&limit=${limit}`, {
        params: filterCategory === "All" ? {} : { category: filterCategory },
      });

      let items: PortfolioItem[] = [];
      let totalP = 1;
      let totalC = 0;

      if (Array.isArray(res)) {
        items = res;
        totalC = res.length;
      } else if (res && typeof res === "object") {
        items = res.videos || res.items || res.portfolios || res.data || res.results || [];
        const meta = res.meta || {};
        totalP = meta.totalPages || res.totalPages || Math.ceil((meta.total ?? items.length) / limit) || 1;
        totalC = meta.total ?? res.totalCount ?? items.length;
      }

      setPortfolios(items);
      setTotalPages(totalP);
      setTotalCount(totalC);
    } catch (err: any) {
      console.error("[PortfoliosManager] Fetch list failed:", err);
      setListError(err.response?.data?.message || err.message || "Failed to load portfolios.");
    } finally {
      setIsLoadingList(false);
    }
  }, [page, limit, filterCategory]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  // Video duration handler on file pick
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setPstart(0);
    setPend(10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !file) {
      setStatus({ type: "error", message: "Category and video file are required." });
      return;
    }

    if (enableTrim && (pstart < 0 || pend <= pstart || pend - pstart > 10)) {
      setStatus({
        type: "error",
        message: "Invalid preview clip. Start must be >= 0, End > Start, and cut duration capped at 10s.",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setUploadStage("uploading");
    setStatus({ type: "idle", message: "" });

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("file", file);
      if (cover) {
        formData.append("cover", cover);
      }
      if (enableTrim) {
        formData.append("pstart", String(Number(pstart.toFixed(2))));
        formData.append("pend", String(Number(pend.toFixed(2))));
      }

      await httpService.post("/portfolio/upload", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
            if (percent >= 100) {
              setUploadStage("processing");
            }
          }
        },
      });

      setStatus({ type: "success", message: "Portfolio item uploaded successfully!" });

      // Reset form
      setCategory("");
      setFile(null);
      setCover(null);
      setPstart(0);
      setPend(10);
      setUploadProgress(0);
      setUploadStage("idle");

      // Clear input elements
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      const coverInput = document.getElementById("cover-upload") as HTMLInputElement;
      if (coverInput) coverInput.value = "";

      fetchPortfolios();
    } catch (err: any) {
      console.error("[PortfoliosManager] Upload failed:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || err.message || "Failed to upload portfolio. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setUploadStage("idle");
    }
  };

  const handleDelete = async (item: PortfolioItem) => {
    const itemId = item.id || item._id || item.uuid;
    if (!itemId) return;

    if (!window.confirm("Are you sure you want to delete this portfolio item?")) {
      return;
    }

    setDeletingId(itemId);
    try {
      await httpService.delete(`/portfolio/${itemId}`);
      setStatus({ type: "success", message: "Portfolio item deleted successfully." });
      fetchPortfolios();
    } catch (err: any) {
      console.error("[PortfoliosManager] Delete failed:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to delete portfolio item.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setEditCategory(item.category || "");
    setEditFile(null);
    setEditCover(null);
    setEditRecut(false);
    setEditPstart(0);
    setEditPend(10);
    setUpdateProgress(0);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditFile(null);
    setEditCover(null);
    setEditRecut(false);
    setUpdateProgress(0);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    const itemId = editingItem.id || editingItem._id || editingItem.uuid;
    if (!itemId) return;

    if (editRecut && (editPstart < 0 || editPend <= editPstart || editPend - editPstart > 10)) {
      setStatus({
        type: "error",
        message: "Invalid preview clip. Start must be >= 0, End > Start, and cut duration capped at 10s.",
      });
      return;
    }

    setUpdatingId(itemId);
    setUpdateProgress(0);
    setStatus({ type: "idle", message: "" });

    try {
      const formData = new FormData();
      if (editCategory) formData.append("category", editCategory);
      if (editFile) formData.append("file", editFile);
      if (editCover) formData.append("cover", editCover);
      if (editRecut) {
        formData.append("pstart", String(Number(editPstart.toFixed(2))));
        formData.append("pend", String(Number(editPend.toFixed(2))));
      }

      await httpService.patch(`/portfolio/${itemId}`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUpdateProgress(percent);
          }
        },
      });

      setStatus({ type: "success", message: "Portfolio item updated successfully." });
      cancelEdit();
      fetchPortfolios();
    } catch (err: any) {
      console.error("[PortfoliosManager] Update failed:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || err.message || "Failed to update portfolio item.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const fixUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) return path;
    const base = (import.meta.env.PUBLIC_API_URL || "").replace(/\/+$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  };

  // Resolve source video for edit trimmer
  const editVideoSource = editFile || fixUrl(editingItem?.video || editingItem?.filepath || editingItem?.file);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header & Add Form Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Add Portfolio</h2>
          <p className="text-sm text-white/50 mt-1">
            Upload video, set optional cover, and select a preview clip (up to 10s).
          </p>
        </div>

        {/* Status Messages */}
        {status.type !== "idle" && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 border ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        )}

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Category <span className="text-[#00E6D7]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow] appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-[#021617] text-white/50">
                  Select a category
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#021617] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Video File Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Video File <span className="text-[#00E6D7]">*</span>
              </label>
              <label className="group relative flex items-center justify-between px-4 py-3 border border-dashed border-white/15 rounded-xl hover:border-[#00E6D7]/50 hover:bg-[#00E6D7]/5 transition-colors cursor-pointer overflow-hidden bg-white/5">
                <input
                  id="file-upload"
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="flex items-center gap-3 truncate">
                  <FileVideo size={20} className={file ? "text-[#00E6D7]" : "text-white/40"} />
                  <span className="text-sm text-white/90 truncate">
                    {file ? file.name : "Select video file (mp4, webm)"}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#00E6D7] shrink-0 ml-2">
                  {file ? "Change" : "Browse"}
                </span>
              </label>
            </div>
          </div>

          {/* Cover Image Upload (Optional) */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Cover Image <span className="text-white/40 font-normal">(optional)</span>
            </label>
            <label className="group relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/10 rounded-xl hover:border-[#00E6D7]/50 hover:bg-[#00E6D7]/5 transition-colors cursor-pointer overflow-hidden bg-white/[0.02]">
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
                className="hidden"
              />
              {cover ? (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={URL.createObjectURL(cover)}
                    alt="Cover preview"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium flex items-center gap-2">
                      <Upload size={16} /> Change Cover
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/40 group-hover:text-[#00E6D7] transition-colors">
                  <ImageIcon size={28} />
                  <span className="text-xs font-medium">Click to upload cover image (png, jpg, webp)</span>
                </div>
              )}
            </label>
          </div>

          {/* Interactive Video Bar / Trimmer for Preview Clip */}
          {file && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableTrim}
                    onChange={(e) => setEnableTrim(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#00E6D7] focus:ring-[#00E6D7]/40 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-white/90">
                    Generate 10s preview clip from video
                  </span>
                </label>
                {enableTrim && (
                  <span className="text-xs text-[#00E6D7] font-mono">
                    {pstart.toFixed(2)}s - {pend.toFixed(2)}s ({(pend - pstart).toFixed(2)}s)
                  </span>
                )}
              </div>

              {enableTrim && (
                <VideoTrimmerBar
                  videoSource={file}
                  pstart={pstart}
                  pend={pend}
                  onChange={(s, e) => {
                    setPstart(s);
                    setPend(e);
                  }}
                  maxCut={10}
                  label="Select Preview Section (<= 10s)"
                />
              )}
            </div>
          )}

          {/* Upload Progress Bar */}
          {isSubmitting && (
            <div className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-2 font-medium">
                  <Loader2 size={14} className="animate-spin text-[#00E6D7]" />
                  {uploadStage === "uploading" ? "Uploading video & assets..." : "Processing preview clip on server..."}
                </span>
                <span className="font-mono text-[#00E6D7] font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-[#00E6D7]/10"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  {uploadStage === "uploading" ? `Uploading (${uploadProgress}%)` : "Processing..."}
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Upload Portfolio
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Portfolio Items List Section */}
      <div className="space-y-6 pt-6 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Manage Portfolios</h3>
            <p className="text-sm text-white/50 mt-0.5">
              {totalCount > 0 ? `${totalCount} items found` : "View and manage portfolio items"}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilterCategory(cat);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterCategory === cat
                    ? "bg-[#00E6D7]/20 border border-[#00E6D7]/40 text-[#00E6D7]"
                    : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        {isLoadingList ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-[#00E6D7] animate-spin mx-auto mb-3" />
            <p className="text-sm text-white/50">Loading portfolios...</p>
          </div>
        ) : listError ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {listError}
            <button
              onClick={() => fetchPortfolios()}
              className="ml-3 underline hover:text-red-300 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="py-12 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
            <p className="text-white/40 text-sm">No portfolio items found for "{filterCategory}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolios.map((item, idx) => {
              const itemId = item.id || item._id || item.uuid || `item-${idx}`;
              const coverUrl = fixUrl(item.cover || item.coverpath || item.coverUrl);
              const mediaUrl = fixUrl(item.video || item.file || item.filepath || item.fileUrl || item.url);
              const previewUrl = fixUrl(item.preview || item.previewpath || item.previewUrl);
              const isDeleting = deletingId === itemId;

              return (
                <div
                  key={itemId}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden hover:border-[#00E6D7]/30 transition-colors flex flex-col justify-between"
                >
                  {/* Preview Container */}
                  <div className="relative w-full h-44 bg-black/40 overflow-hidden">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={item.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <ImageIcon size={40} />
                      </div>
                    )}

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white/90">
                      {item.category}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={isDeleting}
                        className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-600 transition-colors backdrop-blur-sm cursor-pointer disabled:opacity-50"
                        title="Delete Portfolio"
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>

                    <button
                      onClick={() => startEdit(item)}
                      disabled={isDeleting}
                      className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#00E6D7]/90 text-black hover:bg-[#00E6D7] transition-colors backdrop-blur-sm cursor-pointer disabled:opacity-50"
                      title="Edit Portfolio"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>

                  {/* Details Footer */}
                  <div className="p-4 flex items-center justify-between border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 text-xs text-white/60 truncate">
                      {mediaUrl ? (
                        <a
                          href={mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#00E6D7] flex items-center gap-1 underline transition-colors"
                        >
                          <Film size={13} /> Video
                        </a>
                      ) : (
                        "No video"
                      )}
                      {previewUrl && (
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#00E6D7] text-cyan-400/90 flex items-center gap-1 underline transition-colors"
                        >
                          <Eye size={13} /> Preview
                        </a>
                      )}
                    </div>
                    <span className="text-xs text-white/30 font-mono">
                      #{String(itemId).slice(-6)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={cancelEdit}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0A1A1B] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Pencil size={18} className="text-[#00E6D7]" />
                  <h3 className="text-lg font-bold text-white">
                    Edit Portfolio #{String(editingItem.id || editingItem._id || "").slice(-6)}
                  </h3>
                </div>
                <button
                  onClick={cancelEdit}
                  className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow] appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#021617] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Video Replace (Optional) */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Video File <span className="text-white/40 font-normal">(optional — replace existing)</span>
                </label>
                <label className="group relative flex items-center justify-between px-4 py-3 border border-dashed border-white/15 rounded-xl hover:border-[#00E6D7]/50 hover:bg-[#00E6D7]/5 transition-colors cursor-pointer overflow-hidden bg-white/5">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      setEditFile(e.target.files?.[0] || null);
                      setEditPstart(0);
                      setEditPend(10);
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3 truncate">
                    <FileVideo size={20} className={editFile ? "text-[#00E6D7]" : "text-white/40"} />
                    <span className="text-sm text-white/90 truncate">
                      {editFile ? editFile.name : "Keep existing video (or select new video to replace)"}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#00E6D7] shrink-0 ml-2">
                    {editFile ? "Change" : "Browse"}
                  </span>
                </label>
              </div>

              {/* Cover Replace (Optional) */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Cover Image <span className="text-white/40 font-normal">(optional — replace)</span>
                </label>
                <label className="group relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/10 rounded-xl hover:border-[#00E6D7]/50 hover:bg-[#00E6D7]/5 transition-colors cursor-pointer overflow-hidden bg-white/[0.02]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditCover(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {editCover ? (
                    <div className="flex flex-col items-center gap-1 text-[#00E6D7]">
                      <ImageIcon size={22} />
                      <span className="text-xs font-medium truncate px-4 w-full text-center">
                        {editCover.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-white/40 group-hover:text-[#00E6D7] transition-colors">
                      <ImageIcon size={20} />
                      <span className="text-xs font-medium">Click to replace cover image</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Re-cut Preview Clip Checkbox & Trimmer */}
              <div className="space-y-3 pt-1 border-t border-white/5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editRecut}
                    onChange={(e) => setEditRecut(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#00E6D7] focus:ring-[#00E6D7]/40 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-white/90">
                    {editFile ? "Cut preview for new video" : "Re-cut preview from existing video"}
                  </span>
                </label>

                {editRecut && (
                  <VideoTrimmerBar
                    videoSource={editVideoSource}
                    pstart={editPstart}
                    pend={editPend}
                    onChange={(s, e) => {
                      setEditPstart(s);
                      setEditPend(e);
                    }}
                    maxCut={10}
                    label="Re-cut Preview Range (<= 10s)"
                  />
                )}
              </div>

              {/* Progress if updating file */}
              {updatingId && updateProgress > 0 && updateProgress < 100 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Uploading updates...</span>
                    <span>{updateProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00E6D7] transition-all"
                      style={{ width: `${updateProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={handleUpdate}
                  disabled={!!updatingId}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {updatingId ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={!!updatingId}
                  className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium text-sm hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-xs text-white/40">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoadingList}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoadingList}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
