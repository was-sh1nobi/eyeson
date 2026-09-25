import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Mail, X, CheckCheck, Loader2, Building2, Tag, Wallet } from "lucide-react";
import { httpService } from "@/utils/httpService.ts";

type UnreadRequest = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  budget: string;
  status: string;
  createdAt: string;
};

type UnreadResponse = {
  totalUnread: number;
  lastReadAt: string | null;
  requests: UnreadRequest[];
};

const statusColors: Record<string, string> = {
  Completed: "text-emerald-400",
  "In Progress": "text-blue-400",
  Failed: "text-red-400",
  Pending: "text-yellow-400",
};

export default function NotificationBell() {
  const [totalUnread, setTotalUnread] = useState(0);
  const [requests, setRequests] = useState<UnreadRequest[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUnread = useCallback(async () => {
    try {
      const data = await httpService.get<UnreadResponse>("/notifications/unread");
      setTotalUnread(data.totalUnread ?? 0);
      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function markAsRead() {
    setLoading(true);
    try {
      await httpService.post("/notifications/read");
      setTotalUnread(0);
      setRequests([]);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  async function handleClose() {
    await markAsRead();
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={open ? handleClose : handleOpen}
        className="relative p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell size={20} />
        {totalUnread > 0 && !loading && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] min-h-[18px] text-[10px] font-bold rounded-full bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-[#021617] px-1">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
        {loading && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] min-h-[18px]">
            <Loader2 size={12} className="animate-spin text-[#00E6D7]" />
          </span>
        )}
      </button>

      
        {open && (
          <div
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#021617] border border-white/10 shadow-2xl shadow-black/50 z-50 flex flex-col max-h-[70vh]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-[#00E6D7]" />
                <span className="text-sm font-medium text-white">Notifications</span>
                {totalUnread > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00E6D7]/20 text-[#00E6D7] font-medium">
                    {totalUnread}
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="text-white/30 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0">
              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-white/30">
                  <CheckCheck size={32} className="mb-2" />
                  <p className="text-sm">All caught up!</p>
                </div>
              ) : (
                requests.map((r, i) => (
                  <div
                    key={r.id}
                    className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-[#00E6D7]/10 shrink-0">
                      <Mail size={14} className="text-[#00E6D7]" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{r.name}</p>
                        <span className={`text-[10px] font-medium shrink-0 ${statusColors[r.status] || "text-white/40"}`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 truncate">{r.email}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-white/30">
                        {r.company && (
                          <span className="flex items-center gap-1">
                            <Building2 size={10} />
                            {r.company}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Tag size={10} />
                          {r.projectType}
                        </span>
                        {r.budget && (
                          <span className="flex items-center gap-1">
                            <Wallet size={10} />
                            {r.budget}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/20">{r.createdAt}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      
    </div>
  );
}
