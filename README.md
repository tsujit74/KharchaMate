import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Settlement from "../models/Settlement.js";
import { validatePayment } from "../service/settlementService.js";

// Get settlement info for a group
export const getGroupSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    const expenses = await Expense.find({ group: groupId });
    const settlementsMade = await Settlement.find({ group: groupId });

    const members = group.members;
    const memberCount = members.length;
    if (memberCount === 0) return res.json({ message: "No members in group" });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const perPersonShare = totalSpent / memberCount;

    // How much each member paid
    const paidMap = {};
    members.forEach((m) => (paidMap[m._id.toString()] = 0));
    expenses.forEach((e) => (paidMap[e.paidBy.toString()] += e.amount));

    // Initial balances
    const balanceMap = {};
    members.forEach((m) => (balanceMap[m._id.toString()] = paidMap[m._id.toString()] - perPersonShare));

    // Apply previous settlements
    settlementsMade.forEach((s) => {
      balanceMap[s.from.toString()] -= s.amount;
      balanceMap[s.to.toString()] += s.amount;
    });

    // Prepare creditors & debtors
    const creditors = [];
    const debtors = [];
    members.forEach((m) => {
      const bal = balanceMap[m._id.toString()];
      if (bal > 0.01) creditors.push({ user: m, amount: bal });
      else if (bal < -0.01) debtors.push({ user: m, amount: -bal });
    });

    // Calculate settlements
    const settlements = [];
    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amt = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.user._id.toString(),
        to: creditor.user._id.toString(),
        amount: Math.round(amt),
      });

      debtor.amount -= amt;
      creditor.amount -= amt;
      if (debtor.amount <= 0.01) i++;
      if (creditor.amount <= 0.01) j++;
    }

    res.json({
      group: group.name,
      totalSpent,
      perPersonShare: Math.round(perPersonShare),
      balances: members.map((m) => ({
        id: m._id,
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

// Record a payment
export const markPaymentDone = async (req, res) => {
  try {
    const from = req.user.id;
    const { to, amount } = req.body;
    const groupId = req.group._id;

    console.log("FROM:", from);
    console.log("TO:", to);
    console.log("AMOUNT:", amount);

    await validatePayment({ groupId, from, to, amount });

    const settlement = await Settlement.create({
      group: groupId,
      from,
      to,
      amount,
      status: "COMPLETED",
    });

    res.status(201).json({
      message: "Payment recorded successfully",
      settlement,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
