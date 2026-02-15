"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { sendReminder, checkReminder } from "@/app/services/reminder.service";
import { getGroupById } from "@/app/services/group.service";
import toast from "react-hot-toast";

type Member = {
  _id: string;
  name: string;
  email: string;
  mobile?: string | null;
};

export default function ReminderButton({
  groupId,
  toUserId,
  amount,
  toUserName,
  groupName,
}: {
  groupId: string;
  toUserId: string;
  amount: number;
  toUserName?: string;
  groupName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [toUserPhone, setToUserPhone] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  // ✅ Check reminder already sent
  useEffect(() => {
    checkReminder({ groupId, toUserId, amount })
      .then((res) => res.sent && setSent(true))
      .catch(() => {});
  }, [groupId, toUserId, amount]);

  // ✅ Fetch group → find member → get mobile
  useEffect(() => {
    const loadPhone = async () => {
      try {
        const group = await getGroupById(groupId);

        const member: Member | undefined = group.members.find(
          (m: Member) => m._id === toUserId,
        );

        setToUserPhone(member?.mobile ?? null);
      } catch {
        setToUserPhone(null);
      }
    };

    loadPhone();
  }, [groupId, toUserId]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInAppReminder = async () => {
    try {
      setLoading(true);
      await sendReminder({ groupId, toUserId, amount });
      setSent(true);
      setOpen(false);
      toast.success("Reminder sent successfully");
    } catch (err: any) {
      if (err.message === "REMINDER_COOLDOWN") {
        toast.error("Reminder already sent. Try later.");
      } else if (err.message === "INVALID_REMINDER") {
        toast.error("No pending payment.");
      } else {
        toast.error("Failed to send reminder.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppReminder = () => {
    if (!toUserPhone) {
      toast.error("This user has not added a mobile number");
      return;
    }

    const msg = `Hi ${toUserName ?? ""}, just a reminder to pay ₹${amount}${
      groupName ? ` for "${groupName}"` : ""
    }.`;

    const url = `https://wa.me/91${toUserPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setOpen(false);
  };

  // Final state
  if (sent) {
    return (
      <span className="ml-2 text-green-600 text-sm flex items-center gap-1">
        ✔ Reminder sent
      </span>
    );
  }

  return (
    <div ref={ref} className="relative inline-block ml-2">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-yellow-500 text-white"
      >
        Remind
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-20">
          <button
            onClick={handleInAppReminder}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <span>🔔</span>
            <span>In-app reminder</span>
          </button>

          <button
            onClick={handleWhatsAppReminder}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <WhatsAppIcon />
            <span>WhatsApp</span>
          </button>
        </div>
      )}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="w-4 h-4"
      fill="currentColor"
      style={{ color: "#25D366" }}
    >
      <path d="M16 2.9C8.8 2.9 2.9 8.8 2.9 16c0 2.6.8 5.1 2.2 7.2L3 29l5.9-2c2 1.2 4.3 1.8 6.6 1.8 7.2 0 13.1-5.9 13.1-13.1S23.2 2.9 16 2.9zm0 23.7c-2.1 0-4.1-.6-5.9-1.7l-.4-.2-3.5 1.2 1.1-3.4-.2-.4c-1.1-1.8-1.7-3.8-1.7-5.9 0-6.2 5-11.2 11.2-11.2s11.2 5 11.2 11.2S22.2 26.6 16 26.6zm6.2-8.5c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1s-.8.9-1 1.1-.4.2-.7.1c-.3-.1-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3s0-.5.1-.7.3-.4.4-.5.2-.3.3-.5.1-.3 0-.5-.7-1.8-.9-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3s-.9.9-.9 2.2.9 2.6 1 2.8 1.8 2.9 4.3 4c.6.3 1.1.5 1.4.6.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.3z" />
    </svg>
  );
}
