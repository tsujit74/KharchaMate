"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AddExpensePage() {
  const { groupId } = useParams();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:5000/api/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMembers(data.members));
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const splitAmount = Number(amount) / members.length;

    const splitBetween = members.map((m) => ({
      user: m._id,
      amount: splitAmount,
    }));

    setLoading(true);

    await fetch("http://localhost:5000/api/expenses/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        groupId,
        description,
        amount: Number(amount),
        splitBetween,
      }),
    });

    setLoading(false);
    router.push(`/groups/${groupId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Add Expense</h1>

      <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
        <input
          placeholder="Description"
          className="w-full border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button className="bg-black text-white p-2 w-full">
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
