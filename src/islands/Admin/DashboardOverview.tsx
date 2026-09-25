import React, { useEffect, useState } from "react";
import {
  Layers,
  Eye,
  FileText,
  CheckCircle,
  Activity,
  Cpu,
  Database,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { dashboardService } from "@/services/dashboardService.ts";

const itemTransition = { type: "spring" as const, stiffness: 120, damping: 18 };

type LatestProject = {
  cover: string;
  title: string;
  slug: string;
  ownerName: string;
  updatedAt: string;
  views: number;
};

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalViews: 0,
    requestsTotal: 0,
    requestsCompleted: 0,
    requestsToday: 0,
    requestsYesterday: 0,
    requestsPercentage: 0,
    completedToday: 0,
    completedYesterday: 0,
    completedPercentage: 0,
    projectsCount: 0,
  });
  const [latestProjects, setLatestProjects] = useState<LatestProject[]>([]);
  const [latestRequests, setLatestRequests] = useState<{ title: string; from: string; status: string }[]>([]);
  const [uptime] = useState("12 days 4 hrs");
  const [activeUsers] = useState(128);
  const [cpu] = useState(26);
  const [dbConnections] = useState(8);

  useEffect(() => {
    (async () => {
      try {
        const [views, reqCount, reqCompleted, latest, latestReqs] = await Promise.all([
          dashboardService.getTotalViews(),
          dashboardService.getRequestsCount(),
          dashboardService.getRequestsCompleted(),
          dashboardService.getLatestProjects(),
          dashboardService.getLatestRequests(),
        ]);
        setStats({
          totalViews: views.totalViews,
          requestsTotal: reqCount.total,
          requestsCompleted: reqCompleted.completed,
          requestsToday: reqCount.todayCount,
          requestsYesterday: reqCount.yesterdayCount,
          requestsPercentage: reqCount.percentage,
          completedToday: reqCompleted.todayCount,
          completedYesterday: reqCompleted.yesterdayCount,
          completedPercentage: reqCompleted.percentage,
          projectsCount: latest.totalCount,
        });
        setLatestProjects(latest.projects);
        setLatestRequests(latestReqs);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    })();
  }, []);

  const reqUp = stats.requestsToday >= stats.requestsYesterday;
  const reqChange = stats.requestsYesterday > stats.requestsToday
    ? `-${stats.requestsPercentage}%`
    : `+${stats.requestsPercentage}%`;

  const compUp = stats.completedToday >= stats.completedYesterday;
  const compChange = stats.completedYesterday > stats.completedToday
    ? `-${stats.completedPercentage}%`
    : `+${stats.completedPercentage}%`;

  const quickStats = [
    { label: "Projects", value: stats.projectsCount, change: "+0%", up: true, icon: Layers },
    { label: "Total Views", value: stats.totalViews, change: "+0%", up: true, icon: Eye },
    { label: "Requests", value: stats.requestsTotal, change: reqChange, up: reqUp, icon: FileText },
    { label: "Completed", value: stats.requestsCompleted, change: compChange, up: compUp, icon: CheckCircle },
  ];

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "In Progress": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00E6D7]/20 to-[#12ACB5]/10">
                  <Icon className="h-5 w-5 text-[#00E6D7]" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${s.up ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                  {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {s.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-white">{s.value.toLocaleString()}</div>
                <div className="text-sm text-white/50 mt-0.5">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <h3 className="font-semibold text-white">Recent Projects</h3>
            <a href="/admin/projects" className="text-sm text-[#00E6D7] hover:text-[#00E6D7]/80 transition-colors cursor-pointer">
              View all
            </a>
          </div>
          <div className="divide-y divide-white/5">
            {latestProjects.map((p, i) => (
              <div
                key={p.title}
                className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
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
                      <span>{p.ownerName}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{p.updatedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <div className="hidden sm:flex items-center gap-1.5 text-sm text-white/50">
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Requests */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="font-semibold text-white">Recent Requests</h3>
              <a href="/admin/requests" className="text-sm text-[#00E6D7] hover:text-[#00E6D7]/80 transition-colors cursor-pointer">
                View all
              </a>
            </div>
            <div className="divide-y divide-white/5">
              {latestRequests.map((r, i) => (
                <div
                  key={`${r.title}-${i}`}
                  className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-white text-sm truncate">{r.title}</div>
                    <div className="text-xs text-white/40 mt-0.5">{r.from}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ml-2 ${statusColors[r.status] || "bg-white/10 text-white/60 border-white/10"}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Metrics */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={16} className="text-[#00E6D7]" />
              System Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock size={14} />
                  <span>Uptime</span>
                </div>
                <span className="text-sm font-medium text-white">{uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Eye size={14} />
                  <span>Active Users</span>
                </div>
                <span className="text-sm font-medium text-white">{activeUsers}</span>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2 text-white/60">
                    <Cpu size={14} />
                    <span>CPU</span>
                  </div>
                  <span className="font-medium text-white">{cpu}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] h-1.5 rounded-full transition-[width] duration-500"
                    style={{ width: `${cpu}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2 text-white/60">
                    <Database size={14} />
                    <span>DB Connections</span>
                  </div>
                  <span className="font-medium text-white">{dbConnections}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] h-1.5 rounded-full transition-[width] duration-500"
                    style={{ width: `${(dbConnections / 20) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}