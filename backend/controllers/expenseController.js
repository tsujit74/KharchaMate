import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import mongoose from "mongoose";
import { notifyUser } from "../service/notify.js";

const round = (n) => Math.round(n * 100) / 100;
const FIVE_HOURS = 5 * 60 * 60 * 1000;

const canModifyExpense = (expense) => {
  const now = Date.now();
  const createdAt = new Date(expense.createdAt).getTime();
  return now - createdAt <= FIVE_HOURS;
};

export const addExpense = async (req, res) => {
  try {
    const { groupId, description, amount, splitBetween, category } = req.body;

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
      category,
      splitBetween: finalSplit,
    });

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
    const { groupId } = req.params;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    const expenses = await Expense.find({ group: groupId })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .populate("paidBy", "name email")
      .populate("splitBetween.user", "name email")
      .lean();

    const total = await Expense.countDocuments({ group: groupId });

    res.json({
      expenses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("FETCH GROUP EXPENSES ERROR:", error);
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

export const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.query;

    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const expenses = await Expense.find({
      createdAt: { $gte: start, $lt: end },
      $or: [{ paidBy: userId }, { "splitBetween.user": userId }],
    }).lean();

    let paidByYou = 0;
    let yourExpense = 0;

    for (const expense of expenses) {
      // A) Paid by you
      if (expense.paidBy.toString() === userId) {
        paidByYou += expense.amount;
      }

      // B) Your share
      const yourSplit = expense.splitBetween.find(
        (s) => s.user.toString() === userId,
      );

      if (yourSplit) {
        yourExpense += yourSplit.amount;
      }
    }

    const netBalance = paidByYou - yourExpense;

    res.json({
      paidByYou: Math.round(paidByYou * 100) / 100,
      yourExpense: Math.round(yourExpense * 100) / 100,
      netBalance: Math.round(netBalance * 100) / 100,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "FAILED_MONTHLY_SUMMARY" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.user.id;
    const { description, amount, splitBetween } = req.body;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.paidBy.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!canModifyExpense(expense)) {
      return res
        .status(400)
        .json({ message: "Expense can only be modified within 5 hours" });
    }

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

      expense.splitBetween = splitBetween;
    }

    if (description) expense.description = description;
    if (amount) expense.amount = amount;

    await expense.save();

    res.json(expense);
  } catch (error) {
    console.error("UPDATE EXPENSE ERROR:", error);
    res.status(500).json({ message: "Failed to update expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.user.id;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.paidBy.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!canModifyExpense(expense)) {
      return res
        .status(400)
        .json({ message: "Expense can only be deleted within 5 hours" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

export const getMyInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const { filter, start, end } = req.query;

    let startDate, endDate;
    const now = new Date();

    if (filter === "this-month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (filter === "last-month") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      return res.status(400).json({ message: "Invalid filter" });
    }

    const insights = await Expense.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          $or: [
            { paidBy: new mongoose.Types.ObjectId(userId) },
            { "splitBetween.user": new mongoose.Types.ObjectId(userId) },
          ],
        },
      },

      {
        $addFields: {
          category: {
            $ifNull: ["$category", "OTHER"],
          },
        },
      },

      {
        $addFields: {
          yourSplit: {
            $first: {
              $filter: {
                input: "$splitBetween",
                as: "s",
                cond: {
                  $eq: ["$$s.user", new mongoose.Types.ObjectId(userId)],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          yourExpense: {
            $ifNull: ["$yourSplit.amount", 0],
          },
          paidByYou: {
            $cond: [
              { $eq: ["$paidBy", new mongoose.Types.ObjectId(userId)] },
              "$amount",
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          totalCategoryExpense: { $sum: "$yourExpense" },
          totalPaidByYou: { $sum: "$paidByYou" },
          totalYourExpense: { $sum: "$yourExpense" },
        },
      },
    ]);

    let paidByYou = 0;
    let yourExpense = 0;

    const categoryBreakdown = insights.map((item) => {
      paidByYou += item.totalPaidByYou;
      yourExpense += item.totalYourExpense;

      return {
        category: item._id,
        total: Math.round(item.totalCategoryExpense * 100) / 100,
      };
    });

    const netBalance = Math.round((paidByYou - yourExpense) * 100) / 100;

    res.json({
      categoryBreakdown,
      paidByYou: Math.round(paidByYou * 100) / 100,
      yourExpense: Math.round(yourExpense * 100) / 100,
      netBalance,
    });
  } catch (error) {
    console.error("INSIGHTS ERROR:", error);
    res.status(500).json({ message: "FAILED_INSIGHTS" });
  }
};
