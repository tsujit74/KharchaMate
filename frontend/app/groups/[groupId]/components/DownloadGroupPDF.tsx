"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Download, Loader2 } from "lucide-react";

import { downloadGroupSettlementPDF } from "@/app/services/group.service";

interface DownloadGroupPDFProps {
  groupId: string;
  groupName: string;
}

export default function DownloadGroupPDF({
  groupId,
  groupName,
}: DownloadGroupPDFProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    const confirmed = window.confirm(
      "Are you sure you want to download this group settlement report?",
    );

    if (!confirmed) return;

    setIsDownloading(true);

    try {
      const blob = await downloadGroupSettlementPDF(groupId);

      if (!blob || blob.size === 0) {
        throw new Error("EMPTY_FILE");
      }

      const safeGroupName =
        groupName
          .trim()
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-|-$/g, "") || "Group";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `KharchaMate-${safeGroupName}.pdf`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "";

      switch (message) {
        case "UNAUTHORIZED":
          toast.error("Please login again.");
          break;

        case "FORBIDDEN":
          toast.error("You don't have access to this group.");
          break;

        case "GROUP_NOT_FOUND":
          toast.error("Group not found.");
          break;

        case "EMPTY_FILE":
          toast.error("The report could not be generated.");
          break;

        default:
          toast.error("Failed to download PDF. Please try again.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      aria-busy={isDownloading}
      aria-label={
        isDownloading
          ? "Generating settlement report"
          : "Download settlement report"
      }
      className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDownloading ? (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          Generating...
        </>
      ) : (
        <>
          <Download size={16} aria-hidden="true" />
          Download Report
        </>
      )}
    </button>
  );
}
