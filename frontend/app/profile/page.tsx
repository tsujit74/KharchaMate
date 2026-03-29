"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { getMyGroups } from "../services/group.service";
import {
  getPendingSettlements,
  getMySettlementHistory,
} from "../services/settlement.service";
import { formatDateTime } from "../utils/formatDateTime";
import { Users, CreditCard, Clock, Repeat } from "lucide-react";
import MonthlyExpenseSummary from "../components/Profile/MonthlyExpenses";
import AppSkeleton from "../components/ui/AppSkeleton";
import ExpensesList from "./components/ExpensesList";
import toast from "react-hot-toast";

type Group = { _id: string; name: string };

type Settlement = {
  _id: string;
  group: { _id: string; name: string };
  from: { _id: string; name: string };
  to: { _id: string; name: string };
  amount: number;
  status: string;
  settledAt?: string;
  createdAt: string;
};

type PendingSettlementRaw = {
  _id: string;
  groupId: string;
  groupName: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
  createdAt?: string;
};

type Item = {
  _id: string;
  description: string;
  amount: number;
  group: Group;
  from: { _id: string; name: string };
  to: { _id: string; name: string };
  createdAt: string;
  status?: string;
};

export default function ProfilePage() {
  const ITEMS_PER_PAGE = 10;
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [settlements, setSettlements] = useState<PendingSettlementRaw[]>([]);
  const [history, setHistory] = useState<Settlement[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "all" | "paid" | "pending" | "history"
  >("all");
  const [historyFilter, setHistoryFilter] = useState<"sent" | "received">(
    "sent",
  );
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [grpData, settleData, historyData] = await Promise.all([
          getMyGroups(),
          getPendingSettlements(),
          getMySettlementHistory(),
        ]);

        setGroups(grpData || []);
        setSettlements(settleData || []);
        setHistory(historyData || []);
      } catch (err: any) {
        console.error("Profile fetch failed:", err);

        if (err.message === "UNAUTHORIZED") {
          toast.error("Session expired. Please login again.");
          router.replace("/login");
          return;
        }

        toast.error("Failed to load profile data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [loading, isAuthenticated, router]);

  if (loading || loadingData) {
    return <AppSkeleton variant="profile" />;
  }
  if (!user) return null;

  const filterByMonth = (date: string) => {
    if (!selectedMonth) return true;
    const d = new Date(date);
    const [year, month] = selectedMonth.split("-");
    return (
      d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month)
    );
  };

  const baseItems: Item[] =
    activeTab === "pending"
      ? settlements
          .filter((s) => s.from === user.id)
          .map((s) => ({
            _id: s._id,
            description: `Payment to ${s.toName}`,
            amount: s.amount,
            group: {
              _id: s.groupId,
              name: s.groupName,
            },
            from: {
              _id: s.from,
              name: s.fromName,
            },
            to: {
              _id: s.to,
              name: s.toName,
            },
            createdAt: s.createdAt || "",
            status: "pending",
          }))
      : activeTab === "history"
        ? history
            .filter((s) =>
              historyFilter === "sent"
                ? s.from._id === user.id
                : s.to._id === user.id,
            )
            .map((s) => ({
              _id: s._id,
              description: `Payment ${s.status}`,
              amount: s.amount,
              group: s.group,
              from: s.from,
              to: s.to,
              createdAt: s.settledAt || s.createdAt,
              status: s.status,
            }))
        : [];

  const monthFiltered = baseItems.filter((e) =>
    e.createdAt ? filterByMonth(e.createdAt) : true,
  );

  const totalPages = Math.ceil(monthFiltered.length / ITEMS_PER_PAGE);

  const paginatedItems = monthFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 md:px-16 py-8">
      {/* User Card */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-gray-50 to-white border rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white border rounded-2xl p-6">
          <MonthlyExpenseSummary />
        </div>
      </div>

      {/* KPIs */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Groups",
            value: groups.length,
            icon: Users,
            bg: "bg-blue-50",
            color: "text-blue-500",
          },
          {
            label: "Pending Settlements",
            value: settlements.filter((s) => s.from === user.id).length,
            icon: Clock,
            bg: "bg-red-50",
            color: "text-red-500",
          },
          {
            label: "Payment History",
            value: history.length,
            icon: Repeat,
            bg: "bg-purple-50",
            color: "text-purple-500",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border rounded-2xl p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{kpi.label}</p>
              <p className="text-xl font-semibold text-gray-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-3">
        {["all", "paid", "pending", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any);
              setCurrentPage(1);
            }}
            className={`px-3 py-2 text-sm rounded-lg ${
              activeTab === tab ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "all" ? (
          <ExpensesList userId={user.id} mode="all" />
        ) : activeTab === "paid" ? (
          <ExpensesList userId={user.id} mode="paid" />
        ) : (
          <>
            <div className="space-y-3">
              {paginatedItems.length === 0 && (
                <p className="text-gray-500 text-sm">No records found.</p>
              )}

              {paginatedItems.map((item) => {
                const dateLabel = item.createdAt
                  ? formatDateTime(item.createdAt).dateLabel
                  : "";

                const paidByText =
                  activeTab === "pending"
                    ? `You owe ${item.to.name}`
                    : item.from._id === user.id
                      ? `You paid ${item.to.name}`
                      : `${item.from.name} paid you`;

                return (
                  <div
                    key={item._id}
                    className="border p-4 rounded-xl flex justify-between"
                  >
                    <div>
                      <p>{item.description}</p>
                      <p className="text-xs text-gray-500">
                        {item.group.name} • {paidByText}
                      </p>
                      {dateLabel && <p className="text-xs">{dateLabel}</p>}
                    </div>
                    <p>₹{item.amount}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
