"use client";

import { useEffect, useMemo, useState } from "react";
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
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
  };
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
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getAllGroupsAdmin();
      setGroups(data || []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchGroups();
      toast.success("Refreshed");
    } finally {
      setRefreshing(false);
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
      fetchGroups();
      toast.error("Failed to block group");
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
      fetchGroups();
      toast.error("Failed to unblock group");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredGroups = useMemo(() => {
    const query = search.toLowerCase().trim();

    return groups
      .filter((g) => {
        if (status === "blocked") return g.isBlocked;
        if (status === "active") return !g.isBlocked;
        return true;
      })
      .filter((g) => {
        if (!query) return true;

        const nameMatch = g.name.toLowerCase().includes(query);
        const creatorMatch = g.createdBy?.name?.toLowerCase().includes(query);
        const emailMatch = g.createdBy?.email?.toLowerCase().includes(query);

        return nameMatch || creatorMatch || emailMatch;
      });
  }, [groups, search, status]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Loading groups...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <DashboardHeader
            title="Group Management"
            subtitle="Manage platform groups"
          />
          <RefreshButton onRefresh={handleRefresh} loading={refreshing} />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
    </div>
  );
}