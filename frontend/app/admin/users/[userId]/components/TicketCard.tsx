"use client";

import Link from "next/link";
import { CircleDot, Clock3, ArrowUpRight } from "lucide-react";

type Ticket = {
  _id: string;
  subject?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
};

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown date";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const subject = ticket.subject || "Untitled Ticket";
  const date = formatDate(ticket.createdAt);
  const status = ticket.status || "OPEN";
  const priority = ticket.priority || "LOW";

  const statusStyles: Record<string, string> = {
    RESOLVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    OPEN: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };

  const priorityStyles: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    LOW: "bg-slate-100 text-slate-600",
  };

  return (
    <Link href={`/admin/support/${ticket._id}`} className="group block">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CircleDot className="h-4 w-4 text-slate-400" />
              <h3 className="truncate text-sm font-semibold text-slate-950">
                {subject}
              </h3>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              <span>{date}</span>
            </div>
          </div>

          <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-slate-950" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[priority] || priorityStyles.LOW}`}
          >
            {priority}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status] || statusStyles.OPEN}`}
          >
            {status.replace("_", " ")}
          </span>
        </div>
      </div>
    </Link>
  );
}