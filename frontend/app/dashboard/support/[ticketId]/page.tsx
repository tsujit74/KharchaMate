"use client";

import { useEffect, useRef, useState } from "react";
import { getTicketById, replyToTicket } from "@/app/services/ticket.service";
import { useParams } from "next/navigation";
import TicketMessage from "../components/TicketMessage";

export default function TicketDetailsPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  if (loading)
    return (
      <div className="p-6 text-gray-500 text-sm">
        Loading ticket...
      </div>
    );

  if (!ticket)
    return (
      <div className="p-6 text-gray-500 text-sm">
        Ticket not found
      </div>
    );

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-3xl mx-auto border rounded-xl bg-white shadow-sm">

      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="font-semibold text-gray-900">
          {ticket.title}
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          Status: {ticket.status}
        </p>
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

      {/* Reply box */}
      <div className="border-t p-3 flex gap-2 bg-white">
        <input
          type="text"
          placeholder="Write a reply..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleReply}
          disabled={sending || !message.trim()}
          className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}