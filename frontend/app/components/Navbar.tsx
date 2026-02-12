"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { User2, Bell, Plus, Users, Activity, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { user, unreadNotifications, isAuthenticated, logout, loading } =
    useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full h-16 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-full px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          {" "}
          <div className="relative h-64 w-48">
            {" "}
            <Image
              src="/logo.png"
              alt="KharchaMate Logo"
              fill
              priority
              className="object-contain"
            />{" "}
          </div>{" "}
        </Link>

        {/* Center Nav */}
        {isAuthenticated && !loading && (
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-gray-600 hover:text-black transition"
            >
              <Users size={16} />
              Groups
            </Link>

            <Link
              href="#"
              className="flex items-center gap-1 text-gray-600 hover:text-black transition"
            >
              <Activity size={16} />
              Activity
            </Link>

            <Link
              href="/dashboard/insights"
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg hover:bg-slate-100"
            >
              Insights
            </Link>

            <Link
              href="/groups/create"
              className="flex items-center gap-1 bg-black text-white
                         px-3 py-1.5 rounded-md text-sm
                         hover:bg-gray-900 active:scale-[0.97]
                         transition"
            >
              <Plus size={16} />
              Add
            </Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {loading ? (
            <span className="text-gray-400 text-sm">Loading…</span>
          ) : isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-full
                           text-gray-600 hover:text-gray-900
                           hover:bg-gray-100 transition"
              >
                <Bell size={20} />

                {unreadNotifications > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5
                               min-w-[16px] h-[16px]
                               px-1
                               bg-red-600 text-white
                               text-[10px] font-bold
                               rounded-full
                               flex items-center justify-center"
                  >
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setOpenMenu((p) => !p)}
                  className="flex items-center gap-2
                             hover:bg-gray-100 px-2 py-1 rounded-lg
                             transition"
                >
                  <div
                    className="w-8 h-8 rounded-full bg-black text-white
                                  flex items-center justify-center
                                  text-sm font-semibold"
                  >
                    {getInitials(user.name) || <User2 size={18} />}
                  </div>

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-44
                              bg-white border border-gray-200
                              rounded-xl shadow-lg overflow-hidden
                              origin-top-right
                              transition-all duration-200
                              ${
                                openMenu
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-95 pointer-events-none"
                              }`}
                >
                  <Link
                    href="/profile"
                    onClick={() => setOpenMenu(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700
                               hover:bg-gray-100 transition"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setOpenMenu(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700
                               hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </Link>

                  <div className="border-t" />

                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm
                               text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-black transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-black text-white px-4 py-2
                           rounded-md hover:bg-gray-900
                           active:scale-[0.97] transition"
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
