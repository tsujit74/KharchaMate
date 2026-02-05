import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import { notifyUser } from "../service/notify.js";

const round = (n) => Math.round(n * 100) / 100;

export const addExpense = async (req, res) => {
  try {
    const { groupId, description, amount, splitBetween } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    let finalSplit = [];

    // CUSTOM SPLIT
    if (Array.isArray(splitBetween) && splitBetween.length > 0) {
      const totalSplit = splitBetween.reduce(
        (sum, s) => sum + Number(s.amount),
        0,
      );

      if (round(totalSplit) !== round(Number(amount))) {
        return res
          .status(400)
          .json({ message: "Split total must equal amount" });
      }

      finalSplit = splitBetween;
    }
    // EQUAL SPLIT
    else {
      const members = group.members;
      const perHead = round(amount / members.length);

      finalSplit = members.map((memberId) => ({
        user: memberId,
        amount: perHead,
      }));
    }

    const expense = await Expense.create({
      group: groupId,
      description,
      amount,
      paidBy: req.user.id,
      splitBetween: finalSplit,
    });

    // Notify members except payer
    await Promise.all(
      group.members
        .filter((m) => m.toString() !== req.user.id)
        .map((memberId) =>
          notifyUser({
            userId: memberId,
            actor: req.user.id,
            title: "New expense added",
            message: `added ₹${amount} for "${description}"`,
            type: "EXPENSE",
            link: `/groups/${group._id}`,
            relatedId: expense._id,
          }),
        ),
    );

    res.status(201).json(expense);
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

export const getGroupExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      group: req.params.groupId,
    })
      .populate("paidBy", "name email")
      .populate("splitBetween.user", "name email");

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

export const getRecentExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({
      $or: [{ paidBy: userId }, { "splitBetween.user": userId }],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("group", "name")
      .populate("paidBy", "name email")
      .lean();

    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recent expenses" });
  }
};

// GET /expenses/my-expense
export const getMyExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({
      $or: [{ paidBy: userId }, { "splitBetween.user": userId }],
    })
      .sort({ createdAt: -1 })
      .populate("group", "name")
      .populate("paidBy", "name email")
      .lean();

    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recent expenses" });
  }
};
