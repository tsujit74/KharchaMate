export type ExpenseSplit = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
};

export type Expense = {
  _id: string;
  group: string;

  description: string;
  amount: number;
  category: string;

  paidBy: {
    _id: string;
    name: string;
    email: string;
  };

  splitBetween: ExpenseSplit[];

  createdAt: string;
  updatedAt: string;
};