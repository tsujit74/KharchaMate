"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { logoutUser } from "@/app/services/auth.service";
import AdminNotificationBell from "./AdminNotificationBell";
import {
  LayoutDashboard,
  Users,
  Layers3,
  Ticket,
  Megaphone,
  Bell,
  Globe,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  const navItemClass = (path: string) => `
    group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition
    ${
      isActive(path)
        ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }
  `;

  const navIconClass = (path: string) =>
    isActive(path) ? "text-white" : "text-slate-400 group-hover:text-slate-700";

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 px-2 py-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Admin Panel
            </p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">
              Control Center
            </h2>
          </div>
          
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        <Link href="/admin" className={navItemClass("/admin")}>
          {isActive("/admin") && (
            <span className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-white" />
          )}
          <LayoutDashboard className={`h-4 w-4 ${navIconClass("/admin")}`} />
          <span>Dashboard</span>
        </Link>

        <Link href="/admin/users" className={navItemClass("/admin/users")}>
          <Users className={`h-4 w-4 ${navIconClass("/admin/users")}`} />
          <span>User Management</span>
        </Link>

        <Link href="/admin/groups" className={navItemClass("/admin/groups")}>
          <Layers3 className={`h-4 w-4 ${navIconClass("/admin/groups")}`} />
          <span>Group Management</span>
        </Link>

        <Link href="/admin/support" className={navItemClass("/admin/support")}>
          <Ticket className={`h-4 w-4 ${navIconClass("/admin/support")}`} />
          <span>Ticket Support</span>
        </Link>

        <Link
          href="/admin/announcements"
          className={navItemClass("/admin/announcements")}
        >
          <Megaphone className={`h-4 w-4 ${navIconClass("/admin/announcements")}`} />
          <span>Announcements</span>
        </Link>

        <Link
          href="/admin/notifications"
          className={navItemClass("/admin/notifications")}
        >
          <Bell className={`h-4 w-4 ${navIconClass("/admin/notifications")}`} />
          <span>Notifications</span>
        </Link>

        <Link href="/" className={navItemClass("/")}>
          <Globe className={`h-4 w-4 ${navIconClass("/")}`} />
          <span>Normal View</span>
        </Link>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-4 rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Session
          </p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            Admin access active
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}