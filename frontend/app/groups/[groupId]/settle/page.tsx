"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { IndianRupee, ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { settlePayment } from "@/app/services/settlement.service";

export default function SettlePaymentPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const toUserId = searchParams.get("to");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

 
  if (!toUserId || !amount) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="bg-white border rounded-2xl p-8 text-center max-w-sm">
          <p className="text-sm text-red-600 font-medium">
            Invalid settlement request
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm text-gray-500 underline"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  /* ------------------ HANDLER ------------------ */
  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      await settlePayment(groupId, toUserId, Number(amount));
      setConfirmed(true);

      setTimeout(() => {
        router.push(`/groups/${groupId}`);
      }, 1500);
    } catch {
      alert("Failed to update settlement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-3xl shadow-sm p-6 sm:p-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          Confirm Settlement
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Confirm after completing the payment outside the app
        </p>

        {/* Amount Card */}
        <div className="rounded-2xl border bg-neutral-50 p-5 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white border flex items-center justify-center">
            <IndianRupee className="w-6 h-6 text-gray-600" />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Amount to pay
            </p>
            <p className="text-3xl font-semibold">₹{amount}</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex gap-3 text-xs text-gray-500 mb-8">
          <ShieldCheck className="w-4 h-4 mt-0.5 text-gray-400" />
          <p>
            Payments are handled directly between users (UPI, cash, or any
            method). KharchaMate only records the settlement status.
          </p>
        </div>

        {/* Action */}
        {!confirmed ? (
          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-medium
              hover:bg-neutral-800 transition
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Confirming payment..." : "I’ve completed the payment"}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-3">
            <CheckCircle className="w-5 h-5" />
            Settlement completed
          </div>
        )}
      </div>
    </main>
  );
}
