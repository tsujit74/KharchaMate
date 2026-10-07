"use client";

import { useEffect, useState } from "react";
import { X, Users, ArrowRight, IndianRupeeIcon } from "lucide-react";
import { createGroup } from "@/app/services/group.service";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (groupId: string) => void;
};

export default function CreateGroupModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [type, setType] = useState<"NORMAL" | "ONGOING">("NORMAL");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleCreate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Group name is required");
      return;
    }

    if (budget !== null && (Number.isNaN(budget) || budget < 0)) {
      setError("Please enter a valid budget");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const createdGroup = await createGroup(trimmedName, budget, type);

      if (!createdGroup?._id) {
        throw new Error("FAILED_CREATE_GROUP");
      }

      toast.success("Group created successfully");

      setName("");
      setBudget(null);
      setType("NORMAL");

      onCreated(createdGroup._id);
      onClose();
    } catch (err: any) {
      const message = err?.message || "Failed to create group";

      if (message === "UNAUTHORIZED") {
        setError("Session expired. Please login again.");
      } else if (message === "NETWORK_ERROR") {
        setError("Network error. Please try again.");
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create Group
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Add a group to start tracking expenses.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Group Name
            </label>

            <div className="relative">
              <Users
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. Goa Trip"
                autoFocus
                disabled={submitting}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-sm text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Group Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("NORMAL")}
                disabled={submitting}
                className={`p-3 rounded-lg border text-left transition ${
                  type === "NORMAL"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-medium text-slate-900">Normal</p>
                <p className="text-xs text-slate-500 mt-1">
                  Short-term expenses
                </p>
              </button>

              <button
                type="button"
                onClick={() => setType("ONGOING")}
                disabled={submitting}
                className={`p-3 rounded-lg border text-left transition ${
                  type === "ONGOING"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-medium text-slate-900">Ongoing</p>
                <p className="text-xs text-slate-500 mt-1">
                  Long-term expenses
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Budget{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>

            <div className="relative">
              <IndianRupeeIcon
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                min="0"
                value={budget ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setBudget(value === "" ? null : Number(value));

                  if (error) setError("");
                }}
                placeholder="Enter budget"
                disabled={submitting}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-sm text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950 text-white text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Group"}
            {!submitting && <ArrowRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}