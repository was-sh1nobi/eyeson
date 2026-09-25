import React, { useState, useEffect } from "react";
import { Eye, Users, Plus, Search, Grid3X3, List, ArrowUpRight, Pencil, Trash2, Loader2 } from "lucide-react";
import { dashboardService } from "@/services/dashboardService.ts";
import { httpService } from "@/utils/httpService.ts";

type ApiProject = {
  id?: string;
  uuid?: string;
  cover: string;
  title: string;
  slug: string;
  ownerName: string;
  updatedAt: string;
  views: number;
};

type ProjectItem = {
  id?: string;
  uuid?: string;
  slug: string;
  title: string;
  views: number;
  owner: string;
  updated: string;
  cover: string;
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Draft: "bg-white/10 text-white/50 border-white/10",
  Review: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export default function ProjectsList() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [projectname, setProjectname] = useState("");
  const [projectcategory, setProjectcategory] = useState("Video");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const categories = ["Video", "Industry", "Animation", "Design"];

  const loadProjects = async () => {
    try {
      const data = await dashboardService.getAllProjects();
      setProjects(
        data.projects.map((p: ApiProject) => ({
          id: p.id,
          uuid: p.uuid,
          slug: p.slug,
          title: p.title,
          views: p.views,
          owner: p.ownerName,
          updated: p.updatedAt,
          cover: p.cover,
        }))
      );
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteProject = async (p: ProjectItem) => {
    const targetId = p.id || p.uuid || p.slug;
    if (!targetId) return;

    if (!window.confirm(`Are you sure you want to delete project "${p.title}"?`)) {
      return;
    }

    setDeletingSlug(p.slug);
    try {
      await httpService.delete(`/project/${targetId}`);
      await loadProjects();
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project. Please try again.");
    } finally {
      setDeletingSlug(null);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const anyOpen = showNew;
    try {
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("overflow-hidden", anyOpen);
      }
    } catch (e) {}
    return () => {
      try {
        if (typeof document !== "undefined") document.documentElement.classList.remove("overflow-hidden");
      } catch (e) {}
    };
  }, [showNew]);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await httpService.post("/project/create", {
        projectname,
        projectcategory,
        description,
      });
      // Reload projects from backend after creation
      const data = await dashboardService.getAllProjects();
      setProjects(
        data.projects.map((p: ApiProject) => ({
          slug: p.slug,
          title: p.title,
          views: p.views,
          owner: p.ownerName,
          updated: p.updatedAt,
          cover: p.cover,
        }))
      );
      setProjectname("");
      setProjectcategory("Video");
      setDescription("");
      setShowNew(false);
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Projects</h2>
          <p className="text-sm text-white/50 mt-0.5">{projects.length} total projects</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black font-medium text-sm hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#00E6D7]/15 border-[#00E6D7]/30 text-[#00E6D7]" : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${viewMode === "list" ? "bg-[#00E6D7]/15 border-[#00E6D7]/30 text-[#00E6D7]" : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
            {filteredProjects.map((p, i) => (
              <div
                key={p.slug}
                className="group rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E6D7]/20 to-[#12ACB5]/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {p.cover ? (
                      <img
                        src={p.cover.startsWith("http") ? p.cover : `${import.meta.env.PUBLIC_API_URL}${p.cover}`}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <span className={`text-sm font-bold text-[#00E6D7] ${p.cover ? "hidden" : ""}`}>{p.title.charAt(0)}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Active
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-[#00E6D7] transition-colors">{p.title}</h3>
                <p className="text-sm text-white/40 mb-4">Updated {p.updated}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 text-sm text-white/50">
                    <span className="flex items-center gap-1.5"><Eye size={14} /> {p.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><Users size={14} /> {p.owner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/case/${p.slug}`}
                      className="flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
                    >
                      Open <ArrowUpRight size={14} />
                    </a>
                    <a
                      href={`/admin/case/${p.slug}`}
                      className="flex items-center gap-1 text-sm text-[#00E6D7] hover:text-[#00E6D7]/80 transition-colors cursor-pointer"
                    >
                      <Pencil size={14} />
                    </a>
                    <button
                      onClick={() => handleDeleteProject(p)}
                      disabled={deletingSlug === p.slug}
                      className="p-1.5 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Project"
                    >
                      {deletingSlug === p.slug ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl divide-y divide-white/5">
          
            {filteredProjects.map((p, i) => (
              <div
                key={p.slug}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E6D7]/20 to-[#12ACB5]/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {p.cover ? (
                      <img
                        src={p.cover.startsWith("http") ? p.cover : `${import.meta.env.PUBLIC_API_URL}${p.cover}`}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <span className={`text-sm font-bold text-[#00E6D7] ${p.cover ? "hidden" : ""}`}>{p.title.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-white truncate">{p.title}</div>
                    <div className="text-sm text-white/40 flex items-center gap-2">
                      <span>{p.owner}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{p.updated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Active
                  </span>
                  <div className="hidden md:flex items-center gap-1.5 text-sm text-white/50">
                    <Eye size={14} />
                    <span>{p.views.toLocaleString()}</span>
                  </div>
                  <a
                    href={`/case/${p.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Open
                  </a>
                  <a
                    href={`/admin/case/${p.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDeleteProject(p)}
                    disabled={deletingSlug === p.slug}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Project"
                  >
                    {deletingSlug === p.slug ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            ))}
          
        </div>
      )}

      {/* Create Project Modal */}
      
        {showNew && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !creating && setShowNew(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#021617] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-1">Create New Project</h3>
              <p className="text-sm text-white/50 mb-5">Fill in the details to create a new project.</p>

              <form onSubmit={createProject} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Project Name</label>
                  <input
                    value={projectname}
                    onChange={(e) => setProjectname(e.target.value)}
                    required
                    placeholder="Enter project name"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Category</label>
                  <select
                    value={projectcategory}
                    onChange={(e) => setProjectcategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow] appearance-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#021617]">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow] resize-none cursor-text"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNew(false)}
                    disabled={creating}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    {creating ? "Creating..." : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      
    </div>
  );
}