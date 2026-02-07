"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { getMyGroups } from "../services/group.service";
import { getMyExpenses } from "../services/expense.service";
import { getPendingSettlements, getMySettlementHistory } from "../services/settlement.service";
import { formatDateTime } from "../utils/formatDateTime";
import { Users, CreditCard, Clock, Repeat } from "lucide-react";
import MonthlyExpenseSummary from "../components/Profile/MonthlyExpenses";

/* ------------------ TYPES ------------------ */

type Group = { _id: string; name: string };

type Expense = {
  _id: string;
  description: string;
  amount: number;
  group: Group;
  paidBy: { _id: string; name: string };
  createdAt: string;
};

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

/* ------------------ COMPONENT ------------------ */

export default function ProfilePage() {
  const ITEMS_PER_PAGE = 10;
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [history, setHistory] = useState<Settlement[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [activeTab, setActiveTab] = useState<"all" | "paid" | "pending" | "history">("all");
  const [historyFilter, setHistoryFilter] = useState<"sent" | "received">("sent");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ------------------ FETCH DATA ------------------ */

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [grpData, expData, settleData, historyData] = await Promise.all([
          getMyGroups(),
          getMyExpenses(),
          getPendingSettlements(),
          getMySettlementHistory(),
        ]);

        setGroups(grpData || []);
        setExpenses(expData || []);
        setSettlements(settleData || []);
        setHistory(historyData || []);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [loading, isAuthenticated, router]);

  if (loading || loadingData) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!user) return null;

  /* ------------------ FILTER LOGIC ------------------ */

  const filterByMonth = (date: string) => {
    if (!selectedMonth) return true;
    const d = new Date(date);
    const [year, month] = selectedMonth.split("-");
    return d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month);
  };

  const baseItems: Item[] =
    activeTab === "pending"
      ? settlements
          .filter((s) => s.from._id === user.id)
          .map((s) => ({
            _id: s._id,
            description: `Payment to ${s.to.name}`,
            amount: s.amount,
            group: s.group,
            from: s.from,
            to: s.to,
            createdAt: s.createdAt,
            status: s.status,
          }))
      : activeTab === "history"
      ? history
          .filter((s) =>
            historyFilter === "sent" ? s.from._id === user.id : s.to._id === user.id
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
      : expenses.filter((e) => e.paidBy._id === user.id).map((e) => ({
          _id: e._id,
          description: e.description,
          amount: e.amount,
          group: e.group,
          from: e.paidBy,
          to: { _id: "", name: "" },
          createdAt: e.createdAt,
        }));

  const monthFiltered = baseItems.filter((e) => (e.createdAt ? filterByMonth(e.createdAt) : true));

  const totalPages = Math.ceil(monthFiltered.length / ITEMS_PER_PAGE);

  const paginatedItems = monthFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
      <h1 className="text-xl font-semibold text-gray-900">
        {user.name}
      </h1>
      <p className="text-sm text-gray-500">
        {user.email}
      </p>
    </div>
  </div>
</div>

       <div className="max-w-7xl mx-auto mb-8">
  <div className="bg-white border rounded-2xl p-6">
    <MonthlyExpenseSummary />
  </div>
</div>

      {/* KPIs */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Groups", value: groups.length, icon: Users, bg: "bg-blue-50", color: "text-blue-500" },
          { label: "Pending Settlements", value: settlements.filter((s) => s.from._id === user.id).length, icon: Clock, bg: "bg-red-50", color: "text-red-500" },
          { label: "Total Expenses", value: expenses.filter((e) => e.paidBy._id === user.id).length, icon: CreditCard, bg: "bg-green-50", color: "text-green-600" },
          { label: "Payment History", value: history.length, icon: Repeat, bg: "bg-purple-50", color: "text-purple-500" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border rounded-2xl p-5 flex items-center gap-4
            transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px]">
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
      <div className="max-w-7xl mx-auto mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {["all", "paid", "pending", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
              className={`flex-1 sm:flex-none px-3 py-2 text-sm rounded-lg transition-all whitespace-nowrap
                ${activeTab === tab ? "bg-white shadow text-gray-900 font-medium" : "text-gray-500 hover:text-gray-700 hover:bg-white/60"}`}>
              {tab === "all" ? "All" : tab === "paid" ? "Paid by me" : tab === "pending" ? "Pending" : "History"}
            </button>
          ))}
        </div>

        {activeTab === "history" && (
          <div className="w-full sm:w-auto sm:ml-4 flex gap-2">
            <button
              className={`px-3 py-2 text-sm border rounded-lg ${historyFilter === "sent" ? "bg-purple-100" : ""}`}
              onClick={() => setHistoryFilter("sent")}
            >Sent</button>
            <button
              className={`px-3 py-2 text-sm border rounded-lg ${historyFilter === "received" ? "bg-purple-100" : ""}`}
              onClick={() => setHistoryFilter("received")}
            >Received</button>
          </div>
        )}

        <div className="w-full sm:w-auto sm:ml-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
            className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          />
        </div>
      </div>

      {/* List */}
      <div className="max-w-7xl mx-auto space-y-3">
        {paginatedItems.length === 0 && <p className="text-gray-500 text-sm">No records found.</p>}

        {paginatedItems.map((item) => {
          const dateLabel = item.createdAt ? formatDateTime(item.createdAt).dateLabel : "";
          const paidByText =
            activeTab === "pending"
              ? `You owe ${item.to.name}`
              : activeTab === "history"
              ? `${item.from._id === user.id ? `You paid ${item.to.name}` : `${item.from.name} paid you`}`
              : "Paid by you";

          return (
            <div key={item._id} className={`rounded-2xl border p-4 flex justify-between items-center transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-[2px] ${activeTab === "pending" ? "bg-red-50/80 border-red-200 hover:border-red-300" : "bg-white border-gray-200 hover:border-gray-300"}`}>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.description}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.group.name || "No group"} • {paidByText}</p>
                {dateLabel && <p className="text-[11px] text-gray-400 mt-0.5">{dateLabel}</p>}
              </div>
              <p className={`text-sm font-semibold tabular-nums ${activeTab === "pending" ? "text-red-600" : "text-gray-900"}`}>₹{item.amount}</p>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1.5 text-sm border rounded-lg transition hover:bg-gray-50 disabled:opacity-40">Prev</button>
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 text-sm border rounded-lg transition hover:bg-gray-50 disabled:opacity-40">Next</button>
        </div>
      )}
    </main>
  );
}
