"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllUsers,
  blockUser,
  unblockUser,
} from "@/app/services/admin.service";

import DashboardHeader from "../components/DashobardHeader";
import UsersFilter from "./components/UsersFilter";
import UsersTable from "./components/UsersTable";
import RefreshButton from "../components/RefreshButton";

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

  // SEARCH + FILTER
  useEffect(() => {
    const timer = setTimeout(() => {
      let result = [...users];

      if (search) {
        result = result.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (status === "active") {
        result = result.filter((u) => !u.isBlocked);
      }

      if (status === "blocked") {
        result = result.filter((u) => u.isBlocked);
      }

      setFilteredUsers(result);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, status, users]);

  const handleBlock = async (id: string) => {
    try {
      setActionLoading(id);

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: true } : u))
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
        prev.map((u) => (u._id === id ? { ...u, isBlocked: false } : u))
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
          className="px-5 py-2.5 bg-black text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

 return (
  <div className="p-2 md:p-4 bg-gray-50 min-h-screen space-y-6">

    <div className="flex items-center justify-between">
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
);
}