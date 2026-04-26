"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUsers, blockUser, unblockUser } from "@/app/services/admin.service";
import DashboardHeader from "../components/DashobardHeader";
import UsersFilter from "./components/UsersFilter";
import UsersTable from "./components/UsersTable";
import RefreshButton from "../components/RefreshButton";

type User = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "blocked">("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      let message = "Failed to load users.";

      if (err?.message === "UNAUTHORIZED") {
        message = "Session expired. Please login again.";
      } else if (err?.message === "FORBIDDEN") {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      let result = [...users];

      if (search.trim()) {
        const q = search.toLowerCase();
        result = result.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.mobile || "").toLowerCase().includes(q)
        );
      }

      if (status === "active") result = result.filter((u) => !u.isBlocked);
      if (status === "blocked") result = result.filter((u) => u.isBlocked);

      setFilteredUsers(result);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status, users]);

  const handleBlock = async (id: string) => {
    try {
      setActionLoading(id);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBlocked: true } : u)));
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: true } : u))
      );
      await blockUser(id);
      toast.success("User blocked");
    } catch (err: any) {
      toast.error(err?.message || "Failed to block user");
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      setActionLoading(id);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBlocked: false } : u)));
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: false } : u))
      );
      await unblockUser(id);
      toast.success("User unblocked");
    } catch (err: any) {
      toast.error(err?.message || "Failed to unblock user");
      fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-600">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <DashboardHeader
            title="User Management"
            subtitle="Manage platform users"
          />
          <RefreshButton onRefresh={fetchUsers} loading={loading} />
        </div>

        <UsersFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />

        <UsersTable
          users={filteredUsers}
          actionLoading={actionLoading}
          handleBlock={handleBlock}
          handleUnblock={handleUnblock}
        />
      </div>
    </div>
  );
}