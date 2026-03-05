"use client";

type Props = {
  status: string;
  setStatus: (value: string) => void;
};

export default function GroupStatusTabs({
  status,
  setStatus,
}: Props) {
  const tabs = [
    { key: "all", label: "All Groups" },
    { key: "active", label: "Active" },
    { key: "blocked", label: "Blocked" },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setStatus(tab.key)}
          className={`px-4 py-1.5 text-sm font-medium border transition
          ${
            status === tab.key
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}