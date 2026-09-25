import { useState, useEffect } from "react";
import { Edit2, Save, X, Loader2 } from "lucide-react";
import { httpService } from "@/utils/httpService.ts";

interface CaseData {
  avatar?: string;
  title?: string;
  description?: string;
  tools?: { name: string; iconUrl?: string }[];
  projectType?: string;
  projectTimeline?: string;
  projectcategory?: string;
}

const CATEGORY_OPTIONS = ["Video", "Industry", "Animation"];

type Props = {
  slug?: string;
};

export default function AdminCaseStudyHero({ slug: propSlug }: Props) {
  const slug = propSlug || "";
  const [data, setData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const PATCH_BODY = { slug };

  const API_FIELD_MAP: Record<string, string> = {
    title: "projectname",
    description: "description",
    projectType: "type",
    projectTimeline: "timeline",
    projectcategory: "projectcategory",
  };

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setFetchError(false);
    setFetchErrorMessage(null);
    const fetchData = async () => {
      try {
        const res: Record<string, any> = await httpService.get(`/project/details` , { params : {slug : slug}});
        setData({
          title: res.title || "",
          description: res.description || "",
          projectType: res.type || "",
          projectTimeline: res.timeline || "",
          projectcategory: res.category || "",
          avatar: res.avatar || "",
          tools: res.tools || [],
        });
      } catch (err) {
        console.error("[AdminCaseStudyHero] Fetch failed:", err);
        setFetchError(true);
        if (err && typeof err === "object" && "response" in err) {
          const axiosErr = err as { response?: { status?: number; data?: any }; message?: string };
          const status = axiosErr.response?.status ?? "";
          const detail = axiosErr.response?.data?.message || axiosErr.response?.data?.error || "";
          setFetchErrorMessage(`HTTP ${status}${detail ? `: ${detail}` : ""}`);
        } else if (err instanceof Error) {
          setFetchErrorMessage(err.message);
        } else {
          setFetchErrorMessage(String(err));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, retryCounter]);

  const fixImageUrl = (url?: string) => {
    if (!url) return url;
    return url.replace(/\.png$/i, '.webp');
  };

  const startEdit = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
    setSaveError(null);
    if (field !== "avatar") setSelectedFile(null);
  };

  const cancelEdit = () => {
    setEditField(null);
    setEditValue("");
    setSelectedFile(null);
    setSaveError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSaveError(null);
    }
  };

  const saveEdit = async () => {
    if (!editField || !data) return;
    if (editField !== "avatar" && !editValue.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      if (editField === "tools") {
        const toolNames = editValue.split(",").map(n => n.trim()).filter(Boolean);
        const newTools = toolNames.map(name => {
          const existing = data!.tools?.find(t => t.name.toLowerCase() === name.toLowerCase());
          return {
            name,
            iconUrl: existing?.iconUrl || `/case/${name.toLowerCase().replace(/\s+/g, '')}.webp`
          };
        });
        await httpService.patch(`/project/details`, { ...PATCH_BODY, tools: newTools });
        setData(prev => ({ ...prev, tools: newTools } as CaseData));
      } else if (editField === "avatar") {
        if (selectedFile) {
          const formData = new FormData();
          formData.append("slug", slug);
          formData.append("picture", selectedFile);
          console.log("[Avatar Upload] formData entries:");
          for (const pair of (formData as any).entries()) {
            console.log(`  ${pair[0]}:`, pair[1] instanceof File ? `${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})` : pair[1]);
          }
          const res: any = await httpService.patch(`/project/details`, formData);
          const newAvatar = res?.avatar || "";
          setData(prev => ({ ...prev, avatar: newAvatar } as CaseData));
        } else {
          await httpService.patch(`/project/details`, { ...PATCH_BODY, avatar: editValue });
          setData(prev => ({ ...prev, avatar: editValue } as CaseData));
        }
        setSelectedFile(null);
      } else {
        const apiField = API_FIELD_MAP[editField] || editField;
        await httpService.patch(`/project/details`, { ...PATCH_BODY, [apiField]: editValue });
        setData(prev => ({ ...prev, [editField]: editValue } as CaseData));
      }
      setEditField(null);
      setEditValue("");
    } catch (err: any) {
      const status = err?.response?.status;
      const body = err?.response?.data;
      const detail = body
        ? typeof body === "string" ? body : body?.message || body?.error || body?.detail || JSON.stringify(body)
        : err instanceof Error ? err.message : String(err);
      setSaveError(status ? `HTTP ${status} — ${detail}` : String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
    if (e.key === "Escape") cancelEdit();
  };

  const EditBtn = ({ onClick, className = "" }: { onClick: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-white/40 hover:text-cyan-300 hover:bg-white/10 transition-colors ml-2 shrink-0 ${className}`}
      aria-label="Edit"
    >
      <Edit2 className="h-3.5 w-3.5" />
    </button>
  );

  const InlineInput = ({ value, multiline = false }: { value: string; multiline?: boolean }) => (
    <div className="flex gap-2 items-start w-full">
      {multiline ? (
        <textarea
          value={value}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 resize-y"
          rows={3}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          autoFocus
        />
      )}
      <div className="flex gap-1 shrink-0">
        <button onClick={saveEdit} disabled={saving} className="p-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors" aria-label="Save">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </button>
        <button onClick={cancelEdit} disabled={saving} className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors" aria-label="Cancel">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const noSlug = !slug;
  const isLoading = loading;
  const hasError = fetchError || !data;

  return (
    <>
      {saveError && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-red-500/90 p-4 text-white text-sm shadow-lg">
          Save failed: {saveError}
          <button onClick={() => setSaveError(null)} className="ml-2 text-white/80 hover:text-white"><X className="h-3 w-3 inline" /></button>
        </div>
      )}

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
        {noSlug && (
          <div className="mx-auto max-w-7xl px-4 text-center">
            <p className="text-white/40">No project slug provided.</p>
          </div>
        )}
        {isLoading && (
          <div className="mx-auto max-w-7xl px-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
            <p className="text-white/40 mt-4">Loading project...</p>
          </div>
        )}
        {hasError && (
          <div className="mx-auto max-w-7xl px-4 text-center">
            <p className="text-red-400">Failed to load project data for slug: {slug}</p>
            {fetchErrorMessage && (
              <p className="text-red-300/70 text-sm mt-2">{fetchErrorMessage}</p>
            )}
            <button
              onClick={() => {
                setRetryCounter(c => c + 1);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}
        {!noSlug && !isLoading && !hasError && (
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
          {/* Left */}
          <div className="w-full lg:w-[48%]">
            {/* Title */}
            <div className="mb-4">
              {editField === "title" ? (
                <InlineInput value={editValue} />
              ) : (
                <div className="flex items-start gap-1">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-cyan-300 sm:text-4xl lg:text-[3.35rem]">
                    {data!.title}
                  </h1>
                  <EditBtn onClick={() => startEdit("title", data!.title || "")} />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              {editField === "description" ? (
                <InlineInput value={editValue} multiline />
              ) : (
                <div className="flex items-start gap-1">
                  <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-[15px] lg:text-base">
                    {data!.description}
                  </p>
                  <EditBtn onClick={() => startEdit("description", data!.description || "")} className="mt-1" />
                </div>
              )}
            </div>

            {/* Tools */}
            <div className="mb-4">
              {editField === "tools" ? (
                <InlineInput value={editValue} />
              ) : (
                <div>
                  <p className="text-sm font-semibold text-white/80 mb-4">Tools:</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {(data!.tools || []).map((tool, idx) => (
                      <div key={idx} className="group flex h-11 min-w-11 items-center justify-center rounded-xl transition-transform duration-200 hover:-translate-y-0.5">
                        {tool.iconUrl ? (
                          <img src={fixImageUrl(tool.iconUrl)} alt={tool.name} width="28" height="28" className="h-7 w-7 object-contain" loading="lazy" />
                        ) : (
                          <span className="text-[11px] font-semibold tracking-wide text-white/45">{tool.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project Type, Category & Timeline */}
            <div className="mt-10">
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#061b21]/90 px-4 py-2 text-sm text-white/75">
                  <img src="/case/layers.webp" alt="Layers" />
                  <span>Project Type : {data!.projectType}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#061b21]/90 px-4 py-2 text-sm text-white/75">
                  <img src="/case/clock.webp" alt="Clock" />
                  <span>Project Timeline : {data!.projectTimeline}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#061b21]/90 px-4 py-2 text-sm text-white/75">
                  <img src="/case/layers.webp" alt="Category" />
                  <span>Category : {data!.projectcategory || "Not set"}</span>
                </div>
              </div>
              {editField === "projectType" ? (
                <div className="mt-3">
                  <InlineInput value={editValue} />
                </div>
              ) : editField === "projectTimeline" ? (
                <div className="mt-3">
                  <InlineInput value={editValue} />
                </div>
              ) : editField === "projectcategory" ? (
                <div className="mt-3 flex gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setEditValue(cat);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        editValue === cat
                          ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                          : "bg-white/5 text-white/50 border border-white/10 hover:text-white/70"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button onClick={saveEdit} disabled={saving} className="p-2 rounded-lg bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 transition-colors" aria-label="Save">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </button>
                  <button onClick={cancelEdit} disabled={saving} className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors" aria-label="Cancel">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => startEdit("projectType", data!.projectType || "")} className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white/40 hover:text-cyan-300 hover:bg-white/10 transition-colors" aria-label="Edit project type">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => startEdit("projectTimeline", data!.projectTimeline || "")} className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white/40 hover:text-cyan-300 hover:bg-white/10 transition-colors" aria-label="Edit project timeline">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => startEdit("projectcategory", data!.projectcategory || "")} className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white/40 hover:text-cyan-300 hover:bg-white/10 transition-colors" aria-label="Edit category">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="w-full lg:w-[52%]">
            <div className="relative mx-auto w-full max-w-[620px]">
              <div className="absolute inset-0 rounded-[28px] bg-[#061b21]/30 blur-[38px]"></div>
              <div className="relative overflow-hidden rounded-[28px]">
                <div
                  className="skeleton-placeholder absolute inset-0 rounded-[28px] border border-cyan-300/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                  style={{
                    overflow: 'hidden',
                    borderRadius: 'inherit',
                    background: '#061b21',
                    zIndex: 1,
                    transition: 'opacity 0.4s ease'
                  }}
                >
                  <div className="mesh-gradient"></div>
                  <div className="noise-overlay"></div>
                  <div className="shimmer"></div>
                  <div className="particle particle-1"></div>
                  <div className="particle particle-2"></div>
                  <div className="particle particle-3"></div>
                  <div className="particle particle-4"></div>
                  <div className="particle particle-5"></div>
                  <div className="particle particle-6"></div>
                  <div className="particle particle-7"></div>
                  <div className="particle particle-8"></div>
                  <div className="blob blob-1"></div>
                  <div className="blob blob-2"></div>
                  <div className="blob blob-3"></div>
                  <div className="geo-ring geo-ring-1"></div>
                  <div className="geo-ring geo-ring-2"></div>
                  <div className="geo-ring geo-ring-3"></div>
                  <div className="geo-ring geo-ring-4"></div>
                  <div className="shape shape-1"></div>
                  <div className="shape shape-2"></div>
                  <div className="shape shape-3"></div>
                  <div className="shape shape-4"></div>
                  <div className="shape shape-5"></div>
                  <div className="shape shape-6"></div>
                  <div className="pulse-ring pulse-ring-1"></div>
                  <div className="pulse-ring pulse-ring-2"></div>
                  <div className="pulse-ring pulse-ring-3"></div>
                  <div className="grid-line grid-h-1"></div>
                  <div className="grid-line grid-h-2"></div>
                  <div className="grid-line grid-h-3"></div>
                  <div className="grid-line grid-v-1"></div>
                  <div className="grid-line grid-v-2"></div>
                  <div className="grid-line grid-v-3"></div>
                </div>
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .mesh-gradient {
                      position: absolute;
                      inset: -50%;
                      background: 
                        radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.2) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 20%, rgba(74,222,128,0.15) 0%, transparent 50%),
                        radial-gradient(ellipse at 40% 80%, rgba(34,211,238,0.12) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 60%, rgba(74,222,128,0.1) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.08) 0%, transparent 60%);
                      animation: meshMove 15s ease-in-out infinite;
                      filter: blur(40px);
                    }
                    @keyframes meshMove {
                      0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                      25% { transform: translate(8%, -8%) rotate(3deg) scale(1.05); }
                      50% { transform: translate(-5%, 8%) rotate(-2deg) scale(0.95); }
                      75% { transform: translate(-8%, -5%) rotate(2deg) scale(1.02); }
                    }
                    .noise-overlay {
                      position: absolute;
                      inset: 0;
                      opacity: 0.03;
                      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                      background-size: 128px 128px;
                      animation: noiseShift 0.5s steps(10) infinite;
                    }
                    @keyframes noiseShift {
                      0% { transform: translate(0, 0); }
                      10% { transform: translate(-5%, -5%); }
                      20% { transform: translate(5%, 5%); }
                      30% { transform: translate(-5%, 5%); }
                      40% { transform: translate(5%, -5%); }
                      50% { transform: translate(-5%, 0); }
                      60% { transform: translate(5%, 0); }
                      70% { transform: translate(0, 5%); }
                      80% { transform: translate(0, -5%); }
                      90% { transform: translate(5%, 5%); }
                      100% { transform: translate(0, 0); }
                    }
                    .shimmer {
                      position: absolute;
                      top: 0; left: -100%;
                      width: 50%; height: 100%;
                      background: linear-gradient(90deg, transparent, rgba(34,211,238,0.15), rgba(74,222,128,0.1), transparent);
                      animation: shimmerSweep 2.5s ease-in-out infinite;
                    }
                    @keyframes shimmerSweep {
                      0% { left: -100%; }
                      100% { left: 200%; }
                    }
                    .particle {
                      position: absolute;
                      border-radius: 50%;
                      animation: particleFloat 8s ease-in-out infinite;
                    }
                    .particle::after {
                      content: '';
                      position: absolute;
                      inset: -2px;
                      border-radius: 50%;
                      background: inherit;
                      filter: blur(4px);
                      opacity: 0.5;
                    }
                    .particle-1 { width: 4px; height: 4px; background: rgba(34,211,238,0.8); top: 15%; left: 20%; animation-delay: 0s; animation-duration: 7s; }
                    .particle-2 { width: 3px; height: 3px; background: rgba(74,222,128,0.7); top: 65%; left: 75%; animation-delay: -1s; animation-duration: 9s; }
                    .particle-3 { width: 5px; height: 5px; background: rgba(34,211,238,0.6); top: 45%; left: 55%; animation-delay: -2s; animation-duration: 6s; }
                    .particle-4 { width: 3px; height: 3px; background: rgba(74,222,128,0.8); top: 80%; left: 35%; animation-delay: -3s; animation-duration: 8s; }
                    .particle-5 { width: 4px; height: 4px; background: rgba(34,211,238,0.7); top: 25%; left: 80%; animation-delay: -4s; animation-duration: 7.5s; }
                    .particle-6 { width: 6px; height: 6px; background: rgba(74,222,128,0.6); top: 70%; left: 50%; animation-delay: -5s; animation-duration: 10s; }
                    .particle-7 { width: 3px; height: 3px; background: rgba(34,211,238,0.5); top: 55%; left: 25%; animation-delay: -6s; animation-duration: 8.5s; }
                    .particle-8 { width: 4px; height: 4px; background: rgba(74,222,128,0.7); top: 35%; left: 65%; animation-delay: -7s; animation-duration: 9.5s; }
                    @keyframes particleFloat {
                      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                      20% { transform: translate(20px, -25px) scale(1.3); opacity: 0.9; }
                      40% { transform: translate(-15px, -40px) scale(0.7); opacity: 0.5; }
                      60% { transform: translate(25px, -20px) scale(1.2); opacity: 0.8; }
                      80% { transform: translate(-10px, -30px) scale(0.9); opacity: 0.6; }
                    }
                    .blob {
                      position: absolute;
                      border-radius: 50%;
                      filter: blur(60px);
                      animation: blobMorph 12s ease-in-out infinite;
                    }
                    .blob-1 {
                      width: 200px; height: 200px;
                      top: 10%; left: 10%;
                      background: radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%);
                      animation-delay: 0s;
                    }
                    .blob-2 {
                      width: 150px; height: 150px;
                      bottom: 20%; right: 15%;
                      background: radial-gradient(circle, rgba(74,222,128,0.25) 0%, transparent 70%);
                      animation-delay: -4s;
                    }
                    .blob-3 {
                      width: 180px; height: 180px;
                      top: 50%; left: 40%;
                      background: radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%);
                      animation-delay: -8s;
                    }
                    @keyframes blobMorph {
                      0%, 100% { transform: translate(0, 0) scale(1); border-radius: 50%; }
                      25% { transform: translate(30px, -20px) scale(1.2); border-radius: 40% 60% 60% 40%; }
                      50% { transform: translate(-20px, 30px) scale(0.8); border-radius: 60% 40% 40% 60%; }
                      75% { transform: translate(20px, 20px) scale(1.1); border-radius: 50% 50% 40% 60%; }
                    }
                    .geo-ring {
                      position: absolute;
                      top: 50%; left: 50%;
                      border: 1px solid rgba(34,211,238,0.2);
                      border-radius: 50%;
                      animation: ringRotate 20s linear infinite;
                    }
                    .geo-ring::before {
                      content: '';
                      position: absolute;
                      top: -2px; left: 50%;
                      width: 4px; height: 4px;
                      background: rgba(34,211,238,0.6);
                      border-radius: 50%;
                      box-shadow: 0 0 8px rgba(34,211,238,0.4);
                    }
                    .geo-ring-1 { width: 250px; height: 250px; margin: -125px 0 0 -125px; animation-duration: 25s; }
                    .geo-ring-2 { width: 180px; height: 180px; margin: -90px 0 0 -90px; animation-duration: 18s; animation-direction: reverse; border-color: rgba(74,222,128,0.15); }
                    .geo-ring-2::before { background: rgba(74,222,128,0.5); box-shadow: 0 0 8px rgba(74,222,128,0.3); }
                    .geo-ring-3 { width: 350px; height: 350px; margin: -175px 0 0 -175px; animation-duration: 30s; border-color: rgba(34,211,238,0.1); }
                    .geo-ring-4 { width: 120px; height: 120px; margin: -60px 0 0 -60px; animation-duration: 15s; animation-direction: reverse; border-color: rgba(74,222,128,0.12); }
                    .geo-ring-4::before { background: rgba(74,222,128,0.4); box-shadow: 0 0 8px rgba(74,222,128,0.2); }
                    @keyframes ringRotate {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                    .shape {
                      position: absolute;
                      animation: shapeFloat 12s ease-in-out infinite;
                    }
                    .shape-1 {
                      width: 60px; height: 60px;
                      top: 15%; left: 15%;
                      border: 1px solid rgba(34,211,238,0.2);
                      border-radius: 50%;
                      animation-delay: 0s;
                    }
                    .shape-2 {
                      width: 40px; height: 40px;
                      top: 75%; right: 15%;
                      border: 1px solid rgba(74,222,128,0.15);
                      border-radius: 8px;
                      animation-delay: -2s;
                      transform: rotate(45deg);
                    }
                    .shape-3 {
                      width: 80px; height: 80px;
                      bottom: 20%; left: 25%;
                      border: 1px solid rgba(34,211,238,0.12);
                      border-radius: 50%;
                      animation-delay: -4s;
                    }
                    .shape-4 {
                      width: 35px; height: 35px;
                      top: 30%; right: 25%;
                      border: 1px solid rgba(74,222,128,0.12);
                      border-radius: 6px;
                      animation-delay: -6s;
                      transform: rotate(30deg);
                    }
                    .shape-5 {
                      width: 50px; height: 50px;
                      top: 55%; left: 45%;
                      border: 1px solid rgba(34,211,238,0.1);
                      border-radius: 50%;
                      animation-delay: -3s;
                    }
                    .shape-6 {
                      width: 45px; height: 45px;
                      top: 20%; left: 60%;
                      border: 1px solid rgba(74,222,128,0.1);
                      border-radius: 10px;
                      animation-delay: -5s;
                      transform: rotate(60deg);
                    }
                    @keyframes shapeFloat {
                      0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.3; }
                      33% { transform: translateY(-30px) scale(1.15) rotate(8deg); opacity: 0.7; }
                      66% { transform: translateY(20px) scale(0.85) rotate(-5deg); opacity: 0.4; }
                    }
                    .pulse-ring {
                      position: absolute;
                      top: 50%; left: 50%;
                      border: 1px solid rgba(34,211,238,0.2);
                      border-radius: 50%;
                      animation: pulseExpand 6s ease-out infinite;
                    }
                    .pulse-ring-1 { width: 100px; height: 100px; margin: -50px 0 0 -50px; }
                    .pulse-ring-2 { width: 150px; height: 150px; margin: -75px 0 0 -75px; animation-delay: -2s; border-color: rgba(74,222,128,0.15); }
                    .pulse-ring-3 { width: 200px; height: 200px; margin: -100px 0 0 -100px; animation-delay: -4s; border-color: rgba(34,211,238,0.1); }
                    @keyframes pulseExpand {
                      0% { transform: scale(0.2); opacity: 0.9; }
                      100% { transform: scale(3.5); opacity: 0; }
                    }
                    .grid-line {
                      position: absolute;
                      background: rgba(34,211,238,0.05);
                      animation: gridPulse 4s ease-in-out infinite;
                    }
                    .grid-h-1 { top: 33%; left: 0; right: 0; height: 1px; animation-delay: 0s; }
                    .grid-h-2 { top: 66%; left: 0; right: 0; height: 1px; animation-delay: -1.3s; }
                    .grid-h-3 { top: 50%; left: 0; right: 0; height: 1px; animation-delay: -2.6s; background: rgba(74,222,128,0.04); }
                    .grid-v-1 { left: 33%; top: 0; bottom: 0; width: 1px; animation-delay: -0.7s; }
                    .grid-v-2 { left: 66%; top: 0; bottom: 0; width: 1px; animation-delay: -2s; }
                    .grid-v-3 { left: 50%; top: 0; bottom: 0; width: 1px; animation-delay: -3.3s; background: rgba(74,222,128,0.04); }
                    @keyframes gridPulse {
                      0%, 100% { opacity: 0.3; }
                      50% { opacity: 0.8; }
                    }
                  `
                }} />
                <img
                  src={data!.avatar?.startsWith("http") ? data!.avatar : `${import.meta.env.PUBLIC_API_URL}${fixImageUrl(data!.avatar) || ""}`}
                  alt={data!.title || "Hero"}
                  width="1200"
                  height="900"
                  loading="lazy"
                  className="block h-full w-full object-cover relative"
                  style={{ opacity: loading ? 0 : 1, transition: 'opacity .4s ease', zIndex: 2 }}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    img.style.opacity = '1';
                    const parent = img.parentElement;
                    const skeleton = parent?.querySelector('.skeleton-placeholder');
                    if (skeleton) (skeleton as HTMLElement).style.display = 'none';
                  }}
                />
                {editField === "avatar" ? (
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="flex flex-col gap-2 rounded-lg bg-black/70 p-3 backdrop-blur-sm border border-white/10">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-white text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-cyan-400/20 file:text-cyan-300 hover:file:bg-cyan-400/30 file:cursor-pointer cursor-pointer"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={saveEdit}
                          disabled={saving || !selectedFile}
                          className="px-3 py-1.5 rounded-lg bg-cyan-400/20 text-cyan-300 text-xs font-medium hover:bg-cyan-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1.5 rounded-lg bg-white/10 text-white/60 text-xs font-medium hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit("avatar", data!.avatar || "")}
                    className="absolute top-4 right-4 text-white/60 hover:text-cyan-300 transition-colors z-10 bg-black/40 p-1.5 rounded-md backdrop-blur-sm"
                    aria-label="Edit hero image"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </section>
    </>
  );
}