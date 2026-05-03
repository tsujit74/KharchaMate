"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Shield,
  UserMinus,
  UserPlus,
  Crown,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { removeMember, toggleGroupStatus } from "@/app/services/group.service";
import toast from "react-hot-toast";

export default function GroupInfoDrawer({
  open,
  onClose,
  group,
  currentUserId,
  onRefresh,
}: any) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!group) return null;

  const admins = group.admins || [];
  const members = group.members || [];

  const isAdmin = admins.some((a: any) => a._id === currentUserId);
  const isCreator = group.createdBy?._id === currentUserId;

  const isActive = group?.isActive !== false;
  const hasExpenses = (group?.expenseCount ?? 0) > 0;

  /* Derived member roles */
  const enrichedMembers = useMemo(() => {
    return members.map((m: any) => {
      const creator = group.createdBy?._id === m._id;
      const admin = admins.some((a: any) => a._id === m._id);

      return {
        ...m,
        role: creator ? "CREATOR" : admin ? "ADMIN" : "MEMBER",
      };
    });
  }, [members, admins, group.createdBy]);

  /* Toggle group */
  const handleToggleStatus = async () => {
    if (!isAdmin || statusLoading) return;

    if (isActive) {
      const ok = window.confirm(
        "Closing this group will disable all actions.\nContinue?"
      );
      if (!ok) return;
    }

    try {
      setStatusLoading(true);
      await toggleGroupStatus(group._id);
      await onRefresh();

      toast.success(
        isActive ? "Group closed" : "Group reactivated"
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  /* Remove member */
  const handleRemove = async (userId: string) => {
    if (!isActive) return toast.error("Group is closed");
    if (hasExpenses)
      return toast.error("Cannot remove members after expenses");

    if (!window.confirm("Remove this member?")) return;

    try {
      setLoadingUserId(userId);
      await removeMember(group._id, userId);
      await onRefresh();
      toast.success("Member removed");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 backdrop-blur-sm bg-black/40 transition-opacity duration-300
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-full sm:w-[420px]
        bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-white z-10 border-b p-5 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg">Group Info</h2>
            <p className="text-xs text-gray-500">
              Manage members & settings
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && isActive && (
              <Link
                href={`/groups/${group._id}/add-member`}
                className="p-2 rounded-lg border hover:bg-gray-100 transition"
              >
                <UserPlus className="w-4 h-4" />
              </Link>
            )}

            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-6 overflow-y-auto h-[calc(100%-80px)]">
          {/* GROUP HEADER */}
          <div>
            <h3 className="text-xl font-semibold">{group.name}</h3>

            <span
              className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium
              ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isActive ? "Active" : "Closed"}
            </span>
          </div>

          {/* STATUS CARD */}
          <div className="rounded-xl border p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Group Status</p>
                <p className="text-xs text-gray-500">
                  {isActive
                    ? "Members can add expenses"
                    : "View only mode"}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={handleToggleStatus}
                  disabled={statusLoading}
                  className={`relative w-14 h-7 rounded-full transition
                  ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-6 w-6 bg-white rounded-full shadow transition
                    ${isActive ? "translate-x-7" : ""}`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* MEMBERS */}
          <div>
            <p className="font-semibold mb-3">
              Members ({members.length})
            </p>

            <div className="space-y-3">
              {enrichedMembers.map((m: any) => {
                const isYou = m._id === currentUserId;

                const roleStyle =
                  m.role === "CREATOR"
                    ? "bg-purple-50 border-purple-200"
                    : m.role === "ADMIN"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50";

                return (
                  <div
                    key={m._id}
                    className={`flex justify-between items-center p-3 rounded-xl border transition hover:shadow-sm ${roleStyle}`}
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {m.name} {isYou && "(You)"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {m.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {m.mobile}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* ROLE BADGE */}
                      <span className="text-[10px] px-2 py-1 rounded-full font-semibold bg-black text-white">
                        {m.role}
                      </span>

                      {/* ICON */}
                      {m.role === "CREATOR" && (
                        <Crown className="w-4 h-4 text-purple-500" />
                      )}
                      {m.role === "ADMIN" && (
                        <Shield className="w-4 h-4 text-blue-500" />
                      )}

                      {/* REMOVE */}
                      {isAdmin &&
                        isActive &&
                        m.role !== "CREATOR" &&
                        !isYou && (
                          <button
                            disabled={loadingUserId === m._id}
                            onClick={() => handleRemove(m._id)}
                            className="text-red-500 hover:scale-110 transition"
                          >
                            {loadingUserId === m._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <UserMinus className="w-4 h-4" />
                            )}
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FOOTER */}
          <div className="text-xs text-gray-500 border-t pt-4">
            🔐 Only admins can manage members and group settings.
          </div>
        </div>
      </div>
    </>
  );
}