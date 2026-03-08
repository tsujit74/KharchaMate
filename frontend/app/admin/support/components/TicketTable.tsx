"use client";

import { useState } from "react";
import { adminReplyTicket } from "@/app/services/ticket.service";
import { toast } from "react-hot-toast";
import Link from "next/link";

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

  const handleStatus = async (ticketId: string, status: string) => {
    try {
      setUpdating(ticketId);

      await adminReplyTicket(ticketId, status, status);

      setTicketList((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, status: status as Ticket["status"] }
            : ticket,
        ),
      );

      toast.success("Ticket status updated");
    } catch (err: any) {
      toast.error(err.message.replaceAll("_", " "));
    } finally {
      setUpdating(null);
      setOpenMenu(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-100 text-red-700";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white border  overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left font-semibold">Subject</th>
            <th className="p-4 text-left font-semibold">User</th>
            <th className="p-4 text-left font-semibold">Priority</th>
            <th className="p-4 text-left font-semibold">Status</th>
            <th className="p-4 text-left font-semibold">Created</th>
            <th className="p-4 text-left font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {ticketList.map((ticket) => (
            <tr
              key={ticket._id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-4 font-medium">{ticket.subject}</td>

              <td className="p-4">
                <div className="font-medium">{ticket.user?.name}</div>
                <div className="text-xs text-gray-500">
                  {ticket.user?.email}
                </div>
              </td>

              <td className="p-4 capitalize">{ticket.priority}</td>

              <td className="p-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(
                    ticket.status,
                  )}`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
              </td>

              <td className="p-4">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </td>

              <td className="p-4 relative">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/support/${ticket._id}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === ticket._id ? null : ticket._id)
                    }
                    className="text-xs bg-gray-200 px-2 py-1 rounded"
                  >
                    Actions
                  </button>
                </div>

                {openMenu === ticket._id && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                    <button
                      disabled={updating === ticket._id}
                      onClick={() => handleStatus(ticket._id, "IN_PROGRESS")}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Mark In Progress
                    </button>

                    <button
                      disabled={updating === ticket._id}
                      onClick={() => handleStatus(ticket._id, "RESOLVED")}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
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
