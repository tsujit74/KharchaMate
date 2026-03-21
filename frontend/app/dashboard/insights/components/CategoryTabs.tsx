"use client";

type Props = {
  selected: string;
  onChange: (category: string) => void;
};

const CATEGORIES = [
  "ALL",
  "FOOD",
  "TRAVEL",
  "RENT",
  "SHOPPING",
  "RECHARGE",
  "OTHER",
];

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: "#22C55E",
  TRAVEL: "#3B82F6",
  RENT: "#F59E0B",
  SHOPPING: "#EC4899",
  RECHARGE: "#6366F1",
  OTHER: "#6B7280",
};

export default function CategoryTabs({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat;

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border transition whitespace-nowrap
              ${
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            {/* Color Dot */}
            {cat !== "ALL" && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
            )}

            {cat}
          </button>
        );
      })}
    </div>
  );
}