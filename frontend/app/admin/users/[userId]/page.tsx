"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getUserDetailsAdmin,
  blockUser,
  unblockUser,
} from "@/app/services/admin.service";

import DashboardHeader from "../../components/DashobardHeader";
import UserGroups from "./components/UserGroups";
import TicketCard from "./components/TicketCard";

import {
  Mail,
  Users,
  IndianRupee,
  Ticket,
  Lock,
  Unlock,
  ArrowLeft,
  RefreshCw,
  User as UserIcon,
  Phone,
  AlertCircle,
  Receipt,
  Eye,
} from "lucide-react";
import Link from "next/link";

type TicketType = {
  _id: string;
  subject: string;
  description?: string;
  priority: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
};

type RecentExpense = {
  _id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
  group?: {
    _id: string;
    name: string;
  };
};

type UserDetails = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;

  stats: {
    groupsCreated: number;
    groupsJoined: number;
    totalExpenses: number;
    expensesCount: number;
    ticketsRaised: number;
    openTickets: number;
    resolvedTickets: number;
  };

  recentExpenses: RecentExpense[];
  tickets: TicketType[];
};

function formatDate(value?: string) {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <p className="break-words text-1xl font-black leading-tight text-slate-950">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const userId = params?.userId as string;

  const [user, setUser] = useState<UserDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const data = await getUserDetailsAdmin(userId);

      setUser({
        ...data.user,

        stats: {
          groupsCreated: data?.stats?.groupsCreated ?? 0,
          groupsJoined: data?.stats?.groupsJoined ?? 0,
          totalExpenses: data?.stats?.totalExpenses ?? 0,
          expensesCount: data?.stats?.expensesCount ?? 0,
          ticketsRaised: data?.stats?.ticketsRaised ?? 0,
          openTickets: data?.stats?.openTickets ?? 0,
          resolvedTickets: data?.stats?.resolvedTickets ?? 0,
        },

        recentExpenses: Array.isArray(data?.recentExpenses)
          ? data.recentExpenses
          : [],

        tickets: Array.isArray(data?.tickets) ? data.tickets : [],
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to load user");
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await fetchUser();

      toast.success("Refreshed");
    } finally {
      setRefreshing(false);
    }
  };

  const handleBlockToggle = async () => {
    if (!user) return;

    try {
      setActionLoading(true);

      if (user.isBlocked) {
        await unblockUser(user._id);

        setUser((prev) =>
          prev
            ? {
                ...prev,
                isBlocked: false,
              }
            : prev,
        );

        toast.success("User unblocked");
      } else {
        await blockUser(user._id);

        setUser((prev) =>
          prev
            ? {
                ...prev,
                isBlocked: true,
              }
            : prev,
        );

        toast.success("User blocked");
      }
    } catch (err: any) {
      toast.error(err?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Loading user details...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const recentExpenses = Array.isArray(user?.recentExpenses)
    ? user.recentExpenses
    : [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* HEADER */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <DashboardHeader
            title="User Details"
            subtitle="View and manage platform user"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              onClick={handleBlockToggle}
              disabled={actionLoading}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                user.isBlocked
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {actionLoading ? (
                "Processing..."
              ) : user.isBlocked ? (
                <>
                  <Unlock className="h-4 w-4" />
                  Unblock User
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Block User
                </>
              )}
            </button>
          </div>
        </div>

        {/* OVERVIEW */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-base font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-bold tracking-tight text-slate-950">
                    {user.name}
                  </h2>

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      user.isBlocked
                        ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-700">
                    {user.role}
                  </span>
                </div>

                <div className="mt-2 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {user.mobile && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>{user.mobile}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    Joined {formatDate(user.createdAt)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    Updated {formatDate(user.updatedAt)}
                  </span>
                  {user.lastLoginAt && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      Last login {formatDate(user.lastLoginAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  User ID
                </p>
                <p className="mt-2 break-all text-xs font-medium text-slate-700">
                  {user._id}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Status
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {user.isBlocked ? "Blocked" : "Active"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Total Expenses
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  ₹{(user.stats?.totalExpenses ?? 0).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Ticket Resolution
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {user.stats?.resolvedTickets ?? 0} resolved
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-6">
              <StatCard
                label="Groups Created"
                value={user.stats?.groupsCreated ?? 0}
                icon={<Users className="h-5 w-5" />}
              />
              <StatCard
                label="Groups Joined"
                value={user.stats?.groupsJoined ?? 0}
                icon={<UserIcon className="h-5 w-5" />}
              />
              <StatCard
                label="Expenses"
                value={`₹${(user.stats?.totalExpenses ?? 0).toLocaleString()}`}
                icon={<IndianRupee className="h-5 w-5" />}
              />
              <StatCard
                label="Tickets"
                value={user.stats?.ticketsRaised ?? 0}
                icon={<Ticket className="h-5 w-5" />}
              />
              <StatCard
                label="Open Tickets"
                value={user.stats?.openTickets ?? 0}
                icon={<AlertCircle className="h-5 w-5" />}
              />
              <StatCard
                label="Expenses Count"
                value={user.stats?.expensesCount ?? 0}
                icon={<Receipt className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>

        {/* GROUPS */}
        <UserGroups userId={user._id} />

        {/* RECENT EXPENSES */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
  <div className="mb-3 flex items-center justify-between">
    <h3 className="text-base font-semibold text-slate-950">
      Recent Expenses
    </h3>

    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
      {recentExpenses.length}
    </span>
  </div>

  {recentExpenses.length === 0 ? (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-6 text-center text-sm text-slate-500">
      No recent expenses found.
    </div>
  ) : (
    <div className="space-y-2">
      {recentExpenses.map((expense) => (
        <div
          key={expense._id}
          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-3 transition hover:bg-slate-50"
        >
          {/* LEFT */}
          <div className="min-w-0 flex flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Receipt className="h-4 w-4 text-slate-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {expense.description}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">
                  {expense.category}
                </span>

                <span className="truncate font-medium text-slate-700">
                  {expense.group?.name || "Unknown Group"}
                </span>

                <span>{formatDate(expense.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-950">
                ₹{expense.amount.toLocaleString()}
              </p>
            </div>

            {expense.group?._id && (
              <Link
                href={`/admin/groups/${expense.group._id}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <Eye className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        {/* TICKETS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-950">
              Support Tickets
            </h3>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {user.tickets?.length || 0}
            </span>
          </div>

          {user.tickets?.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No support tickets raised by this user.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {user.tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
