"use client";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  status: "all" | "active" | "blocked";
  setStatus: (value: "all" | "active" | "blocked") => void;
};

export default function UsersFilter({
  search,
  setSearch,
  status,
  setStatus,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border">

      <input
        type="text"
        placeholder="Search name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 text-sm w-full md:w-72"
      />

      <div className="flex gap-2">
        {["all", "active", "blocked"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatus(tab as any)}
            className={`px-4 py-2 text-sm font-medium transition
              ${
                status === tab
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}