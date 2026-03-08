"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createTicket } from "@/app/services/ticket.service";

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
      console.error(err);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      
      {/* Modal */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Create Support Ticket
          </h2>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">

          <input
            type="text"
            placeholder="Subject"
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black/20"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <textarea
            placeholder="Describe your issue"
            rows={4}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black/20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-black/20"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Submit"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}