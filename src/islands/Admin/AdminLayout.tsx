import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Mail,
  Send,
  Settings,
  Tag,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
  Image,
  BarChart3
} from "lucide-react";
import { httpService } from "@/utils/httpService.ts";
import NotificationBell from "@/islands/Admin/NotificationBell";
import UpcomingRequests from "@/islands/Admin/UpcomingRequests";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { href: "/admin/requests", icon: Mail, label: "Requests" },
  { href: "/admin/emails", icon: Send, label: "Emails" },
  { href: "/admin/project-types", icon: Tag, label: "Project Types" },
  { href: "/admin/portfolios", icon: Image, label: "Portfolios" },
  { href: "/admin/case", icon: LayoutDashboard, label: "Case Editor" },
  { href: "/admin/events", icon: BarChart3, label: "Events" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; avatar?: string } | null>(null);
  const [currentPath, setCurrentPath] = useState("/admin");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => { setIsDesktop(window.innerWidth >= 1024); }, []);
  useEffect(() => { setCurrentPath(window.location.pathname); }, []);

  useEffect(() => {
    (async () => {
      try {
        const data: any = await httpService.get("/auth/me", { timeout: 5000 });
        setUser({ name: data?.name || data?.username, email: data?.email, avatar: data?.avatar });
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") return currentPath === "/admin" || currentPath === "/admin/";
    return currentPath.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,#062428,#001219)] text-white">
      {/* Mobile overlay */}
      
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-screen z-50 flex flex-col w-64 bg-[#021617]/95 lg:bg-[#021617]/60 backdrop-blur-xl border-r border-white/5"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E6D7] to-[#12ACB5] flex items-center justify-center">
              <span className="text-black font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg tracking-tight">EyesON</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-200 cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-[#00E6D7]/15 to-[#12ACB5]/10 text-[#00E6D7] border border-[#00E6D7]/20 shadow-lg shadow-[#00E6D7]/5"
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </a>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E6D7]/30 to-[#12ACB5]/30 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <User size={14} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name || "Admin"}</div>
              <div className="text-xs text-white/40 truncate">{user?.email || "admin@eyeson.io"}</div>
            </div>
            <button onClick={handleLogout} className="text-white/40 hover:text-red-400 transition-colors cursor-pointer" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-4 bg-[#021617]/60 backdrop-blur-xl border-b border-white/5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/60 hover:text-white transition-colors p-1 cursor-pointer"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">
              {navItems.find((item) => isActive(item.href))?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <UpcomingRequests />
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}