"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getActiveAnnouncements();
        setAnnouncements(data);

        if (data.length > 0) {
          setHasNew(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    setHasNew(false);
  };

  if (announcements.length === 0) return null;

  return (
    <div className="fixed top-18 right-6 z-5">

      {/* BELL BUTTON */}

      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition"
      >
        <Bell size={20} />

        {hasNew && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* PANEL */}

      {open && (
        <div className="absolute top-14 right-0 w-80 bg-white border shadow-xl rounded-xl overflow-hidden animate-in fade-in zoom-in">

          {/* HEADER */}

          <div className="flex items-center justify-between p-3 bg-indigo-600 text-white">

            <p className="text-sm font-semibold flex items-center gap-2">
              <Bell size={16} />
              Announcements
            </p>

            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-indigo-500 transition"
            >
              <X size={16} />
            </button>

          </div>

          {/* CONTENT */}

          <div className="max-h-64 overflow-y-auto">

            {announcements.map((a) => (
              <div
                key={a._id}
                className="p-3 border-b text-sm hover:bg-gray-50 transition"
              >

                <p className="font-semibold text-gray-800">
                  {a.title}
                </p>

                <p className="text-gray-600 text-xs mt-1">
                  {a.message}
                </p>

                <p className="text-[10px] text-gray-400 mt-1">
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