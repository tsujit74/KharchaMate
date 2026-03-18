"use client";

import { useState, useEffect, useRef } from "react";
import { adminReplyTicket } from "@/app/services/ticket.service";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

interface Ticket {
  _id: string;
  subject: string;
  priority: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface Props {
  tickets: Ticket[];
}

export default function TicketTable({ tickets }: Props) {
  const [ticketList, setTicketList] = useState<Ticket[]>(tickets);
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatus = async (ticketId: string, status: string) => {
    try {
      setUpdating(ticketId);

      await adminReplyTicket(ticketId, status, status);

      setTicketList((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, status: status as Ticket["status"] }
            : ticket
        )
      );

      toast.success("Ticket updated");
    } catch (err: any) {
      toast.error(err.message.replaceAll("_", " "));
    } finally {
      setUpdating(null);
      setOpenMenu(null);
    }
  };

  // 🔥 Status Badge
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-50 text-red-600";
      case "IN_PROGRESS":
        return "bg-yellow-50 text-yellow-600";
      case "RESOLVED":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  // 🔥 Priority Badge
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-orange-100 text-orange-700";
      case "LOW":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (!ticketList || ticketList.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
        <p className="text-gray-500">No support tickets yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-4 text-left font-semibold">Subject</th>
            <th className="p-4 text-left font-semibold">User</th>
            <th className="p-4 text-left font-semibold">Priority</th>
            <th className="p-4 text-left font-semibold">Status</th>
            <th className="p-4 text-left font-semibold">Created</th>
            <th className="p-4 text-right font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {ticketList.map((ticket) => (
            <tr
              key={ticket._id}
              className="border-t hover:bg-gray-50 transition"
            >
              {/* Subject */}
              <td className="p-4 font-medium text-gray-800">
                {ticket.subject}
              </td>

              {/* User */}
              <td className="p-4">
                <div className="font-medium text-gray-800">
                  {ticket.user?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {ticket.user?.email}
                </div>
              </td>

              {/* Priority */}
              <td className="p-4">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityStyle(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
              </td>

              {/* Status */}
              <td className="p-4">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(
                    ticket.status
                  )}`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
              </td>

              {/* Date */}
              <td className="p-4 text-gray-500">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="p-4 text-right relative">
                <div className="flex justify-end items-center gap-3">
                  <Link
                    href={`/admin/support/${ticket._id}`}
                    className="text-blue-600 text-xs font-medium hover:underline"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === ticket._id ? null : ticket._id
                      )
                    }
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                {openMenu === ticket._id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    <button
                      disabled={updating === ticket._id}
                      onClick={() =>
                        handleStatus(ticket._id, "IN_PROGRESS")
                      }
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      {updating === ticket._id && (
                        <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                      )}
                      Mark In Progress
                    </button>

                    <button
                      disabled={updating === ticket._id}
                      onClick={() =>
                        handleStatus(ticket._id, "RESOLVED")
                      }
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      {updating === ticket._id && (
                        <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                      )}
                      Mark Resolved
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}