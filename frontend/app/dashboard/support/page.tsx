"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyTickets } from "@/app/services/ticket.service";
import TicketCard from "./components/TicketCard";
import CreateTicketModal from "./components/CreateTicketModal";
import { Plus, Ticket } from "lucide-react";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getMyTickets();

      if (!data || !Array.isArray(data.tickets)) {
        setTickets([]);
        toast.error("Invalid ticket data received");
        return;
      }

      setTickets(data.tickets);
    } catch (err: any) {
      const message =
        err?.message === "NETWORK_ERROR"
          ? "Network error. Please check your connection."
          : err?.message === "UNAUTHORIZED"
          ? "Session expired. Please login again."
          : "Failed to load tickets";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Support
              </p>
              <h1 className="mt-1 flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                <Ticket className="h-6 w-6 text-blue-600" />
                Support Tickets
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                View and manage your help requests in one place.
              </p>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Create Ticket
            </button>
          </div>
        </section>

        {loading && (
          <div className="space-y-3">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200/80" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200/80" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200/80" />
          </div>
        )}

        {!loading && tickets.length === 0 && (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Ticket className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-950">No tickets yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create your first support ticket to get help from the team.
            </p>
            <button
              onClick={() => setOpenModal(true)}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Create Ticket
            </button>
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <section className="space-y-4">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </section>
        )}

        <CreateTicketModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          refreshTickets={fetchTickets}
        />
      </div>
    </main>
  );
}