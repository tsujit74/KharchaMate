import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

export const addExpense = async (req, res) => {
  try {
    const { groupId, description, amount } = req.body;

    const group = await Group.findById(groupId);
    if (!group)
      return res.status(404).json({ message: "Group not found" });

    const members = group.members;
    const perHeadAmount = amount / members.length;

    const splitBetween = members.map((memberId) => ({
      user: memberId,
      amount: perHeadAmount,
    }));

    const expense = await Expense.create({
      group: groupId,
      description,
      amount,
      paidBy: req.user.id,
      splitBetween,
    });

    res.status(201).json(expense);
  } catch (error) {
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
