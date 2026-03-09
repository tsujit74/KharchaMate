"use client";

import Link from "next/link";

type Ticket = {
  _id: string;
  subject?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
};

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const subject = ticket.subject || "Untitled Ticket";

  const date = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString()
    : "Unknown date";

  const status = ticket.status || "OPEN";
  const priority = ticket.priority || "LOW";

  const statusStyles: Record<string, string> = {
    RESOLVED: "bg-green-50 text-green-600 border-green-200",
    IN_PROGRESS: "bg-yellow-50 text-yellow-600 border-yellow-200",
    OPEN: "bg-red-50 text-red-600 border-red-200",
  };

  const priorityStyles: Record<string, string> = {
    HIGH: "bg-red-100 text-red-600",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-gray-100 text-gray-700",
  };

  return (
    <Link href={`/admin/support/${ticket._id}`}>
      <div className="bg-white border border-gray-200 p-5 rounded-lg hover:shadow-md hover:border-gray-300 transition cursor-pointer">
        <div className="flex items-center justify-between">
          
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {subject}
            </h3>

            <p className="text-xs text-gray-400 mt-1">{date}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">

            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                priorityStyles[priority] || priorityStyles.LOW
              }`}
            >
              {priority}
            </span>

            <span
              className={`px-2 py-1 text-xs font-semibold border rounded ${
                statusStyles[status] || statusStyles.OPEN
              }`}
            >
              {status.replace("_", " ")}
            </span>

          </div>
        </div>
      </div>
    </Link>
  );
}