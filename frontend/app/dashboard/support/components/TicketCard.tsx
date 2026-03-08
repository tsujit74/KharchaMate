"use client";

import Link from "next/link";

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
    OPEN: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border border-blue-200",
    RESOLVED: "bg-green-50 text-green-700 border border-green-200",
  };

  const createdTime = new Date(ticket.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <Link href={`/dashboard/support/${ticket._id}`} className="block group">
      <div className="max-w-xl bg-white border border-gray-200 rounded-xl px-5 py-4 transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-[2px]">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-gray-950 transition">
            {ticket.subject}
          </h3>

          <span
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
              statusStyles[ticket.status]
            }`}
          >
            {ticket.status.replace("_", " ")}
          </span>
        </div>

        {/* Description */}
        {ticket.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {ticket.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-400">

          <span className="flex items-center gap-2">
            <span className="font-mono text-gray-500">
              #{ticket._id.slice(-6)}
            </span>

            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>

            <span>{createdTime}</span>
          </span>

          <span className="text-gray-400 group-hover:text-gray-600 transition">
            View →
          </span>

        </div>
      </div>
    </Link>
  );
}