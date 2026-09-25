import React, { useState, useEffect, useMemo } from "react";
import {
  Send,
  Mail,
  CheckSquare,
  Loader2,
  History,
  Inbox,
  Building2,
  Wallet,
  Tag,
  Grid3X3,
  List,
  Table2,
} from "lucide-react";
import { dashboardService, type EmailLogItem, type SendEmailPayload } from "@/services/dashboardService.ts";
import { LOG_PREFIX } from "./emails/types";
import FeedbackToast from "./emails/FeedbackToast";
import FilterBar from "./emails/FilterBar";
import RequestsListView from "./emails/RequestsListView";
import RequestsGridView from "./emails/RequestsGridView";
import RequestsCompactView from "./emails/RequestsCompactView";
import HistoryList from "./emails/HistoryList";
import EmailComposerModal from "./emails/EmailComposerModal";

type EmailRequest = {
  id: string;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  projectType: string;
  budget: string;
  projectDetails: string;
  date: string;
  duration: string;
  time: string;
  title: string;
  from: string;
  createdAt: string;
  status: string;
  priority: string;
};

export default function EmailsManager() {
  console.log(`${LOG_PREFIX} Component initializing - mounting Email Manager`);

  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  console.log(`${LOG_PREFIX} Initial state set: activeTab="compose"`);

  const [requests, setRequests] = useState<EmailRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ companies: number; budget_count: number; project_type_count: number } | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Approved" | "In Progress" | "Completed" | "Cancelled">("All");
  const [filterBudget, setFilterBudget] = useState("All");
  const [filterPriority, setFilterPriority] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "compact">("list");
  const [budgets, setBudgets] = useState<string[]>([]);

  const [showComposer, setShowComposer] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const [history, setHistory] = useState<EmailLogItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    console.log(`${LOG_PREFIX} [useEffect] Component mounted - calling initial fetches`);
    console.log(`${LOG_PREFIX} [useEffect] Current env: PUBLIC_API_URL=${(import.meta as any).env?.PUBLIC_API_URL || "not set"}`);
    fetchRequests();
  }, []);

  useEffect(() => {
    console.log(`${LOG_PREFIX} [useEffect] activeTab changed to: "${activeTab}"`);
    if (activeTab === "history") {
      console.log(`${LOG_PREFIX} [useEffect] Tab is history - fetching email history page 1`);
      fetchHistory(1);
    }
  }, [activeTab]);

  async function fetchRequests() {
    console.log(`${LOG_PREFIX} [fetchRequests] Starting request fetch`);
    console.log(`${LOG_PREFIX} [fetchRequests] Current filters: status="${filterStatus}", budget="${filterBudget}", priority="${filterPriority}", search="${searchQuery}", sort="${sortOrder}"`);
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 50 };
      if (filterStatus !== "All") { params.status = filterStatus; console.log(`${LOG_PREFIX} [fetchRequests] Applying status filter: "${filterStatus}"`); }
      if (filterBudget !== "All") { params.budget = filterBudget; console.log(`${LOG_PREFIX} [fetchRequests] Applying budget filter: "${filterBudget}"`); }
      if (filterPriority !== "All") { params.priority = filterPriority; console.log(`${LOG_PREFIX} [fetchRequests] Applying priority filter: "${filterPriority}"`); }
      if (searchQuery) { params.search = searchQuery; console.log(`${LOG_PREFIX} [fetchRequests] Applying search query: "${searchQuery}"`); }
      console.log(`${LOG_PREFIX} [fetchRequests] Sending GET /contact/requests/all with params:`, params);
      console.time(`${LOG_PREFIX} [fetchRequests] API call duration`);
      const data = await dashboardService.getRequestsForEmail(params);
      console.timeEnd(`${LOG_PREFIX} [fetchRequests] API call duration`);
      console.log(`${LOG_PREFIX} [fetchRequests] Raw API response:`, data);
      console.log(`${LOG_PREFIX} [fetchRequests] Total count from API: ${data.totalCount}, Page: ${data.page}/${data.totalPages}`);

      const mapped = data.requests.map((r: any) => {
        const mappedItem: EmailRequest = {
          id: r.uuid || r.id || r._id || "",
          uuid: r.uuid || r.id || r._id || "",
          email: r.email || r.from || "",
          firstName: r.firstName || "",
          lastName: r.lastName || "",
          phone: r.phone || "",
          companyName: r.company || r.companyName || "",
          projectType: r.projectType || "",
          budget: r.budget || "",
          projectDetails: r.projectDetails || "",
          date: r.date || "",
          duration: r.duration || "",
          time: r.time || "",
          title: r.title || "",
          from: r.from || "",
          createdAt: r.createdAt || "",
          status: r.status || "Pending",
          priority: r.priority || "Medium",
        };
        return mappedItem;
      });
      console.log(`${LOG_PREFIX} [fetchRequests] Mapped ${mapped.length} request(s) to EmailRequest type`);
      console.log(`${LOG_PREFIX} [fetchRequests] First 3 mapped items:`, mapped.slice(0, 3));
      console.log(`${LOG_PREFIX} [fetchRequests] Requests with missing email: ${mapped.filter((r: EmailRequest) => !r.email).length}`);
      console.log(`${LOG_PREFIX} [fetchRequests] Requests with missing id: ${mapped.filter((r: EmailRequest) => !r.id).length}`);

      setRequests(mapped);
      setTotalCount(data.totalCount);
      if (data.budgets) {
        setBudgets(data.budgets);
      }
      if (data.meta) {
        console.log(`${LOG_PREFIX} [fetchRequests] Received meta from API:`, data.meta);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error(`${LOG_PREFIX} [fetchRequests] FAILED to load requests:`, err);
      console.error(`${LOG_PREFIX} [fetchRequests] Error name:`, (err as any)?.name);
      console.error(`${LOG_PREFIX} [fetchRequests] Error message:`, (err as any)?.message);
      console.error(`${LOG_PREFIX} [fetchRequests] Error response data:`, (err as any)?.response?.data);
      console.error(`${LOG_PREFIX} [fetchRequests] Error response status:`, (err as any)?.response?.status);
    } finally {
      setLoading(false);
      console.log(`${LOG_PREFIX} [fetchRequests] Fetch complete, loading set to false`);
    }
  }

  async function fetchHistory(page: number) {
    console.log(`${LOG_PREFIX} [fetchHistory] Fetching email history - page ${page}, limit 10`);
    setHistoryLoading(true);
    try {
      console.log(`${LOG_PREFIX} [fetchHistory] Sending GET /email/history?page=${page}&limit=10`);
      console.time(`${LOG_PREFIX} [fetchHistory] API call duration`);
      const data = await dashboardService.getEmailHistory(page, 10);
      console.timeEnd(`${LOG_PREFIX} [fetchHistory] API call duration`);
      console.log(`${LOG_PREFIX} [fetchHistory] Raw history response:`, data);
      console.log(`${LOG_PREFIX} [fetchHistory] Total: ${data.totalCount}, Page: ${data.page}/${data.totalPages}, Items: ${data.items?.length || 0}`);

      if (data.items?.length > 0) {
        console.log(`${LOG_PREFIX} [fetchHistory] First history item:`, {
          id: data.items[0].id, to: data.items[0].to, subject: data.items[0].subject,
          sentAt: data.items[0].sentAt, status: data.items[0].status,
        });
      } else { console.log(`${LOG_PREFIX} [fetchHistory] No history items found`); }

      setHistory(data.items);
      setHistoryPage(data.page);
      setHistoryTotalPages(data.totalPages);
    } catch (err) {
      console.error(`${LOG_PREFIX} [fetchHistory] FAILED to load history:`, err);
      console.error(`${LOG_PREFIX} [fetchHistory] Error name:`, (err as any)?.name);
      console.error(`${LOG_PREFIX} [fetchHistory] Error message:`, (err as any)?.message);
      console.error(`${LOG_PREFIX} [fetchHistory] Error response:`, (err as any)?.response?.data);
    } finally {
      setHistoryLoading(false);
      console.log(`${LOG_PREFIX} [fetchHistory] History fetch complete, loading set to false`);
    }
  }

  useEffect(() => {
    console.log(`${LOG_PREFIX} [useEffect] Filter dependency changed - refetching requests`);
    console.log(`${LOG_PREFIX} [useEffect] Filters: status="${filterStatus}", budget="${filterBudget}", priority="${filterPriority}", search="${searchQuery}"`);
    fetchRequests();
  }, [filterStatus, filterBudget, filterPriority, searchQuery]);

  const filteredRequests = useMemo(() => {
    console.log(`${LOG_PREFIX} [useMemo] filteredRequests recomputing`);
    console.log(`${LOG_PREFIX} [useMemo] Input: ${requests.length} requests, search="${searchQuery}", status="${filterStatus}", budget="${filterBudget}", priority="${filterPriority}", sort="${sortOrder}"`);
    const filtered = requests.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = r.title.toLowerCase().includes(q) || r.from.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.firstName.toLowerCase().includes(q) || r.lastName.toLowerCase().includes(q) || r.companyName.toLowerCase().includes(q) || r.phone.toLowerCase().includes(q);
        if (!matches) { console.log(`${LOG_PREFIX} [useMemo] Item "${r.id}" filtered OUT by search`); return false; }
      }
      if (filterStatus !== "All" && r.status !== filterStatus) { console.log(`${LOG_PREFIX} [useMemo] Item "${r.id}" filtered OUT by status`); return false; }
      if (filterBudget !== "All" && r.budget !== filterBudget) { console.log(`${LOG_PREFIX} [useMemo] Item "${r.id}" filtered OUT by budget`); return false; }
      if (filterPriority !== "All" && r.priority !== filterPriority) { console.log(`${LOG_PREFIX} [useMemo] Item "${r.id}" filtered OUT by priority`); return false; }
      return true;
    });
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    console.log(`${LOG_PREFIX} [useMemo] Filtered result: ${sorted.length} of ${requests.length} requests visible (sorted ${sortOrder})`);
    return sorted;
  }, [requests, searchQuery, filterStatus, filterBudget, filterPriority, sortOrder]);

  const selectedRequests = useMemo(() => {
    console.log(`${LOG_PREFIX} [useMemo] selectedRequests recomputing`);
    console.log(`${LOG_PREFIX} [useMemo] selectedIds size: ${selectedIds.size}, total requests: ${requests.length}`);
    const sel = requests.filter((r) => selectedIds.has(r.id));
    console.log(`${LOG_PREFIX} [useMemo] Selected requests count: ${sel.length}`);
    if (sel.length > 0) {
      console.log(`${LOG_PREFIX} [useMemo] Selected IDs:`, Array.from(selectedIds));
      console.log(`${LOG_PREFIX} [useMemo] Selected emails:`, sel.map((r) => r.email));
      console.log(`${LOG_PREFIX} [useMemo] Selected without email: ${sel.filter((r) => !r.email).length}`);
    }
    return sel;
  }, [requests, selectedIds]);

  function toggleSelect(id: string) {
    console.log(`${LOG_PREFIX} [toggleSelect] Toggling selection for request id="${id}"`);
    console.log(`${LOG_PREFIX} [toggleSelect] Currently selected: ${selectedIds.size} item(s)`);
    const wasSelected = selectedIds.has(id);
    console.log(`${LOG_PREFIX} [toggleSelect] Was selected before toggle: ${wasSelected}`);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); console.log(`${LOG_PREFIX} [toggleSelect] Removed id="${id}" from selection. New count: ${next.size}`); }
      else { next.add(id); console.log(`${LOG_PREFIX} [toggleSelect] Added id="${id}" to selection. New count: ${next.size}`); }
      return next;
    });
  }

  function selectAll() {
    const ids = filteredRequests.map((r) => r.id);
    console.log(`${LOG_PREFIX} [selectAll] Selecting ALL ${ids.length} filtered requests`);
    console.log(`${LOG_PREFIX} [selectAll] IDs:`, ids);
    setSelectedIds(new Set(ids));
  }

  function selectFiltered() {
    const ids = filteredRequests.map((r) => r.id);
    console.log(`${LOG_PREFIX} [selectFiltered] Selecting ALL ${ids.length} filtered requests`);
    console.log(`${LOG_PREFIX} [selectFiltered] Current filters - status: "${filterStatus}", search: "${searchQuery}"`);
    console.log(`${LOG_PREFIX} [selectFiltered] IDs:`, ids);
    setSelectedIds(new Set(ids));
  }

  function clearSelection() {
    console.log(`${LOG_PREFIX} [clearSelection] Clearing all ${selectedIds.size} selections`);
    setSelectedIds(new Set());
  }

  function openComposer() {
    console.log(`${LOG_PREFIX} [openComposer] Opening composer modal`);
    console.log(`${LOG_PREFIX} [openComposer] Selected requests with email: ${selectedRequests.filter((r) => r.email).length}`);
    console.log(`${LOG_PREFIX} [openComposer] Recipient emails:`, selectedRequests.filter((r) => r.email).map((r) => r.email));
    setSubject("");
    console.log(`${LOG_PREFIX} [openComposer] Subject cleared`);
    setBody("");
    console.log(`${LOG_PREFIX} [openComposer] Body cleared`);
    setShowComposer(true);
    console.log(`${LOG_PREFIX} [openComposer] Composer modal visibility set to true`);
  }

  async function handleSend() {
    console.log(`${LOG_PREFIX} [handleSend] === SEND EMAIL TRIGGERED ===`);
    console.log(`${LOG_PREFIX} [handleSend] Subject: "${subject.trim()}"`);
    console.log(`${LOG_PREFIX} [handleSend] Body length: ${body.trim().length} characters`);
    console.log(`${LOG_PREFIX} [handleSend] Body preview (first 100 chars): "${body.trim().slice(0, 100)}..."`);

    if (!subject.trim()) { console.warn(`${LOG_PREFIX} [handleSend] VALIDATION FAILED - Subject is empty, aborting send`); return; }
    if (!body.trim()) { console.warn(`${LOG_PREFIX} [handleSend] VALIDATION FAILED - Body is empty, aborting send`); return; }

    const recipients = selectedRequests.map((r) => r.email).filter(Boolean);
    console.log(`${LOG_PREFIX} [handleSend] Recipients extracted: ${recipients.length} valid email(s)`);
    console.log(`${LOG_PREFIX} [handleSend] Recipient list:`, recipients);

    if (recipients.length === 0) { console.warn(`${LOG_PREFIX} [handleSend] VALIDATION FAILED - No recipients with valid email, aborting send`); return; }

    setSending(true);
    console.log(`${LOG_PREFIX} [handleSend] Sending state set to true`);
    setFeedback(null);
    console.log(`${LOG_PREFIX} [handleSend] Previous feedback cleared`);

    try {
      const payload: SendEmailPayload = { to: recipients, subject: subject.trim(), body: body.trim(), requestIds: selectedRequests.map((r) => r.id) };
      console.log(`${LOG_PREFIX} [handleSend] Payload prepared:`, { toCount: payload.to.length, to: payload.to, subject: payload.subject, bodyLength: payload.body.length, requestIds: payload.requestIds });
      console.log(`${LOG_PREFIX} [handleSend] Sending POST /email/send`);
      console.time(`${LOG_PREFIX} [handleSend] API call duration`);
      const result = await dashboardService.sendEmail(payload);
      console.timeEnd(`${LOG_PREFIX} [handleSend] API call duration`);
      console.log(`${LOG_PREFIX} [handleSend] Send result:`, result);

      if (result.success) {
        console.log(`${LOG_PREFIX} [handleSend] SUCCESS - Email sent to ${result.sent} recipient(s)`);
        setFeedback({ type: "success", message: `Email sent successfully to ${result.sent} recipient(s)` });
        console.log(`${LOG_PREFIX} [handleSend] Closing composer modal`);
        setShowComposer(false);
        console.log(`${LOG_PREFIX} [handleSend] Clearing selection`);
        setSelectedIds(new Set());
        if (activeTab === "history") { console.log(`${LOG_PREFIX} [handleSend] Refreshing history tab`); fetchHistory(1); }
      } else {
        console.warn(`${LOG_PREFIX} [handleSend] PARTIAL FAILURE - Sent: ${result.sent}, Failed: ${result.failed}`);
        if (result.details) {
          console.warn(`${LOG_PREFIX} [handleSend] Send details:`, result.details);
          result.details.forEach((d: any, i: number) => {
            if (d.status === "failed") { console.warn(`${LOG_PREFIX} [handleSend] Failed recipient #${i}: email="${d.email}", error="${d.error || "unknown"}"`); }
          });
        }
        setFeedback({ type: "error", message: `Sent: ${result.sent}, Failed: ${result.failed}` });
      }
    } catch (err: any) {
      console.error(`${LOG_PREFIX} [handleSend] EXCEPTION during send:`, err);
      console.error(`${LOG_PREFIX} [handleSend] Error name:`, err?.name);
      console.error(`${LOG_PREFIX} [handleSend] Error message:`, err?.message);
      console.error(`${LOG_PREFIX} [handleSend] Error stack:`, err?.stack);
      console.error(`${LOG_PREFIX} [handleSend] Axios response data:`, err?.response?.data);
      console.error(`${LOG_PREFIX} [handleSend] Axios response status:`, err?.response?.status);
      console.error(`${LOG_PREFIX} [handleSend] Axios response headers:`, err?.response?.headers);
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to send email";
      console.log(`${LOG_PREFIX} [handleSend] Derived error message for user: "${errorMsg}"`);
      setFeedback({ type: "error", message: errorMsg });
    } finally {
      setSending(false);
      console.log(`${LOG_PREFIX} [handleSend] Sending state set to false`);
      console.log(`${LOG_PREFIX} [handleSend] === SEND EMAIL COMPLETE ===`);
    }
  }

  useEffect(() => {
    return () => {
      console.log(`${LOG_PREFIX} [useEffect] EmailsManager component unmounting - cleanup`);
      console.log(`${LOG_PREFIX} [useEffect] Final state: activeTab="${activeTab}", requests=${requests.length}, selected=${selectedIds.size}, history=${history.length}`);
    };
  }, []);

  if (typeof window !== "undefined") {
    console.log(`${LOG_PREFIX} [render] Rendering EmailsManager - activeTab="${activeTab}", loading=${loading}, requests=${requests.length}, filtered=${filteredRequests.length}, selected=${selectedIds.size}, sending=${sending}`);
  }

  return (
    <div className="space-y-6">
      <FeedbackToast feedback={feedback} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Email Manager</h2>
          <p className="text-sm text-white/50 mt-0.5">Send emails to project requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/5 w-fit">
        <button
          onClick={() => { console.log(`${LOG_PREFIX} [UI] Tab clicked: "compose" (was "${activeTab}")`); setActiveTab("compose"); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "compose"
              ? "bg-gradient-to-r from-[#00E6D7]/15 to-[#12ACB5]/10 text-[#00E6D7] border border-[#00E6D7]/20"
              : "text-white/50 hover:text-white/70"
          }`}
        >
          <Inbox size={16} />
          Compose
        </button>
        <button
          onClick={() => { console.log(`${LOG_PREFIX} [UI] Tab clicked: "history" (was "${activeTab}")`); setActiveTab("history"); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "history"
              ? "bg-gradient-to-r from-[#00E6D7]/15 to-[#12ACB5]/10 text-[#00E6D7] border border-[#00E6D7]/20"
              : "text-white/50 hover:text-white/70"
          }`}
        >
          <History size={16} />
          History
        </button>
      </div>

      {/* ─────── COMPOSE TAB ─────── */}
      {activeTab === "compose" && (
        <div className="space-y-4">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterBudget={filterBudget}
            onBudgetChange={setFilterBudget}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            filterPriority={filterPriority}
            onPriorityChange={setFilterPriority}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            budgets={budgets}
          />

          {/* Selection toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <CheckSquare size={14} />
              <span>{selectedIds.size} selected</span>
              {selectedIds.size > 0 && (
                <>
                  <span className="text-xs text-white/30">· {selectedRequests.filter((r) => r.email).length} with email</span>
                  <span className="text-xs text-white/30">· {selectedRequests.filter((r) => r.companyName).length} with company</span>
                  <span className="text-xs text-white/30">· {selectedRequests.filter((r) => r.phone).length} with phone</span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { console.log(`${LOG_PREFIX} [UI] 'Select All' button clicked`); selectAll(); }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/60 hover:text-white/80 transition-colors cursor-pointer"
              >Select All</button>
              <button
                onClick={() => { console.log(`${LOG_PREFIX} [UI] 'Select Filtered' button clicked`); selectFiltered(); }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/60 hover:text-white/80 transition-colors cursor-pointer"
              >Select Filtered</button>
              {selectedIds.size > 0 && (
                <button
                  onClick={() => { console.log(`${LOG_PREFIX} [UI] 'Clear' button clicked`); clearSelection(); }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-red-400/70 hover:text-red-400 transition-colors cursor-pointer"
                >Clear</button>
              )}
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
              <button
                onClick={() => { console.log(`${LOG_PREFIX} [UI] View mode changed to "list"`); setViewMode("list"); }}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-[#00E6D7]/15 text-[#00E6D7]" : "text-white/30 hover:text-white/60"}`} title="List view"
              ><List size={16} /></button>
              <button
                onClick={() => { console.log(`${LOG_PREFIX} [UI] View mode changed to "grid"`); setViewMode("grid"); }}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#00E6D7]/15 text-[#00E6D7]" : "text-white/30 hover:text-white/60"}`} title="Grid view"
              ><Grid3X3 size={16} /></button>
              <button
                onClick={() => { console.log(`${LOG_PREFIX} [UI] View mode changed to "compact"`); setViewMode("compact"); }}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "compact" ? "bg-[#00E6D7]/15 text-[#00E6D7]" : "text-white/30 hover:text-white/60"}`} title="Compact table view"
              ><Table2 size={16} /></button>
            </div>
            {selectedIds.size > 0 && (
              <button
                onClick={() => { console.log(`${LOG_PREFIX} [UI] Compose Email button clicked`); console.log(`${LOG_PREFIX} [UI] Selected IDs count: ${selectedIds.size}`); openComposer(); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black font-medium text-sm hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
              ><Send size={16} /> Compose Email</button>
            )}
          </div>

          {/* Loading / Empty */}
          {loading && (
            <div className="flex items-center justify-center py-16 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={24} className="animate-spin text-white/40" />
                <p className="text-sm text-white/30">Loading requests...</p>
              </div>
            </div>
          )}
          {!loading && filteredRequests.length === 0 && (
            <div className="p-16 text-center rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl">
              <Mail className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm font-medium">No requests found</p>
              <p className="text-white/20 text-xs mt-1">Try adjusting your filters or search query</p>
            </div>
          )}

          {/* Views */}
          {!loading && filteredRequests.length > 0 && viewMode === "list" && (
            <RequestsListView
              requests={filteredRequests}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              expandedId={expandedId}
              onSetExpandedId={setExpandedId}
            />
          )}
          {!loading && filteredRequests.length > 0 && viewMode === "grid" && (
            <RequestsGridView
              requests={filteredRequests}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
            />
          )}
          {!loading && filteredRequests.length > 0 && viewMode === "compact" && (
            <RequestsCompactView
              requests={filteredRequests}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              expandedId={expandedId}
              onSetExpandedId={setExpandedId}
            />
          )}

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/30">
            <span>Showing {filteredRequests.length} of {totalCount} requests</span>
            {meta && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1"><Building2 size={11} />{meta.companies} companies</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Wallet size={11} />{meta.budget_count} budget ranges</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Tag size={11} />{meta.project_type_count} project types</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─────── HISTORY TAB ─────── */}
      {activeTab === "history" && (
        <HistoryList
          items={history}
          loading={historyLoading}
          page={historyPage}
          totalPages={historyTotalPages}
          onPageChange={fetchHistory}
        />
      )}

      {/* ─────── EMAIL COMPOSER MODAL ─────── */}
      <EmailComposerModal
        show={showComposer}
        onClose={() => setShowComposer(false)}
        selectedRequests={selectedRequests}
        subject={subject}
        onSubjectChange={setSubject}
        body={body}
        onBodyChange={setBody}
        sending={sending}
        onSend={handleSend}
      />
    </div>
  );
}
