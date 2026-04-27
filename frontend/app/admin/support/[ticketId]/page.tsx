"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getTicketById, adminReplyTicket } from "@/app/services/ticket.service";
import TicketMessage from "../../../dashboard/support/components/TicketMessage";
import {
  ArrowLeft,
  CircleAlert,
  Send,
  Ticket,
  User,
  Mail,
  CalendarDays,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | string;

type TicketMessageItem = {
  _id: string;
  message: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  sender?: {
    name?: string;
    email?: string;
  };
};

type TicketDetail = {
  _id: string;
  subject?: string;
  description?: string;
  status: TicketStatus;
  priority?: TicketPriority;
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
  user?: {
    name?: string;
    email?: string;
  };
  messages?: TicketMessageItem[];
};

export default function AdminTicketDetailsPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const statusStyles: Record<TicketStatus, string> = {
    OPEN: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  };

  const priorityStyles: Record<string, string> = {
    HIGH: "bg-rose-100 text-rose-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    LOW: "bg-emerald-100 text-emerald-700",
  };

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(ticketId);
      setTicket(data?.ticket || null);
    } catch (err: any) {
      toast.error(err?.message?.replaceAll("_", " ") || "Failed to load ticket");
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages?.length]);

  const stats = useMemo(() => {
    const messages = ticket?.messages || [];
    return {
      total: messages.length,
    };
  }, [ticket]);

  const handleReply = async () => {
    const content = message.trim();
    if (!content || sending) return;

    try {
      setSending(true);
      await adminReplyTicket(ticketId, content);
      setMessage("");
      await fetchTicket();
    } catch (err: any) {
      toast.error(err?.message?.replaceAll("_", " ") || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
          Loading ticket...
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Ticket className="h-5 w-5" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-slate-950">Ticket not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            The ticket may have been removed, or you may not have access to it.
          </p>
          <Link
            href="/admin/support"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto flex h-full max-w-5xl flex-col">
        <div className="mb-3 flex items-center justify-between">
          <Link
            href="/admin/support"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-3 md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-lg font-bold text-slate-950 md:text-xl">
                    {ticket.subject || "Untitled Ticket"}
                  </h1>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      statusStyles[ticket.status]
                    }`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>
                  {ticket.priority && (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        priorityStyles[ticket.priority] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 md:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-3 w-3.5" />
                     {ticket.messages?.[0]?.sender?.name || "—"}

                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3 w-3.5" />
                    {ticket.messages?.[0]?.sender?.email || "—"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3.5" />
                    Created: {formatDate(ticket.createdAt)}
                  </span>
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {ticket.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:min-w-64">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Ticket ID
                  </p>
                  <p className="mt-1 truncate text-xs font-medium text-slate-900">
                    #{ticket._id.slice(-6)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Updated
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-900">
                    {formatDate(ticket.updatedAt || ticket.resolvedAt)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Messages
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-900">{stats.total}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-900">
                    {ticket.status.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
            <div className="min-h-0 flex-1 overflow-y-auto p-3 md:p-4">
              {ticket.messages?.length ? (
                <div className="space-y-3">
                  {ticket.messages.map((msg: any) => (
                    <TicketMessage
                      key={msg._id}
                      message={msg.message}
                      role={msg.role}
                      createdAt={msg.createdAt}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
                  <div>
                    <CircleAlert className="mx-auto h-6 w-6 text-slate-400" />
                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No messages yet
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Start the conversation by sending a reply.
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-200 bg-white p-3 md:p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                <div className="flex-1">
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Admin reply
                  </label>
                  <textarea
                    placeholder="Write your reply..."
                    className="min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  />
                </div>

                <button
                  onClick={handleReply}
                  disabled={!message.trim() || sending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {sending ? "Sending..." : "Send reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}