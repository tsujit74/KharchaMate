"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  onCreateClick: () => void;
}

export default function SupportSidebar({ onCreateClick }: Props) {
  const pathname = usePathname();
  const isTickets = pathname === "/dashboard/support";
  const isMessage = pathname.startsWith("/dashboard/support/");

  return (
    <div className="w-full h-full p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-6 tracking-wide">
        SUPPORT
      </h2>

      <nav className="space-y-1">
        <Link
          href="/dashboard/support"
          className={`flex items-center px-3 py-2 text-sm font-medium  transition border-1 ${
            isTickets
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          My Tickets
        </Link>

        <Link
          href="#"
          className={`flex items-center px-3 py-2 text-sm font-medium  transition border-1 ${
            isMessage
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          Ticket Messages
        </Link>

        <button
          onClick={onCreateClick}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition border-1"
        >
          + Create Ticket
        </button>
      </nav>
    </div>
  );
}
