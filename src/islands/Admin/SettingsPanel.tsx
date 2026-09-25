import React, { useEffect, useState } from "react";
import {
  Clock,
  Settings,
  Bell,
  RefreshCcw,
  Shield,
  Palette,
  Globe,
  Save,
  Check
} from "lucide-react";

type ApiSetting = { enabled: boolean; value: number };

export default function SettingsPanel() {
  const [apiInterval, setApiInterval] = useState<ApiSetting>({ enabled: true, value: 60 });
  const [notifications, setNotifications] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin-settings");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.apiInterval) setApiInterval(s.apiInterval);
        if (typeof s.notifications === "boolean") setNotifications(s.notifications);
        if (typeof s.maintenance === "boolean") setMaintenance(s.maintenance);
        if (typeof s.autoRefresh === "boolean") setAutoRefresh(s.autoRefresh);
      }
    } catch (e) {}
  }, []);

  const handleSave = () => {
    const s = { apiInterval, notifications, maintenance, autoRefresh };
    localStorage.setItem("admin-settings", JSON.stringify(s));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
        checked ? "bg-[#00E6D7]" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  const settingItems = [
    {
      icon: <Clock className="h-5 w-5 text-[#00E6D7]" />,
      title: "API Request Interval",
      desc: "How often the app polls the API (in seconds)",
      control: (
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={apiInterval.value}
            min={5}
            onChange={(e) => setApiInterval((prev) => ({ ...prev, value: Number(e.target.value) }))}
            className="w-20 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 transition-[border-color,box-shadow] cursor-pointer"
          />
          <Toggle checked={apiInterval.enabled} onChange={(v) => setApiInterval((prev) => ({ ...prev, enabled: v }))} />
        </div>
      ),
    },
    {
      icon: <Bell className="h-5 w-5 text-[#00E6D7]" />,
      title: "Notifications",
      desc: "Enable admin notifications for requests and errors",
      control: <Toggle checked={notifications} onChange={setNotifications} />,
    },
    {
      icon: <RefreshCcw className="h-5 w-5 text-[#00E6D7]" />,
      title: "Auto Refresh",
      desc: "Auto-refresh dashboard widgets",
      control: <Toggle checked={autoRefresh} onChange={setAutoRefresh} />,
    },
    {
      icon: <Shield className="h-5 w-5 text-[#00E6D7]" />,
      title: "Maintenance Mode",
      desc: "Put the site into maintenance mode",
      control: <Toggle checked={maintenance} onChange={setMaintenance} />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00E6D7]/20 to-[#12ACB5]/10">
            <Settings className="h-5 w-5 text-[#00E6D7]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <p className="text-sm text-white/50">Manage your admin preferences</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-[color,background-color,border-color,opacity] cursor-pointer ${
            saved
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black hover:opacity-90"
          }`}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Settings List */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl divide-y divide-white/5">
        {settingItems.map((item, i) => (
          <div
            key={item.title}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="p-2 rounded-lg bg-white/5 shrink-0">{item.icon}</div>
              <div className="min-w-0">
                <div className="font-medium text-white">{item.title}</div>
                <div className="text-sm text-white/40 mt-0.5">{item.desc}</div>
              </div>
            </div>
            <div className="shrink-0 sm:ml-4">{item.control}</div>
          </div>
        ))}
      </div>

      {/* Additional Settings Placeholder */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-5">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#00E6D7]" />
          Appearance & Language
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Theme</label>
            <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 transition-[border-color,box-shadow] appearance-none cursor-pointer">
              <option className="bg-[#021617]">Dark (Default)</option>
              <option className="bg-[#021617]">Light</option>
              <option className="bg-[#021617]">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Language</label>
            <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 transition-[border-color,box-shadow] appearance-none cursor-pointer">
              <option className="bg-[#021617]">English</option>
              <option className="bg-[#021617]">فارسی</option>
              <option className="bg-[#021617]">العربية</option>
            </select>
          </div>
        </div>
      </div>

      <p className="text-xs text-white/30 text-center">
        Settings are stored locally. Integrate with backend to persist for all admins.
      </p>
    </div>
  );
}