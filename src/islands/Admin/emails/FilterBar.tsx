import { Search, Wallet, ArrowUpDown } from "lucide-react";
import { LOG_PREFIX, statuses, priorities } from "./types";
import type { FilterStatus, FilterPriority, SortOrder } from "./types";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterBudget: string;
  onBudgetChange: (value: string) => void;
  filterStatus: FilterStatus;
  onStatusChange: (value: FilterStatus) => void;
  filterPriority: FilterPriority;
  onPriorityChange: (value: FilterPriority) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
  budgets: string[];
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  filterBudget,
  onBudgetChange,
  filterStatus,
  onStatusChange,
  filterPriority,
  onPriorityChange,
  sortOrder,
  onSortOrderChange,
  budgets,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, company, title, phone..."
            value={searchQuery}
            onChange={(e) => {
              console.log(`${LOG_PREFIX} [UI] Search query changed: "${e.target.value}"`);
              onSearchChange(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow]"
          />
        </div>

        <div className="relative">
          <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
          <select
            value={filterBudget}
            onChange={(e) => {
              console.log(`${LOG_PREFIX} [UI] Budget filter changed: "${e.target.value}"`);
              onBudgetChange(e.target.value);
            }}
            className="pl-10 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow] appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="All" className="bg-[#021617]">All Budgets</option>
            {budgets.map((b) => (
              <option key={b} value={b} className="bg-[#021617]">{b}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
          <select
            value={sortOrder}
            onChange={(e) => {
              console.log(`${LOG_PREFIX} [UI] Sort order changed: "${e.target.value}"`);
              onSortOrderChange(e.target.value as SortOrder);
            }}
            className="pl-10 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow] appearance-none cursor-pointer min-w-[130px]"
          >
            <option value="newest" className="bg-[#021617]">Newest First</option>
            <option value="oldest" className="bg-[#021617]">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-white/30 font-medium mr-1">Status:</span>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              console.log(`${LOG_PREFIX} [UI] Status filter changed: "${s}" (was "${filterStatus}")`);
              onStatusChange(s);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === s
                ? "bg-[#00E6D7]/15 text-[#00E6D7] border border-[#00E6D7]/30"
                : "bg-white/5 text-white/50 border border-white/10 hover:text-white/70"
            }`}
          >
            {s}
          </button>
        ))}

        <span className="text-xs text-white/30 font-medium ml-3 mr-1">Priority:</span>
        {priorities.map((p) => (
          <button
            key={p}
            onClick={() => {
              console.log(`${LOG_PREFIX} [UI] Priority filter changed: "${p}" (was "${filterPriority}")`);
              onPriorityChange(p);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterPriority === p
                ? "bg-[#00E6D7]/15 text-[#00E6D7] border border-[#00E6D7]/30"
                : "bg-white/5 text-white/50 border border-white/10 hover:text-white/70"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
