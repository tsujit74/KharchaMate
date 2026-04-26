"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createTicket } from "@/app/services/ticket.service";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  refreshTickets: () => void;
}

export default function CreateTicketModal({
  open,
  onClose,
  refreshTickets,
}: Props) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, loading]);

  if (!open) return null;

  const resetForm = () => {
    setSubject("");
    setDescription("");
    setPriority("MEDIUM");
  };

  const handleSubmit = async () => {
    if (loading) return;

    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim();

    if (!trimmedSubject || !trimmedDescription) {
      toast.error("Subject and description are required");
      return;
    }

    try {
      setLoading(true);
      await createTicket(trimmedSubject, trimmedDescription, priority);
      toast.success("Ticket created successfully");
      resetForm();
      refreshTickets();
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.message === "NETWORK_ERROR"
          ? "Network error. Please try again."
          : err?.message === "UNAUTHORIZED"
          ? "Session expired. Please login again."
          : "Failed to create ticket";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-ticket-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 sm:my-6"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h2
              id="create-ticket-title"
              className="text-lg font-bold text-slate-950 sm:text-xl"
            >
              Create Support Ticket
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tell us what’s wrong and we’ll help you fix it.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subject
            </label>
            <input
              type="text"
              placeholder="Short summary of your issue"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              placeholder="Describe your issue in detail"
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            onClick={handleClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Submit Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}