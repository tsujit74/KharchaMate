"use client";

import Link from "next/link";
import { ChevronRight, Clock3, Ticket } from "lucide-react";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

interface Ticket {
  _id: string;
  subject: string;
  description?: string;
  status: TicketStatus;
  createdAt: string;
}

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const statusStyles: Record<TicketStatus, string> = {
    OPEN: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  };

  const statusDot: Record<TicketStatus, string> = {
    OPEN: "bg-amber-500",
    IN_PROGRESS: "bg-blue-500",
    RESOLVED: "bg-emerald-500",
  };

  const createdTime = new Date(ticket.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/dashboard/support/${ticket._id}`} className="block group">
      <article className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <Ticket className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-bold text-slate-950 group-hover:text-slate-700">
                  {ticket.subject}
                </h3>
              </div>

              <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span className={`h-2 w-2 rounded-full ${statusDot[ticket.status]}`} />
                <span>{ticket.status.replace("_", " ")}</span>
              </p>
            </div>
          </div>

          <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[ticket.status]}`}>
            {ticket.status.replace("_", " ")}
          </span>
        </div>

        {ticket.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {ticket.description}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-400">#{ticket._id.slice(-6)}</span>
            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {createdTime}
            </span>
          </div>

          <div className="flex items-center gap-1 font-medium text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-slate-950">
            <span>View</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}