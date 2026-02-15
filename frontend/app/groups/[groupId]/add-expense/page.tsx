"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IndianRupee, FileText, Plus } from "lucide-react";

import { useAuth } from "@/app/context/authContext";
import { addExpense } from "@/app/services/expense.service";
import { getGroupById } from "@/app/services/group.service";
import toast from "react-hot-toast";

type Member = {
  _id: string;
  name: string;
};

export default function AddExpensePage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [splitType, setSplitType] = useState<"EQUAL" | "CUSTOM">("EQUAL");
  const [customSplit, setCustomSplit] = useState<Record<string, number>>({});
  const [category, setCategory] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!groupId) return;

    getGroupById(groupId)
      .then((res) => setMembers(res.members))
      .catch(() => setError("Failed to load group members"));
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid expense amount");
      return;
    }

    const totalAmount = Number(amount);

    const payload: any = {
      groupId,
      description: description.trim(),
      amount: totalAmount,
    };

    // ✅ CATEGORY (Optional)
    const allowedCategories = ["FOOD", "TRAVEL", "RENT", "SHOPPING", "OTHER"];

    if (category) {
      if (!allowedCategories.includes(category)) {
        toast.error("Invalid category selected");
        return;
      }
      payload.category = category;
    }

    // ✅ CUSTOM SPLIT
    if (splitType === "CUSTOM") {
      if (!members.length) {
        toast.error("No group members found");
        return;
      }

      const splitArray = [];

      for (const m of members) {
        const value = customSplit[m._id];

        if (!value || value <= 0) {
          toast.error(`Enter valid amount for ${m.name}`);
          return;
        }

        splitArray.push({
          user: m._id,
          amount: Number(value),
        });
      }

      const totalSplit = splitArray.reduce((sum, s) => sum + s.amount, 0);

      if (
        Math.round(totalSplit * 100) / 100 !==
        Math.round(totalAmount * 100) / 100
      ) {
        toast.error("Split total must equal expense amount");
        return;
      }

      payload.splitBetween = splitArray;
    }

    try {
      setSubmitting(true);
      await addExpense(payload);
      toast.success("Expense added successfully");
      router.push(`/groups/${groupId}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-[#FCFCFD] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">Add Expense</h1>
          <p className="text-sm text-gray-500">
            {splitType === "EQUAL"
              ? "Expense will be split equally"
              : "Custom split enabled"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 text-center">
              {error}
            </p>
          )}

          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              placeholder="Dinner, Taxi, Hotel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border"
            />
          </div>

          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border"
            />
          </div>

          {/* Category (Optional) */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border text-sm"
            >
              <option value="">Select category (Optional)</option>
              <option value="FOOD">Food</option>
              <option value="TRAVEL">Travel</option>
              <option value="RENT">Rent</option>
              <option value="SHOPPING">Shopping</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="flex gap-4 text-sm">
            <button
              type="button"
              onClick={() => setSplitType("EQUAL")}
              className={`flex-1 py-2 border ${
                splitType === "EQUAL" ? "bg-black text-white" : ""
              }`}
            >
              Equal
            </button>
            <button
              type="button"
              onClick={() => setSplitType("CUSTOM")}
              className={`flex-1 py-2 border ${
                splitType === "CUSTOM" ? "bg-black text-white" : ""
              }`}
            >
              Custom
            </button>
          </div>

          {splitType === "CUSTOM" && (
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m._id} className="flex justify-between gap-3">
                  <span className="text-sm">{m.name}</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-24 px-2 py-1 border text-sm"
                    onChange={(e) =>
                      setCustomSplit((prev) => ({
                        ...prev,
                        [m._id]: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <button
            disabled={submitting}
            className="w-full bg-black text-white py-4 font-semibold"
          >
            <Plus className="inline w-4 h-4 mr-2" />
            {submitting ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </main>
  );
}
