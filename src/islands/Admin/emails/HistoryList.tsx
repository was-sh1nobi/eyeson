import { Send, Mail, FileText, Eye, Loader2 } from "lucide-react";
import type { EmailLogItem } from "./types";
import { LOG_PREFIX, formatDate } from "./types";

interface HistoryListProps {
  items: EmailLogItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function HistoryList({ items, loading, page, totalPages, onPageChange }: HistoryListProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-white/40" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl">
        <div className="p-12 text-center">
          <Send className="h-10 w-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No emails sent yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl divide-y divide-white/5">
      
        {items.map((item, i) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00E6D7]/20 to-[#12ACB5]/10 shrink-0">
                  <Send className="h-4 w-4 text-[#00E6D7]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-white truncate">{item.subject}</div>
                  <div className="text-sm text-white/40 mt-0.5">
                    To: {item.to.join(", ")}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-[11px] text-white/30 flex items-center gap-1">
                      <Mail size={10} />
                      {item.to.length} recipient{item.to.length !== 1 ? "s" : ""}
                    </span>
                    {item.requestCount !== undefined && (
                      <span className="text-[11px] text-white/30 flex items-center gap-1">
                        <FileText size={10} />
                        {item.requestCount} request{item.requestCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      item.status === "sent"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/15 text-red-400 border-red-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/20 mt-1 flex items-center gap-2">
                    <span>{formatDate(item.sentAt)}</span>
                    <span>·</span>
                    <span>by {item.sentBy || "admin"}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  console.log(`${LOG_PREFIX} [UI] History item "${item.id}" eye icon clicked - toggling body preview`);
                  const bodyPreview = document.getElementById(`email-body-${item.id}`);
                  if (bodyPreview) {
                    const isHidden = bodyPreview.classList.contains("hidden");
                    console.log(`${LOG_PREFIX} [UI] Body preview was ${isHidden ? "hidden" : "visible"} - now ${isHidden ? "showing" : "hiding"}`);
                    bodyPreview.classList.toggle("hidden");
                  } else {
                    console.warn(`${LOG_PREFIX} [UI] Could not find body preview element for id="email-body-${item.id}"`);
                  }
                }}
                className="shrink-0 text-white/30 hover:text-white/60 transition-colors cursor-pointer p-1"
                title="View message body"
              >
                <Eye size={16} />
              </button>
            </div>

            <div id={`email-body-${item.id}`} className="hidden mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-xs text-white/30 mb-2 font-medium">Message Body:</div>
              <div className="text-sm text-white/60 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                {item.body}
              </div>
            </div>

            {item.toDetails && item.toDetails.length > 0 && (
              <div id={`email-details-${item.id}`} className="hidden mt-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-white/30 mb-2 font-medium">Recipient Details:</div>
                <div className="space-y-1.5">
                  {item.toDetails.map((d, di) => (
                    <div key={di} className="text-xs text-white/50 flex items-center gap-2">
                      <Mail size={10} className="shrink-0" />
                      <span className="text-white/70">{d.name || d.email}</span>
                      {d.company && <span className="text-white/30">· {d.company}</span>}
                      {d.projectType && <span className="text-white/30">· {d.projectType}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-4 border-t border-white/5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => {
                console.log(`${LOG_PREFIX} [UI] History pagination: page ${p} clicked (current: ${page})`);
                onPageChange(p);
              }}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                p === page
                  ? "bg-[#00E6D7]/15 text-[#00E6D7] border border-[#00E6D7]/30"
                  : "bg-white/5 text-white/40 border border-white/10 hover:text-white/70"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
