"use client";

import { ArrowLeft, CheckCircle2, Clock3, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/app/context/authContext";
import {
  confirmSettlement,
  getSettlementRequests,
} from "@/app/services/settlement.service";

type UserInfo = {
  _id: string;
  name: string;
  email?: string;
  mobile?: string;
};

type GroupInfo = {
  _id: string;
  name: string;
};

type SettlementRequest = {
  _id: string;
  from: UserInfo;
  to: UserInfo;
  group: GroupInfo;
  amount: number;
  status: "INITIATED" | "COMPLETED" | "CANCELLED" | "PENDING";
  createdAt: string;
};

function initials(name?: string) {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (first + last).toUpperCase();
}

const AVATAR_TONES = [
  "bg-blue-50 text-blue-600",
  "bg-violet-50 text-violet-600",
  "bg-teal-50 text-teal-600",
  "bg-amber-50 text-amber-700",
  "bg-rose-50 text-rose-600",
  "bg-indigo-50 text-indigo-600",
  "bg-emerald-50 text-emerald-600",
  "bg-slate-100 text-slate-600",
];

function avatarTone(name?: string) {
  if (!name) {
    return AVATAR_TONES[AVATAR_TONES.length - 1];
  }

  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }

  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

export default function SettlementRequestsPage() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [pendingRequests, setPendingRequests] = useState<SettlementRequest[]>(
    [],
  );

  const [confirmedPayments, setConfirmedPayments] = useState<
    SettlementRequest[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;

    const fetchRequests = async () => {
      try {
        setLoading(true);

        const data = await getSettlementRequests();

        if (!cancelled) {
          setPendingRequests(data.pending);
          setConfirmedPayments(data.confirmed);
        }
      } catch (error: any) {
        if (cancelled) return;

        console.error("Failed to load settlement requests:", error);

        toast.error(
          error?.message ||
            "Unable to load payment requests. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const handleConfirm = async (settlementId: string) => {
    if (confirmingId) return;

    const confirmedRequest = pendingRequests.find(
      (request) => request._id === settlementId,
    );

    if (!confirmedRequest) return;

    try {
      setConfirmingId(settlementId);

      await confirmSettlement(settlementId);

      setPendingRequests((currentRequests) =>
        currentRequests.filter((request) => request._id !== settlementId),
      );

      setConfirmedPayments((current) => [
        {
          ...confirmedRequest,
          status: "COMPLETED",
        },
        ...current,
      ]);

      toast.success("Payment confirmed successfully.");
    } catch (error: any) {
      console.error("Failed to confirm settlement:", error);

      toast.error(
        error?.message || "Failed to confirm payment. Please try again.",
      );
    } finally {
      setConfirmingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-400">Loading payments...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:py-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Payments
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Review payments you&apos;ve received and confirm pending payments.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {pendingRequests.length > 0 && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1 tabular-nums">
                {pendingRequests.length} pending
              </span>
            )}

            {confirmedPayments.length > 0 && (
              <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-1 tabular-nums">
                {confirmedPayments.length} confirmed
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900">
                  Pending confirmation
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Payments waiting for your confirmation
                </p>
              </div>

              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
                {pendingRequests.length}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {pendingRequests.length === 0 ? (
                <div className="p-5 text-center">
                  <p className="text-sm text-slate-400">Nothing pending</p>
                </div>
              ) : (
                pendingRequests.map((request) => {
                  const isConfirming = confirmingId === request._id;

                  return (
                    <div
                      key={request._id}
                      className="px-4 py-3 flex items-center gap-3"
                    >
                      <div
                        className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-[11px] font-semibold ${avatarTone(
                          request.from?.name,
                        )}`}
                      >
                        {initials(request.from?.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {request.from?.name || "Someone"}
                          </span>

                          <span className="text-xs text-slate-400 shrink-0">
                            •
                          </span>

                          <span className="text-xs text-slate-400 truncate">
                            {request.group?.name || "Group"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0 font-semibold text-sm text-slate-900">
                        <IndianRupee className="w-3 h-3" />
                        {Number(request.amount || 0).toFixed(2)}
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-xs text-amber-700 shrink-0">
                        <Clock3 className="w-3.5 h-3.5" />
                        Pending
                      </div>

                      <button
                        type="button"
                        onClick={() => handleConfirm(request._id)}
                        disabled={isConfirming || confirmingId !== null}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isConfirming ? (
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}

                        <span className="hidden sm:inline">
                          {isConfirming ? "Confirming" : "Confirm"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/groups/${request.group?._id}`)
                        }
                        disabled={isConfirming}
                        className="hidden sm:block shrink-0 rounded-md border border-slate-200 text-slate-600 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
                      >
                        View
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900">
                  Confirmed payments
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  Payments you&apos;ve already confirmed
                </p>
              </div>

              <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
                {confirmedPayments.length}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {confirmedPayments.length === 0 ? (
                <div className="p-5 text-center">
                  <p className="text-sm text-slate-400">
                    No confirmed payments
                  </p>
                </div>
              ) : (
                confirmedPayments.map((payment) => (
                  <div
                    key={payment._id}
                    className="px-4 py-3 flex items-center gap-3"
                  >
                    <div
                      className={`h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-[11px] font-semibold ${avatarTone(
                        payment.from?.name,
                      )}`}
                    >
                      {initials(payment.from?.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {payment.from?.name || "Someone"}
                        </span>

                        <span className="text-xs text-slate-400 shrink-0">
                          •
                        </span>

                        <span className="text-xs text-slate-400 truncate">
                          {payment.group?.name || "Group"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0 font-semibold text-sm text-slate-900">
                      <IndianRupee className="w-3 h-3" />
                      {Number(payment.amount || 0).toFixed(2)}
                    </div>

                    <div className="hidden sm:flex items-center gap-1 text-xs text-green-700 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirmed
                    </div>

                    <span className="hidden md:block text-[11px] text-slate-400 shrink-0">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : ""}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/groups/${payment.group?._id}`)
                      }
                      className="hidden sm:block shrink-0 rounded-md border border-slate-200 text-slate-600 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                    >
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
