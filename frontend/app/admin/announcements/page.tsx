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

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const data = await getAllAnnouncementsAdmin();

      setAnnouncements(data);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // CREATE
  const handleCreate = async (title: string, message: string) => {
    try {
      const newAnnouncement = await createAnnouncementAdmin({
        title,
        message,
      });

      setAnnouncements((prev) => [newAnnouncement, ...prev]);

      toast.success("Announcement created");
    } catch {
      toast.error("Failed to create announcement");
    }
  };

  // TOGGLE ACTIVE
  const handleToggle = async (id: string) => {
    try {
      setActionLoading(id);

      setAnnouncements((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, isActive: !a.isActive } : a
        )
      );

      await toggleAnnouncementAdmin(id);
    } catch {
      fetchAnnouncements();
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      setActionLoading(id);

      await deleteAnnouncementAdmin(id);

      setAnnouncements((prev) =>
        prev.filter((a) => a._id !== id)
      );

      toast.success("Announcement deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading announcements...
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-screen space-y-6">

      <DashboardHeader
        title="Announcements"
        subtitle="Broadcast platform updates to all users"
      />

      <div className="flex justify-end">
        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-gray-800 transition"
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
  );
}