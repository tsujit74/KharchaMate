"use client";

import { useEffect, useState } from "react";
import { getAllTicketsAdmin } from "@/app/services/ticket.service";
import { toast } from "react-hot-toast";
import TicketTable from "@/app/admin/support/components/TicketTable";
import DashboardHeader from "../components/DashobardHeader";
import RefreshButton from "../components/RefreshButton";

interface Ticket {
  _id: string;
  subject: string;
  description: string;
  priority: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;

  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const res = await getAllTicketsAdmin();
      setTickets(res.tickets || []);
    } catch (error: any) {
      toast.error(error.message.replaceAll("_", " "));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading tickets...</div>;
  }

  return (
    <div className="p-1 md:p-2 bg-gray-50 min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Support Ticket"
          subtitle="Manage platform Ticket"
        />

        <RefreshButton onRefresh={fetchTickets} loading={loading} />
      </div>

      <TicketTable tickets={tickets} />
    </div>
  );
}
