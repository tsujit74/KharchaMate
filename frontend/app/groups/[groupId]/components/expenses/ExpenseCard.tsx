"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Edit, Receipt } from "lucide-react";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { deleteExpense } from "@/app/services/expense.service";
import EditExpenseModal from "../EditExpenseModal";
import toast from "react-hot-toast";
import { useConfirm } from "@/app/context/ConfirmContext";

function formatAmount(amount: number | string) {
  return `₹${Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export default function ExpenseCard({
  expense,
  currentUserId,
  onDeleted,
  onUpdated,
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

  const { confirm } = useConfirm();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = await confirm({
      title: "Delete Expense",
      message: `Are you sure you want to delete "${expense.description}"? This action cannot be undone.`,
      confirmText: "Delete Expense",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      setLoading(true);

      await deleteExpense(expense._id);

      toast.success("Expense deleted successfully");

      onDeleted?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete expense");
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
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        {/* HEADER */}
        <div
          className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50 sm:px-5 sm:py-4"
          onClick={() => setOpen(!open)}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Receipt className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {expense.description}
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                Paid by {isOwner ? "You" : expense.paidBy?.name || "Unknown"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {/* AMOUNT */}
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums text-slate-900 sm:text-base">
                {formatAmount(expense.amount)}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">{dateLabel}</p>
            </div>

            {/* ACTIONS */}
            {isOwner && (
              <div
                className="flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleEdit}
                  title="Edit expense"
                  aria-label="Edit expense"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                  <Edit className="h-4 w-4" />
                </button>

                <button
                  onClick={handleDelete}
                  disabled={loading}
                  title="Delete expense"
                  aria-label="Delete expense"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {open ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
            <p className="mb-2 text-xs font-medium text-slate-500">
              Split details
            </p>

            {expense.splitBetween.map((s: any) => {
              const isYou = s.user._id === currentUserId;

              return (
                <div
                  key={s._id}
                  className="flex items-center justify-between py-1.5 text-sm"
                >
                  <span
                    className={
                      isYou ? "font-semibold text-slate-900" : "text-slate-600"
                    }
                  >
                    {s.user.name} {isYou && "(You)"}
                  </span>

                  <span className="tabular-nums text-slate-900">
                    {formatAmount(s.amount)}
                  </span>
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
