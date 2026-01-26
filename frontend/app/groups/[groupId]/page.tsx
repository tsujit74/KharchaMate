"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Users, IndianRupee, Plus, ArrowRight } from "lucide-react";
import { formatDateTime } from "@/app/utils/formatDateTime";
import Link from "next/link";

type Expense = {
  _id: string;
  description: string;
  amount: number;
  createdAt: string;
  paidBy: {
    name: string;
    email: string;
  };
};

type Settlement = {
  from: string;
  to: string;
  amount: number;
};

type Balance = {
  name: string;
  email: string;
  balance: number;
};

type SettlementResponse = {
  group: string;
  totalSpent: number;
  perPersonShare: number;
  settlements: Settlement[];
  balances: Balance[];
};

export default function GroupDetailsPage() {
  const { groupId } = useParams();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlement, setSettlement] = useState<SettlementResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [expenseRes, settlementRes] = await Promise.all([
          fetch(`http://localhost:5000/api/expenses/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `http://localhost:5000/api/blance/groups/${groupId}/settlement`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);

        const expenseData = await expenseRes.json();
        const settlementData = await settlementRes.json();

        setExpenses(expenseData);
        setSettlement(settlementData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading group details...
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-[#FCFCFD] ">
      <div className="flex">
       <aside className="hidden md:flex w-72 bg-[#F8F9FB] border-r border-gray-200 px-6 py-7 flex-col sticky top-16 h-[calc(100vh-64px)]">
  {/* Group Info */}
  <div className="mb-7">
    <h3 className="text-base font-semibold text-gray-900 truncate">
      {settlement?.group ?? "Group Name"}
    </h3>
    <p className="text-xs text-gray-500 mt-1">
      {settlement?.balances.length ?? 0} members
    </p>
  </div>

  <div className="h-px bg-gray-200 mb-6" />

  {/* Members */}
  <div className="flex-1 overflow-y-auto pr-1">
    <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-4">
      Members
    </h4>

    <div className="space-y-3">
      {settlement?.balances.map((member) => (
        <div
          key={member.email}
          className="flex justify-between items-center text-sm"
        >
          <span className="text-gray-700 font-medium truncate">
            {member.name}
          </span>

          <span
            className={`text-sm font-semibold ${
              member.balance > 0
                ? "text-green-600"
                : member.balance < 0
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            ₹{member.balance}
          </span>
        </div>
      ))}
    </div>
  </div>

  <div className="mt-6">
    <Link
      href={`/groups/${groupId}/add-expense`}
      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition"
    >
      <Plus className="w-4 h-4" />
      Add expense
    </Link>
  </div>
</aside>


        <section className="flex-1 px-2 md:px-10 py-6">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-4">
            <div className="text-2xl font-bold tracking-tight mb-2 flex">
              <p className="text-gray-500">Group </p> :-{" "}
              {settlement?.group ?? "Name"}
            </div>
            <p className="text-gray-500">Track expenses and settle balances</p>
          </div>

          {/* KPI Section */}
          <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
              <IndianRupee className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold">
                  ₹{settlement?.totalSpent ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
              <Users className="w-8 h-8 text-gray-400" />

              <div className="flex items-center justify-between w-full">
                {/* Left side */}
                <div>
                  <p className="text-sm text-gray-500">Per Person Share</p>
                  <p className="text-2xl font-bold">
                    ₹{Math.round(settlement?.perPersonShare ?? 0)}
                  </p>
                </div>

                <div className="hidden sm:block h-10 w-px bg-gray-200" />

                {/* Right side */}
                <div className="text-right">
                  <p className="text-sm text-gray-500">Members</p>
                  <p className="text-2xl font-bold">
                    {settlement?.balances.length ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
              <Users className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Expenses</p>
                <p className="text-2xl font-bold">{expenses.length}</p>
              </div>
            </div>
          </div>

          {/* Settlement Section */}
          <div className="max-w-6xl mx-auto bg-white rounded-2xl border p-6 mb-12">
            <h2 className="text-lg font-semibold mb-4">Settlement</h2>

            {!settlement || settlement.settlements.length === 0 ? (
              <p className="text-gray-500 text-sm">
               Everyone is settled up!
              </p>
            ) : (
              <div className="space-y-3">
                {settlement.settlements.map((s, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{s.from}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{s.to}</span>
                    </div>
                    <span className="font-semibold">₹{s.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expenses */}
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Expenses</h2>
              <Link
                href={`/groups/${groupId}/add-expense`}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:shadow-black/20 hover:-translate-y-1 transition-all"
              >
                <Plus className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                Add Expense
              </Link>
            </div>

            {expenses.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-gray-500">
                No expenses added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {expenses
                  .slice()
                  .sort(
                    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
                  )
                  .map((expense) => {
                    const { dateLabel, time } = formatDateTime(
                      expense.createdAt,
                    );
                    return (
                      <div
                        key={expense._id}
                        className="bg-white border rounded-xl p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-gray-500">
                            Paid by {expense.paidBy.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{expense.amount}</p>
                          <p className="text-sm text-gray-500">{dateLabel}</p>
                          <p className="text-sm text-gray-500">{time}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
