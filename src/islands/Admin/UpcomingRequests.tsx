import React, { useState, useEffect, useRef, useCallback } from "react";
import { AlertTriangle, Clock, X, Loader2, User, Phone, Mail } from "lucide-react";
import { httpService } from "@/utils/httpService.ts";

type UpcomingRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  projectType: string;
  budget: string;
  date: string;
  time: string;
  duration: string;
  status: string;
  daysLeft: number;
  deadline: string;
};

type UpcomingResponse = {
  requests: UpcomingRequest[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export default function UpcomingRequests() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<UpcomingRequest[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchUpcoming = useCallback(async (p: number, append: boolean) => {
    setLoading(true);
    try {
      const data = await httpService.get<UpcomingResponse>(`/contact/requests/upcoming?page=${p}&limit=10&days=7`);
      setRequests((prev) => append ? [...prev, ...data.requests] : data.requests);
      setTotalPages(data.meta.totalPages);
      setTotalItems(data.meta.total);
      setPage(data.meta.page);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial data just to get the total count for the badge (maybe without opening)
  useEffect(() => {
    fetchUpcoming(1, false);
    const interval = setInterval(() => fetchUpcoming(1, false), 60000);
    return () => clearInterval(interval);
  }, [fetchUpcoming]);

  // Handle click outside to close
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Infinite scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading && page < totalPages) {
      fetchUpcoming(page + 1, true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          if (!open) fetchUpcoming(1, false);
          setOpen(!open);
        }}
        className="relative p-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        title="Upcoming Requests"
      >
        <AlertTriangle size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] min-h-[18px] text-[10px] font-bold rounded-full bg-red-500 text-white px-1 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>

      
        {open && (
          <div
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#021617] border border-red-500/20 shadow-2xl shadow-red-900/20 z-50 flex flex-col max-h-[70vh]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-red-500/10 shrink-0 bg-red-500/5 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                <span className="text-sm font-semibold text-white">Upcoming Deadlines</span>
                {totalItems > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium border border-red-500/20">
                    {totalItems} in 7 days
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="overflow-y-auto flex-1 min-h-0"
            >
              {requests.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-white/30">
                  <Clock size={32} className="mb-3 text-emerald-400/50" />
                  <p className="text-sm">No upcoming deadlines!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.03]">
                  {requests.map((r, i) => {
                    const isDanger = r.daysLeft < 2;
                    return (
                      <div
                        key={r.id}
                        className={`p-4 transition-colors hover:bg-white/[0.02] ${isDanger ? 'bg-red-500/[0.02]' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white flex items-center gap-2">
                              {r.firstName} {r.lastName}
                            </h4>
                            <p className="text-[11px] text-white/40 mt-0.5 truncate">{r.companyName || r.projectType}</p>
                          </div>
                          <div className={`shrink-0 px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${
                            isDanger 
                              ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
                              : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                          }`}>
                            {r.deadline}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 mt-3 text-[11px]">
                          <div className="flex items-center gap-2 text-white/50">
                            <Clock size={12} />
                            <span>{r.date} at {r.time} ({r.duration})</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/50">
                            <Mail size={12} />
                            <span className="truncate">{r.email}</span>
                          </div>
                          {r.phone && (
                            <div className="flex items-center gap-2 text-white/50">
                              <Phone size={12} />
                              <span>{r.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {loading && (
                    <div className="flex justify-center py-4">
                      <Loader2 size={16} className="animate-spin text-red-400" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      
    </div>
  );
}
