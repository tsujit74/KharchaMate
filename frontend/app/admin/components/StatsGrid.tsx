"use client";

import StatCard from "./StatCard";
import {
  Users,
  Shield,
  Wallet,
  Folder,
  Ban,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

type Stats = {
  blockedGroups: number;
  blockedUsers: number;
  totalUsers: number;
  totalGroups: number;
  totalExpenses: number;
  totalMoney: number;
  newUsersThisMonth: number;
  loggedInThisMonth: number;
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
};

type Props = {
  stats: Stats | null;
};

export default function StatsGrid({ stats }: Props) {
  if (!stats) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-8 text-center text-sm text-slate-500 shadow-sm">
        No statistics available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          Users
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle="All users"
            icon={<Users size={16} />}
            href="/admin/users"
          />
          <StatCard
            title="Blocked Users"
            value={stats.blockedUsers}
            subtitle="Requires review"
            icon={<Ban size={16} />}
            href="/admin/users"
          />
          <StatCard
            title="New Users"
            value={stats.newUsersThisMonth}
            subtitle="This month"
            icon={<Users size={16} />}
          />
          <StatCard
            title="Active Users"
            value={stats.loggedInThisMonth}
            subtitle="Logged in this month"
            icon={<Activity size={16} />}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          Groups
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Groups"
            value={stats.totalGroups}
            subtitle="All groups"
            icon={<Folder size={16} />}
            href="/admin/groups"
          />
          <StatCard
            title="Blocked Groups"
            value={stats.blockedGroups}
            subtitle="Needs action"
            icon={<Shield size={16} />}
            href="/admin/groups"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          Expenses
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Expenses"
            value={stats.totalExpenses}
            subtitle="Recorded expenses"
            icon={<Wallet size={16} />}
            href="/admin/expenses"
          />
          <StatCard
            title="Money Tracked"
            value={`₹${stats.totalMoney.toLocaleString()}`}
            subtitle="Platform amount"
            icon={<Wallet size={16} />}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          Support Tickets
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Tickets"
            value={stats.totalTickets}
            subtitle="All support tickets"
            icon={<Activity size={16} />}
            href="/admin/support"
          />
          <StatCard
            title="Open Tickets"
            value={stats.openTickets}
            subtitle="Needs attention"
            icon={<AlertCircle size={16} />}
            href="/admin/support"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgressTickets}
            subtitle="Currently active"
            icon={<Clock size={16} />}
            href="/admin/support"
          />
          <StatCard
            title="Resolved Tickets"
            value={stats.resolvedTickets}
            subtitle="Completed"
            icon={<CheckCircle size={16} />}
            href="/admin/support"
          />
        </div>
      </div>
    </div>
  );
}