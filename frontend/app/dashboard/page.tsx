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
  ChevronRight,
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
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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
      prev.map((g) => (g._id === editGroupId ? { ...g, name: newName } : g))
    );
  };

  const totalMembers = groups.reduce((sum, group) => sum + group.members.length, 0);
  const activeGroups = groups.filter((group) => group.isActive && !group.isBlocked).length;
  const blockedGroups = groups.filter((group) => group.isBlocked).length;
  const archivedGroups = groups.filter((group) => !group.isActive && !group.isBlocked).length;

  if (loading || groupLoading) {
    return <AppSkeleton variant="dashboard" />;
  }

  if (error) {
    return <p className="p-10 text-center text-red-500 font-medium">{error}</p>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
        <div className="space-y-6 sm:space-y-8">
          <Announcements />

          {/* Hero */}
          <section className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-xs">
                  Dashboard
                </p>
                <h2 className="mt-1 truncate text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Hey, {user?.name?.split(" ")[0] || "User"}.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
                  Your expense ecosystem at a glance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/insights"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span>Insights</span>
                </Link>

                <Link
                  href="/groups/create"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Group</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Users className="h-5 w-5 text-blue-600" />}
              label="Groups"
              value={groups.length}
              subtext={`${activeGroups} active`}
              accent="blue"
            />
            <StatCard
              icon={<UserPlus className="h-5 w-5 text-emerald-600" />}
              label="Members"
              value={totalMembers}
              subtext="Across all groups"
              accent="emerald"
            />
            <StatCard
              icon={<ReceiptText className="h-5 w-5 text-violet-600" />}
              label="Recent Expenses"
              value={recentExpenses.length}
              subtext="Latest entries"
              accent="violet"
            />
            <StatCard
              icon={<ShieldCheck className="h-5 w-5 text-amber-600" />}
              label="Settlements"
              value={pendingSettlements.length}
              subtext="Pending actions"
              accent="amber"
            />
          </section>

          {/* Groups */}
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-950 sm:text-xl">
                  Your Groups
                </h3>
                <p className="text-sm text-slate-500">
                  {activeGroups} active, {archivedGroups} archived, {blockedGroups} blocked
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {groups.map((group) => {
                const isBlockedByAdmin = group.isBlocked;
                const isClosed = !group.isActive && !isBlockedByAdmin;

                const isAdmin =
                  group.admins?.some(
                    (adminId: string) =>
                      adminId?.toString() === user?.id?.toString()
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
                          : `/groups/${group._id}`
                      )
                    }
                    className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
                      isClosed
                        ? "border-slate-200 bg-slate-50"
                        : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            isBlockedByAdmin
                              ? "border-red-200 bg-red-50 text-red-600"
                              : isClosed
                              ? "border-slate-200 bg-slate-100 text-slate-500"
                              : "border-emerald-100 bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {isBlockedByAdmin ? "Blocked" : isClosed ? "Archived" : "Active"}
                        </span>

                        {isCreator && (
                          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
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
                            <summary className="list-none cursor-pointer rounded-xl p-2 transition hover:bg-slate-100">
                              <MoreVertical className="h-4 w-4 text-slate-500" />
                            </summary>

                            <div className="absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                              {isAdmin && (
                                <button
                                  onClick={() => {
                                    setEditGroupId(group._id);
                                    setEditGroupName(group.name);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-slate-50"
                                >
                                  <Pencil className="h-4 w-4 text-slate-500" />
                                  Edit Name
                                </button>
                              )}

                              {isAdmin && (
                                <Link
                                  href={`/groups/${group._id}/add-member`}
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-slate-50"
                                >
                                  <UserPlus className="h-4 w-4 text-slate-500" />
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

                    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950 transition-colors group-hover:text-blue-600">
                      {group.name}
                      {(isClosed || isBlockedByAdmin) && (
                        <Lock
                          className={`h-4 w-4 ${
                            isBlockedByAdmin ? "text-red-500" : "text-slate-400"
                          }`}
                        />
                      )}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Updated {formatDateTime(group.updatedAt).dateLabel}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex -space-x-3">
                        {group.members.slice(0, 4).map((m, i) => (
                          <div
                            key={m._id}
                            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-600"
                            style={{ zIndex: 4 - i }}
                          >
                            {m.name?.[0]?.toUpperCase()}
                          </div>
                        ))}
                        {group.members.length > 4 && (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-50 text-[10px] font-semibold text-slate-400">
                            +{group.members.length - 4}
                          </div>
                        )}
                      </div>

                      <ChevronRight className="h-5 w-5 text-slate-300 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>

                    <p className="mt-4 text-xs font-medium text-slate-500">
                      {group.members.length} members
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Expenses and settlements */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-950 sm:text-xl">
                    Recent Expenses
                  </h3>
                  <p className="text-sm text-slate-500">
                    Latest activity across your groups.
                  </p>
                </div>
              </div>

              {recentLoading ? (
                <p className="text-sm text-slate-500">Loading…</p>
              ) : recentExpenses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  No recent expenses
                </div>
              ) : (
                <div className="space-y-2">
                  {recentExpenses.map((e) => (
                    <Link
                      key={e._id}
                      href={`/groups/${e.group._id}`}
                      className="flex items-center justify-between gap-4 rounded-2xl px-3 py-4 transition hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950 sm:text-base">
                          {e.description}
                        </p>
                        <p className="truncate text-xs text-slate-500 sm:text-sm">
                          {e.group.name} • {e.paidBy.name}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-slate-950 sm:text-base">
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

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-950 sm:text-xl">
                    Pending Settlements
                  </h3>
                  <p className="text-sm text-slate-500">
                    Who owes whom right now.
                  </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600">
                  {pendingSettlements.length} items
                </span>
              </div>

              {pendingLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-slate-500">Loading…</p>
                </div>
              ) : pendingSettlements.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 py-10 text-center">
                  <div>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <ShieldCheck className="h-5 w-5" />
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
                  {pendingSettlements.map((s, i) => {
                    const isUserPayer = s.from?.toString() === user?.id?.toString();
                    const isUserReceiver = s.to?.toString() === user?.id?.toString();

                    const rowClass = isUserPayer
                      ? "border-rose-200 bg-rose-50/70 hover:bg-rose-100"
                      : isUserReceiver
                      ? "border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100"
                      : "border-slate-200 bg-slate-50/60 hover:border-indigo-200 hover:bg-indigo-50/40";

                    const iconClass = isUserPayer
                      ? "bg-rose-100 text-rose-600"
                      : isUserReceiver
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-indigo-100 text-indigo-600";

                    const amountClass = isUserPayer
                      ? "bg-rose-100 text-rose-700"
                      : isUserReceiver
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-50 text-amber-700";

                    return (
                      <Link
                        key={i}
                        href={`/groups/${s.groupId}`}
                        className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 transition ${rowClass}`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconClass}`}>
                            <Wallet className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {s.fromName} → {s.toName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {isUserPayer
                                ? "You need to pay this"
                                : isUserReceiver
                                ? "You will receive this"
                                : "Settle this balance"}
                            </p>
                          </div>
                        </div>

                        <strong className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold ${amountClass}`}>
                          ₹{s.amount}
                        </strong>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
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
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtext: string;
  accent: "blue" | "emerald" | "violet" | "amber";
}) {
  const accentMap = {
    blue: "from-blue-50 to-white ring-blue-100",
    emerald: "from-emerald-50 to-white ring-emerald-100",
    violet: "from-violet-50 to-white ring-violet-100",
    amber: "from-amber-50 to-white ring-amber-100",
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-gradient-to-br p-4 shadow-sm ring-1 ${accentMap[accent]} transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            {icon}
          </div>
          <p className="text-sm text-slate-500">{label}</p>
          <h4 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </h4>
        </div>

        <div className="mt-1">
          <Activity className="h-4 w-4 text-slate-300" />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">{subtext}</p>
    </div>
  );
}