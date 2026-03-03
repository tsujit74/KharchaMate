"use client";

import StatCard from "./StatCard";

type Stats = {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        subtitle="All registered users"
      />

      <StatCard
        title="Total Groups"
        value={stats.totalGroups}
        subtitle="Groups created"
      />

      <StatCard
        title="Total Expenses"
        value={stats.totalExpenses}
        subtitle="All recorded expenses"
      />

      <StatCard
        title="Total Money Tracked"
        value={`₹ ${stats.totalMoney.toLocaleString()}`}
        subtitle="Cumulative expense amount"
      />

      <StatCard
        title="New Users This Month"
        value={stats.newUsersThisMonth}
        subtitle="Monthly signups"
      />

      <StatCard
        title="Active Users This Month"
        value={stats.loggedInThisMonth}
        subtitle="Users logged in"
      />
    </div>
  );
}