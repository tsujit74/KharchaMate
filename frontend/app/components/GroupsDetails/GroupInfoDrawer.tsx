"use client";

import { useEffect, useState } from "react";
import {
  X,
  Shield,
  UserMinus,
  UserPlus,
  Power,
} from "lucide-react";
import Link from "next/link";
import {
  removeMember,
  toggleGroupStatus,
} from "@/app/services/group.service";

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
  const hasExpenses = (group?.expenseCount ?? 0) > 0;
  const isActive = group?.isActive !== false;

  /* ---- Member Remove ---- */
  const handleRemove = async (userId: string) => {
    if (!isActive) {
      setMessage({
        type: "error",
        text: "This group is closed. No actions allowed.",
      });
      return;
    }

    if (hasExpenses) {
      setMessage({
        type: "error",
        text: "Members cannot be removed after expenses are added.",
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

  /* ---- Toggle Group Status ---- */
  const handleToggleStatus = async () => {
    if (!isAdmin) return;

    if (isActive) {
      const ok = confirm(
        "Closing this group will lock all actions.\nExpenses & members cannot be modified.\n\nContinue?"
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
          ? "Group has been closed successfully."
          : "Group has been reactivated.",
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

  return (
    <>
      {/* Overlay (keeps page visible below) */}
      <div
        onClick={onClose}
        className={`
          fixed inset-x-0 top-16 bottom-0 z-40
          bg-black/40
          transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-16 right-0 bottom-0 z-50
          w-full sm:w-[420px]
          bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
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
                  title="Add member"
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
              className={`mb-4 rounded-md border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Group Meta */}
          <div className="mb-6">
            <p className="text-xs text-gray-500">Group Name</p>
            <p className="font-medium">{group.name}</p>
          </div>

          {/* Group Status */}
          <div className="mb-6 border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Group Status</p>
                <p className="text-xs text-gray-500">
                  {isActive
                    ? "Group is active. Members can add expenses."
                    : "Group is closed. View only."}
                </p>
              </div>

              {isAdmin && (
                <button
                  disabled={statusLoading}
                  onClick={handleToggleStatus}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border
                    ${
                      isActive
                        ? "border-red-300 text-red-600 hover:bg-red-50"
                        : "border-green-300 text-green-600 hover:bg-green-50"
                    }`}
                >
                  <Power className="w-4 h-4" />
                  {isActive ? "Close" : "Activate"}
                </button>
              )}
            </div>
          </div>

          {/* Members */}
          <div>
            <p className="text-sm font-semibold mb-3">
              Members ({members.length})
            </p>

            <div className="space-y-3">
              {members.map((m: any) => {
                const isCreator = group?.createdBy?._id === m._id;
                const isMemberAdmin = admins.some(
                  (a: any) => a?._id === m._id
                );

                return (
                  <div
                    key={m._id}
                    className="flex justify-between items-center border rounded-lg p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {m.name}
                        {m._id === currentUserId && " (You)"}
                      </p>
                      <p className="text-xs text-gray-500">{m.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isMemberAdmin && (
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
        </div>
      </div>
    </>
  );
}
