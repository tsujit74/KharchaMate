"use client";

import { useEffect, useState } from "react";
import {
  X,
  Wallet,
  IndianRupee,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { updateGroupBudget } from "../../services/group.service";

type Props = {
  isOpen: boolean;
  groupId: string;
  currentBudget?: number | null;
  onClose: () => void;
  onUpdated: (
    budget: number,
    remainingBudget: number
  ) => void;
};

export default function SetBudgetModal({
  isOpen,
  groupId,
  currentBudget,
  onClose,
  onUpdated,
}: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing =
    typeof currentBudget === "number" && currentBudget > 0;

  useEffect(() => {
    if (!isOpen) return;

    setValue(
      typeof currentBudget === "number"
        ? String(currentBudget)
        : ""
    );

    setError("");
    setSaving(false);
  }, [isOpen, currentBudget]);

  useEffect(() => {
    if (!isOpen || saving) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const trimmedValue = value.trim();

  const numericValue =
    trimmedValue === "" ? NaN : Number(trimmedValue);

  const isValid =
    trimmedValue !== "" &&
    Number.isFinite(numericValue) &&
    numericValue > 0;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextValue = event.target.value;

    setValue(nextValue);

    if (error) {
      setError("");
    }
  };

  const validate = () => {
    if (!trimmedValue) {
      setError("Please enter a budget amount.");
      return false;
    }

    if (!Number.isFinite(numericValue)) {
      setError("Please enter a valid amount.");
      return false;
    }

    if (numericValue <= 0) {
      setError("Budget must be greater than ₹0.");
      return false;
    }

    if (numericValue > 100_000_000) {
      setError("Budget cannot exceed ₹10 crore.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) return;

    setError("");

    if (!validate()) return;

    if (
      isEditing &&
      numericValue === currentBudget
    ) {
      setError("Please enter a different budget.");
      return;
    }

    setSaving(true);

    try {
      const result = await updateGroupBudget(
        groupId,
        numericValue
      );

      onUpdated(
        result.budget,
        result.remainingBudget
      );

      onClose();
    } catch (err: any) {
      switch (err?.message) {
        case "NETWORK_ERROR":
          setError(
            "Unable to connect to the server. Please check your internet connection."
          );
          break;

        case "UNAUTHORIZED":
          setError(
            "Your session has expired. Please log in again."
          );
          break;

        case "FORBIDDEN":
          setError(
            "You don't have permission to update this group's budget."
          );
          break;

        case "INVALID_DATA":
        case "INVALID_BUDGET":
          setError(
            "Please enter a valid budget greater than ₹0."
          );
          break;

        default:
          setError(
            "Failed to update the budget. Please try again."
          );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget && !saving) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="budget-modal-title"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
        onMouseDown={(event) => event.stopPropagation()}
      >
       
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Wallet className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h2
                id="budget-modal-title"
                className="text-base font-bold text-slate-900"
              >
                {isEditing
                  ? "Update Budget"
                  : "Set Group Budget"}
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {isEditing
                  ? "Update the spending limit for this group."
                  : "Set a spending limit for this group."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5">
            {isEditing && (
              <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
                <span className="text-xs font-medium text-slate-500">
                  Current budget
                </span>

                <span className="text-sm font-bold text-slate-800">
                  ₹{currentBudget.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <label
              htmlFor="group-budget"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Budget amount
            </label>

            <div
              className={`flex h-12 items-center overflow-hidden rounded-xl border bg-white transition ${
                error
                  ? "border-red-300 ring-2 ring-red-50"
                  : "border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50"
              }`}
            >
              <div className="flex h-full w-12 items-center justify-center border-r border-slate-100 bg-slate-50">
                <IndianRupee className="h-4 w-4 text-slate-500" />
              </div>

              <input
                id="group-budget"
                type="number"
                inputMode="decimal"
                min="0.01"
                max="100000000"
                step="0.01"
                value={value}
                onChange={handleChange}
                placeholder="Enter budget amount"
                disabled={saving}
                autoFocus
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-300 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            {error && (
              <div className="mt-2 flex items-start gap-1.5 text-xs text-red-500">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

        
            {!error && (
              <p className="mt-2 text-[11px] text-slate-400">
                Enter an amount between ₹0.01 and ₹10 crore.
              </p>
            )}

            {isValid && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-[11px] font-medium text-emerald-700">
                    New budget
                  </p>

                  <p className="text-sm font-bold text-emerald-800">
                    ₹{numericValue.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            )}
          </div>

          
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3.5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid || saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {saving && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}

              {saving
                ? "Saving..."
                : isEditing
                  ? "Update Budget"
                  : "Set Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}