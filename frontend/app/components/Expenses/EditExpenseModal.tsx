"use client";

import { useState } from "react";
import { updateExpense } from "@/app/services/expense.service";
import toast from "react-hot-toast";

export default function EditExpenseModal({
  expense,
  onClose,
  onUpdated,
}: {
  expense: any;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  if (!description || !amount) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    await updateExpense({
      expenseId: expense._id,
      description,
      amount,
      splitBetween: expense.splitBetween.map((s: any) => ({
        user: s.user._id,
        amount: s.amount,
      })),
    });

    toast.success("Expense updated successfully");

    onUpdated();
    onClose();
  } catch (err: any) {
    toast.error(err?.message || "Failed to update expense");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="font-semibold mb-4">Edit Expense</h3>
        <input
          className="w-full border p-2 mb-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          className="w-full border p-2 mb-3 rounded"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
