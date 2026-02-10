"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, UserPlus, ArrowRight } from "lucide-react";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { getMyGroups } from "../services/group.service";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { getRecentExpenses } from "../services/expense.service";
import { getPendingSettlements } from "../services/settlement.service";

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

  if (loading || groupLoading)
    return <p className="p-10 text-center">Loading…</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 md:px-16 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl sm:text-2xl text-lg font-semibold text-gray-900">
            Dashboard
          </h1>

          <p className="text-sm sm:text-sm text-xs text-gray-500">
            Your expense ecosystem at a glance
          </p>
        </div>

        <Link
          href="/groups/create"
          className="btn-primary text-sm sm:text-sm text-xs px-3 sm:px-4 py-2 sm:py-2.5"
        >
          <Plus className="w-4 h-4 sm:w-4 sm:h-4 w-3 h-3" />
          <span className="hidden xs:inline">New Group</span>
        </Link>
      </div>

      {/* Groups */}
      <section className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group) => {
          const isClosed = !group.isActive;

          return (
            <div
              key={group._id}
              onClick={() => {
                if (!isClosed) {
                  router.push(`/groups/${group._id}`);
                } else {
                  router.push(`/groups/${group._id}?mode=readonly`);
                }
              }}
              className={`
          card hover-lift cursor-pointer relative
          ${isClosed ? "opacity-80 ring-red-200" : "ring-green-200"}
        `}
              title={
                isClosed ? "This group is closed (read-only)" : "Open group"
              }
            >
              {/* Status badge */}
              <span
                className={`status-badge ${isClosed ? "inactive" : "active"}`}
              >
                {isClosed ? "CLOSED" : "ACTIVE"}
              </span>

              {/* Group name */}
              <h2 className="font-semibold text-gray-900 truncate mb-1 flex items-center gap-2">
                {group.name}
                {isClosed && (
                  <span className="text-xs text-red-500 font-medium">
                    (Read-only)
                  </span>
                )}
              </h2>

              {/* Members */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Users className="w-4 h-4" />
                {group.members.length} members
              </div>

              {/* Updated */}
              <p className="text-xs text-gray-400">
                Updated {formatDateTime(group.updatedAt).dateLabel}
              </p>

              {/* Avatars */}
              <div className="flex -space-x-2 mt-4">
                {group.members.slice(0, 4).map((m) => (
                  <div key={m._id} className="avatar" title={m.email}>
                    {m.name[0].toUpperCase()}
                  </div>
                ))}
              </div>

              {/* Add member (only if active) */}
              {!isClosed && (
                <Link
                  href={`/groups/${group._id}/add-member`}
                  onClick={(e) => e.stopPropagation()}
                  className="add-member"
                  title="Add member"
                >
                  <UserPlus className="w-4 h-4" />
                </Link>
              )}
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
