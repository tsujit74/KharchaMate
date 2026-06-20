"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/authContext";
import {
  User2,
  Bell,
  Plus,
  Users,
  Activity,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  CircleUserRound,
} from "lucide-react";

export default function Navbar() {
  const { user, unreadNotifications, isAuthenticated, logout, loading } =
    useAuth();

  const isAdmin = user?.role === "admin";
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0]?.toUpperCase() || ""
      : `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full h-18 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/"}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-100 group-hover:scale-105 transition">
            KM
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
            KharchaMate
          </span>
        </Link>

        {/* Center Nav */}
        {isAuthenticated && !loading && (
          <div className="hidden md:flex items-center gap-2 lg:gap-3 text-sm">
            <NavLink href="/dashboard" icon={<Users size={16} />}>
              Groups
            </NavLink>

            <NavLink href="/dashboard/activity" icon={<Activity size={16} />}>
              Activity
            </NavLink>

            <NavLink
              href="/dashboard/insights"
              icon={<LayoutDashboard size={16} />}
            >
              Insights
            </NavLink>

            <NavLink href="/dashboard/support" icon={<LifeBuoy size={16} />}>
              Support
            </NavLink>

            <Link
              href="/groups/create"
              className="ml-2 inline-flex items-center gap-1.5 bg-slate-950 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition shadow-lg shadow-black/10"
            >
              <Plus size={16} />
              Add Group
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
              >
                Admin Panel
              </Link>
            )}
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <span className="text-slate-400 text-sm">Loading…</span>
          ) : isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setOpenMenu((p) => !p)}
                  className="flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-full hover:bg-slate-100 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-950 text-white flex items-center justify-center text-sm font-semibold overflow-hidden">
                    {user?.name ? getInitials(user.name) : <User2 size={18} />}
                  </div>

                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-sm font-semibold text-slate-900 max-w-[120px] truncate">
                      {user.name || "Account"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {isAdmin ? "Admin" : "Member"}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform duration-200 ${
                      openMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden origin-top-right transition-all duration-200 ${
                    openMenu
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 pointer-events-none -translate-y-1"
                  }`}
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <DropdownItem
                    href="/profile"
                    icon={<CircleUserRound size={16} />}
                    onClick={() => setOpenMenu(false)}
                  >
                    Profile
                  </DropdownItem>

                  <DropdownItem
                    href="/dashboard"
                    icon={<LayoutDashboard size={16} />}
                    onClick={() => setOpenMenu(false)}
                  >
                    Dashboard
                  </DropdownItem>

                  <DropdownItem
                    href="/dashboard/insights"
                    icon={<Activity size={16} />}
                    onClick={() => setOpenMenu(false)}
                  >
                    Insights
                  </DropdownItem>

                  <DropdownItem
                    href="/dashboard/support"
                    icon={<LifeBuoy size={16} />}
                    onClick={() => setOpenMenu(false)}
                  >
                    Support
                  </DropdownItem>

                  <div className="border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
              >
                Login
              </Link>

              <Link
                href="/auth"
                className="inline-flex items-center gap-1.5 bg-slate-950 text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition shadow-lg shadow-black/10"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-slate-600 font-medium hover:text-slate-950 hover:bg-slate-100 transition"
    >
      {icon}
      {children}
    </Link>
  );
}

function DropdownItem({
  href,
  children,
  icon,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition"
    >
      {icon}
      {children}
    </Link>
  );
}
