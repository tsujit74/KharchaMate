"use client"
import { useEffect, useState } from "react";

type Member = {
  _id: string;
  name: string;
  email: string;
};

type Group = {
  _id: string;
  name: string;
  createdBy: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
};

export default function DashboardPage() {
  const [items, setItems] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login first.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/groups/my-groups", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data: Group[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load groups. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p className="text-gray-500">Loading groups...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (items.length === 0) return <p className="text-gray-500">No groups found.</p>;

  return (
    <ul>
      {items.map((group) => (
        <li key={group._id} className="p-3 border rounded-md">
          <p className="font-bold">{group.name}</p>
          <p className="text-sm text-gray-500">Members:</p>
          <ul className="pl-5 list-disc">
            {group.members.map((member) => (
              <li key={member._id}>
                {member.name} ({member.email})
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
