"use client";

import {
  ArrowLeft,
  CheckCircle,
  IndianRupee,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import toast from "react-hot-toast";

import { useAuth } from "@/app/context/authContext";
import {
  getGroupSettlement,
  settlePayment,
} from "@/app/services/settlement.service";
import { getUserById } from "@/app/services/users.ervice";

type Receiver = {
  _id: string;
  name: string;
  email?: string;
  mobile?: string;
};

type Settlement = {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  toMobile?: string;
  amount: number;
};

export default function SettlePaymentPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const toUserId = searchParams.get("to");

  const [pageLoading, setPageLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [receiver, setReceiver] = useState<Receiver | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [maxPayable, setMaxPayable] = useState(0);
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    if (authLoading || !user || !toUserId || !groupId) {
      return;
    }

    let cancelled = false;

    const fetchPaymentDetails = async () => {
      try {
        setPageLoading(true);

        const [receiverRes, settlementData] = await Promise.all([
          getUserById(toUserId),
          getGroupSettlement(groupId),
        ]);

        if (cancelled) return;

        const receiverData = receiverRes?.data?.user;

        if (!receiverData) {
          throw new Error("Receiver not found");
        }

        const currentSettlement = (settlementData?.settlements ?? []).find(
          (settlement: Settlement) =>
            settlement.from?.toString() === user.id.toString() &&
            settlement.to?.toString() === toUserId.toString(),
        );

        if (!currentSettlement) {
          toast.error("This settlement is no longer available.");
          router.replace(`/groups/${groupId}`);
          return;
        }

        const amount = Number(currentSettlement.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
          toast.error("Invalid settlement amount.");
          router.replace(`/groups/${groupId}`);
          return;
        }

        setReceiver(receiverData);
        setPaymentAmount(amount.toFixed(2));
        setMaxPayable(amount);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load payment details:", error);

        toast.error("Unable to load payment details. Please try again.");
      } finally {
        if (!cancelled) {
          setPageLoading(false);
        }
      }
    };

    fetchPaymentDetails();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, toUserId, groupId, router]);

  useEffect(() => {
    if (!receiver?.mobile || !paymentAmount || Number(paymentAmount) <= 0) {
      setQrImage("");
      return;
    }

    let cancelled = false;

    const generateQR = async () => {
      try {
        const amount = Number(paymentAmount);

        if (!Number.isFinite(amount) || amount <= 0) {
          setQrImage("");
          return;
        }

        const upiId = `${receiver.mobile}@upi`;

        const upiString =
          `upi://pay?pa=${upiId}` +
          `&pn=${encodeURIComponent(receiver.name)}` +
          `&am=${amount.toFixed(2)}` +
          `&cu=INR`;

        const qr = await QRCode.toDataURL(upiString, {
          width: 280,
          margin: 2,
        });

        if (!cancelled) {
          setQrImage(qr);
        }
      } catch (error) {
        console.error("QR generation failed:", error);

        if (!cancelled) {
          setQrImage("");
        }
      }
    };

    generateQR();

    return () => {
      cancelled = true;
    };
  }, [receiver, paymentAmount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setPaymentAmount("");
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    setPaymentAmount(value);
  };

  const handleMaxAmount = () => {
    setPaymentAmount(maxPayable.toFixed(2));
  };

  const handleConfirmPayment = async () => {
    if (paymentLoading) return;

    if (!user || !toUserId || !groupId) {
      toast.error("Invalid payment details.");
      return;
    }

    const amount = Number(paymentAmount);

    if (!paymentAmount.trim()) {
      toast.error("Please enter a payment amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Please enter a valid payment amount.");
      return;
    }

    if (amount > maxPayable + 0.01) {
      toast.error(`Maximum payable amount is ₹${maxPayable.toFixed(2)}`);
      return;
    }

    try {
      setPaymentLoading(true);

      await settlePayment(groupId, toUserId, Number(amount.toFixed(2)));

      setConfirmed(true);

      toast.success("Settlement recorded successfully");

      setTimeout(() => {
        router.push(`/groups/${groupId}`);
      }, 1500);
    } catch (error: any) {
      console.error("Settlement payment failed:", error);

      toast.error(
        error?.message || "Failed to update settlement. Please try again.",
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!toUserId || !groupId) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-7 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <Wallet className="w-7 h-7 text-red-500" />
          </div>

          <h1 className="text-xl font-semibold text-gray-900 mt-5">
            Invalid Payment
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Receiver or group information is missing.
          </p>

          <button
            onClick={() => groupId && router.push(`/groups/${groupId}`)}
            className="mt-6 w-full rounded-xl bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  if (authLoading || pageLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-gray-500">
            Loading payment details...
          </p>
        </div>
      </main>
    );
  }

  if (confirmed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mt-5">
            Payment Recorded
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Your settlement has been successfully recorded.
          </p>

          <div className="mt-6 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
            <p className="text-xs text-green-700">Amount paid</p>

            <p className="text-xl font-semibold text-green-700 mt-1">
              ₹{Number(paymentAmount).toFixed(2)}
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-5">Redirecting to group...</p>
        </div>
      </main>
    );
  }

  const enteredAmount = Number(paymentAmount);

  const amountExceedsLimit =
    Number.isFinite(enteredAmount) && enteredAmount > maxPayable + 0.01;

  const invalidAmount =
    !paymentAmount ||
    !Number.isFinite(enteredAmount) ||
    enteredAmount <= 0 ||
    amountExceedsLimit;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-4 py-4 md:py-5">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push(`/groups/${groupId}`)}
          disabled={paymentLoading}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition mb-4 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Group
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 md:px-6 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Settlement
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-gray-950 mt-1">
                Complete your payment
              </h1>

              <p className="text-sm text-gray-500 mt-1.5 leading-5">
                Pay {receiver?.name || "the receiver"} using UPI and record the
                settlement in KharchaMate.
              </p>
            </div>

            <div className="p-5 md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <UserRound className="w-5 h-5 text-gray-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Paying to</p>

                  <p className="font-semibold text-gray-900 truncate">
                    {receiver?.name || "Receiver"}
                  </p>

                  {receiver?.email && (
                    <p className="text-xs text-gray-500 truncate">
                      {receiver.email}
                    </p>
                  )}

                  {receiver?.mobile && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      +91 {receiver.mobile}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 border border-gray-200 p-5">
                <p className="text-xs text-gray-500">Current amount you owe</p>

                <p className="text-3xl font-bold tracking-tight text-gray-950 mt-1">
                  ₹{maxPayable.toFixed(2)}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-900">
                  Payment information
                </p>

                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-gray-500">Amount</span>

                    <span className="text-sm font-semibold text-gray-900">
                      ₹{maxPayable.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-gray-500">Method</span>

                    <span className="text-sm font-medium text-gray-900">
                      UPI
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Safe settlement tracking
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-5">
                    KharchaMate does not process or hold your money. Your UPI
                    payment happens outside the app and KharchaMate records the
                    settlement.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 md:px-6 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment
              </p>

              <h2 className="text-xl font-semibold tracking-tight text-gray-950 mt-1">
                Review & pay
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Enter the amount and complete payment through UPI.
              </p>
            </div>

            <div className="p-5 md:p-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="paymentAmount"
                    className="text-sm font-medium text-gray-700"
                  >
                    Amount
                  </label>

                  <button
                    type="button"
                    onClick={handleMaxAmount}
                    disabled={paymentLoading}
                    className="text-xs font-semibold text-green-600 hover:text-green-700 disabled:opacity-50"
                  >
                    Use maximum
                  </button>
                </div>

                <div
                  className={`relative rounded-xl border transition ${
                    amountExceedsLimit
                      ? "border-red-300 bg-red-50/30"
                      : "border-gray-200 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100"
                  }`}
                >
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    id="paymentAmount"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={paymentAmount}
                    onChange={handleAmountChange}
                    disabled={paymentLoading}
                    placeholder="0.00"
                    className="w-full bg-transparent rounded-xl pl-11 pr-4 py-3.5 text-xl font-semibold text-gray-900 outline-none disabled:opacity-60"
                  />
                </div>

                <div className="flex justify-between mt-2">
                  <p
                    className={`text-xs ${
                      amountExceedsLimit ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {amountExceedsLimit
                      ? `Maximum allowed is ₹${maxPayable.toFixed(2)}`
                      : "You can make a partial payment."}
                  </p>

                  <p className="text-xs text-gray-400">
                    Max ₹{maxPayable.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Pay via UPI
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Scan the QR code to pay
                      </p>
                    </div>

                    <Wallet className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="px-4 py-3">
                  {qrImage ? (
                    <div className="text-center">
                      <div className="inline-flex p-2 rounded-xl border border-gray-200 bg-white">
                        <Image
                          src={qrImage}
                          alt="UPI QR Code"
                          width={140}
                          height={140}
                          className="w-[140px] h-[140px]"
                        />
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        Amount to pay
                      </p>

                      <p className="text-xl font-bold text-gray-900 mt-0.5">
                        ₹{Number(paymentAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  ) : receiver?.mobile ? (
                    <div className="py-5 text-center">
                      <div className="w-9 h-9 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                        <IndianRupee className="w-4 h-4 text-gray-500" />
                      </div>

                      <p className="text-sm font-medium text-gray-800 mt-2">
                        Enter a valid amount
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Your payment QR will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="py-5 text-center">
                      <div className="w-9 h-9 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-gray-500" />
                      </div>

                      <p className="text-sm font-medium text-gray-800 mt-2">
                        UPI QR unavailable
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        No mobile number is available for this receiver.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={paymentLoading || invalidAmount}
                className="w-full mt-4 rounded-xl bg-gray-950 text-white py-3.5 px-4 text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Recording Payment...
                  </span>
                ) : (
                  "I Have Completed the Payment"
                )}
              </button>

              <p className="text-[11px] leading-4 text-center text-gray-400 mt-2 px-3">
                Only confirm after you have completed the payment through your
                UPI app.
              </p>

              <button
                type="button"
                onClick={() => router.push(`/groups/${groupId}`)}
                disabled={paymentLoading}
                className="w-full mt-1.5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
