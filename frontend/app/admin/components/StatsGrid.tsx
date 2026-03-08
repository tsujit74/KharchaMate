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
      <div className="text-center text-gray-500 py-10">
        No statistics available.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-slate-700">Users</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle="View all users"
            icon={<Users size={18} />}
            href="/admin/users"
          />

          <StatCard
            title="Blocked Users"
            value={stats.blockedUsers}
            subtitle="Manage users"
            icon={<Ban size={18} />}
            href="/admin/users"
          />

          <StatCard
            title="New Users"
            value={stats.newUsersThisMonth}
            subtitle="Joined this month"
            icon={<Users size={18} />}
          />

          <StatCard
            title="Active Users"
            value={stats.loggedInThisMonth}
            subtitle="Logged in this month"
            icon={<Activity size={18} />}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-slate-700">Groups</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Groups"
            value={stats.totalGroups}
            subtitle="View all groups"
            icon={<Folder size={18} />}
            href="/admin/groups"
          />

          <StatCard
            title="Blocked Groups"
            value={stats.blockedGroups}
            subtitle="Manage groups"
            icon={<Shield size={18} />}
            href="/admin/groups"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-slate-700">Expenses</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Expenses"
            value={stats.totalExpenses}
            subtitle="View expenses"
            icon={<Activity size={18} />}
            href="/admin/expenses"
          />

          <StatCard
            title="Money Tracked"
            value={`₹ ${stats.totalMoney.toLocaleString()}`}
            subtitle="Platform transactions"
            icon={<Wallet size={18} />}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-slate-700">
          Support Tickets
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Tickets"
            value={stats.totalTickets}
            subtitle="View support"
            icon={<Activity size={18} />}
            href="/admin/support"
          />

          <StatCard
            title="Open Tickets"
            value={stats.openTickets}
            subtitle="Needs attention"
            icon={<AlertCircle size={18} />}
            href="/admin/support"
          />

          <StatCard
            title="In Progress"
            value={stats.inProgressTickets}
            subtitle="Currently being handled"
            icon={<Clock size={18} />}
            href="/admin/support"
          />

          <StatCard
            title="Resolved Tickets"
            value={stats.resolvedTickets}
            subtitle="Completed successfully"
            icon={<CheckCircle size={18} />}
            href="/admin/support"
          />
        </div>
      </div>
    </div>
  );
}
