"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/authContext";
import { User2 } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  return (
    <nav className="w-full border-b top-0 fixed bg-white z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold cursor-pointer">
          KharchaMate
        </Link>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {/* Avatar with initials or fallback icon */}
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                {getInitials(user.name) || <User2 size={24} />}
              </div>

              {/* User Name */}
              <span className="font-small text-x">{user.name}</span>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-black">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-black text-white px-4 py-2 rounded hover:opacity-90 transition"
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
