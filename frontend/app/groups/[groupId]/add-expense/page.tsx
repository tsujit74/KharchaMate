"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IndianRupee, FileText, Plus } from "lucide-react";

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
    <main className="min-h-screen bg-[#FCFCFD] px-6 md:px-16 py-12">
      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-gray-100 shadow-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Add Expense
          </h1>
        </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  placeholder="e.g. Dinner, Taxi, Hotel"
                  className="w-full pl-11 pr-4 py-3 border focus:outline-none focus:ring-2 focus:ring-black/10"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Amount
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 border focus:outline-none focus:ring-2 focus:ring-black/10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Info */}
            {members.length > 0 && amount && (
              <div className="bg-gray-50 border p-4 text-sm text-gray-600">
                This expense will be split equally among{" "}
                <span className="font-semibold">{members.length}</span> members
                <br />
                Each pays:{" "}
                <span className="font-semibold">
                  ₹{(Number(amount) / members.length).toFixed(2)}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
