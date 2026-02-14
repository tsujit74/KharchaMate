"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Lock,
  User,
} from "lucide-react";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { getMyGroups } from "../services/group.service";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { getRecentExpenses } from "../services/expense.service";
import { getPendingSettlements } from "../services/settlement.service";
import AppSkeleton from "../components/ui/AppSkeleton";

// ---------------- Types ----------------
type Member = {
  _id: string;
  name: string;
  email: string;
};

type Group = {
  _id: string;
  name: string;
  createdBy: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
};

type RecentExpense = {
  _id: string;
  description: string;
  amount: number;
  createdAt: string;
  group: { _id: string; name: string };
  paidBy: { _id: string; name: string };
};

// ---------------- Page ----------------
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

  // ---------------- Fetch ----------------
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchAll = async () => {
      try {
        const groupsData = await getMyGroups();

        // ✅ keep backend isActive value
        setGroups(
          groupsData.sort(
            (a: Group, b: Group) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
        );

        setRecentExpenses(await getRecentExpenses());
        setPendingSettlements(await getPendingSettlements());
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setGroupLoading(false);
        setRecentLoading(false);
        setPendingLoading(false);
      }
    };

    fetchAll();
  }, [loading, isAuthenticated, router]);

  if (loading || groupLoading) {
  return <AppSkeleton variant="dashboard" />;
}
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 md:px-16 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 pb-8 border-b border-gray-100">
        {/* Left Section */}
        <div>
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Hey, {user?.name?.split(" ")[0] || "User"}{" "}
            <span className="text-gray-300 font-light">/</span>
          </h2>

          <p className="text-base sm:text-lg font-medium text-slate-500 mt-1">
            Your expense ecosystem at a glance.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/insights"
            className="group flex items-center gap-2 px-5 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm"
          >
            <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
            Insights
          </Link>

          <Link
            href="/groups/create"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-slate-950 text-white rounded-2xl hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Group
          </Link>
        </div>
      </div>

      {/* Groups */}
      <section className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const isClosed = !group.isActive;
          const firstName = group.name;

          return (
            <div
              key={group._id}
              onClick={() =>
                router.push(
                  isClosed
                    ? `/groups/${group._id}?mode=readonly`
                    : `/groups/${group._id}`,
                )
              }
              className={`group p-6 rounded-3xl border transition-all duration-300 cursor-pointer
          ${isClosed ? "bg-slate-50 border-slate-200" : "bg-white border-slate-100 hover:shadow-sm hover:-translate-y-1"}
        `}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start mb-5">
                <span
                  className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full border
              ${
                isClosed
                  ? "bg-slate-100 text-slate-500 border-slate-200"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}
                >
                  {isClosed ? "Archived" : "Active"}
                </span>

                {!isClosed && (
                  <Link
                    href={`/groups/${group._id}/add-member`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                {firstName}
                {isClosed && <Lock className="w-4 h-4 text-slate-400" />}
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Updated {formatDateTime(group.updatedAt).dateLabel}
              </p>

              {/* Members */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex -space-x-3">
                  {group.members.slice(0, 4).map((m, i) => (
                    <div
                      key={m._id}
                      className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 border-2 border-white text-xs font-semibold text-slate-600"
                      style={{ zIndex: 4 - i }}
                    >
                      {m.name?.[0]?.toUpperCase()}
                    </div>
                  ))}
                  {group.members.length > 4 && (
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 border-2 border-white text-[10px] font-semibold text-slate-400">
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
      </section>

      {/* Recent Expenses */}
      <section className="max-w-7xl mx-auto mt-10">
        <h2 className="section-title text-base sm:text-lg">Recent Expenses</h2>

        {recentLoading ? (
          <p className="muted text-xs sm:text-sm">Loading…</p>
        ) : recentExpenses.length === 0 ? (
          <p className="muted text-xs sm:text-sm">No recent expenses</p>
        ) : (
          <div className="card divide-y">
            {recentExpenses.map((e) => (
              <Link
                key={e._id}
                href={`/groups/${e.group._id}`}
                className="
    row hover:bg-slate-50
    px-2 py-2
    sm:px-4 sm:py-3
  "
              >
                {/* Left */}
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">
                    {e.description}
                  </p>

                  <p className="muted-xs sm:text-sm">{e.group.name}</p>
                </div>

                {/* Right */}
                <div className="text-right">
                  <p className="font-semibold text-sm sm:text-base">
                    ₹{e.amount}
                  </p>
                  <p className="muted-xs mt-0.5">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Pending Settlements */}
      <section className="max-w-7xl mx-auto mt-10">
        <h2 className="section-title">Pending Settlements</h2>
        {pendingLoading ? (
          <p className="muted">Loading…</p>
        ) : pendingSettlements.length === 0 ? (
          <p className="muted">No pending settlements 🎉</p>
        ) : (
          pendingSettlements.map((s, i) => (
            <Link
              key={i}
              href={`/groups/${s.groupId}`}
              className="settlement-card"
            >
              <div className="flex items-center gap-2">
                {s.fromName} <ArrowRight className="w-4 h-4" /> {s.toName}
              </div>
              <strong>₹{s.amount}</strong>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
