"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  getUserGroupsAdmin,
  blockGroupAdmin,
  unblockGroupAdmin,
  getUserDetailsAdmin,
} from "@/app/services/admin.service";

import {
  ChevronDown,
  ChevronUp,
  CircleDot,
  CalendarDays,
  Eye,
  Users,
} from "lucide-react";

type Group = {
  _id: string;
  name: string;
  isBlocked?: boolean;
  isActive?: boolean;
  totalMembers?: number;
  createdAt: string;
  type?: "CREATED" | "JOINED";
};

type UserGroupsResponse = {
  createdGroups: Group[];
  joinedGroups: Group[];
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
    if (!userId || loading) return;

    try {
      setLoading(true);

      const data: UserGroupsResponse = await getUserDetailsAdmin(userId);

      // SAFE FALLBACKS
      const safeCreatedGroups = Array.isArray(data?.createdGroups)
        ? data.createdGroups
        : [];

      const safeJoinedGroups = Array.isArray(data?.joinedGroups)
        ? data.joinedGroups
        : [];

      // ADD TYPE
      const createdGroups: Group[] = safeCreatedGroups.map((g) => ({
        _id: g._id,
        name: g.name || "Unnamed Group",
        isBlocked: Boolean(g.isBlocked),
        isActive: g.isActive ?? true,
        totalMembers: g.totalMembers ?? 0,
        createdAt: g.createdAt,
        type: "CREATED",
      }));

      const joinedGroups: Group[] = safeJoinedGroups.map((g) => ({
        _id: g._id,
        name: g.name || "Unnamed Group",
        isBlocked: Boolean(g.isBlocked),
        isActive: g.isActive ?? true,
        totalMembers: g.totalMembers ?? 0,
        createdAt: g.createdAt,
        type: "JOINED",
      }));

      // REMOVE DUPLICATES
      // MERGE + REMOVE DUPLICATES BY GROUP ID
      const mergedGroups = [...createdGroups, ...joinedGroups];

      const uniqueGroups = mergedGroups.filter(
        (group, index, self) =>
          index === self.findIndex((g) => g._id === group._id),
      );

      // IF GROUP EXISTS IN BOTH CREATED + JOINED
      // PRIORITIZE CREATED LABEL
      const finalGroups: Group[] = uniqueGroups.map((group): Group => {
        const isCreated = createdGroups.some((g) => g._id === group._id);

        return {
          ...group,
          type: isCreated ? "CREATED" : "JOINED",
        };
      });

      // SORT LATEST FIRST
      finalGroups.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setGroups(finalGroups);
    } catch (err: any) {
      console.error("Load groups error:", err);

      setGroups([]);

      toast.error(
        err?.response?.data?.message || err?.message || "Failed to load groups",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleGroups = async () => {
    try {
      const nextOpen = !open;

      setOpen(nextOpen);

      // LOAD ONLY FIRST TIME
      if (nextOpen && groups.length === 0 && !loading) {
        await loadGroups();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlock = async (id: string) => {
    if (!id || actionLoading) return;

    // BACKUP FOR ROLLBACK
    const previousGroups = [...groups];

    try {
      setActionLoading(id);

      // OPTIMISTIC UPDATE
      setGroups((prev) =>
        prev.map((g) =>
          g._id === id
            ? {
                ...g,
                isBlocked: true,
              }
            : g,
        ),
      );

      await blockGroupAdmin(id);

      toast.success("Group blocked successfully");
    } catch (err: any) {
      // ROLLBACK
      setGroups(previousGroups);

      toast.error(
        err?.response?.data?.message || err?.message || "Failed to block group",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (id: string) => {
    if (!id || actionLoading) return;

    // BACKUP FOR ROLLBACK
    const previousGroups = [...groups];

    try {
      setActionLoading(id);

      // OPTIMISTIC UPDATE
      setGroups((prev) =>
        prev.map((g) =>
          g._id === id
            ? {
                ...g,
                isBlocked: false,
              }
            : g,
        ),
      );

      await unblockGroupAdmin(id);

      toast.success("Group unblocked successfully");
    } catch (err: any) {
      // ROLLBACK
      setGroups(previousGroups);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to unblock group",
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={toggleGroups}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-950 sm:text-base">
            User Groups
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Groups created and joined by this user.
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-[11px] font-medium">
            {open ? "Hide" : "Show"}
          </span>
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-200">
          {loading && (
            <div className="px-4 py-5 text-sm text-slate-500">
              Loading groups...
            </div>
          )}

          {!loading && groups.length === 0 && (
            <div className="px-4 py-5">
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No groups found for this user.
              </div>
            </div>
          )}

          {!loading && groups.length > 0 && (
            <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                          {group.name?.charAt(0)?.toUpperCase() || "G"}
                        </div>

                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-slate-950">
                            {group.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Group overview
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/admin/groups/${group._id}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
                        group.type === "CREATED"
                          ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                          : "bg-violet-50 text-violet-700 ring-1 ring-violet-200"
                      }`}
                    >
                      {group.type === "CREATED" ? "Created" : "Joined"}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
                        group.isBlocked
                          ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                          : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      }`}
                    >
                      {group.isBlocked ? "Blocked" : "Active"}
                    </span>

                    {group.isActive === false && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Created
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {formatDate(group.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Users className="h-3.5 w-3.5" />
                        Members
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {group.totalMembers ?? 0}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/admin/groups/${group._id}`}
                      className="flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      View
                    </Link>

                    <button
                      disabled={actionLoading === group._id}
                      onClick={() =>
                        group.isBlocked
                          ? handleUnblock(group._id)
                          : handleBlock(group._id)
                      }
                      className={`flex h-10 flex-1 items-center justify-center rounded-xl text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        group.isBlocked
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {actionLoading === group._id
                        ? "..."
                        : group.isBlocked
                          ? "Unblock"
                          : "Block"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
