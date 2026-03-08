"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyTickets } from "@/app/services/ticket.service"
import TicketCard from "./components/TicketCard";
import CreateTicketModal from "./components/CreateTicketModal";

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
      console.error(err);

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
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Support Tickets</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          + Create Ticket
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 animate-pulse">
          Loading tickets...
        </p>
      )}

      {!loading && tickets.length === 0 && (
        <div className="text-gray-500 text-sm">
          No tickets yet. Create your first support ticket.
        </div>
      )}

      {!loading && tickets.length > 0 && (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}

      <CreateTicketModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refreshTickets={fetchTickets}
      />

    </div>
  );
}