"use client";

import { useEffect, useState } from "react";
import { getMonthlySummary } from "@/app/services/expense.service";
import { getMyNetBalance } from "@/app/services/settlement.service";

const SummaryCard = ({ label, value, color }: any) => {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${color} transition-colors duration-300`}>
        ₹{value}
      </p>
    </div>
  );
};

const MonthSelector = ({
  month,
  year,
  onChange,
}: {
  month: number;
  year: number;
  onChange: (dir: number) => void;
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => onChange(-1)}
        className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100 shadow-sm transition-all duration-200"
      >
        ←
      </button>

      <p className="font-medium text-gray-700">
        {new Date(year, month - 1).toLocaleString("default", { month: "long" })}{" "}
        {year}
      </p>

      <button
        onClick={() => onChange(1)}
        className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100 shadow-sm transition-all duration-200"
      >
        →
      </button>
    </div>
  );
};


const MonthlySummary = ({ data }: any) => {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <SummaryCard label="Paid by you" value={data.paidByYou} color="text-blue-600" />
      <SummaryCard label="Your actual expense" value={data.yourExpense} color="text-gray-900" />
      <SummaryCard
        label="Net balance"
        value={data.netBalance}
        color={data.netBalance >= 0 ? "text-green-600" : "text-red-500"}
      />
    </div>
  );
};

export default function MonthlyExpenseSummary() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const monthly = await getMonthlySummary({ month, year });
      const net = await getMyNetBalance();

      setSummary({
        ...monthly,
        netBalance: net.netBalance,
      });
    };

    fetchData();
  }, [month, year]);

  const changeMonth = (dir: number) => {
    let m = month + dir;
    let y = year;

    if (m === 0) {
      m = 12;
      y--;
    }
    if (m === 13) {
      m = 1;
      y++;
    }

    setMonth(m);
    setYear(y);
  };

  if (!summary) return <p className="text-gray-400 text-center">Loading summary...</p>;

  return (
    <section className="bg-gray-50 p-4 rounded-2xl shadow-sm">
      <MonthSelector month={month} year={year} onChange={changeMonth} />
      <MonthlySummary data={summary} />
    </section>
  );
}
