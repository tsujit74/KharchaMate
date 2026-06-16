export type Group = {
  _id: string;
  name: string;
};

export type Settlement = {
  _id: string;
  group: {
    _id: string;
    name: string;
  };
  from: {
    _id: string;
    name: string;
  };
  to: {
    _id: string;
    name: string;
  };
  amount: number;
  status: string;
  settledAt?: string;
  createdAt: string;
};

export type PendingSettlementRaw = {
  _id: string;
  groupId: string;
  groupName: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
  createdAt?: string;
};

export type Item = {
  _id: string;
  description: string;
  amount: number;
  group: Group;
  from: {
    _id: string;
    name: string;
  };
  to: {
    _id: string;
    name: string;
  };
  createdAt: string;
  status?: string;
};