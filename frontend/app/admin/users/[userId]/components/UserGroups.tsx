"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  getUserGroupsAdmin,
  blockGroupAdmin,
  unblockGroupAdmin,
} from "@/app/services/admin.service";

type Group = {
  _id: string;
  name: string;
  isBlocked?: boolean;
  createdAt: string;
};

type Props = {
  userId: string;
};

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
      toast.error(err.message || "Failed to load groups");
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

  // BLOCK
  const handleBlock = async (id: string) => {
    try {
      setActionLoading(id);

      setGroups((prev) =>
        prev.map((g) =>
          g._id === id ? { ...g, isBlocked: true } : g
        )
      );

      await blockGroupAdmin(id);
      toast.success("Group blocked");
    } catch {
      loadGroups();
    } finally {
      setActionLoading(null);
    }
  };

  // UNBLOCK
  const handleUnblock = async (id: string) => {
    try {
      setActionLoading(id);

      setGroups((prev) =>
        prev.map((g) =>
          g._id === id ? { ...g, isBlocked: false } : g
        )
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
    <div className="bg-white border border-gray-200 rounded-md">

      {/* HEADER */}

      <button
        onClick={toggleGroups}
        className="w-full flex items-center justify-between p-4 font-semibold hover:bg-gray-50 transition"
      >
        <span>User Groups</span>

        <span className="text-sm text-gray-500">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* CONTENT */}

      {open && (
        <div className="border-t">

          {loading && (
            <p className="p-4 text-sm text-gray-500">
              Loading groups...
            </p>
          )}

          {!loading && groups.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No groups created by this user
            </p>
          )}

          {!loading && groups.length > 0 && (
            <div className="max-h-80 overflow-y-auto">

              {groups.map((group) => (
                <div
                  key={group._id}
                  className="p-4 border-b flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {group.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      Created {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">

                    {group.isBlocked ? (
                      <span className="text-xs text-red-600 font-medium">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 font-medium">
                        Active
                      </span>
                    )}

                    <button
                      disabled={actionLoading === group._id}
                      onClick={() =>
                        group.isBlocked
                          ? handleUnblock(group._id)
                          : handleBlock(group._id)
                      }
                      className={`px-3 py-1 text-xs font-semibold text-white
                      ${
                        group.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
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
          )}

        </div>
      )}
    </div>
  );
}