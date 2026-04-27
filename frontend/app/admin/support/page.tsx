"use client";

import { useEffect, useMemo, useState } from "react";
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
  description?: string;
  priority: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}


export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllTicketsAdmin();
      setTickets(res.tickets || []);
    } catch (error: any) {
      toast.error(error?.message?.replaceAll("_", " ") || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchTickets();
      toast.success("Refreshed");
    } finally {
      setRefreshing(false);
    }
  };

  const filteredTickets = useMemo(() => {
    const q = search.toLowerCase().trim();

    return tickets.filter((t) => {
      const matchesFilter = filter === "ALL" ? true : t.status?.toUpperCase() === filter;
      const matchesSearch =
        !q ||
        t.subject?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.user?.name?.toLowerCase().includes(q) ||
        t.user?.email?.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [tickets, filter, search]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Loading tickets...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <DashboardHeader
            title="Support Ticket"
            subtitle="Manage platform tickets"
          />
          <RefreshButton onRefresh={handleRefresh} loading={refreshing} />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TicketFiltersTabs status={filter} setStatus={setFilter} />
          <TicketSearch search={search} setSearch={setSearch} />
        </div>

        <TicketTable tickets={filteredTickets} setTickets={setTickets} />

      </div>
    </div>
  );
}