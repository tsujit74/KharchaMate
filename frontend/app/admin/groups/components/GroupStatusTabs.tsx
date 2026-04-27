"use client";

type Props = {
  status: string;
  setStatus: (value: string) => void;
};

const tabs = [
  { key: "all", label: "All Groups" },
  { key: "active", label: "Active" },
  { key: "blocked", label: "Blocked" },
];

export default function GroupStatusTabs({ status, setStatus }: Props) {
  return (
    <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setStatus(tab.key)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            status === tab.key
              ? "bg-slate-950 text-white shadow-sm"
              : "bg-transparent text-slate-600 hover:bg-slate-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}