import React, { useState, useEffect, useCallback } from "react";
import { Upload, Plus, AlertCircle, CheckCircle2, Image as ImageIcon, FileVideo, Trash2, ChevronLeft, ChevronRight, Loader2, Pencil, Save, X } from "lucide-react";
import { httpService } from "@/utils/httpService.ts";

const CATEGORIES = ["Brand Trailer", "Explainer Videos", "Motion Graphics", "Ad Creatives", "Social Content", "Graphic Design"];
const FILTER_CATEGORIES = ["All", ...CATEGORIES];

type PortfolioItem = {
  id?: string;
  _id?: string;
  uuid?: string;
  category: string;
  file?: string;
  filepath?: string;
  fileUrl?: string;
  url?: string;
  cover?: string;
  coverpath?: string;
  coverUrl?: string;
  createdAt?: string;
};

export default function PortfoliosManager() {
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  // List & Filter & Pagination States
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [filterCategory, setFilterCategory] = useState("All");
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editCover, setEditCover] = useState<File | null>(null);
  const [editCategory, setEditCategory] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPortfolios = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const res: any = await httpService.get(`/portfolio/list?page=${page}&limit=${limit}`, {
        params: filterCategory === "All" ? {} : { category: filterCategory }
      });

      let items: PortfolioItem[] = [];
      let totalP = 1;
      let totalC = 0;

      if (Array.isArray(res)) {
        items = res;
        totalC = res.length;
      } else if (res && typeof res === 'object') {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !file || !cover) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('file', file);
      formData.append('cover', cover);

      await httpService.post('/portfolio/upload', formData);

      setStatus({ type: 'success', message: 'Portfolio uploaded successfully!' });
      
      // Reset form
      setCategory("");
      setFile(null);
      setCover(null);
      
      // Clear file inputs
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      const coverInput = document.getElementById('cover-upload') as HTMLInputElement;
      if (coverInput) coverInput.value = '';
      
      // Refresh listing
      fetchPortfolios();
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to upload portfolio. Please try again.' });
    } finally {
      setIsSubmitting(false);
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
      setStatus({ type: 'success', message: 'Portfolio item deleted successfully.' });
      fetchPortfolios();
    } catch (err: any) {
      console.error("[PortfoliosManager] Delete failed:", err);
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to delete portfolio item.' });
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setEditCategory(item.category || "");
    setEditFile(null);
    setEditCover(null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditFile(null);
    setEditCover(null);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    const itemId = String(editingItem.id || editingItem._id || editingItem.uuid);
    if (!editCategory) {
      setStatus({ type: 'error', message: 'Category is required.' });
      return;
    }

    setUpdatingId(itemId);
    setStatus({ type: 'idle', message: '' });
    try {
      const formData = new FormData();
      formData.append('category', editCategory);
      if (editFile) formData.append('file', editFile);
      if (editCover) formData.append('cover', editCover);

      await httpService.patch(`/portfolio/${itemId}`, formData);

      setStatus({ type: 'success', message: 'Portfolio item updated successfully.' });
      cancelEdit();
      fetchPortfolios();
    } catch (err: any) {
      console.error("[PortfoliosManager] Update failed:", err);
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update portfolio item.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const fixUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${import.meta.env.PUBLIC_API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header & Add Form Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Add Portfolio</h2>
          <p className="text-sm text-white/50 mt-1">Upload a new portfolio item to showcase your work.</p>
        </div>

        {/* Status Messages */}
        
          {status.type !== 'idle' && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 border ${
                status.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}
        

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow] appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-[#021617] text-white/50">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#021617] text-white">{c}</option>
                ))}
              </select>
            </div>

            <div></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Cover Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Cover Image</label>
              <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-xl hover:border-[#00E6D7]/50 hover:bg-[#00E6D7]/5 transition-colors cursor-pointer overflow-hidden">
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCover(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {cover ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img src={URL.createObjectURL(cover)} alt="Cover preview" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium flex items-center gap-2"><Upload size={16} /> Change Cover</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/40 group-hover:text-[#00E6D7] transition-colors">
                    <ImageIcon size={32} />
                    <span className="text-sm font-medium">Click to upload cover</span>
                  </div>
                )}
              </label>
            </div>

            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Media File</label>
              <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-xl hover:border-[#00E6D7]/50 hover:bg-[#00E6D7]/5 transition-colors cursor-pointer overflow-hidden">
                <input
                  id="file-upload"
                  type="file"
                  accept="video/*,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {file ? (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-white/5">
                    <FileVideo size={48} className="text-[#00E6D7] mb-2" />
                    <span className="text-sm font-medium text-white truncate px-4 w-full text-center">{file.name}</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium flex items-center gap-2"><Upload size={16} /> Change File</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/40 group-hover:text-[#00E6D7] transition-colors">
                    <Upload size={32} />
                    <span className="text-sm font-medium">Click to upload file</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Portfolio
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
              {totalCount > 0 ? `${totalCount} items found` : 'View and delete existing portfolios'}
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

                    <button
                      onClick={() => handleDelete(item)}
                      disabled={isDeleting}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-600 transition-colors backdrop-blur-sm cursor-pointer disabled:opacity-50"
                      title="Delete Portfolio"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      disabled={isDeleting}
                      className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#00E6D7]/80 text-black hover:bg-[#00E6D7] transition-colors backdrop-blur-sm cursor-pointer disabled:opacity-50"
                      title="Edit Portfolio"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>

                  {/* Details Footer */}
                  <div className="p-4 flex items-center justify-between border-t border-white/5 bg-black/20">
                    <span className="text-xs text-white/40 truncate max-w-[200px]">
                      {mediaUrl ? (
                        <a
                          href={mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#00E6D7] underline transition-colors"
                        >
                          View Media
                        </a>
                      ) : (
                        "No media file"
                      )}
                    </span>
                    <span className="text-xs text-white/30">
                      ID: {String(itemId).slice(-6)}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={cancelEdit}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-[#0A1A1B] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Edit Portfolio</h3>
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

                {/* Video */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Video <span className="text-white/40 font-normal">(optional — replace)</span>
                  </label>
                  <label className="group relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/10 rounded-xl hover:border-[#00E6D7]/50 hover:bg-[#00E6D7]/5 transition-colors cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    {editFile ? (
                      <div className="flex flex-col items-center gap-1 text-[#00E6D7]">
                        <FileVideo size={24} />
                        <span className="text-xs font-medium truncate px-4 w-full text-center">{editFile.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-white/40 group-hover:text-[#00E6D7] transition-colors">
                        <Upload size={22} />
                        <span className="text-xs font-medium">Click to replace video</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Cover */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Cover Image <span className="text-white/40 font-normal">(optional — replace)</span>
                  </label>
                  <label className="group relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/10 rounded-xl hover:border-[#00E6D7]/50 hover:bg-[#00E6D7]/5 transition-colors cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditCover(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    {editCover ? (
                      <div className="flex flex-col items-center gap-1 text-[#00E6D7]">
                        <ImageIcon size={24} />
                        <span className="text-xs font-medium truncate px-4 w-full text-center">{editCover.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-white/40 group-hover:text-[#00E6D7] transition-colors">
                        <ImageIcon size={22} />
                        <span className="text-xs font-medium">Keep to replace cover</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleUpdate}
                    disabled={!!updatingId}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    {updatingId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
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

