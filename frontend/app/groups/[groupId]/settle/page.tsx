"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { IndianRupee, ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { settlePayment } from "@/app/services/settlement.service";
import { getUserById } from "@/app/services/users.ervice";
import toast from "react-hot-toast";
import QRCode from "qrcode";

export default function SettlePaymentPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const toUserId = searchParams.get("to");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [qrImage, setQrImage] = useState<string>("");
  const [receiver, setReceiver] = useState<any>(null);

  // ✅ ALL HOOKS MUST BE ABOVE RETURN

  useEffect(() => {
    if (!toUserId) return;

    const fetchReceiver = async () => {
      try {
        const res = await getUserById(toUserId);
        setReceiver(res.data.user);
      } catch {
        toast.error("Unable to load receiver details");
      }
    };

    fetchReceiver();
  }, [toUserId]);

  useEffect(() => {
    if (!receiver?.mobile || !amount) return;

    const generateQR = async () => {
      const upiId = `${receiver.mobile}@upi`;

      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
        receiver.name,
      )}&am=${amount}&cu=INR`;

      const qr = await QRCode.toDataURL(upiString);
      setQrImage(qr);
    };

    generateQR();
  }, [receiver, amount]);

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

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);

      await settlePayment(groupId, toUserId, Number(amount));

      toast.success("Settlement recorded successfully");
      setConfirmed(true);

      setTimeout(() => {
        router.push(`/groups/${groupId}`);
      }, 1500);
    } catch {
      toast.error("Failed to update settlement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white border overflow-hidden">
        {/* Header */}
        <div className="border-b px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-lg font-semibold tracking-tight">
            Settlement Confirmation
          </h1>

          <div />
        </div>

        {/* Body */}
        <div className="grid md:grid-cols-2">
          {/* LEFT SECTION */}
          <div className="p-8 border-r bg-neutral-50">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6">
              Payment Details
            </h2>

            {/* Receiver */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-1">Paying To</p>
              <p className="text-lg font-semibold text-black">
                {receiver?.name || "Loading..."}
              </p>
              <p className="text-sm text-gray-500">{receiver?.mobile}</p>
            </div>

            {/* Amount */}
            <div className="rounded-2xl border bg-white p-6 flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Amount
                </p>
                <p className="text-3xl font-semibold text-black">₹{amount}</p>
              </div>
            </div>

            {/* QR */}
            {qrImage && !confirmed && (
              <div className="flex flex-col items-center">
                <img
                  src={qrImage}
                  alt="UPI QR"
                  className="w-[200px] h-[200px] bg-white p-4 rounded-2xl border"
                />
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Scan this QR using any UPI application
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6">
                Confirmation
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed mb-8">
                Complete the payment externally using UPI, cash, or any
                preferred method. Once payment is done, confirm below to update
                the settlement record.
              </p>

              <div className="flex gap-3 text-xs text-gray-500 mb-8">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-gray-400" />
                <p>
                  KharchaMate does not process payments. It only records
                  settlement status between members.
                </p>
              </div>
            </div>

            {!confirmed ? (
              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-medium
                  hover:bg-neutral-800 transition
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Recording settlement..."
                  : "I Have Completed the Payment"}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-4">
                <CheckCircle className="w-5 h-5" />
                Settlement Successfully Recorded
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
