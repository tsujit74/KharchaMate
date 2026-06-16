type Props = {
  activeTab: string;
  onChange: (
    tab: "all" | "paid" | "pending" | "history"
  ) => void;
};

export default function ProfileTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-3">
      {["all", "paid", "pending", "history"].map(
        (tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab as any)}
            className={`px-3 py-2 text-sm rounded-lg ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        )
      )}
    </div>
  );
}