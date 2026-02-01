"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import {
  User2,
  Bell,
  Plus,
  Users,
  Activity,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <nav className="w-full fixed top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-bold">
          KharchaMate
        </Link>

        {/* Center Nav */}
        {isAuthenticated && !loading && (
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-gray-600 hover:text-black"
            >
              <Users size={16} />
              Groups
            </Link>

            <Link
              href="/activity"
              className="flex items-center gap-1 text-gray-600 hover:text-black"
            >
              <Activity size={16} />
              Activity
            </Link>

            <Link
              href="/groups/create"
              className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90"
            >
              <Plus size={16} />
              Add
            </Link>
          </div>
        )}

      
        <div className="flex items-center gap-4">
          {loading ? (
            <span className="text-gray-400 text-sm">Loading...</span>
          ) : isAuthenticated && user ? (
            <>
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                    {getInitials(user.name) || <User2 size={18} />}
                  </div>
                  <ChevronDown size={16} />
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md overflow-hidden">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-black">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
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
