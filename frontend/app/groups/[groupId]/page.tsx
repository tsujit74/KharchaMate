"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Users, IndianRupee, Plus } from "lucide-react";
import Link from "next/link";

type Member = {
  _id: string;
  name: string;
  email: string;
};

type Expense = {
  _id: string;
  description: string;
  amount: number;
  paidBy: {
    name: string;
    email: string;
  };
  createdAt: string;
};

export default function GroupDetailsPage() {
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/expenses/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setExpenses(data);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [groupId]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading group details...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFCFD] px-6 md:px-16 py-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Group Details
        </h1>
        <p className="text-gray-500">
          Track expenses and settle balances
        </p>
      </div>

      {/* KPI Section */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
          <IndianRupee className="w-8 h-8 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold">₹{totalSpent}</p>
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

      {/* Settlement Placeholder */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border p-6 mb-12">
        <h2 className="text-lg font-semibold mb-2">Settlement</h2>
        <p className="text-gray-500 text-sm">
          Settlement calculation will appear here (who owes whom).
        </p>
      </div>

      {/* Expenses */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Expenses</h2>
          <Link
            href={`/groups/${groupId}/add-expense`}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Link>
        </div>

        {expenses.length === 0 ? (
          <div className="bg-white border rounded-2xl p-8 text-center text-gray-500">
            No expenses added yet.
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
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
                <p className="font-semibold">₹{expense.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
