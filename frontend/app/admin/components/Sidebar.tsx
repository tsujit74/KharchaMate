"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { logoutUser } from "@/app/services/auth.service";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

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
    group relative flex items-center
    px-3 py-2.5 text-sm font-medium
    transition-colors
    border-1
    ${
      isActive(path)
        ? "bg-gray-900 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }
  `;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Admin Panel
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <Link href="/admin" className={navItemClass("/admin")}>
          {isActive("/admin") && (
            <span className="absolute left-0 top-0 h-full w-1 bg-white" />
          )}
          Dashboard
        </Link>

        <Link href="/admin/users" className={navItemClass("/admin/users")}>
          {isActive("/admin/users") && (
            <span className="absolute left-0 top-0 h-full w-1 bg-white" />
          )}
          User Management
        </Link>

        <Link href="/admin/groups" className={navItemClass("/admin/groups")}>
          {isActive("/admin/groups") && (
            <span className="absolute left-0 top-0 h-full w-1 bg-white" />
          )}
          Group Management
        </Link>

        <Link href="/admin/support" className={navItemClass("/admin/support")}>
          {isActive("/admin/support") && (
            <span className="absolute left-0 top-0 h-full w-1 bg-white" />
          )}
          Ticket Support
        </Link>

        <Link href="/admin/announcements" className={navItemClass("/admin/announcements")}>
          {isActive("/admin/announcements") && (
            <span className="absolute left-0 top-0 h-full w-1 bg-white" />
          )}
          Announcements
        </Link>

        {/* Normal View */}
        <Link href="/" className={navItemClass("/")}>
          {isActive("/") && (
            <span className="absolute left-0 top-0 h-full w-1 bg-white" />
          )}
          Normal View
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="
            w-full
            px-3 py-2.5
            text-sm font-medium
            text-red-600
            border border-red-200
            hover:bg-red-50
            transition-colors
          "
        >
          Logout
        </button>
      </div>
    </div>
  );
}