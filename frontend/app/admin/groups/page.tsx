"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllGroupsAdmin,
  blockGroupAdmin,
  unblockGroupAdmin,
} from "@/app/services/admin.service";
import DashboardHeader from "../components/DashobardHeader";

type Group = {
  _id: string;
  name: string;
  createdBy?: { name: string };
  totalMembers: number;
  totalExpenses: number;
  isBlocked: boolean;
  createdAt: string;
};

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllGroupsAdmin();
      setGroups(data);
    } catch (err: any) {
      let message = "Failed to load groups.";

      if (err.message === "UNAUTHORIZED") {
        message = "Session expired. Please login again.";
      } else if (err.message === "FORBIDDEN") {
        message = "Admin access required.";
      }

      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  //BLOCK
  const handleBlock = async (id: string) => {
    try {
      setActionLoading(id);

      // optimistic update
      setGroups((prev) =>
        prev.map((g) =>
          g._id === id ? { ...g, isBlocked: true } : g
        )
      );

      await blockGroupAdmin(id);
      toast.success("Group blocked");
    } catch (err: any) {
      toast.error(err.message || "Failed to block group");
      fetchGroups(); // rollback
    } finally {
      setActionLoading(null);
    }
  };

  // UNBLOCK
  const handleUnblock = async (id: string) => {
    try {
      setActionLoading(id);

      // optimistic update
      setGroups((prev) =>
        prev.map((g) =>
          g._id === id ? { ...g, isBlocked: false } : g
        )
      );

      await unblockGroupAdmin(id);
      toast.success("Group unblocked");
    } catch (err: any) {
      toast.error(err.message || "Failed to unblock group");
      fetchGroups(); // rollback
    } finally {
      setActionLoading(null);
    }
  };

  // loading state
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 font-medium">
        Loading groups...
      </div>
    );
  }

  // error state
  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4 font-medium">{error}</p>
        <button
          onClick={fetchGroups}
          className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-1 md:p-2 bg-gray-50 min-h-screen">
      <DashboardHeader
        title="Group Management"
        subtitle="Manage platform groups"
      />

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100/70">
              <tr className="text-gray-600">
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Creator</th>
                <th className="p-4 text-left font-semibold">Members</th>
                <th className="p-4 text-left font-semibold">Expenses</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {groups.map((group) => (
                <tr
                  key={group._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Name */}
                  <td className="p-4 font-semibold text-gray-900">
                    {group.name}
                  </td>

                  {/* Creator */}
                  <td className="p-4 text-gray-600">
                    {group.createdBy?.name || "—"}
                  </td>

                  {/* Members */}
                  <td className="p-4 text-gray-600">
                    {group.totalMembers}
                  </td>

                  {/* Expenses */}
                  <td className="p-4 text-gray-600">
                    {group.totalExpenses}
                  </td>

                  {/* Status badge */}
                  <td className="p-4">
                    {group.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">
                        ● Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                        ● Active
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="p-4">
                    <button
                      disabled={actionLoading === group._id}
                      onClick={() =>
                        group.isBlocked
                          ? handleUnblock(group._id)
                          : handleBlock(group._id)
                      }
                      className={`
                        min-w-[120px]
                        px-4 py-1.5
                        text-xs font-semibold
                        text-white
                        transition
                        disabled:opacity-50
                        ${
                          group.isBlocked
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }
                      `}
                    >
                      {actionLoading === group._id
                        ? "Processing..."
                        : group.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {groups.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No groups found.
          </div>
        )}
      </div>
    </div>
  );
}