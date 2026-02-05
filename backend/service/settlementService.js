import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Settlement from "../models/Settlement.js";

export const validatePayment = async ({ groupId, from, to, amount }) => {
  if (amount <= 0) throw new Error("Invalid amount");

  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");

  const expenses = await Expense.find({ group: groupId });
  const settlements = await Settlement.find({
    group: groupId,
    status: "COMPLETED",
  });

  const balanceMap = {};
  group.members.forEach((id) => {
    balanceMap[id.toString()] = 0;
  });

  // apply expenses
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

  // apply settlements
  settlements.forEach((s) => {
    balanceMap[s.from.toString()] += s.amount;
    balanceMap[s.to.toString()] -= s.amount;
  });

  const payerBal = Number(balanceMap[from].toFixed(2));
  const receiverBal = Number(balanceMap[to].toFixed(2));

  if (payerBal >= -0.01) throw new Error("Nothing to pay");
  if (receiverBal <= 0.01) throw new Error("Receiver not owed");

  const maxPayable = Math.min(Math.abs(payerBal), receiverBal);
  if (amount > maxPayable + 0.01) {
    throw new Error(`Max payable ₹${maxPayable}`);
  }

  return true;
};
