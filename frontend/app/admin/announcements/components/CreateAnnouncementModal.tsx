"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, message: string) => void;
};

export default function CreateAnnouncementModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = title.trim().length > 0 && message.trim().length > 0;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onCreate(title.trim(), message.trim());
      setTitle("");
      setMessage("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Create Announcement
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add a new notice for admins or users.
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Title
            </label>
            <input
              type="text"
              maxLength={80}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="System maintenance notice"
              className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
            <p className="text-right text-xs text-slate-400">{title.length}/80</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Message
            </label>
            <textarea
              rows={5}
              maxLength={300}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="We will be performing scheduled maintenance..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
            <p className="text-right text-xs text-slate-400">
              {message.length}/300
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}