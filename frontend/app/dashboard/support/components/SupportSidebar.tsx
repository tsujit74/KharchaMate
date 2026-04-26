"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket, MessageSquarePlus, Plus } from "lucide-react";

interface Props {
  onCreateClick: () => void;
}

export default function SupportSidebar({ onCreateClick }: Props) {
  const pathname = usePathname();
  const isTickets = pathname === "/dashboard/support";
  const isMessage = pathname.startsWith("/dashboard/support/");

  return (
    <aside className="h-full w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Support
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-950">
          Tickets
        </h2>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard/support"
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
            isTickets
              ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
        >
          <Ticket className="h-4 w-4" />
          <span>My Tickets</span>
        </Link>

        <Link
          href="/dashboard/support/messages"
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
            isMessage
              ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          }`}
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span>Ticket Messages</span>
        </Link>

        <button
          onClick={onCreateClick}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <Plus className="h-4 w-4" />
          <span>Create Ticket</span>
        </button>
      </nav>
    </aside>
  );
}