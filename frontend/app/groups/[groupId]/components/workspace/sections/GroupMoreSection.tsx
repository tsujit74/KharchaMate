"use client";

import { Info, FileDown } from "lucide-react";
import DownloadGroupPDF from "../../DownloadGroupPDF";

type Props = {
  groupId: string;
  groupName: string;
  onInfoClick: () => void;
};

export default function GroupMoreSection({
  groupId,
  groupName,
  onInfoClick,
}: Props) {
  return (
    <section className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          More
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Additional tools and group options.
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={onInfoClick}
          className="flex items-start gap-4 rounded-xl border bg-white p-5 text-left transition hover:bg-slate-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <Info className="h-5 w-5 text-slate-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Group Info
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View group details and information.
            </p>
          </div>
        </button>

        <div className="flex items-start gap-4 rounded-xl border bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <FileDown className="h-5 w-5 text-slate-600" />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">
              Group Report
            </h2>

            <p className="mt-1 mb-4 text-sm text-slate-500">
              Download the current group financial report.
            </p>

            <DownloadGroupPDF
              groupId={groupId}
              groupName={groupName}
            />
          </div>
        </div>
      </div>
    </section>
  );
}