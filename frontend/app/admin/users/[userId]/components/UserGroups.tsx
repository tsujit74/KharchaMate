"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  getUserGroupsAdmin,
  blockGroupAdmin,
  unblockGroupAdmin,
} from "@/app/services/admin.service";
import { ChevronDown, ChevronUp, CircleDot, CalendarDays } from "lucide-react";

type Group = {
  _id: string;
  name: string;
  isBlocked?: boolean;
  createdAt: string;
};

type Props = {
  userId: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function UserGroups({ userId }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadGroups = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await getUserGroupsAdmin(userId);
      setGroups(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const toggleGroups = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen && groups.length === 0) {
      loadGroups();
    }
  };

  const handleBlock = async (id: string) => {
    try {
      setActionLoading(id);
      setGroups((prev) =>
        prev.map((g) => (g._id === id ? { ...g, isBlocked: true } : g))
      );
      await blockGroupAdmin(id);
      toast.success("Group blocked");
    } catch {
      loadGroups();
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      setActionLoading(id);
      setGroups((prev) =>
        prev.map((g) => (g._id === id ? { ...g, isBlocked: false } : g))
      );
      await unblockGroupAdmin(id);
      toast.success("Group unblocked");
    } catch {
      loadGroups();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={toggleGroups}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <div>
          <h3 className="text-base font-semibold text-slate-950">User Groups</h3>
          <p className="mt-1 text-sm text-slate-500">
            Groups created or joined by this user.
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-xs font-medium">
            {open ? "Hide" : "Show"}
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-200">
          {loading && (
            <div className="px-5 py-6 text-sm text-slate-500">Loading groups...</div>
          )}

          {!loading && groups.length === 0 && (
            <div className="px-5 py-6">
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No groups created by this user.
              </div>
            </div>
          )}

          {!loading && groups.length > 0 && (
            <div className="max-h-[420px] overflow-y-auto">
              <div className="divide-y divide-slate-100">
                {groups.map((group) => (
                  <div
                    key={group._id}
                    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CircleDot className="h-4 w-4 text-slate-400" />
                        <p className="truncate font-semibold text-slate-950">
                          {group.name}
                        </p>
                      </div>

                      <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Created {formatDate(group.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          group.isBlocked
                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        }`}
                      >
                        {group.isBlocked ? "Blocked" : "Active"}
                      </span>

                      <button
                        disabled={actionLoading === group._id}
                        onClick={() =>
                          group.isBlocked ? handleUnblock(group._id) : handleBlock(group._id)
                        }
                        className={`rounded-xl px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          group.isBlocked
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {actionLoading === group._id
                          ? "Processing..."
                          : group.isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}