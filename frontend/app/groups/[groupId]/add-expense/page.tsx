"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IndianRupee, FileText, Plus } from "lucide-react";

import { useAuth } from "@/app/context/authContext";
import { addExpense } from "@/app/services/expense.service";

export default function AddExpensePage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!groupId) {
      setError("Invalid group.");
      return;
    }

    if (!description.trim() || !amount) {
      setError("All fields are required.");
      return;
    }

    try {
      setSubmitting(true);

      await addExpense({
        groupId,
        description: description.trim(),
        amount: Number(amount),
      });

      router.push(`/groups/${groupId}`);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        router.push("/login");
      } else {
        setError("Failed to add expense. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-[#FCFCFD] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">Add Expense</h1>
          <p className="text-sm text-gray-500">
            Expense will be split equally
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 text-center">
              {error}
            </p>
          )}

          {/* Description */}
          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              required
              placeholder="Dinner, Taxi, Hotel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 focus:outline-none focus:border-black"
            />
          </div>

          {/* Amount */}
          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              required
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 focus:outline-none focus:border-black"
            />
          </div>

          {/* Submit */}
          <button
            disabled={submitting}
            className="w-full bg-black text-white py-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Plus className="w-4 h-4" />
            {submitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </main>
  );
}
