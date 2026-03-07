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

  // ESC key close
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

    setIsSubmitting(true);

    try {
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
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white shadow-xl
        p-6 space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Create Announcement
          </h2>

          <button
            onClick={onClose}
            className="p-1  hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Title</label>
          <input
            type="text"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="System maintenance notice"
            className="w-full border  px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-black/80"
          />
          <p className="text-xs text-gray-400 text-right">
            {title.length}/80
          </p>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Message</label>

          <textarea
            rows={4}
            maxLength={300}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="We will be performing scheduled maintenance..."
            className="w-full border  px-3 py-2 text-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-black/80"
          />

          <p className="text-xs text-gray-400 text-right">
            {message.length}/300
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border 
            hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="px-4 py-2 text-sm font-medium 
            bg-black text-white transition
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-900"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}