import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Settlement from "../models/Settlement.js";

export const validatePayment = async ({
  groupId,
  from,
  to,
  amount,
  session,
}) => {
  if (amount <= 0) {
    throw new Error("Invalid amount");
  }

  const group = await Group.findById(groupId).session(session);

  if (!group) {
    throw new Error("Group not found");
  }

  // Check payer is a group member
  if (!group.members.some((id) => id.toString() === from.toString())) {
    throw new Error("Payer is not a member of this group");
  }

  // Check receiver is a group member
  if (!group.members.some((id) => id.toString() === to.toString())) {
    throw new Error("Receiver is not a member of this group");
  }

  // Prevent self-payment
  if (from.toString() === to.toString()) {
    throw new Error("Cannot pay yourself");
  }

  const expenses = await Expense.find({
    group: groupId,
  }).session(session);

  const settlements = await Settlement.find({
    group: groupId,
    status: "COMPLETED",
  }).session(session);

  const initiatedPayments = await Settlement.find({
    group: groupId,
    from,
    to,
    status: "INITIATED",
  }).session(session);

  const pendingAmount = initiatedPayments.reduce(
    (total, settlement) => total + settlement.amount,
    0,
  );

  const balanceMap = {};

  group.members.forEach((id) => {
    balanceMap[id.toString()] = 0;
  });

  // Apply expenses
  expenses.forEach((exp) => {
    balanceMap[exp.paidBy.toString()] += exp.amount;

    if (exp.splitBetween?.length) {
      exp.splitBetween.forEach((s) => {
        balanceMap[s.user.toString()] -= s.amount;
      });
    } else {
      const share = exp.amount / group.members.length;

      group.members.forEach((id) => {
        balanceMap[id.toString()] -= share;
      });
    }
  });

  // Apply completed settlements
  settlements.forEach((s) => {
    balanceMap[s.from.toString()] += s.amount;
    balanceMap[s.to.toString()] -= s.amount;
  });

  const payerBal = Number(balanceMap[from.toString()].toFixed(2));

  const receiverBal = Number(balanceMap[to.toString()].toFixed(2));

  if (payerBal >= -0.01) {
    throw new Error("Nothing to pay");
  }

  if (receiverBal <= 0.01) {
    throw new Error("Receiver not owed");
  }

  const maxPayable = Math.min(Math.abs(payerBal), receiverBal);

  const availableToPay = Number((maxPayable - pendingAmount).toFixed(2));

  if (availableToPay <= 0) {
    throw new Error("Payment already pending confirmation");
  }

  if (amount > availableToPay + 0.01) {
    throw new Error(`Max payable ₹${availableToPay}`);
  }

  return true;
};
