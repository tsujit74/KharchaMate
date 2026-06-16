import { Users } from "lucide-react";

type Props = {
  name: string;
  email: string;
};

export default function ProfileHeader({
  name,
  email,
}: Props) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border rounded-2xl p-6 flex items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
        <Users className="w-6 h-6 text-blue-600" />
      </div>

      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          {name}
        </h1>
        <p className="text-sm text-gray-500">
          {email}
        </p>
      </div>
    </div>
  );
}