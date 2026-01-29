import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; 

export const getMyGroups = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");

  const res = await axios.get(`${API_URL}/api/groups/my-groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createGroup = async (name: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");

  const res = await axios.post(
    `${API_URL}/api/groups`,
    { name },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};


