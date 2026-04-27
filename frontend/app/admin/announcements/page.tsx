"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardHeader from "../components/DashobardHeader";
import AnnouncementTable from "./components/AnnouncementTable";
import CreateAnnouncementModal from "./components/CreateAnnouncementModal";
import {
  getAllAnnouncementsAdmin,
  createAnnouncementAdmin,
  toggleAnnouncementAdmin,
  deleteAnnouncementAdmin,
} from "@/app/services/admin.service";
import RefreshButton from "../components/RefreshButton";

type Announcement = {
  _id: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAllAnnouncementsAdmin();
      setAnnouncements(data || []);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAnnouncements();
      toast.success("Refreshed");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreate = async (title: string, message: string) => {
    try {
      const newAnnouncement = await createAnnouncementAdmin({
        title,
        message,
      });

      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      toast.success("Announcement created");
      setOpenModal(false);
    } catch {
      toast.error("Failed to create announcement");
    }
  };

  const handleToggle = async (id: string) => {
    const prev = announcements;

    try {
      setActionLoading(id);
      setAnnouncements((current) =>
        current.map((a) => (a._id === id ? { ...a, isActive: !a.isActive } : a))
      );
      await toggleAnnouncementAdmin(id);
    } catch {
      setAnnouncements(prev);
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    const prev = announcements;

    try {
      setActionLoading(id);
      setAnnouncements((current) => current.filter((a) => a._id !== id));
      await deleteAnnouncementAdmin(id);
      toast.success("Announcement deleted");
    } catch {
      setAnnouncements(prev);
      toast.error("Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <DashboardHeader
            title="Announcements"
            subtitle="Broadcast platform updates to all users"
          />
          <RefreshButton onRefresh={handleRefresh} loading={refreshing} />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Create Announcement
          </button>
        </div>

        <AnnouncementTable
          announcements={announcements}
          actionLoading={actionLoading}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
        />

        <CreateAnnouncementModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}