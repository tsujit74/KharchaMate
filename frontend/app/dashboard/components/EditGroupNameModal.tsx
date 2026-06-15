"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { updateGroupName } from "@/app/services/group.service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  currentName: string;
  onUpdated: (newName: string) => void;
};

export default function EditGroupNameModal({
  isOpen,
  onClose,
  groupId,
  currentName,
  onUpdated,
}: Props) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Group name cannot be empty");
      return;
    }

    if (name.trim() === currentName) {
      onClose();
      return;
    }

    try {
      setLoading(true);

      await updateGroupName(groupId, name.trim());

      onUpdated(name.trim());
      toast.success("Group name updated");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update group name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Edit Group Name
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Group Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new group name"
              className="mt-2 w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-slate-900 focus:ring-0 outline-none transition"
              maxLength={50}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-2xl bg-slate-950 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Name"}
          </button>
        </form>
      </div>
    </div>
  );
}
