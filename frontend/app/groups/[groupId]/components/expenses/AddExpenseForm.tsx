"use client";

import { useState, useEffect } from "react";
import { IndianRupee, FileText, Plus, AlertTriangle } from "lucide-react";
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

  // Values coming from OCR
  initialAmount?: string;
  initialDescription?: string;

  // OCR warning
  ocrWarning?: string;
};

export default function AddExpenseForm({
  groupId,
  onSuccess,
  initialAmount = "",
  initialDescription = "",
  ocrWarning = "",
}: Props) {
  const [description, setDescription] = useState(initialDescription);

  const [amount, setAmount] = useState(initialAmount);

  const [members, setMembers] = useState<Member[]>([]);

  const [splitType, setSplitType] = useState<"EQUAL" | "CUSTOM">("EQUAL");

  const [customSplit, setCustomSplit] = useState<Record<string, number>>({});

  const [category, setCategory] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Update form when OCR result changes
  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount]);

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

    const allowedCategories = [
      "FOOD",
      "TRAVEL",
      "RENT",
      "SHOPPING",
      "RECHARGE",
      "OTHER",
    ];

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

      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* OCR Warning */}
      {ocrWarning && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

            <div>
              <p className="text-sm font-medium text-orange-800">
                Please review the scanned bill
              </p>

              <p className="mt-1 text-sm text-orange-700">{ocrWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>

        <div className="relative">
          <FileText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            placeholder="Dinner, Taxi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border bg-gray-50 py-3 pl-12 pr-4"
          />
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Amount
        </label>

        <div className="relative">
          <IndianRupee className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border bg-gray-50 py-3 pl-12 pr-4"
          />
        </div>
      </div>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-lg border bg-gray-50 px-4 py-3"
      >
        <option value="">Category (optional)</option>
        <option value="FOOD">Food</option>
        <option value="TRAVEL">Travel</option>
        <option value="RENT">Rent</option>
        <option value="SHOPPING">Shopping</option>
        <option value="RECHARGE">Recharge</option>
        <option value="OTHER">Other</option>
      </select>

      {/* Split type */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSplitType("EQUAL")}
          className={`flex-1 rounded-lg border py-2 ${
            splitType === "EQUAL" ? "bg-black text-white" : ""
          }`}
        >
          Equal
        </button>

        <button
          type="button"
          onClick={() => setSplitType("CUSTOM")}
          className={`flex-1 rounded-lg border py-2 ${
            splitType === "CUSTOM" ? "bg-black text-white" : ""
          }`}
        >
          Custom
        </button>
      </div>

      {/* Custom split */}
      {splitType === "CUSTOM" && (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m._id} className="flex items-center justify-between">
              <span>{m.name}</span>

              <input
                type="number"
                min="0"
                step="0.01"
                className="w-24 rounded border px-2 py-2"
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

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-50"
      >
        <Plus className="mr-2 inline h-4 w-4" />

        {submitting ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
