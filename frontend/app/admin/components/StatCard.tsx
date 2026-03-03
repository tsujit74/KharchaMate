"use client";

type StatCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm text-gray-500 font-medium">
          {title}
        </h3>

        <p className="text-2xl font-bold text-gray-800">
          {value}
        </p>

        {subtitle && (
          <p className="text-xs text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}