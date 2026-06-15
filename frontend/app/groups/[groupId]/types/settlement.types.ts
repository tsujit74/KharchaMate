export type SettlementItem = {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
};

export type Balance = {
  id: string;
  name: string;
  email: string;
  balance: number;
};

export type Settlement = {
  group: string;
  totalSpent: number;
  yourShare: number;
  balances: Balance[];
  settlements: SettlementItem[];
};