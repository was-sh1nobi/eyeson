import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  TrendingUp,
  Users,
  Search,
  Filter,
  Download,
  Globe,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Info,
  ChevronLeft,
  ChevronRight,
  FileText,
  MousePointerClick,
  AlertCircle
} from "lucide-react";
import {
  analyticsService,
  type AnalyticsEvent,
  type AnalyticsTimeRange,
  type AnalyticsTimeseriesPoint,
  type AnalyticsTopPage,
  type AnalyticsReferrer,
  type AnalyticsDevice,
  type SummaryResponse,
} from "@/services/analyticsService";

export default function EventsAnalytics() {
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>("7d");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<AnalyticsEvent | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [timeseries, setTimeseries] = useState<AnalyticsTimeseriesPoint[]>([]);
  const [topPages, setTopPages] = useState<AnalyticsTopPage[]>([]);
  const [referrers, setReferrers] = useState<AnalyticsReferrer[]>([]);
  const [devices, setDevices] = useState<AnalyticsDevice[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [totalEventCount, setTotalEventCount] = useState(0);
  const [totalEventPages, setTotalEventPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const s = await analyticsService.getSummary(timeRange);
      setSummary(s);
    } catch {
      setSummary(null);
    }
  }, [timeRange]);

  const fetchTimeseries = useCallback(async () => {
    try {
      const ts = await analyticsService.getTimeseries(timeRange);
      setTimeseries(ts.points);
    } catch {
      setTimeseries([]);
    }
  }, [timeRange]);

  const fetchTopPages = useCallback(async () => {
    try {
      const tp = await analyticsService.getTopPages(timeRange, 6);
      setTopPages(tp.pages);
    } catch {
      setTopPages([]);
    }
  }, [timeRange]);

  const fetchReferrers = useCallback(async () => {
    try {
      const r = await analyticsService.getReferrers(timeRange);
      setReferrers(r.referrers);
    } catch {
      setReferrers([]);
    }
  }, [timeRange]);

  const fetchDevices = useCallback(async () => {
    try {
      const d = await analyticsService.getDevices(timeRange);
      setDevices(d.devices);
    } catch {
      setDevices([]);
    }
  }, [timeRange]);

  const fetchEvents = useCallback(async () => {
    try {
      const e = await analyticsService.getEvents({
        page: currentPage,
        limit: itemsPerPage,
        type: eventTypeFilter,
        search: searchQuery,
        range: timeRange,
      });
      setEvents(e.events);
      setTotalEventCount(e.totalCount);
      setTotalEventPages(e.totalPages);
    } catch {
      setEvents([]);
      setTotalEventCount(0);
      setTotalEventPages(1);
    }
  }, [timeRange, eventTypeFilter, searchQuery, currentPage]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchSummary(),
      fetchTimeseries(),
      fetchTopPages(),
      fetchReferrers(),
      fetchDevices(),
      fetchEvents(),
    ]);
    setLoading(false);
  }, [fetchSummary, fetchTimeseries, fetchTopPages, fetchReferrers, fetchDevices, fetchEvents]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAll().finally(() => setIsRefreshing(false));
  };

  const viewsData = timeseries;

  const maxChartValue = useMemo(() => {
    return Math.max(...viewsData.map((d) => d.views), 10);
  }, [viewsData]);

  const chartHeight = 220;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 20;

  const points = useMemo(() => {
    const totalPoints = viewsData.length;
    if (totalPoints === 0) return { viewsPath: "", uniquePath: "", viewsArea: "", uniqueArea: "", coords: [] };

    const coords = viewsData.map((d, i) => {
      const x = paddingX + (i / (totalPoints - 1)) * (chartWidth - paddingX * 2);
      const yViews = chartHeight - paddingY - (d.views / maxChartValue) * (chartHeight - paddingY * 2);
      const yUnique = chartHeight - paddingY - (d.unique / maxChartValue) * (chartHeight - paddingY * 2);
      return { x, yViews, yUnique, label: d.label, views: d.views, unique: d.unique };
    });

    const viewsPath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.yViews}`).join(" ");
    const uniquePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.yUnique}`).join(" ");

    const viewsArea = `${viewsPath} L ${coords[coords.length - 1].x} ${chartHeight - paddingY} L ${coords[0].x} ${chartHeight - paddingY} Z`;
    const uniqueArea = `${uniquePath} L ${coords[coords.length - 1].x} ${chartHeight - paddingY} L ${coords[0].x} ${chartHeight - paddingY} Z`;

    return { viewsPath, uniquePath, viewsArea, uniqueArea, coords };
  }, [viewsData, maxChartValue]);

  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const getEventIcon = (event: string) => {
    switch (event) {
      case "page_view":
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case "click":
        return <MousePointerClick className="w-4 h-4 text-emerald-400" />;
      case "form_submit":
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-white/60" />;
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await analyticsService.exportCsv({
        type: eventTypeFilter,
        search: searchQuery,
        range: timeRange,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${timeRange}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => { setTimeRange("24h"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeRange === "24h"
                  ? "bg-gradient-to-r from-[#00E6D7]/20 to-[#12ACB5]/20 text-[#00E6D7] border border-[#00E6D7]/20 shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => { setTimeRange("7d"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeRange === "7d"
                  ? "bg-gradient-to-r from-[#00E6D7]/20 to-[#12ACB5]/20 text-[#00E6D7] border border-[#00E6D7]/20 shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => { setTimeRange("30d"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeRange === "30d"
                  ? "bg-gradient-to-r from-[#00E6D7]/20 to-[#12ACB5]/20 text-[#00E6D7] border border-[#00E6D7]/20 shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw size={15} className={isRefreshing ? "animate-spin text-[#00E6D7]" : ""} />
          </button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCsv}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Total Page Views", value: summary?.totalPageViews.toLocaleString() ?? "—", change: summary?.totalPageViewsChange ?? "", icon: TrendingUp, color: "from-cyan-500/20 to-teal-500/10" },
          { label: "Unique Visitors", value: summary?.uniqueVisitors.toLocaleString() ?? "—", change: summary?.uniqueVisitorsChange ?? "", icon: Users, color: "from-[#00E6D7]/20 to-cyan-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const isUp = stat.change.startsWith("+");
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-5 w-5 text-[#00E6D7]" />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    isUp ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                  }`}>
                    {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/50 mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Analytics Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Visitors Graph */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Views & Visitors Over Time</h3>
              <p className="text-xs text-white/40 mt-0.5">Visual traffic flow and engagement metrics</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E6D7]" />
                <span className="text-white/60">Page Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span className="text-white/60">Unique Visitors</span>
              </div>
            </div>
          </div>

          {loading && viewsData.length === 0 ? (
            <div className="flex items-center justify-center h-[230px] text-white/40 text-sm">
              Loading chart data...
            </div>
          ) : (
            <div className="relative w-full h-[230px] select-none">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full"
                onMouseLeave={() => setHoveredPointIndex(null)}
              >
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E6D7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00E6D7" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  const value = Math.round(maxChartValue * (1 - ratio));
                  return (
                    <g key={index} className="opacity-20">
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#FFFFFF"
                        strokeWidth="0.5"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 4}
                        fill="#FFFFFF"
                        fontSize="9"
                        textAnchor="end"
                        className="opacity-70"
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}

                <path d={points.viewsArea} fill="url(#viewsGrad)" />
                <path d={points.uniqueArea} fill="url(#uniqueGrad)" />

                <path
                  d={points.viewsPath}
                  fill="none"
                  stroke="#00E6D7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={points.uniquePath}
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1 1"
                />

                {points.coords.map((c, index) => {
                  const totalPoints = points.coords.length;
                  const nextX = index < totalPoints - 1 ? points.coords[index + 1].x : chartWidth;
                  const prevX = index > 0 ? points.coords[index - 1].x : 0;
                  const hoverAreaWidth = (nextX - prevX) / 2;

                  return (
                    <rect
                      key={index}
                      x={c.x - hoverAreaWidth}
                      y={0}
                      width={hoverAreaWidth * 2}
                      height={chartHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPointIndex(index)}
                    />
                  );
                })}

                {hoveredPointIndex !== null && points.coords[hoveredPointIndex] && (
                  <line
                    x1={points.coords[hoveredPointIndex].x}
                    y1={paddingY}
                    x2={points.coords[hoveredPointIndex].x}
                    y2={chartHeight - paddingY}
                    stroke="#00E6D7"
                    strokeWidth="1"
                    className="opacity-40"
                  />
                )}

                {hoveredPointIndex !== null && points.coords[hoveredPointIndex] && (
                  <>
                    <circle
                      cx={points.coords[hoveredPointIndex].x}
                      cy={points.coords[hoveredPointIndex].yViews}
                      r="5"
                      fill="#00E6D7"
                      stroke="#001219"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={points.coords[hoveredPointIndex].x}
                      cy={points.coords[hoveredPointIndex].yUnique}
                      r="4"
                      fill="#14B8A6"
                      stroke="#001219"
                      strokeWidth="1.5"
                    />
                  </>
                )}

                {points.coords.map((c, index) => {
                  const step = timeRange === "30d" ? 5 : 1;
                  if (index % step !== 0 && index !== points.coords.length - 1) return null;

                  return (
                    <text
                      key={index}
                      x={c.x}
                      y={chartHeight - 4}
                      fill="#FFFFFF"
                      fontSize="9"
                      textAnchor="middle"
                      className="opacity-40"
                    >
                      {c.label}
                    </text>
                  );
                })}
              </svg>

              {hoveredPointIndex !== null && points.coords[hoveredPointIndex] && (
                <div
                  className="absolute bg-[#021617]/95 border border-[#00E6D7]/20 rounded-lg p-2 shadow-xl backdrop-blur-md text-xs space-y-1 pointer-events-none"
                  style={{
                    left: `${Math.min(
                      Math.max(5, (points.coords[hoveredPointIndex].x / chartWidth) * 100 - 15),
                      70
                    )}%`,
                    top: "10px"
                  }}
                >
                  <div className="font-semibold text-white/95 border-b border-white/5 pb-1">
                    {points.coords[hoveredPointIndex].label}
                  </div>
                  <div className="flex items-center gap-4 text-white/80">
                    <span>Views: <strong className="text-[#00E6D7]">{points.coords[hoveredPointIndex].views}</strong></span>
                    <span>Uniques: <strong className="text-teal-400">{points.coords[hoveredPointIndex].unique}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Device Breakdown & Referrers */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white mb-1">Referrers & Acquisitions</h3>
            <p className="text-xs text-white/40 mb-4">Top channels driving visits</p>
            {referrers.length > 0 ? (
              <div className="space-y-3.5">
                {referrers.map((ref) => (
                  <div key={ref.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/70 font-medium">{ref.name}</span>
                      <span className="text-white/50">{ref.count.toLocaleString()} ({ref.percent}%)</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#00E6D7] to-cyan-500 h-full rounded-full"
                        style={{ width: `${ref.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-xs py-4 text-center">No referrer data available</p>
            )}
          </div>

          <div className="border-t border-white/5 pt-4 mt-4">
            <h4 className="font-semibold text-xs text-white/70 mb-3 uppercase tracking-wider">Device Breakdown</h4>
            <div className="grid grid-cols-3 gap-2">
              {devices.length > 0 ? (
                devices.map((dev) => (
                  <div key={dev.type} className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
                    <div className="flex justify-center mb-1">
                      {dev.type === "Desktop" ? (
                        <Monitor size={14} className="text-[#00E6D7]/80" />
                      ) : (
                        <Globe size={14} className="text-[#00E6D7]/80" />
                      )}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase font-medium">{dev.type}</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{dev.percent}%</div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-white/40 text-xs py-4 text-center">No device data</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pages View Table & Event Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages List */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Top Visited Pages</h3>
              <p className="text-xs text-white/40 mt-0.5">Most active content paths</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {topPages.length > 0 ? (
              topPages.map((page) => (
                <div key={page.path} className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold text-[#00E6D7] truncate">{page.path}</div>
                    <div className="text-[10px] text-white/40 mt-1">Unique: {page.unique.toLocaleString()}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white">{page.views.toLocaleString()}</div>
                    <div className="text-[10px] text-white/40">views</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-xs py-4 text-center">No page data available</p>
            )}
          </div>
        </div>

        {/* Live Event Log Feed */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
              <div>
                <h3 className="font-semibold text-white">All Events & Live Feed</h3>
                <p className="text-xs text-white/40 mt-0.5">Real-time interactions tracking</p>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full sm:w-[180px] bg-white/5 border border-white/10 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#00E6D7]/40 placeholder-white/30"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <select
                    value={eventTypeFilter}
                    onChange={(e) => { setEventTypeFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-white/5 border border-white/10 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white/80 focus:outline-none focus:border-[#00E6D7]/40 appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#021617]">All Types</option>
                    <option value="page_view" className="bg-[#021617]">Page View</option>
                    <option value="click" className="bg-[#021617]">Clicks</option>
                    <option value="form_submit" className="bg-[#021617]">Form Submit</option>
                    <option value="error" className="bg-[#021617]">Errors</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Event</th>
                    <th className="py-2.5 px-3">Path</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {loading && events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/40 text-xs">
                        Loading events...
                      </td>
                    </tr>
                  ) : events.length > 0 ? (
                    events.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.01] group transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 font-medium text-white/90">
                            {getEventIcon(log.event)}
                            <span className="capitalize">{log.event.replace("_", " ")}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-cyan-400/95">{log.path}</td>
                        <td className="py-3 px-3 text-white/60">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[10px] text-white/40">{log.browser} • {log.os}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>{log.country}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-white/40 text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedEvent(log)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-[#00E6D7] transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/40 text-xs">
                        No events found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalEventPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
              <span className="text-xs text-white/40">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalEventCount)} of {totalEventCount} logs
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-colors text-white/80 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalEventPages))}
                  disabled={currentPage === totalEventPages}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-colors text-white/80 cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* JSON Details Inspector Drawer/Modal */}
      
        {selectedEvent && (
          <>
            <div
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <div
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#021617]/95 border-l border-white/10 z-50 p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between text-white"
            >
              <div className="space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      {getEventIcon(selectedEvent.event)}
                      <span className="capitalize">{selectedEvent.event.replace("_", " ")}</span>
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Event Reference ID: {selectedEvent.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Core Parameters</h4>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-white/50">Path:</span><span className="font-mono text-[#00E6D7]">{selectedEvent.path}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">IP Address:</span><span className="font-mono text-white/80">{selectedEvent.ip}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Country:</span><span className="text-white/80">{selectedEvent.country}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Timestamp:</span><span className="text-white/80">{selectedEvent.timestamp}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Environment Metadata</h4>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-white/50">OS / Platform:</span><span className="text-white/80">{selectedEvent.os}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">User Agent / Browser:</span><span className="text-white/80">{selectedEvent.browser}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Custom Analytics Payload</h4>
                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[11px] text-teal-300 leading-relaxed overflow-x-auto">
                      <pre>{JSON.stringify(selectedEvent.metadata, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] hover:opacity-90 transition-opacity text-black font-semibold text-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      
    </div>
  );
}
