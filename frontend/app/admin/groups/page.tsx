"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllGroupsAdmin,
  blockGroupAdmin,
  unblockGroupAdmin,
} from "@/app/services/admin.service";

import DashboardHeader from "../components/DashobardHeader";
import GroupsTable from "./components/GroupTables";
import GroupStatusTabs from "./components/GroupStatusTabs";
import GroupSearch from "./components/GroupFilter";
import RefreshButton from "../components/RefreshButton";

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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getAllGroupsAdmin();
      setGroups(data);
    } catch (err: any) {
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

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
      fetchGroups();
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
      fetchGroups();
    } finally {
      setActionLoading(null);
    }
  };

  // FILTERS
const filteredGroups = groups
  .filter((g) => {
    if (status === "blocked") return g.isBlocked;
    if (status === "active") return !g.isBlocked;
    return true;
  })
  .filter((g) => {
    const query = search.toLowerCase();

    const nameMatch = g.name.toLowerCase().includes(query);

    const creatorMatch = g.createdBy?.name
      ?.toLowerCase()
      .includes(query);

    return nameMatch || creatorMatch;
  });

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading groups...
      </div>
    );
  }

  return (
  <div className="p-1 md:p-2 bg-gray-50 min-h-screen space-y-6">

    <div className="flex items-center justify-between">
      <DashboardHeader
        title="Group Management"
        subtitle="Manage platform groups"
      />

      <RefreshButton onRefresh={fetchGroups} loading={loading} />
    </div>

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <GroupStatusTabs status={status} setStatus={setStatus} />
      <GroupSearch search={search} setSearch={setSearch} />
    </div>

    <GroupsTable
      groups={filteredGroups}
      actionLoading={actionLoading}
      handleBlock={handleBlock}
      handleUnblock={handleUnblock}
    />

  </div>
);
}