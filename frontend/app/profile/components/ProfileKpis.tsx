import { Users, Clock, Repeat } from "lucide-react";

type Props = {
  groupsCount: number;
  pendingCount: number;
  historyCount: number;
};

export default function ProfileKpis({
  groupsCount,
  pendingCount,
  historyCount,
}: Props) {
  const kpis = [
    {
      label: "Total Groups",
      value: groupsCount,
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-500",
    },
    {
      label: "Pending Settlements",
      value: pendingCount,
      icon: Clock,
      bg: "bg-red-50",
      color: "text-red-500",
    },
    {
      label: "Payment History",
      value: historyCount,
      icon: Repeat,
      bg: "bg-purple-50",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-4 mb-8">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-white border rounded-2xl p-5 flex items-center gap-4"
        >
          <div className={`p-3 rounded-xl ${kpi.bg}`}>
            <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              {kpi.label}
            </p>

            <p className="text-xl font-semibold text-gray-900">
              {kpi.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}