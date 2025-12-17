"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function GroupExpensesPage() {
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:5000/api/expenses/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .finally(() => setLoading(false));
  }, [groupId]);

  if (loading) return <p>Loading expenses...</p>;
  if (expenses.length === 0) return <p>No expenses yet.</p>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-bold">Expenses</h1>

      {expenses.map((exp) => (
        <div key={exp._id} className="border p-3 rounded space-y-1">
          <p className="font-semibold">{exp.description}</p>
          <p>Amount: ₹{exp.amount}</p>
          <p className="text-sm text-gray-500">Paid by: {exp.paidBy?.name}</p>

          <div className="text-sm text-gray-600">
            <p className="font-medium">Split:</p>
            <ul className="pl-4 list-disc">
              {exp.splitBetween.map((s: any) => (
                <li key={s._id}>
                  {s.user.name} owes ₹{s.amount}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
