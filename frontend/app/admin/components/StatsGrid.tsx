"use client";

import StatCard from "./StatCard";
import {
  Users,
  Shield,
  Wallet,
  Folder,
  Ban,
  Activity,
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        subtitle="All registered users"
        icon={<Users size={18} />}
      />

      <StatCard
        title="Blocked Users"
        value={stats.blockedUsers}
        subtitle="Users restricted by admin"
        icon={<Ban size={18} />}
      />

      <StatCard
        title="Total Groups"
        value={stats.totalGroups}
        subtitle="Groups created"
        icon={<Folder size={18} />}
      />

      <StatCard
        title="Blocked Groups"
        value={stats.blockedGroups}
        subtitle="Groups disabled by admin"
        icon={<Shield size={18} />}
      />

      <StatCard
        title="Total Expenses"
        value={stats.totalExpenses}
        subtitle="All recorded expenses"
        icon={<Activity size={18} />}
      />

      <StatCard
        title="Money Tracked"
        value={`₹ ${stats.totalMoney.toLocaleString()}`}
        subtitle="Total platform transactions"
        icon={<Wallet size={18} />}
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
  );
}