"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { getActiveAnnouncements } from "@/app/services/announcement.service";

type Announcement = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getActiveAnnouncements();
        setAnnouncements(data);
        setHasNew(data.length > 0);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    setHasNew(false);
  };

  if (announcements.length === 0) return null;

  return (
    <div ref={panelRef} className="fixed top-22 right-25 sm:right-6 z-50">
      <button
        onClick={handleOpen}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700"
        aria-label="Open announcements"
      >
        <Bell size={20} />
        {hasNew && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Bell size={16} />
              Announcements
            </p>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 transition hover:bg-indigo-500"
              aria-label="Close announcements"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {announcements.map((a) => (
              <div
                key={a._id}
                className="border-b border-slate-100 px-4 py-3 text-sm transition hover:bg-slate-50 last:border-b-0"
              >
                <p className="font-semibold text-slate-800">{a.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {a.message}
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}