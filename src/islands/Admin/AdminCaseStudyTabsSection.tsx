import { useEffect, useMemo, useState } from "react";
import { Edit2, Save, X, Loader2, Plus } from "lucide-react";
import { httpService } from "@/utils/httpService.ts";

export type TabKey = string;

export type TabItem = {
  key: TabKey;
  label: string;
  title: string;
  text: string;
};

type Props = {
  slug?: string;
};

export default function AdminCaseStudyTabsSection({ slug: propSlug }: Props) {
  const slug = propSlug || "";
  const [projectUUID, setProjectUUID] = useState<string>("");
  const [tabs, setTabs] = useState<TabItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("");
  const [displayedText, setDisplayedText] = useState("");
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSection, setNewSection] = useState({ label: "Client", title: "", text: "" });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setFetchError(false);
    setFetchErrorMessage(null);
    const fetchData = async () => {
      try {
        const details: any = await httpService.get(`/project/details`, { params: { slug } });
        const uuid = details?.projectUUID || details?.project || details?.uuid || details?.id || details?._id || details?.slug || slug || "";
        setProjectUUID(uuid);

        const texts = await httpService.get<any[]>(`/project/texts?slug=${slug}`);
        const rawTexts = Array.isArray(texts) ? texts : (texts as any)?.data || (texts as any)?.texts || [];
        const mapped = rawTexts.map((t: any) => ({
          key: (t.section || "section").replace(/\s+/g, "").toLowerCase(),
          label: t.section || "Section",
          title: t.title || "",
          text: t.description || t.text || "",
        }));
        setTabs(mapped);
        if (mapped.length > 0 && !activeTab) setActiveTab(mapped[0].key);
      } catch (err) {
        console.error("[AdminCaseStudyTabsSection] Fetch failed:", err);
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

  const activeTabItem = useMemo(
    () => tabs?.find((tab) => tab.key === activeTab) ?? (tabs?.length ? tabs[0] : null),
    [activeTab, tabs],
  );

  useEffect(() => {
    if (editField || isAdding || !activeTabItem) return;
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      i += 2;
      setDisplayedText(activeTabItem.text.slice(0, i));
      if (i >= activeTabItem.text.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [activeTab, activeTabItem?.text, editField, isAdding]);

  const startEdit = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
    setSaveError(null);
  };

  const cancelEdit = () => {
    setEditField(null);
    setEditValue("");
    setSaveError(null);
  };

  const saveEdit = async () => {
    if (!editField || !editValue.trim() || !activeTabItem) return;
    setSaving(true);
    setSaveError(null);
    try {
      if (editField === "title") {
        await httpService.patch(`/project/add`, { project: projectUUID, section: activeTabItem.label, title: editValue });
        setEditField(null);
        setEditValue("");
        window.location.reload();
      } else if (editField === "text") {
        await httpService.patch(`/project/add`, { project: projectUUID, section: activeTabItem.label, description: editValue });
        setEditField(null);
        setEditValue("");
        window.location.reload();
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const body = err?.response?.data;
      const detail = body
        ? typeof body === "string" ? body : body?.message || body?.error || body?.detail || JSON.stringify(body)
        : err instanceof Error ? err.message : String(err);
      setSaveError(status ? `HTTP ${status} — ${detail}` : String(err));
      setSaving(false);
    }
  };

  const addSection = async () => {
    if (!newSection.label || !newSection.title || !newSection.text) return;
    setSaving(true);
    setSaveError(null);
    try {
      await httpService.post(`/project/add`, {
        project: projectUUID,
        section: newSection.label,
        title: newSection.title,
        description: newSection.text,
      });
      setIsAdding(false);
      setNewSection({ label: "Client", title: "", text: "" });
      window.location.reload();
    } catch (err: any) {
      const status = err?.response?.status;
      const body = err?.response?.data;
      const detail = body
        ? typeof body === "string" ? body : body?.message || body?.error || body?.detail || JSON.stringify(body)
        : err instanceof Error ? err.message : String(err);
      setSaveError(status ? `HTTP ${status} — ${detail}` : String(err));
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
    if (e.key === "Escape") cancelEdit();
  };

  const EditBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white/40 hover:text-cyan-300 hover:bg-white/10 transition-colors shrink-0"
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

  const showTabs = tabs && tabs.length > 0;
  const noSlug = !slug;
  const showError = !loading && fetchError;
  const showEmpty = !loading && !fetchError && !showTabs && !noSlug;
  const showContent = !noSlug && !loading && !showError && showTabs;
  const showMain = !noSlug && !loading && !showError;

  return (
    <section className="relative overflow-hidden lg:py-40">
      {saveError && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-red-500/90 p-4 text-white text-sm shadow-lg">
          Save failed: {saveError}
          <button onClick={() => setSaveError(null)} className="ml-2 text-white/80 hover:text-white"><X className="h-3 w-3 inline" /></button>
        </div>
      )}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {noSlug && (
          <div className="text-center py-12">
            <p className="text-white/40">No project slug provided.</p>
          </div>
        )}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
            <p className="text-white/40 mt-4">Loading sections...</p>
          </div>
        )}
        {showError && (
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load project sections for slug: {slug}</p>
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
        {showMain && (
          <>
            <div className="mb-4 flex flex-nowrap items-center gap-6 overflow-x-auto pb-3 sm:gap-7 sm:justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs?.map((tab) => {
                const isActiveTab = tab.key === activeTab && !isAdding;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onMouseEnter={() => { if (!isAdding) setActiveTab(tab.key); }}
                    onFocus={() => { if (!isAdding) setActiveTab(tab.key); }}
                    onClick={() => { setIsAdding(false); setActiveTab(tab.key); }}
                    className={[
                      "relative shrink-0 text-sm font-medium transition-colors duration-200 sm:text-[15px] whitespace-nowrap",
                      isActiveTab ? "text-cyan-300" : "text-white/35 hover:text-white/60",
                    ].join(" ")}
                  >
                    {tab.label}
                    {isActiveTab && (
                      <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.75)]" />
                    )}
                  </button>
                );
              })}
              
              <button
                onClick={() => setIsAdding(true)}
                className={[
                  "relative shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-[color,background-color,border-color,box-shadow] text-sm font-medium border whitespace-nowrap",
                  isAdding 
                    ? "bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                    : "bg-cyan-400/10 text-cyan-300 border-cyan-400/20 hover:bg-cyan-400/20"
                ].join(" ")}
              >
                <Plus className="h-4 w-4" />
                Add New
              </button>
            </div>

            {isAdding ? (
              <div className="rounded-[26px] border border-cyan-400/30 bg-[#07181d]/95 px-5 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-7 sm:py-8 lg:px-8 lg:py-9">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-cyan-300">Add New Text Section</h3>
                  <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                 
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Section Label (Tab Name)</label>
                      <select
                        value={newSection.label}
                        onChange={e => setNewSection({...newSection, label: e.target.value})}
                        className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                        autoFocus
                      >
                        <option value="Client" className="bg-gray-800">Client</option>
                        <option value="Industry" className="bg-gray-800">Industry</option>
                        <option value="Service" className="bg-gray-800">Service</option>
                        <option value="Platforms" className="bg-gray-800">Platforms</option>
                        <option value="Primary Goal" className="bg-gray-800">Primary Goal</option>
                        <option value="Our Role" className="bg-gray-800">Our Role</option>
                        <option value="Starting Point" className="bg-gray-800">Starting Point</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Title</label>
                      <input 
                        type="text" 
                        value={newSection.title}
                        onChange={e => setNewSection({...newSection, title: e.target.value})}
                        placeholder="e.g. Modern Tech Stack"
                        className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
                    <textarea 
                      value={newSection.text}
                      onChange={e => setNewSection({...newSection, text: e.target.value})}
                      placeholder="Describe this section..."
                      rows={4}
                      className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={addSection}
                      disabled={saving || !newSection.label || !newSection.title || !newSection.text}
                      className="flex-1 py-3 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                      Save Section
                    </button>
                    <button 
                      onClick={() => setIsAdding(false)}
                      className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : showEmpty ? (
              <div className="rounded-[26px] border border-white/5 bg-[#07181d]/95 px-5 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-7 lg:px-8">
                <p className="text-white/60 text-sm">No text sections yet for this project.</p>
                <p className="text-white/40 text-sm mt-1">Add your first section to get started.</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-400 text-black text-sm font-bold hover:bg-cyan-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add First Text
                </button>
              </div>
            ) : (
              <div className="rounded-[26px] border border-white/5 bg-[#07181d]/95 px-5 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-7 sm:py-8 lg:px-8 lg:py-9">
                <div className="mb-4">
                  {editField === "title" ? (
                    <InlineInput value={editValue} />
                  ) : (
                    <div className="flex items-start gap-1">
                      <h2 className="text-[28px] font-bold leading-tight tracking-tight text-white sm:text-[32px]">
                        {activeTabItem?.title}
                      </h2>
                      <EditBtn onClick={() => startEdit("title", activeTabItem?.title || "")} />
                    </div>
                  )}
                </div>
                <div>
                  {editField === "text" ? (
                    <InlineInput value={editValue} multiline />
                  ) : (
                    <div className="flex items-start gap-1">
                      <p className="max-w-5xl text-[15px] leading-7 text-white/80 sm:text-base">
                        {displayedText}
                        {activeTabItem && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-cyan-300 align-middle animate-pulse" />}
                      </p>
                      <EditBtn onClick={() => startEdit("text", activeTabItem?.text || "")} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
