"use client";

import { useState } from "react";
import {
  User2,
  X,
  ReceiptText,
  IndianRupee,
  Users,
  CheckCircle2,
} from "lucide-react";
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
  const [description, setDescription] = useState(expense.description || "");

  const [amount, setAmount] = useState(Number(expense.amount));

  const [loading, setLoading] = useState(false);

 
  const [splitBetween, setSplitBetween] = useState(
    () =>
      expense.splitBetween?.map((s: any) => ({
        user: typeof s.user === "object" ? s.user : { _id: s.user },
        amount: Number(s.amount),
      })) || [],
  );

 
  const getInitials = (name?: string) => {
    if (!name) return "";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase() || "";
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  
  const handleAmountChange = (value: string) => {
    const newAmount = Number(value);

    setAmount(value === "" ? 0 : newAmount);

    if (
      !newAmount ||
      newAmount <= 0 ||
      !expense.amount ||
      splitBetween.length === 0
    ) {
      return;
    }

    const oldAmount = Number(expense.amount);

    const updated = splitBetween.map((split: any) => {
      const ratio = Number(split.amount) / oldAmount;

      return {
        ...split,
        amount: Number((ratio * newAmount).toFixed(2)),
      };
    });

   
    const total = updated.reduce(
      (sum: number, split: any) => sum + split.amount,
      0,
    );

    const difference = Number((newAmount - total).toFixed(2));

    if (difference !== 0) {
      updated[updated.length - 1].amount += difference;
    }

    setSplitBetween(updated);
  };

 
  const handleShareChange = (index: number, value: string) => {
    const newValue = value === "" ? 0 : Number(value);

    setSplitBetween((prev: any[]) =>
      prev.map((split, i) =>
        i === index
          ? {
              ...split,
              amount: newValue,
            }
          : split,
      ),
    );
  };

 
  const splitTotal = splitBetween.reduce(
    (sum: number, split: any) => sum + Number(split.amount || 0),
    0,
  );

  const splitDifference = Number((amount - splitTotal).toFixed(2));

  const splitIsValid = splitBetween.length === 0 || splitDifference === 0;

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (splitBetween.length > 0) {
      if (splitDifference !== 0) {
        toast.error(
          `Split total must equal ₹${amount.toLocaleString("en-IN")}`,
        );
        return;
      }

      const hasInvalidShare = splitBetween.some(
        (split: any) => !split.user?._id || split.amount < 0,
      );

      if (hasInvalidShare) {
        toast.error("Please enter valid member shares");
        return;
      }
    }

    try {
      setLoading(true);

      await updateExpense({
        expenseId: expense._id,
        description: description.trim(),
        amount,
        splitBetween:
          splitBetween.length > 0
            ? splitBetween.map((split: any) => ({
                user: split.user._id,
                amount: Number(split.amount),
              }))
            : undefined,
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
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/40
        backdrop-blur-[2px]
        px-4
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full max-w-md
          max-h-[90vh]
          overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white
          shadow-2xl shadow-slate-900/20
        "
      >
   

        <div
          className="
            flex items-center justify-between
            border-b border-slate-100
            px-6 py-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-slate-100
                text-slate-700
              "
            >
              <ReceiptText size={19} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-950">
                Edit Expense
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Update expense details and split
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <X size={18} />
          </button>
        </div>

      

        <div className="space-y-5 px-6 py-5">
      

          <div>
            <label
              className="
                mb-1.5 block
                text-[11px]
                font-bold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Description
            </label>

            <div className="relative">
              <ReceiptText
                size={17}
                className="
                  absolute left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Dinner"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  py-3
                  pl-10
                  pr-4
                  text-sm
                  font-medium
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-slate-400
                  focus:bg-white
                  disabled:opacity-60
                "
              />
            </div>
          </div>

         

          <div>
            <label
              className="
                mb-1.5 block
                text-[11px]
                font-bold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Amount
            </label>

            <div className="relative">
              <IndianRupee
                size={17}
                className="
                  absolute left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="number"
                min="1"
                value={amount || ""}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="5000"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  py-3
                  pl-10
                  pr-4
                  text-sm
                  font-semibold
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-slate-400
                  focus:bg-white
                  disabled:opacity-60
                "
              />
            </div>
          </div>

          

          {splitBetween.length > 0 && (
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-slate-500" />

                  <span
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Split between
                  </span>
                </div>

                <span className="text-[11px] font-medium text-slate-400">
                  {splitBetween.length}{" "}
                  {splitBetween.length === 1 ? "member" : "members"}
                </span>
              </div>

            

              <div
                className="
                  max-h-52
                  overflow-y-auto
                  space-y-2
                  rounded-xl
                  border border-slate-200
                  bg-slate-50/60
                  p-2

                  scrollbar-thin
                  scrollbar-thumb-slate-300
                  scrollbar-track-transparent
                "
              >
                {splitBetween.map((split: any, index: number) => {
                  const member = split.user;

                  const name = member?.name || "Unknown member";

                  const email = member?.email || "";

                  return (
                    <div
                      key={member?._id || index}
                      className="
                          flex items-center
                          justify-between
                          gap-3
                          rounded-xl
                          border border-slate-100
                          bg-white
                          px-3
                          py-2.5
                          transition
                          hover:border-slate-200
                        "
                    >
                  

                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className="
                              flex h-9 w-9
                              shrink-0
                              items-center justify-center
                              overflow-hidden
                              rounded-full
                              bg-slate-100
                              text-[10px]
                              font-bold
                              text-slate-600
                            "
                        >
                          {member?.avatar ? (
                            <img
                              src={member.avatar}
                              alt={name}
                              className="
                                  h-full
                                  w-full
                                  object-cover
                                "
                            />
                          ) : (
                            getInitials(name)
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-800">
                            {name}
                          </p>

                          <p className="truncate text-[10px] text-slate-400">
                            {email}
                          </p>
                        </div>
                      </div>


                      <div className="relative w-24 shrink-0">
                        <IndianRupee
                          size={12}
                          className="
                              absolute left-2.5
                              top-1/2
                              -translate-y-1/2
                              text-slate-400
                            "
                        />

                        <input
                          type="number"
                          min="0"
                          value={split.amount}
                          onChange={(e) =>
                            handleShareChange(index, e.target.value)
                          }
                          disabled={loading}
                          className="
                              w-full
                              rounded-lg
                              border border-slate-200
                              bg-slate-50
                              py-2
                              pl-6
                              pr-2
                              text-right
                              text-xs
                              font-bold
                              tabular-nums
                              text-slate-800
                              outline-none
                              transition
                              focus:border-slate-400
                              focus:bg-white
                            "
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

           

              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Split total
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      splitIsValid ? "text-slate-900" : "text-rose-600"
                    }`}
                  >
                    ₹
                    {splitTotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>

                  {splitIsValid && (
                    <CheckCircle2 size={15} className="text-emerald-500" />
                  )}
                </div>
              </div>

              {!splitIsValid && (
                <p className="mt-1 text-right text-[11px] font-medium text-rose-500">
                  Difference: ₹
                  {Math.abs(splitDifference).toLocaleString("en-IN")}
                </p>
              )}
            </div>
          )}
        </div>

        

        <div
          className="
            flex items-center justify-end
            gap-2
            border-t border-slate-100
            bg-slate-50/50
            px-6 py-4
          "
        >
          <button
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              bg-white
              px-4 py-2.5
              text-sm
              font-semibold
              text-slate-600
              ring-1
              ring-inset
              ring-slate-200
              transition
              hover:bg-slate-50
              hover:text-slate-900
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !splitIsValid}
            className="
              rounded-xl
              bg-slate-950
              px-5 py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-slate-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Updating..." : "Update Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}
