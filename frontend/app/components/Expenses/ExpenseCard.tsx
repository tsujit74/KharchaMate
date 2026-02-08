"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Edit } from "lucide-react";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { deleteExpense } from "@/app/services/expense.service";
import EditExpenseModal from "./EditExpenseModal";

export default function ExpenseCard({
  expense,
  currentUserId,
  onDeleted,
  onUpdated, // optional callback when expense is updated
}: {
  expense: any;
  currentUserId?: string;
  onDeleted?: () => void;
  onUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const { dateLabel } = formatDateTime(expense.createdAt);
  const isOwner = expense.paidBy?._id === currentUserId;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      setLoading(true);
      await deleteExpense(expense._id);
      onDeleted?.();
    } catch (err: any) {
      alert(err.message); 
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  };

  return (
    <>
      <div className="bg-white border rounded-lg mb-3">
        {/* HEADER */}
        <div
          className="p-4 flex justify-between items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div>
            <p className="font-medium">{expense.description}</p>
            <p className="text-xs text-gray-500">
              Paid by {isOwner ? "You" : expense.paidBy?.name || "Unknown"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* ACTIONS */}
            {isOwner && (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleEdit}
                  title="Edit expense"
                  className="p-1 text-gray-500 hover:text-black"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDelete}
                  disabled={loading}
                  title="Delete expense"
                  className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* AMOUNT */}
            <div className="text-right">
              <p className="font-semibold">₹{expense.amount}</p>
              <p className="text-xs text-gray-500">{dateLabel}</p>
            </div>

            {open ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="border-t px-4 py-3 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Split Details
            </p>

            {expense.splitBetween.map((s: any) => {
              const isYou = s.user._id === currentUserId;

              return (
                <div key={s._id} className="flex justify-between text-sm mb-1">
                  <span className={isYou ? "font-semibold" : ""}>
                    {s.user.name} {isYou && "(You)"}
                  </span>
                  <span>₹{s.amount}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <EditExpenseModal
          expense={expense}
          onClose={() => setEditing(false)}
          onUpdated={() => {
            setEditing(false);
            onUpdated?.();
          }}
        />
      )}
    </>
  );
}
