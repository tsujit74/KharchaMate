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
  expenseCount: number;
  totalExpenses: number;
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 sm:px-6 lg:px-10 py-5 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <Announcements />

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Dashboard
            </p>

            <h2 className="mt-1 text-lg sm:text-3xl font-black text-slate-950 tracking-tight leading-tight truncate">
              Hey, {user?.name?.split(" ")[0] || "User"}.
            </h2>

            <p className="hidden sm:block mt-1 text-sm sm:text-base text-slate-500 leading-relaxed">
              Your expense ecosystem at a glance.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <Link
              href="/dashboard/insights"
              className="inline-flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
            >
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline ml-1">Insights</span>
            </Link>

            <Link
              href="/groups/create"
              className="inline-flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 rounded-xl bg-slate-950 text-white text-sm font-medium hover:bg-slate-800 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">New Group</span>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="hidden sm:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Groups"
            value={groups.length}
            subtext={`${activeGroups} active`}
            iconStyle="text-indigo-600 bg-indigo-50 border-indigo-100"
          />
          <StatCard
            icon={<UserPlus className="w-4 h-4" />}
            label="Members"
            value={totalMembers}
            subtext="Across all groups"
            iconStyle="text-sky-600 bg-sky-50 border-sky-100"
          />
          <StatCard
            icon={<ReceiptText className="w-4 h-4" />}
            label="Recent Expenses"
            value={recentExpenses.length}
            subtext="Latest entries"
            iconStyle="text-emerald-600 bg-emerald-50 border-emerald-100"
          />
          <StatCard
            icon={<ShieldCheck className="w-4 h-4" />}
            label="Settlements"
            value={pendingSettlements.length}
            subtext="Pending actions"
            iconStyle="text-amber-600 bg-amber-50 border-amber-100"
          />
        </section>

        {/* Groups */}
        <section>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-20px sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Your Groups
            </h3>

            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium border border-slate-200/40">
              {activeGroups} active, {archivedGroups} archived, {blockedGroups}{" "}
              blocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
                  className={`group relative p-4 sm:p-6 rounded-[1rem] border cursor-pointer transition-all duration-300 border-t-[6px] ${
                    isBlockedByAdmin
                      ? "border-t-red-300 bg-white border-slate-300"
                      : isClosed
                        ? "border-t-slate-300 bg-slate-50 border-slate-300"
                        : "border-t-indigo-300 bg-white border-slate-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
                  }`}
                >
                  {/* Top badges */}
                  <div className="flex items-start justify-between mb-4 sm:mb-5 gap-3">
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
                          ? "Blocked by Admin"
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
                          <summary className="list-none cursor-pointer p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition">
                            <MoreVertical className="w-4 h-4" />
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

                  {/* 🔥 Title + Total */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {group.name}
                        {(isClosed || isBlockedByAdmin) && (
                          <Lock
                            className={`w-3.5 h-3.5 ${
                              isBlockedByAdmin
                                ? "text-red-500"
                                : "text-slate-400"
                            }`}
                          />
                        )}
                      </h2>

                      <p className="text-xs text-slate-400">
                        Updated {formatDateTime(group.updatedAt).dateLabel}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        Total
                      </p>
                      <p
                        className={`text-base font-extrabold tracking-tight ${
                          group.totalExpenses > 0
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      >
                        ₹{group.totalExpenses.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400/90 mt-0.5">
                        {group.expenseCount} expenses
                      </p>
                    </div>
                  </div>

                  {/* Members avatars */}
                  <div className="flex items-center justify-between mt-5 sm:mt-6">
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

                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Member count */}
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    {group.members.length} members
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Expenses + Pending Settlements */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
                Recent Expenses
              </h3>
            </div>

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
                    className="flex items-center justify-between gap-4 py-3.5 hover:bg-slate-50/80 rounded-xl px-3 -mx-3 transition duration-200"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">
                        {e.description}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {e.group.name} •{" "}
                        <span className="font-medium text-slate-500">
                          {e.paidBy.name}
                        </span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-slate-800 tracking-tight">
                        ₹{e.amount}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-6 shadow-sm min-h-[260px] flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Pending Settlements
                </h3>
                <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-100">
                  {pendingSettlements.length} items
                </span>
              </div>

              {pendingLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-slate-400 font-medium">Loading…</p>
                </div>
              ) : pendingSettlements.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-8 text-center">
                  <div>
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      No pending settlements
                    </p>
                    <p className="mt-1 text-xs text-slate-400 max-w-[240px]">
                      Everyone is up to date right now.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSettlements.map((s, i) => {
                    const isUserPayer =
                      s.from?.toString() === user?.id?.toString();
                    const isUserReceiver =
                      s.to?.toString() === user?.id?.toString();

                    const rowClass = isUserPayer
                      ? "border-rose-100 bg-rose-50/50 hover:bg-rose-50"
                      : isUserReceiver
                        ? "border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50"
                        : "border-slate-200 bg-slate-50/40 hover:border-indigo-200 hover:bg-indigo-50/20";

                    const iconClass = isUserPayer
                      ? "bg-rose-100 text-rose-600"
                      : isUserReceiver
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-indigo-100 text-indigo-600";

                    const amountClass = isUserPayer
                      ? "bg-rose-100 text-rose-700 border-rose-200/50"
                      : isUserReceiver
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200/50"
                        : "bg-amber-50 text-amber-700 border-amber-200/50";

                    return (
                      <Link
                        key={i}
                        href={`/groups/${s.groupId}`}
                        className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-all duration-200 ${rowClass}`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${iconClass}`}
                          >
                            <Wallet className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">
                              {s.fromName} → {s.toName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                              {isUserPayer
                                ? "You need to pay this"
                                : isUserReceiver
                                  ? "You will receive this"
                                  : "Settle this balance"}
                            </p>
                          </div>
                        </div>

                        <strong
                          className={`whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-extrabold tracking-tight ${amountClass}`}
                        >
                          ₹{s.amount}
                        </strong>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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
  iconStyle,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtext: string;
  iconStyle?: string;
}) {
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:border-slate-300">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${iconStyle}`}
        >
          {icon}
        </div>

        <div className="flex flex-col space-y-0.5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <h4 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
            {value}
          </h4>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <Activity className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
        <p className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
          {subtext}
        </p>
      </div>
    </div>
  );
}
