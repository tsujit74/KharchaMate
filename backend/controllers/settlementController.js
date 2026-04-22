import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Settlement from "../models/Settlement.js";
import { notifyUser } from "../service/notify.js";
import { validatePayment } from "../service/settlementService.js";

export const getGroupSettlement = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate(
      "members",
      "name email mobile",
    );
    if (!group) return res.status(404).json({ message: "Group not found" });

    const members = group.members;
    if (!members.length) return res.json({ message: "No members" });

    const expenses = await Expense.find({ group: groupId });
    const settlementsDone = await Settlement.find({
      group: groupId,
      status: "COMPLETED",
    });

    let yourShare = 0;

    expenses.forEach((expense) => {
      if (
        Array.isArray(expense.splitBetween) &&
        expense.splitBetween.length > 0
      ) {
        const mySplit = expense.splitBetween.find(
          (s) => s.user.toString() === currentUserId,
        );
        if (mySplit) {
          yourShare += mySplit.amount;
        }
      } else {
        yourShare += expense.amount / members.length;
      }
    });

    //  init balances
    const balanceMap = {};
    members.forEach((m) => {
      balanceMap[m._id.toString()] = 0;
    });

    //  apply expenses using splitBetween
    expenses.forEach((exp) => {
      const paidBy = exp.paidBy.toString();

      // payer paid full amount
      balanceMap[paidBy] += exp.amount;

      if (exp.splitBetween?.length) {
        exp.splitBetween.forEach((s) => {
          balanceMap[s.user.toString()] -= s.amount;
        });
      } else {
        // fallback equal split
        const share = exp.amount / members.length;
        members.forEach((m) => {
          balanceMap[m._id.toString()] -= share;
        });
      }
    });

    //  apply completed settlements
    settlementsDone.forEach((s) => {
      balanceMap[s.from.toString()] += s.amount;
      balanceMap[s.to.toString()] -= s.amount;
    });

    //  prepare debtors & creditors
    const creditors = [];
    const debtors = [];

    members.forEach((m) => {
      const bal = Number(balanceMap[m._id.toString()].toFixed(2));
      if (bal > 0.01) creditors.push({ user: m, amount: bal });
      if (bal < -0.01) debtors.push({ user: m, amount: -bal });
    });

    //  settlement matching
    const settlements = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(debtors[i].amount, creditors[j].amount);

      settlements.push({
        from: debtors[i].user._id,
        fromName: debtors[i].user.name,
        to: creditors[j].user._id,
        toName: creditors[j].user.name,
        toMobile: creditors[j].user.mobile,
        amount: Number(amount.toFixed(2)),
      });

      debtors[i].amount -= amount;
      creditors[j].amount -= amount;

      if (debtors[i].amount <= 0.01) i++;
      if (creditors[j].amount <= 0.01) j++;
    }

    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

    res.json({
      group: group.name,
      totalSpent: Number(totalSpent.toFixed(2)),
      yourShare: Number(yourShare.toFixed(2)),
      balances: members.map((m) => ({
        id: m._id,
        name: m.name,
        email: m.email,
        balance: Number(balanceMap[m._id.toString()].toFixed(2)),
      })),
      settlements,
    });
  } catch (err) {
    res.status(500).json({ message: "Settlement failed" });
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
      amount: Number(Number(amount).toFixed(2)),
      status: "COMPLETED",
      settledAt: new Date(),
    });

    // Notify receiver
    await notifyUser({
      userId: to,
      actor: from,
      title: "Payment received",
      message: `paid you ₹${Number(amount).toFixed(2)}`,
      type: "SETTLEMENT",
      link: `/groups/${groupId}`,
      relatedId: settlement._id,
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
    const userId = req.user.id.toString();

    const groups = await Group.find({ members: userId })
      .populate("members", "name email")
      .lean();

    const result = [];

    for (const group of groups) {
      const members = group.members;
      if (!members || members.length < 2) continue;

      const [expenses, settlementsDone] = await Promise.all([
        Expense.find({ group: group._id }).lean(),
        Settlement.find({
          group: group._id,
          status: "COMPLETED",
        }).lean(),
      ]);

      const balanceMap = {};

      // init
      members.forEach((m) => {
        balanceMap[m._id.toString()] = 0;
      });

      expenses.forEach((e) => {
        const paidBy = e.paidBy.toString();

        if (balanceMap[paidBy] !== undefined) {
          balanceMap[paidBy] += e.amount;
        }

        e.splitBetween?.forEach((s) => {
          const uid = s.user.toString();
          if (balanceMap[uid] !== undefined) {
            balanceMap[uid] -= s.amount;
          }
        });
      });

      // settlements already done
      settlementsDone.forEach((s) => {
        balanceMap[s.from.toString()] += s.amount;
        balanceMap[s.to.toString()] -= s.amount;
      });

      const creditors = [];
      const debtors = [];

      members.forEach((m) => {
        const bal = Number(balanceMap[m._id.toString()].toFixed(2));

        if (bal > 0.01) creditors.push({ user: m, amount: bal });
        else if (bal < -0.01)
          debtors.push({ user: m, amount: -bal });
      });

      let i = 0;
      let j = 0;

      while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(debtor.amount, creditor.amount);

        const settlement = {
          groupId: group._id,
          groupName: group.name,
          from: debtor.user._id,
          fromName: debtor.user.name,
          to: creditor.user._id,
          toName: creditor.user.name,
          amount: Number(amount.toFixed(2)),
        };

        //  Only push if current user involved
        if (
          settlement.from.toString() === userId ||
          settlement.to.toString() === userId
        ) {
          result.push(settlement);
        }

        debtor.amount -= amount;
        creditor.amount -= amount;

        if (debtor.amount <= 0.01) i++;
        if (creditor.amount <= 0.01) j++;
      }
    }

    res.json(result);
  } catch (err) {
    console.error("PENDING SETTLEMENT ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch pending settlements",
    });
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

export const getUserNetBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({
      $or: [{ paidBy: userId }, { "splitBetween.user": userId }],
    }).lean();

    let expenseBalance = 0;

    for (const expense of expenses) {
      if (expense.paidBy.toString() === userId) {
        expenseBalance += expense.amount;
      }

      const split = expense.splitBetween.find(
        (s) => s.user.toString() === userId,
      );

      if (split) {
        expenseBalance -= split.amount;
      }
    }

    const settlements = await Settlement.find({
      status: "COMPLETED",
      $or: [{ from: userId }, { to: userId }],
    }).lean();

    let settlementBalance = 0;

    for (const settlement of settlements) {
      if (settlement.from.toString() === userId) {
        settlementBalance += settlement.amount;
      }

      if (settlement.to.toString() === userId) {
        settlementBalance -= settlement.amount;
      }
    }

    const netBalance = expenseBalance + settlementBalance;

    res.json({
      netBalance: Math.round(netBalance * 100) / 100,
      status:
        netBalance > 0
          ? "You will receive"
          : netBalance < 0
            ? "You need to pay"
            : "Settled",
      absoluteAmount: Math.abs(netBalance),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "FAILED_NET_BALANCE" });
  }
};
