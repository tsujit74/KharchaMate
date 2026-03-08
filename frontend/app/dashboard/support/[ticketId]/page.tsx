"use client";

import { useEffect, useRef, useState } from "react";
import { getTicketById, replyToTicket } from "@/app/services/ticket.service";
import { useParams } from "next/navigation";
import TicketMessage from "../components/TicketMessage";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export default function TicketDetailsPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const statusStyles: Record<TicketStatus, string> = {
    OPEN: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border border-blue-200",
    RESOLVED: "bg-green-50 text-green-700 border border-green-200",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(ticketId);
      setTicket(data.ticket);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket]);

  const handleReply = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      await replyToTicket(ticketId, message);
      setMessage("");
      await fetchTicket();
    } catch (err) {
      console.error(err);
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500 text-sm">Loading ticket...</div>;
  }

  if (!ticket) {
    return <div className="p-6 text-gray-500 text-sm">Ticket not found</div>;
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto border rounded-xl bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b flex items-start justify-between">
        <div>
          <h1 className="font-semibold text-gray-900 text-lg">
            {ticket.subject}
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            Ticket ID: #{ticket._id.slice(-6)}
          </p>
        </div>

        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            statusStyles[ticket.status as TicketStatus]
          }`}
        >
          {ticket.status.replace("_", " ")}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {ticket.messages.map((msg: any) => (
          <TicketMessage
            key={msg._id}
            message={msg.message}
            role={msg.role}
            createdAt={msg.createdAt}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Box */}
      <div className="border-t p-3 flex gap-2 bg-white">
        <input
          type="text"
          placeholder="Write a reply..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleReply();
          }}
        />

        <button
          onClick={handleReply}
          disabled={sending || !message.trim()}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
