"use client";

import { useState } from "react";

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

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) return;

    onCreate(title, message);

    setTitle("");
    setMessage("");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md p-6 space-y-4">

        <h2 className="text-lg font-semibold">
          Create Announcement
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 text-sm"
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full border px-3 py-2 text-sm"
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-3 py-1 text-sm border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-1 text-sm font-semibold bg-black text-white"
          >
            Create
          </button>

        </div>

      </div>

    </div>
  );
}