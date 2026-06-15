export type GroupMember = {
  id: string;
  name: string;
  email: string;
  balance: number;
  role?: "ADMIN" | "MEMBER";
};

export type Group = {
  _id: string;
  name: string;
  subtitle?: string;
  isActive: boolean;

  members: GroupMember[];
};