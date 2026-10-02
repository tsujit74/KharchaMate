import { Users, IndianRupee } from "lucide-react";
import Stat from "./groupkpi/Stat";

type Props = {
  totalSpent: number;
  yourShare: number;
  members: number;
};

function formatAmount(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function GroupKPIs({ totalSpent, yourShare, members }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Stat
        icon={IndianRupee}
        label="Total Spent"
        value={formatAmount(totalSpent)}
        description="Total group spending"
      />

      <Stat
        icon={IndianRupee}
        label="Your Share"
        value={formatAmount(yourShare)}
        description="Your portion of spending"
      />

      <Stat
        icon={Users}
        label="Members"
        value={members}
        description="People in this group"
      />
    </div>
  );
}