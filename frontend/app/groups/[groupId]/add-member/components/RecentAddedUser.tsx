type User = {
  _id: string;
  name: string;
  email: string;
};

type Props = {
  users: User[];
  onSelect: (user: User) => void;
};

export default function RecentUsers({ users, onSelect }: Props) {
  if (!users.length) return null;

  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-2">Recent</p>

      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => onSelect(u)}
          className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
          {u.name}
        </div>
      ))}
    </div>
  );
}