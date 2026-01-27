import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Settlement from "../models/Settlement.js";

export const validatePayment = async ({ groupId, from, to, amount }) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error("Group not found");
  }

  if (!group.members.includes(from) || !group.members.includes(to)) {
    throw new Error("Both users must be group members");
  }

  // Fetch data
  const expenses = await Expense.find({ group: groupId });
  const settlements = await Settlement.find({
    group: groupId,
    status: "COMPLETED",
  });

  // Init balance map
  const balanceMap = {};
  group.members.forEach(id => {
    balanceMap[id.toString()] = 0;
  });

  // Add expenses
  expenses.forEach(e => {
    balanceMap[e.paidBy.toString()] += e.amount;
  });

  // Subtract share
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const perPersonShare = totalSpent / group.members.length;

  group.members.forEach(id => {
    balanceMap[id.toString()] -= perPersonShare;
  });

  // Apply settlements
  settlements.forEach(s => {
    balanceMap[s.from.toString()] += s.amount;
    balanceMap[s.to.toString()] -= s.amount;
  });

  const payerBalance = Number(
    (balanceMap[from.toString()] ?? 0).toFixed(2)
  );

  const receiverBalance = Number(
    (balanceMap[to.toString()] ?? 0).toFixed(2)
  );

  // validations
  if (payerBalance >= -0.01) {
    throw new Error("You have already settled all dues");
  }

  if (receiverBalance <= 0.01) {
    throw new Error("Receiver is not owed any money");
  }

  const maxPayable = Math.min(
    Math.abs(payerBalance),
    receiverBalance
  );

  if (amount > maxPayable + 0.01) {
    throw new Error(
      `Payment exceeds pending amount. Max payable: ₹${maxPayable}`
    );
  }

  return true;
};
