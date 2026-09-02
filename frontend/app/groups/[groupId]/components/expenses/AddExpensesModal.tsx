"use client";

import { useState } from "react";
import ScanBill from "@/app/components/expense/ScanBill";
import AddExpenseForm from "./AddExpenseForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess: () => void;
};

type ScannedData = {
  amount: number | null;
  description: string;
  date: string | null;
  warning?: string;
};

export default function AddExpenseModal({
  isOpen,
  onClose,
  groupId,
  onSuccess,
}: Props) {
  const [scannedData, setScannedData] = useState<ScannedData>({
    amount: null,
    description: "",
    date: null,
    warning: "",
  });

  // Called whenever a new scan starts
  const handleScanStart = () => {
    setScannedData({
      amount: null,
      description: "",
      date: null,
      warning: "",
    });
  };

  if (!isOpen) return null;

  const handleScanComplete = (data: ScannedData) => {
    console.log("Scanned data:", data);

    const hasAmount = data.amount !== null;
    const hasDescription = data.description.trim().length > 0;

    let warning = "";

    if (!hasAmount && !hasDescription) {
      warning =
        "We couldn't read this bill clearly. Please fill in the expense details manually.";
    } else if (!hasAmount || !hasDescription) {
      warning =
        "Some information couldn't be read from the bill. Please review and fill in the missing details manually.";
    }

    setScannedData({
      ...data,
      warning,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-1xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
          <div>
            <h4 className="text-1xl font-bold text-gray-900">
              Add Expense
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              Add an expense manually or scan a bill
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5">
          {/* Scan section */}
          <div className="mb-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3">
            <h4 className="font-semibold text-gray-900">
              Scan your bill
            </h4>

            <p className="mt mb-4 text-sm text-gray-500">
              Upload or capture a receipt.
            </p>

            <ScanBill
              onScanStart={handleScanStart}
              onScanComplete={handleScanComplete}
            />
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-medium uppercase text-gray-400">
              Expense Details
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <AddExpenseForm
            groupId={groupId}
            initialAmount={
              scannedData.amount !== null
                ? String(scannedData.amount)
                : ""
            }
            initialDescription={scannedData.description}
            ocrWarning={scannedData.warning}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}