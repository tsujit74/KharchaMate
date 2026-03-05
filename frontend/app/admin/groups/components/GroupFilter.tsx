"use client";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function GroupFilter({
  search,
  setSearch,
}: Props) {
  return (
    <input
      type="text"
      placeholder="Search groups..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black/20"
    />
  );
}