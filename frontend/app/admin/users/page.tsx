"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllUsers,
  blockUser,
  unblockUser,
} from "@/app/services/admin.service";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      let message = "Failed to load users.";

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
    fetchUsers();
  }, []);

  const handleBlock = async (id: string) => {
    try {
      setActionLoading(id);

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: true } : u)),
      );

      await blockUser(id);
      toast.success("User blocked");
    } catch (err: any) {
      toast.error(err.message || "Failed to block user");
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      setActionLoading(id);

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: false } : u)),
      );

      await unblockUser(id);
      toast.success("User unblocked");
    } catch (err: any) {
      toast.error(err.message || "Failed to unblock user");
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 font-medium">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 mb-4 font-medium">{error}</p>
        <button
          onClick={fetchUsers}
          className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor and control platform users
        </p>
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100/70">
              <tr className="text-gray-600">
                <th className="p-4 text-left font-semibold">User</th>
                <th className="p-4 text-left font-semibold">Role</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Joined</th>
                <th className="p-4 text-left font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* User Info */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-700 capitalize font-medium">
                      {user.role}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">
                        ● Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                        ● Active
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Action */}
                  <td className="p-4">
                    <button
                      disabled={actionLoading === user._id}
                      onClick={() =>
                        user.isBlocked
                          ? handleUnblock(user._id)
                          : handleBlock(user._id)
                      }
                      className={`
      min-w-[120px]
      px-4 py-1.5
      text-xs font-semibold
      text-white
      transition
      disabled:opacity-50
      ${
        user.isBlocked
          ? "bg-green-600 hover:bg-green-700"
          : "bg-red-600 hover:bg-red-700"
      }
    `}
                    >
                      {actionLoading === user._id
                        ? "Processing..."
                        : user.isBlocked
                          ? "Unblock"
                          : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="p-10 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
}
