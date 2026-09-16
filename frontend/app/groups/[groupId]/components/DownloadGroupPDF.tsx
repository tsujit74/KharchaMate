"use client";

import toast from "react-hot-toast";
import { Download } from "lucide-react";

import { downloadGroupSettlementPDF } from "@/app/services/group.service";

interface DownloadGroupPDFProps {
  groupId: string;
  groupName: string;
}

export default function DownloadGroupPDF({
  groupId,
  groupName,
}: DownloadGroupPDFProps) {
  const handleDownload = async () => {
    try {
      const blob = await downloadGroupSettlementPDF(groupId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `KharchaMate-${groupName
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") {
        toast.error("Please login again.");
        return;
      }

      if (error?.message === "FORBIDDEN") {
        toast.error("You don't have access to this group.");
        return;
      }

      if (error?.message === "GROUP_NOT_FOUND") {
        toast.error("Group not found.");
        return;
      }

      toast.error("Failed to download PDF.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
    >
      <Download size={16} />
      Download Report
    </button>
  );
}
