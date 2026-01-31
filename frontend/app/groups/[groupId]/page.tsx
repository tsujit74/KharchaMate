"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Users, IndianRupee, Plus, ArrowRight } from "lucide-react";

import { useAuth } from "@/app/context/authContext";
import { formatDateTime } from "@/app/utils/formatDateTime";
import {
  getGroupSettlement,
  settlePayment,
} from "@/app/services/settlement.service";

import { getGroupExpenses } from "@/app/services/group.service";

export default function GroupDetailsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [settlement, setSettlement] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!groupId) {
      setError("Invalid group");
      setPageLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setPageLoading(true);
        setError("");

        const [expenseData, settlementData] = await Promise.all([
          getGroupExpenses(groupId),
          getGroupSettlement(groupId),
        ]);

        setExpenses(expenseData);
        setSettlement(settlementData);
      } catch (err: any) {
        if (err.message === "FORBIDDEN") {
          setError("You are not a member of this group.");
        } else {
          setError("Failed to load group details.");
        }
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [loading, isAuthenticated, groupId]);

  if (loading || pageLoading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!settlement) {
    return (
      <div className="p-10 text-center text-gray-500">
        No access to this group.
      </div>
    );
  }

  const handleSettle = async (toId: string, amount: number) => {
    try {
      await settlePayment(groupId, toId, amount);
      const updated = await getGroupSettlement(groupId);
      setSettlement(updated);
    } catch {
      alert("Payment failed. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFCFD] px-4 md:px-10 py-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold">{settlement.group}</h1>
        <p className="text-sm text-gray-500">Track expenses & settlements</p>
      </div>

      {/* KPIs */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-4 mb-8">
        <Stat icon={IndianRupee} label="Total Spent" value={`₹${settlement.totalSpent}`} />
        <Stat icon={Users} label="Per Person" value={`₹${Math.round(settlement.perPersonShare)}`} />
        <Stat icon={Users} label="Members" value={settlement.balances.length} />
      </div>

      {/* Settlement */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl border p-6 mb-10">
        <h2 className="font-semibold mb-4">Settlement</h2>

        {settlement.settlements.length === 0 ? (
          <p className="text-gray-500 text-sm">Everyone is settled 🎉</p>
        ) : (
          settlement.settlements.map((s: any, i: number) => {
            const toUser = settlement.balances.find(
              (b: any) => b.name === s.toName,
            );

            return (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-50 rounded-lg p-3 mb-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span>{s.fromName}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span>{s.toName}</span>
                </div>
                <button
                  onClick={() => handleSettle(toUser.id, s.amount)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                >
                  ₹{s.amount}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Expenses */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Expenses</h2>
          <Link
            href={`/groups/${groupId}/add-expense`}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Link>
        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-sm">No expenses yet.</p>
        ) : (
          expenses
            .sort(
              (a, b) =>
                Date.parse(b.createdAt) - Date.parse(a.createdAt),
            )
            .map((e) => {
              const { dateLabel } = formatDateTime(e.createdAt);
              return (
                <div
                  key={e._id}
                  className="bg-white border rounded-lg p-4 mb-2 flex justify-between"
                >
                  <div>
                    <p className="font-medium">{e.description}</p>
                    <p className="text-xs text-gray-500">
                      Paid by {e.paidBy.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{e.amount}</p>
                    <p className="text-xs text-gray-500">{dateLabel}</p>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </main>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white border rounded-xl p-5 flex gap-4 items-center">
      <Icon className="w-7 h-7 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
