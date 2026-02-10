"use client";

import { useEffect, useState } from "react";
import { X, Shield, UserMinus, UserPlus, Crown } from "lucide-react";
import Link from "next/link";
import { removeMember, toggleGroupStatus } from "@/app/services/group.service";

type Message = {
  type: "success" | "error";
  text: string;
};

export default function GroupInfoDrawer({
  open,
  onClose,
  group,
  currentUserId,
  onRefresh,
}: {
  open: boolean;
  onClose: () => void;
  group: any;
  currentUserId?: string;
  onRefresh: () => Promise<void> | void;
}) {
  const [message, setMessage] = useState<Message | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  /* Prevent body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!group) return null;

  const admins = Array.isArray(group.admins) ? group.admins : [];
  const members = Array.isArray(group.members) ? group.members : [];

  const isAdmin = admins.some((a: any) => a?._id === currentUserId);
  const isActive = group?.isActive !== false;
  const hasExpenses = (group?.expenseCount ?? 0) > 0;

  /* ---- Toggle Group Status ---- */
  const handleToggleStatus = async () => {
    if (!isAdmin || statusLoading) return;

    if (isActive) {
      const ok = confirm(
        "Closing this group will lock all actions.\nContinue?",
      );
      if (!ok) return;
    }

    try {
      setStatusLoading(true);
      setMessage(null);

      await toggleGroupStatus(group._id, !isActive);
      await onRefresh();

      setMessage({
        type: "success",
        text: isActive
          ? "Group closed successfully."
          : "Group reactivated successfully.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update group status.",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  /* ---- Remove Member ---- */
  const handleRemove = async (userId: string) => {
    if (!isActive) {
      setMessage({
        type: "error",
        text: "This group is closed.",
      });
      return;
    }

    if (hasExpenses) {
      setMessage({
        type: "error",
        text: "Cannot remove members after expenses are added.",
      });
      return;
    }

    if (!confirm("Remove this member from the group?")) return;

    try {
      setLoadingUserId(userId);
      setMessage(null);

      await removeMember(group._id, userId);
      await onRefresh();

      setMessage({
        type: "success",
        text: "Member removed successfully.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to remove member.",
      });
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40 transition-opacity
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-16 right-0 bottom-0 z-50 w-full sm:w-[420px]
          bg-white shadow-2xl transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 overflow-y-auto h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Group Info</h2>

            <div className="flex items-center gap-2">
              {isAdmin && isActive && (
                <Link
                  href={`/groups/${group._id}/add-member`}
                  className="p-2 rounded-lg border hover:bg-gray-50"
                >
                  <UserPlus className="w-4 h-4 text-gray-600" />
                </Link>
              )}
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 rounded-md border px-4 py-3 text-sm transition-all
                ${
                  message.type === "success"
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-red-300 bg-red-50 text-red-700"
                }`}
            >
              {message.text}
            </div>
          )}

          {/* Group Name */}
          <div className="mb-4">
            <p className="text-xs text-gray-500">Group Name</p>
            <p className="font-medium">{group.name}</p>
          </div>

          {/* Status + Toggle */}
          <div
            className={`mb-6 rounded-xl p-4 border transition-all duration-300
              ${
                isActive
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-gray-50 border-gray-300"
              }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Group Status</p>
                <p className="text-xs text-gray-600 mt-1">
                  {isActive
                    ? "Active - members can add expenses"
                    : "Closed - view only"}
                </p>
              </div>

              {/* Toggle Switch */}
              {isAdmin && (
                <button
                  onClick={handleToggleStatus}
                  disabled={statusLoading}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300
                    ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow
                      transition-transform duration-300
                      ${isActive ? "translate-x-7" : "translate-x-0"}`}
                  />
                </button>
              )}
            </div>
          </div>

          {!isActive && (
            <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-300 px-4 py-3 text-sm text-yellow-800">
              🔒 This group is closed. All actions are disabled.
            </div>
          )}

          {/* Members */}
          <div>
            <p className="text-sm font-semibold mb-3">
              Members ({members.length})
            </p>

            <div className="space-y-3">
              {members.map((m: any) => {
                const isCreator = group?.createdBy?._id === m._id;
                const isMemberAdmin = admins.some((a: any) => a?._id === m._id);

                const roleStyles = isCreator
                  ? "border-purple-300 bg-purple-50"
                  : isMemberAdmin
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-white";

                return (
                  <div
                    key={m._id}
                    className={`flex justify-between items-center border rounded-lg p-3 transition
                      ${roleStyles}
                      ${!isActive ? "opacity-70" : ""}`}
                  >
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1">
                        {m.name}
                        {m._id === currentUserId && " (You)"}
                      </p>
                      <p className="text-xs text-gray-500">{m.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCreator && (
                        <Crown className="w-4 h-4 text-purple-500" />
                      )}
                      {isMemberAdmin && !isCreator && (
                        <Shield className="w-4 h-4 text-blue-500" />
                      )}

                      {isAdmin &&
                        isActive &&
                        !isCreator &&
                        m._id !== currentUserId && (
                          <button
                            disabled={loadingUserId === m._id}
                            onClick={() => handleRemove(m._id)}
                            className="text-red-500 disabled:opacity-40"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8 pt-4 border-t">
            <p className="text-xs text-gray-500 flex items-start gap-2">
              <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
              Only{" "}
              <span className="font-medium text-gray-600">
                group admins
              </span>{" "}
              can activate or close this group.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
