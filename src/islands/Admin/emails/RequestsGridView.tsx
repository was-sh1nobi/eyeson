import { CheckSquare, Square, User, Mail, Building2, Wallet, Phone } from "lucide-react";
import type { EmailRequest } from "./types";
import { statusConfig, priorityColors } from "./types";

interface RequestsGridViewProps {
  requests: EmailRequest[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}

export default function RequestsGridView({ requests, selectedIds, onToggleSelect }: RequestsGridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      
        {requests.map((r, i) => {
          const isSelected = selectedIds.has(r.id);
          const status = statusConfig[r.status] || statusConfig.Pending;
          return (
            <div
              key={r.id}
              className={`group rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5 hover:border-white/10 transition-colors cursor-pointer ${
                isSelected ? "border-[#00E6D7]/30 bg-[#00E6D7]/5" : ""
              }`}
              onClick={() => onToggleSelect(r.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-white/40 hover:text-[#00E6D7] transition-colors">
                  {isSelected ? <CheckSquare size={18} className="text-[#00E6D7]" /> : <Square size={18} />}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border inline-flex items-center gap-1 ${status.color}`}>
                    {status.icon}
                    {r.status}
                  </span>
                  <span className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full border ${priorityColors[r.priority] || "text-white/30"} border-white/10`}>
                    {r.priority}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-white text-sm leading-snug group-hover:text-[#00E6D7] transition-colors line-clamp-2">
                  {r.title || `${r.firstName} ${r.lastName}`}
                </div>
                {r.projectType && (
                  <span className="inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-[#00E6D7]/10 to-[#12ACB5]/10 text-[10px] font-medium text-[#00E6D7]/70 border border-[#00E6D7]/20">
                    {r.projectType}
                  </span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <User size={11} className="shrink-0" />
                  <span className="truncate">{r.firstName} {r.lastName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Mail size={11} className="shrink-0" />
                  <span className="truncate">{r.email}</span>
                </div>
                {r.companyName && (
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Building2 size={11} className="shrink-0" />
                    <span className="truncate">{r.companyName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px] text-white/30 pt-1">
                  {r.budget && <span className="flex items-center gap-1"><Wallet size={10} />{r.budget}</span>}
                  {r.phone && <span className="flex items-center gap-1"><Phone size={10} />{r.phone}</span>}
                  <span className="ml-auto">{r.createdAt}</span>
                </div>
              </div>
            </div>
          );
        })}
      
    </div>
  );
}
