"use client";

import Link from "next/link";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

interface Ticket {
  _id: string;
  subject: string;
  description?: string;
  status: TicketStatus;
}

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const statusStyles: Record<TicketStatus, string> = {
    OPEN: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border border-blue-200",
    RESOLVED: "bg-green-50 text-green-700 border border-green-200",
  };

  return (
    <Link href={`/dashboard/support/${ticket._id}`} className="block">
      <div className="max-w-xl bg-white border border-gray-200 rounded-lg px-4 py-4 hover:shadow-md hover:border-gray-300 transition-all duration-200">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-medium text-gray-900 text-sm leading-snug">
            {ticket.subject}
          </h3>

          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
              statusStyles[ticket.status]
            }`}
          >
            {ticket.status.replace("_", " ")}
          </span>
        </div>

        {/* Description */}
        {ticket.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {ticket.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span>#{ticket._id.slice(-6)}</span>

          <span className="text-gray-500 hover:text-gray-700 transition">
            View →
          </span>
        </div>

      </div>
    </Link>
  );
}