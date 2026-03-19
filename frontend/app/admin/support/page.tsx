"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllTicketsAdmin } from "@/app/services/ticket.service";
import { toast } from "react-hot-toast";
import TicketTable from "@/app/admin/support/components/TicketTable";
import DashboardHeader from "../components/DashobardHeader";
import RefreshButton from "../components/RefreshButton";

import TicketFiltersTabs from "./components/TicketFilterTabs";
import TicketSearch from "./components/TicketSearch";

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

  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

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

  //Filter + Search
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesFilter =
        filter === "ALL"
          ? true
          : t.status?.toUpperCase() === filter;

      const matchesSearch =
        t.subject?.toLowerCase().includes(search.toLowerCase()) ||
        t.user?.name?.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tickets, filter, search]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading tickets...</div>;
  }

  return (
    <div className="p-1 md:p-2 bg-gray-50 min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Support Ticket"
          subtitle="Manage platform tickets"
        />
        <RefreshButton onRefresh={fetchTickets} loading={loading} />
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <TicketFiltersTabs status={filter} setStatus={setFilter} />
        <TicketSearch search={search} setSearch={setSearch} />
      </div>

      {/* Table */}
      <TicketTable tickets={filteredTickets} />
    </div>
  );
}