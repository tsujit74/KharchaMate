"use client";

import { useState, useEffect } from "react";
import { IndianRupee, FileText, Plus } from "lucide-react";
import { addExpense } from "@/app/services/expense.service";
import { getGroupById } from "@/app/services/group.service";
import toast from "react-hot-toast";

type Member = {
  _id: string;
  name: string;
};

type Props = {
  groupId: string;
  onSuccess: () => void;
};

export default function AddExpenseForm({ groupId, onSuccess }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [splitType, setSplitType] = useState<"EQUAL" | "CUSTOM">("EQUAL");
  const [customSplit, setCustomSplit] = useState<Record<string, number>>({});
  const [category, setCategory] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    getGroupById(groupId)
      .then((res) => setMembers(res.members))
      .catch(() => toast.error("Failed to load members"));
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const totalAmount = Number(amount);

    const payload: any = {
      groupId,
      description: description.trim(),
      amount: totalAmount,
    };

    const allowedCategories = ["FOOD", "TRAVEL", "RENT", "SHOPPING", "RECHARGE", "OTHER"];

    if (category) {
      if (!allowedCategories.includes(category)) {
        toast.error("Invalid category");
        return;
      }
      payload.category = category;
    }

    if (splitType === "CUSTOM") {
      const splitArray = members.map((m) => ({
        user: m._id,
        amount: Number(customSplit[m._id] || 0),
      }));

      const totalSplit = splitArray.reduce((sum, s) => sum + s.amount, 0);

      if (
        Math.round(totalSplit * 100) / 100 !==
        Math.round(totalAmount * 100) / 100
      ) {
        toast.error("Split must equal total");
        return;
      }

      payload.splitBetween = splitArray;
    }

    try {
      setSubmitting(true);
      await addExpense(payload);
      toast.success("Expense added");

      onSuccess(); // refresh + close
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          placeholder="Dinner, Taxi..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border"
        />
      </div>

      <div className="relative">
        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border"
        />
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50 border"
      >
        <option value="">Category (optional)</option>
        <option value="FOOD">Food</option>
        <option value="TRAVEL">Travel</option>
        <option value="RENT">Rent</option>
        <option value="SHOPPING">Shopping</option>
        <option value="RECHARGE">Recharge</option>
        <option value="OTHER">Other</option>
      </select>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSplitType("EQUAL")}
          className={`flex-1 py-2 border ${splitType === "EQUAL" ? "bg-black text-white" : ""}`}
        >
          Equal
        </button>
        <button
          type="button"
          onClick={() => setSplitType("CUSTOM")}
          className={`flex-1 py-2 border ${splitType === "CUSTOM" ? "bg-black text-white" : ""}`}
        >
          Custom
        </button>
      </div>

      {splitType === "CUSTOM" && (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m._id} className="flex justify-between">
              <span>{m.name}</span>
              <input
                type="number"
                className="w-20 border px-2"
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

      <button className="w-full bg-black text-white py-3">
        <Plus className="inline w-4 h-4 mr-2" />
        {submitting ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}