"use client";

import { useEffect, useState } from "react";
import { getMonthlySummary } from "@/app/services/expense.service";

const SummaryCard = ({ label, value, color }: any) => {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${color}`}>₹{value}</p>
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
      <button onClick={() => onChange(-1)} className="px-3 py-1 border rounded">
        ←
      </button>

      <p className="font-medium">
        {new Date(year, month - 1).toLocaleString("default", {
          month: "long",
        })}{" "}
        {year}
      </p>

      <button onClick={() => onChange(1)} className="px-3 py-1 border rounded">
        →
      </button>
    </div>
  );
};

const MonthlySummary = ({ data }: any) => {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <SummaryCard
        label="Paid by you"
        value={data.paidByYou}
        color="text-blue-600"
      />
      <SummaryCard
        label="Your actual expense"
        value={data.yourExpense}
        color="text-gray-900"
      />
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
    getMonthlySummary({
      month,
      year,
    }).then((data) => {
      setSummary(data);
    });
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

  if (!summary) return null;

  return (
    <section>
      <MonthSelector month={month} year={year} onChange={changeMonth} />
      <MonthlySummary data={summary} />
    </section>
  );
}
