export default function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white border rounded-xl p-5 flex gap-4 items-center">
      <Icon className="w-7 h-7 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}