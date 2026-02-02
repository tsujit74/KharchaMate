import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Settlement from "../models/Settlement.js";
import { validatePayment } from "../service/settlementService.js";

export const getGroupSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate(
      "members",
      "name email",
    );
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const members = group.members;
    if (!members.length) {
      return res.json({ message: "No members in group" });
    }

    const expenses = await Expense.find({ group: groupId });
    const settlementsDone = await Settlement.find({
      group: groupId,
      status: "COMPLETED",
    });

    // Initialize balances
    const balanceMap = {};
    members.forEach((m) => {
      balanceMap[m._id.toString()] = 0;
    });

    // Add expense payments
    expenses.forEach((expense) => {
      balanceMap[expense.paidBy.toString()] += expense.amount;
    });

    // Subtract equal share
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const perPersonShare = totalSpent / members.length;

    members.forEach((m) => {
      balanceMap[m._id.toString()] -= perPersonShare;
    });

    // Apply previous settlements
    settlementsDone.forEach((s) => {
      balanceMap[s.from.toString()] += s.amount;
      balanceMap[s.to.toString()] -= s.amount;
    });

    // Prepare creditors & debtors
    const creditors = [];
    const debtors = [];

    members.forEach((m) => {
      const bal = Number(balanceMap[m._id.toString()].toFixed(2));
      if (bal > 0.01) creditors.push({ user: m, amount: bal });
      else if (bal < -0.01) debtors.push({ user: m, amount: -bal });
    });

    // Final settlement calculation
    const settlements = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.user._id,
        fromName: debtor.user.name,
        to: creditor.user._id,
        toName: creditor.user.name,
        amount: Number(amount.toFixed(2)),
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount <= 0.01) i++;
      if (creditor.amount <= 0.01) j++;
    }

    res.json({
      group: group.name,
      totalSpent: Number(totalSpent.toFixed(2)),
      perPersonShare: Number(perPersonShare.toFixed(2)),
      balances: members.map((m) => ({
        id: m._id,
        name: m.name,
        email: m.email,
        balance: Number(balanceMap[m._id.toString()].toFixed(2)),
      })),
      settlements,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate settlement" });
  }
};

export const markPaymentDone = async (req, res) => {
  try {
    const from = req.user.id;
    const { to, amount } = req.body;
    const groupId = req.group._id;

    await validatePayment({
      groupId,
      from,
      to,
      amount: Number(amount),
    });

    const settlement = await Settlement.create({
      group: groupId,
      from,
      to,
      amount: Number(amount.toFixed ? amount.toFixed(2) : amount),
      status: "COMPLETED",
      settledAt: new Date(),
    });

    res.status(201).json({
      message: "Payment recorded successfully",
      settlement,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const getPendingSettlements = async (req, res) => {
  try {
    const userId = req.user.id;

    //  Fetch all groups where user is a member
    const groups = await Group.find({ members: userId }).populate(
      "members",
      "name email"
    );

    const result = [];

    //  Loop through groups
    for (const group of groups) {
      const members = group.members;

      // Skip groups without members
      if (!members.length) continue;

      // Fetch all expenses in this group
      const expenses = await Expense.find({ group: group._id });

      // Fetch completed settlements
      const settlementsDone = await Settlement.find({
        group: group._id,
        status: "COMPLETED",
      });

      // Initialize balances
      const balanceMap = {};
      members.forEach((m) => {
        balanceMap[m._id.toString()] = 0;
      });

      // Add paid amounts
      expenses.forEach((e) => {
        balanceMap[e.paidBy.toString()] += e.amount;
      });

      // Subtract equal share
      const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
      const perPersonShare = totalSpent / members.length;
      members.forEach((m) => {
        balanceMap[m._id.toString()] -= perPersonShare;
      });

      
      settlementsDone.forEach((s) => {
        balanceMap[s.from.toString()] += s.amount;
        balanceMap[s.to.toString()] -= s.amount;
      });

      const creditors = [];
      const debtors = [];

      members.forEach((m) => {
        const bal = Number(balanceMap[m._id.toString()].toFixed(2));
        if (bal > 0.01) creditors.push({ user: m, amount: bal });
        else if (bal < -0.01) debtors.push({ user: m, amount: -bal });
      });

    
      let i = 0,
        j = 0;
      const settlements = [];

      while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amount = Math.min(debtor.amount, creditor.amount);

        settlements.push({
          groupId: group._id,
          groupName: group.name,
          from: debtor.user._id,
          fromName: debtor.user.name,
          to: creditor.user._id,
          toName: creditor.user.name,
          amount: Number(amount.toFixed(2)),
        });

        debtor.amount -= amount;
        creditor.amount -= amount;

        if (debtor.amount <= 0.01) i++;
        if (creditor.amount <= 0.01) j++;
      }

      //Filter only settlements related to current user
      settlements
        .filter((s) => s.from.toString() === userId || s.to.toString() === userId)
        .forEach((s) => result.push(s));
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending settlements" });
  }
};

export const getMySettlementHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const settlements = await Settlement.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("from", "name email")    
      .populate("to", "name email")      
      .populate("group", "name")         
      .sort({ createdAt: -1 });          

    res.json(settlements);
  } catch (err) {
    console.error("Error fetching settlement history:", err);
    res.status(500).json({ message: "Failed to fetch settlement history" });
  }
};