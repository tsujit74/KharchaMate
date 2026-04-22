"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  MoreVertical,
  UserPlus,
  Pencil,
  ArrowRight,
  TrendingUp,
  Lock,
  Wallet,
  ReceiptText,
  Activity,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";

import { formatDateTime } from "@/app/utils/formatDateTime";
import { getMyGroups } from "../services/group.service";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { getRecentExpenses } from "../services/expense.service";
import { getPendingSettlements } from "../services/settlement.service";
import AppSkeleton from "../components/ui/AppSkeleton";
import toast from "react-hot-toast";
import EditGroupNameModal from "../components/Groups/EditGroupNameModal";
import Announcements from "./components/Announcements";

type Member = {
  _id: string;
  name: string;
  email: string;
};

type Group = {
  _id: string;
  name: string;
  createdBy: string;
  admins: string[];
  members: Member[];
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  isBlocked?: boolean;
};

type RecentExpense = {
  _id: string;
  description: string;
  amount: number;
  createdAt: string;
  group: { _id: string; name: string };
  paidBy: { _id: string; name: string };
};

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<RecentExpense[]>([]);
  const [pendingSettlements, setPendingSettlements] = useState<any[]>([]);

  const [groupLoading, setGroupLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [error, setError] = useState("");

  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchAll = async () => {
      try {
        const groupsData = await getMyGroups();

        const sortedGroups = groupsData.sort(
          (a: Group, b: Group) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );

        setGroups(sortedGroups);
        setRecentExpenses(await getRecentExpenses());
        setPendingSettlements(await getPendingSettlements());
      } catch (err: any) {
        const message = err.message || "Failed to load dashboard data";
        setError(message);
        toast.error(message);

        if (err.message === "UNAUTHORIZED") {
          router.replace("/login");
        }
      } finally {
        setGroupLoading(false);
        setRecentLoading(false);
        setPendingLoading(false);
      }
    };

    fetchAll();
  }, [loading, isAuthenticated, router]);

  const handleNameUpdated = (newName: string) => {
    setGroups((prev) =>
      prev.map((g) => (g._id === editGroupId ? { ...g, name: newName } : g)),
    );
  };

  const totalMembers = groups.reduce(
    (sum, group) => sum + group.members.length,
    0,
  );
  const activeGroups = groups.filter(
    (group) => group.isActive && !group.isBlocked,
  ).length;
  const blockedGroups = groups.filter((group) => group.isBlocked).length;
  const archivedGroups = groups.filter(
    (group) => !group.isActive && !group.isBlocked,
  ).length;

  if (loading || groupLoading) {
    return <AppSkeleton variant="dashboard" />;
  }

  if (error) {
    return <p className="p-10 text-center text-red-500 font-medium">{error}</p>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Announcements />

        {/* Header */}
       <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
  <div className="min-w-0">
    <p className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wider">
      Dashboard
    </p>

    <h2 className="mt-1 text-xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight truncate">
      Hey, {user?.name?.split(" ")[0] || "User"}.
    </h2>

    <p className="hidden sm:block mt-1 text-sm sm:text-base text-slate-500 leading-relaxed">
      Your expense ecosystem at a glance.
    </p>
  </div>

  <div className="flex items-center gap-2 shrink-0">
    <Link
      href="/dashboard/insights"
      className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
    >
      <TrendingUp className="w-4 h-4 text-blue-600" />
      <span className="hidden sm:inline ml-1">Insights</span>
    </Link>

    <Link
      href="/groups/create"
      className="inline-flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-xl bg-slate-950 text-white text-sm font-medium hover:bg-slate-800 transition shadow"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline ml-1">New Group</span>
    </Link>
  </div>
</div>

        {/* Summary Cards */}
        <section className="hidden sm:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="w-4 h-4 text-blue-600" />}
            label="Groups"
            value={groups.length}
            subtext={`${activeGroups} active`}
          />
          <StatCard
            icon={<UserPlus className="w-4 h-4 text-emerald-600" />}
            label="Members"
            value={totalMembers}
            subtext="Across all groups"
          />
          <StatCard
            icon={<ReceiptText className="w-4 h-4 text-violet-600" />}
            label="Recent Expenses"
            value={recentExpenses.length}
            subtext="Latest entries"
          />
          <StatCard
            icon={<ShieldCheck className="w-4 h-4 text-amber-600" />}
            label="Settlements"
            value={pendingSettlements.length}
            subtext="Pending actions"
          />
        </section>

        {/* Groups */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-950">Your Groups</h3>
            <p className="text-sm text-slate-500">
              {activeGroups} active, {archivedGroups} archived, {blockedGroups}{" "}
              blocked
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {groups.map((group) => {
              const isBlockedByAdmin = group.isBlocked;
              const isClosed = !group.isActive && !isBlockedByAdmin;

              const isAdmin =
                group.admins?.some(
                  (adminId: string) =>
                    adminId?.toString() === user?.id?.toString(),
                ) ?? false;

              const isCreator =
                group.createdBy?.toString() === user?.id?.toString();

              return (
                <div
                  key={group._id}
                  onClick={() =>
                    router.push(
                      isBlockedByAdmin || isClosed
                        ? `/groups/${group._id}?mode=readonly`
                        : `/groups/${group._id}`,
                    )
                  }
                  className={`group relative p-6 rounded-[1rem] border cursor-pointer transition-all duration-300 ${
                    isClosed
                      ? "bg-slate-50 border-slate-200"
                      : "bg-white border-slate-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                          isBlockedByAdmin
                            ? "bg-red-50 text-red-600 border-red-200"
                            : isClosed
                              ? "bg-slate-100 text-slate-500 border-slate-200"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}
                      >
                        {isBlockedByAdmin
                          ? "Blocked BY ADMIN"
                          : isClosed
                            ? "Archived"
                            : "Active"}
                      </span>

                      {isCreator && (
                        <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">
                          Creator
                        </span>
                      )}
                    </div>

                    {!isClosed && !isBlockedByAdmin && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative"
                      >
                        <details className="relative">
                          <summary className="list-none cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition">
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                          </summary>

                          <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-20">
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  setEditGroupId(group._id);
                                  setEditGroupName(group.name);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-slate-50 transition"
                              >
                                <Pencil className="w-4 h-4 text-slate-500" />
                                Edit Name
                              </button>
                            )}

                            {isAdmin && (
                              <Link
                                href={`/groups/${group._id}/add-member`}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-slate-50 transition"
                              >
                                <UserPlus className="w-4 h-4 text-slate-500" />
                                Add Member
                              </Link>
                            )}

                            {!isAdmin && (
                              <div className="px-3 py-2 text-xs text-slate-400">
                                Admin only actions
                              </div>
                            )}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                    {group.name}
                    {(isClosed || isBlockedByAdmin) && (
                      <Lock
                        className={`w-4 h-4 ${
                          isBlockedByAdmin ? "text-red-500" : "text-slate-400"
                        }`}
                      />
                    )}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Updated {formatDateTime(group.updatedAt).dateLabel}
                  </p>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex -space-x-3">
                      {group.members.slice(0, 4).map((m, i) => (
                        <div
                          key={m._id}
                          className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 border-2 border-white text-xs font-semibold text-slate-600"
                          style={{ zIndex: 4 - i }}
                        >
                          {m.name?.[0]?.toUpperCase()}
                        </div>
                      ))}
                      {group.members.length > 4 && (
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-50 border-2 border-white text-[10px] font-semibold text-slate-400">
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>

                  <p className="text-xs text-slate-500 mt-4 font-medium">
                    {group.members.length} members
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Expenses */}
        <section className="grid xl:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-[1rem] p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-950 mb-4">
              Recent Expenses
            </h3>

            {recentLoading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : recentExpenses.length === 0 ? (
              <p className="text-sm text-slate-500">No recent expenses</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentExpenses.map((e) => (
                  <Link
                    key={e._id}
                    href={`/groups/${e.group._id}`}
                    className="flex items-center justify-between gap-4 py-4 hover:bg-slate-50 rounded-2xl px-3 transition"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">
                        {e.description}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">
                        {e.group.name} • {e.paidBy.name}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm sm:text-base text-slate-950">
                        ₹{e.amount}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pending Settlements */}
          <div className="bg-white border border-slate-200 rounded-[1rem] p-6 shadow-sm min-h-[220px] flex flex-col justify-center">
            <h3 className="text-xl font-bold text-slate-950 mb-4">
              Pending Settlements
            </h3>

            {pendingLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-slate-500">Loading…</p>
              </div>
            ) : pendingSettlements.length === 0 ? (
              <div className="flex flex-1 items-center justify-center py-12 text-center">
                <div>
                  <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    No pending settlements
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Everyone is up to date right now.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSettlements.map((s, i) => (
                  <Link
                    key={i}
                    href={`/groups/${s.groupId}`}
                    className="flex items-center justify-between gap-4 px-4 py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {s.fromName} → {s.toName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Settle this balance
                        </p>
                      </div>
                    </div>

                    <strong className="text-slate-950 whitespace-nowrap">
                      ₹{s.amount}
                    </strong>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <EditGroupNameModal
        isOpen={!!editGroupId}
        onClose={() => setEditGroupId(null)}
        groupId={editGroupId || ""}
        currentName={editGroupName}
        onUpdated={handleNameUpdated}
      />
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtext: string;
}) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-100 transition-colors group-hover:bg-blue-50">
          <span className="text-slate-700 group-hover:text-blue-600">
            {icon}
          </span>
        </div>

        <div className="flex flex-col leading-tight">
          <p className="text-sm text-slate-500">{label}</p>
          <h4 className="text-base font-semibold text-slate-950">{value}</h4>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end leading-tight">
        <Activity className="h-4 w-4 text-slate-300 mb-1" />
        <p className="text-xs text-slate-400">{subtext}</p>
      </div>
    </div>
  );
}
