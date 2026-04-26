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
} from "lucide-react";

type TicketType = {
  _id: string;
  subject: string;
  priority: string;
  status: string;
  createdAt: string;
};

type UserDetails = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  stats: {
    groupsCreated: number;
    groupsJoined: number;
    totalExpenses: number;
    ticketsRaised: number;
  };
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-black tracking-tight text-slate-950">
          {value}
        </p>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminUserDetailsPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const router = useRouter();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserDetailsAdmin(userId);
      setUser({
        ...data.user,
        stats: data.stats,
        tickets: data.tickets || [],
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to load user");
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUser();
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
        setUser((prev) => (prev ? { ...prev, isBlocked: false } : prev));
        toast.success("User unblocked");
      } else {
        await blockUser(user._id);
        setUser((prev) => (prev ? { ...prev, isBlocked: true } : prev));
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

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-3 md:px-4 md:py-4 overflow-x-hidden">
      <div className="mx-auto max-w-[1400px] space-y-4">
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
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
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

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-xl font-bold text-slate-950">
                        {user.name}
                      </h2>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                          user.isBlocked
                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>

                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{user.email}</span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                        {user.role}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Joined {formatDate(user.createdAt)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Last login {formatDate(user.lastLoginAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full lg:w-[520px] xl:w-[560px]">
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
                    value={user.stats?.ticketsRaised ?? user.tickets?.length ?? 0}
                    icon={<Ticket className="h-5 w-5" />}
                  />
                </div>
              </div>
            </div>

            <UserGroups userId={user._id} />

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

          <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-4 xl:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Admin summary
            </p>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <span>User ID</span>
                <span className="min-w-0 max-w-[180px] truncate font-mono text-xs text-slate-700">
                  {user._id}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <span>Account status</span>
                <span className="font-medium text-slate-900">
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <span>Updated at</span>
                <span className="font-medium text-slate-900">
                  {formatDate(user.updatedAt)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}