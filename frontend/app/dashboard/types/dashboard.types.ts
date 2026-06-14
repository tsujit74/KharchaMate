export type Member = {
  _id: string;
  name: string;
  email: string;
};

export type Group = {
  expenseCount: number;
  totalExpenses: number;
  _id: string;
  name: string;
  createdBy: string;
  admins: string[];
  members: Member[];
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  isBlocked?: boolean;
};

export type RecentExpense = {
  _id: string;
  description: string;
  amount: number;
  createdAt: string;
  group: {
    _id: string;
    name: string;
  };
  paidBy: {
    _id: string;
    name: string;
  };
};

export type PendingSettlement = {
  groupId: string;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  amount: number;
};