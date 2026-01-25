import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

export const getGroupSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate(
      "members",
      "name email"
    );

    if (!group)
      return res.status(404).json({ message: "Group not found" });

    const expenses = await Expense.find({ group: groupId });

    const members = group.members;
    const memberCount = members.length;

    if (memberCount === 0) {
      return res.json({ message: "No members in group" });
    }

    //  Total spent
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    //  Per person share
    const perPersonShare = totalSpent / memberCount;

    //  Track how much each member paid
    const paidMap = {};
    members.forEach((m) => {
      paidMap[m._id.toString()] = 0;
    });

    expenses.forEach((expense) => {
      const payerId = expense.paidBy.toString();
      paidMap[payerId] += expense.amount;
    });

    //  Net balance (paid - share)
    const balanceMap = {};
    members.forEach((m) => {
      const userId = m._id.toString();
      balanceMap[userId] = paidMap[userId] - perPersonShare;
    });

    // Settlement calculation
    const creditors = [];
    const debtors = [];

    members.forEach((m) => {
      const balance = balanceMap[m._id.toString()];
      if (balance > 0) {
        creditors.push({ user: m, amount: balance });
      } else if (balance < 0) {
        debtors.push({ user: m, amount: -balance });
      }
    });

    const settlements = [];

    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const settleAmount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.user.name,
        to: creditor.user.name,
        amount: Math.round(settleAmount),
      });

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (debtor.amount === 0) i++;
      if (creditor.amount === 0) j++;
    }

    //  Response
    res.json({
      group: group.name,
      totalSpent,
      perPersonShare,
      balances: members.map((m) => ({
        name: m.name,
        email: m.email,
        balance: Math.round(balanceMap[m._id.toString()]),
      })),
      settlements,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate settlement" });
  }
};
