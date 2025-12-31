"use client"

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b top-0 fixed bg-white z-9">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold cursor-pointer">KharchaMate</Link>

        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-black">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
