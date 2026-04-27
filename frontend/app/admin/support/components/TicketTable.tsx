"use client";

import { useEffect, useRef, useState } from "react";
import { adminReplyTicket } from "@/app/services/ticket.service";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  MoreVertical,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface Ticket {
  _id: string;
  subject: string;
  description?: string;
  priority: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Props {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}


function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    default:
      return "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-700";
    case "MEDIUM":
      return "bg-amber-100 text-amber-700";
    case "LOW":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function TicketTable({ tickets, setTickets }: Props) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatus = async (
    ticketId: string,
    nextStatus: "IN_PROGRESS" | "RESOLVED"
  ) => {
    const previousTickets = tickets;

    try {
      setUpdating(ticketId);
      setOpenMenu(null);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId
            ? {
                ...ticket,
                status: nextStatus,
                updatedAt: new Date().toISOString(),
                resolvedAt:
                  nextStatus === "RESOLVED"
                    ? new Date().toISOString()
                    : ticket.resolvedAt,
              }
            : ticket
        )
      );

      await adminReplyTicket(ticketId, nextStatus, nextStatus);
      toast.success("Ticket updated");
    } catch (err: any) {
      setTickets(previousTickets);
      toast.error(err?.message?.replaceAll("_", " ") || "Failed to update ticket");
    } finally {
      setUpdating(null);
    }
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm text-slate-500">No support tickets yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="w-[22%] px-4 py-3 font-semibold">Subject</th>
              <th className="w-[20%] px-4 py-3 font-semibold">User</th>
              <th className="w-[10%] px-4 py-3 font-semibold">Priority</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Status</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Created</th>
              <th className="w-[12%] px-4 py-3 font-semibold">Updated</th>
              <th className="w-[12%] px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="transition hover:bg-slate-50/80">
                <td className="px-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">
                      {ticket.subject || "Untitled Ticket"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {ticket.description || "No description provided"}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {ticket.user?.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {ticket.user?.email}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getStatusStyle(
                      ticket.status
                    )}`}
                  >
                    <span
                      className={`mr-1 h-1.5 w-1.5 rounded-full ${
                        ticket.status === "OPEN"
                          ? "bg-red-500"
                          : ticket.status === "IN_PROGRESS"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    {ticket.status.replace("_", " ")}
                  </span>
                </td>

                <td className="px-4 py-4 text-slate-600">
                  {formatDate(ticket.createdAt)}
                </td>

                <td className="px-4 py-4 text-slate-600">
                  {formatDate(ticket.updatedAt || ticket.resolvedAt)}
                </td>

                <td className="px-4 py-4">
                  <div className="relative inline-flex w-full justify-end gap-2">
                    <Link
                      href={`/admin/support/${ticket._id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      View
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === ticket._id ? null : ticket._id)
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenu === ticket._id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                      >
                        <button
                          disabled={
                            updating === ticket._id ||
                            ticket.status === "IN_PROGRESS"
                          }
                          onClick={() => handleStatus(ticket._id, "IN_PROGRESS")}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updating === ticket._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Clock3 className="h-4 w-4" />
                          )}
                          Mark In Progress
                        </button>

                        <button
                          disabled={
                            updating === ticket._id ||
                            ticket.status === "RESOLVED"
                          }
                          onClick={() => handleStatus(ticket._id, "RESOLVED")}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updating === ticket._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Mark Resolved
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
