import { Users, IndianRupee } from "lucide-react";
import Stat from "./groupkpi/Stat";

export default function GroupKPIs({
  totalSpent,
  yourShare,
  members,
}: {
  totalSpent: number;
  yourShare: number;
  members: number;
}) {
  return (
    <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-4 mb-8">
      <Stat icon={IndianRupee} label="Total Spent" value={`₹${totalSpent}`} />
      <Stat icon={Users} label="Your Share" value={`₹${yourShare}`} />
      <Stat icon={Users} label="Members" value={members} />
    </div>
  );
}