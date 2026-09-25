import React, { useState, useEffect, useRef } from "react";
import { Tag, Plus, X, Check, Pencil, Loader2, Save } from "lucide-react";
import { dashboardService } from "@/services/dashboardService.ts";

export default function ProjectTypesManager() {
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newType, setNewType] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    if (editingIndex !== null && editRef.current) {
      editRef.current.focus();
    }
  }, [editingIndex]);

  async function fetchTypes() {
    setLoading(true);
    try {
      const result = await dashboardService.getProjectTypes();
      setTypes(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load project types", err);
      setFeedback({ type: "error", message: "Failed to load project types" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await dashboardService.updateProjectTypes(types);
      setFeedback({ type: "success", message: "Project types saved successfully" });
    } catch (err) {
      console.error("Failed to save project types", err);
      setFeedback({ type: "error", message: "Failed to save project types" });
    } finally {
      setSaving(false);
    }
  }

  function handleAdd() {
    const trimmed = newType.trim();
    if (!trimmed) return;
    if (types.includes(trimmed)) {
      setFeedback({ type: "error", message: "Duplicate project type" });
      return;
    }
    setTypes([...types, trimmed]);
    setNewType("");
  }

  function handleRemove(index: number) {
    setTypes(types.filter((_, i) => i !== index));
  }

  function startEdit(index: number) {
    setEditingIndex(index);
  }

  function confirmEdit(index: number, value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setTypes(types.map((t, i) => (i === index ? trimmed : t)));
    setEditingIndex(null);
  }

  function cancelEdit() {
    setEditingIndex(null);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#00E6D7]/20 to-[#12ACB5]/10 border border-[#00E6D7]/20">
            <Tag className="h-5 w-5 text-[#00E6D7]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Project Types</h1>
            <p className="text-sm text-white/40">Manage and edit all project types</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-[#021617] font-medium text-sm hover:shadow-lg hover:shadow-[#00E6D7]/20 transition-shadow disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      
        {feedback && (
          <div
            key="feedback"
            className={`mb-4 px-4 py-3 rounded-xl text-sm ${
              feedback.type === "success"
                ? "bg-[#00E6D7]/10 border border-[#00E6D7]/20 text-[#00E6D7]"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {feedback.message}
          </div>
        )}
      

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add new project type..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow]"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-[#021617] font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 text-[#00E6D7] animate-spin" />
          </div>
        ) : types.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">
            No project types yet. Add one above.
          </div>
        ) : (
          <div className="space-y-2">
            {types.map((type, index) => (
              <div
                key={`${index}-${type}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 group hover:border-[#00E6D7]/20 transition-colors"
              >
                <Tag className="h-4 w-4 text-[#00E6D7]/50 shrink-0" />

                {editingIndex === index ? (
                  <EditInput
                    ref={editRef}
                    initialValue={type}
                    onConfirm={(value) => confirmEdit(index, value)}
                    onCancel={cancelEdit}
                  />
                ) : (
                  <>
                    <span className="flex-1 text-white text-sm">{type}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(index)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemove(index)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type EditInputProps = {
  initialValue: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

const EditInput = React.forwardRef<HTMLInputElement, EditInputProps>(
  function EditInput({ initialValue, onConfirm, onCancel }, ref) {
    const [value, setValue] = useState(initialValue);

    return (
      <div className="flex-1 flex items-center gap-2">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirm(value);
            if (e.key === "Escape") onCancel();
          }}
          className="flex-1 px-3 py-1 rounded-lg bg-white/10 border border-[#00E6D7]/30 text-white text-sm focus:outline-none"
        />
        <button
          onClick={() => onConfirm(value)}
          className="p-1 rounded-lg bg-[#00E6D7]/20 text-[#00E6D7] hover:bg-[#00E6D7]/30 transition-colors"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg bg-white/10 text-white/50 hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
);
