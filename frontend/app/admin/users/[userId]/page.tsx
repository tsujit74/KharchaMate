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

type Ticket = {
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

  stats: {
    groupsCreated: number;
    groupsJoined: number;
    totalExpenses: number;
    ticketsRaised: number;
  };

  tickets: Ticket[];
};

export default function AdminUserDetailsPage() {

  const params = useParams();
  const userId = params?.userId as string;

  const router = useRouter();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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
      toast.error(err.message || "Failed to load user");
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

  const handleBlockToggle = async () => {
    if (!user) return;

    try {
      setActionLoading(true);

      if (user.isBlocked) {
        await unblockUser(user._id);
        toast.success("User unblocked");

        setUser(prev =>
          prev ? { ...prev, isBlocked: false } : prev
        );

      } else {

        await blockUser(user._id);
        toast.success("User blocked");

        setUser(prev =>
          prev ? { ...prev, isBlocked: true } : prev
        );
      }

    } catch (err: any) {
      toast.error(err.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading user details...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen space-y-6">

      <DashboardHeader
        title="User Details"
        subtitle="View and manage platform user"
      />

      {/* USER CARD */}

      <div className="bg-white border border-gray-200 p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* USER INFO */}

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h2>

              <p className="text-sm text-gray-500">
                {user.email}
              </p>

              <div className="flex items-center gap-3 mt-2">

                <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                  {user.role}
                </span>

                {user.isBlocked ? (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                    Blocked
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
                    Active
                  </span>
                )}

              </div>

              <p className="text-xs text-gray-400 mt-2">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>

            </div>

          </div>

          {/* ACTION */}

          <button
            onClick={handleBlockToggle}
            disabled={actionLoading}
            className={`px-4 py-2 text-sm font-semibold text-white transition
            ${
              user.isBlocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {actionLoading
              ? "Processing..."
              : user.isBlocked
              ? "Unblock User"
              : "Block User"}
          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Groups Created
          </p>

          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {user.stats?.groupsCreated ?? 0}
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Groups Joined
          </p>

          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {user.stats?.groupsJoined ?? 0}
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-5">
          <p className="text-sm text-gray-500">
            Total Expenses
          </p>

          <p className="text-2xl font-semibold text-gray-900 mt-1">
            ₹{user.stats?.totalExpenses?.toLocaleString() ?? 0}
          </p>
        </div>

      </div>

      {/* USER GROUPS */}

      <UserGroups userId={user._id} />

      {/* USER TICKETS */}

<div className="space-y-4">

  <h3 className="text-lg font-semibold text-gray-900">
    Support Tickets <span>{`(${user.tickets?.length})`}</span>
  </h3>

  {user.tickets?.length === 0 ? (
    <div className="bg-white border border-gray-200 p-6 text-sm text-gray-500">
      No support tickets raised by this user.
    </div>
  ) : (

    <div className="grid md:grid-cols-2 gap-4">
      {user.tickets.map(ticket => (
        <TicketCard key={ticket._id} ticket={ticket} />
      ))}
    </div>

  )}

</div>

    </div>
  );
}