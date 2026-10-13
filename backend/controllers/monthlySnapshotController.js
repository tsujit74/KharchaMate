import mongoose from "mongoose";
import MonthlySnapshot from "../models/MonthlySnapshot.js";
import Expense from "../models/Expense.js";
import Settlement from "../models/Settlement.js";
import User from "../models/User.js";

const IST_OFFSET = 5.5 * 60 * 60 * 1000;
const CATEGORIES = ["FOOD", "TRAVEL", "RENT", "SHOPPING", "RECHARGE", "OTHER"];

const isValidMonth = (month) =>
  typeof month === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(month);

const getMonthRange = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);

  const start = new Date(Date.UTC(year, monthNumber - 1, 1) - IST_OFFSET);

  const end = new Date(Date.UTC(year, monthNumber, 1) - IST_OFFSET);

  return { start, end };
};

const getCurrentISTMonth = () =>
  new Date(Date.now() + IST_OFFSET).toISOString().slice(0, 7);

const roundMoney = (amount) =>
  Math.round((amount + Number.EPSILON) * 100) / 100;

const getUserName = (user) => user?.name?.trim() || "Unknown member";

export const createMonthlySnapshot = async (req, res, next) => {
  try {
    const group = req.group;
    const userId = req.user.id;
    const { month } = req.body;

    if (!isValidMonth(month)) {
      return res.status(400).json({
        message: "Month must use YYYY-MM format.",
      });
    }

    if (month >= getCurrentISTMonth()) {
      return res.status(400).json({
        message: "Only completed months can be closed.",
      });
    }

    const existingSnapshot = await MonthlySnapshot.findOne({
      group: group._id,
      month,
    }).lean();

    if (existingSnapshot) {
      return res.status(409).json({
        message: "This month has already been closed.",
        snapshot: existingSnapshot,
      });
    }

    const { start, end } = getMonthRange(month);

    const [expenses, settlements] = await Promise.all([
      Expense.find({
        group: group._id,
        createdAt: { $gte: start, $lt: end },
      }).lean(),
      Settlement.find({
        group: group._id,
        status: "COMPLETED",
        $expr: {
          $and: [
            {
              $gte: [{ $ifNull: ["$settledAt", "$updatedAt"] }, start],
            },
            {
              $lt: [{ $ifNull: ["$settledAt", "$updatedAt"] }, end],
            },
          ],
        },
      }).lean(),
    ]);

    const categoryTotals = new Map(CATEGORIES.map((category) => [category, 0]));

    const memberTotals = new Map();

    const ensureMember = (id) => {
      const key = id.toString();

      if (!memberTotals.has(key)) {
        memberTotals.set(key, {
          userId: id,
          paid: 0,
          share: 0,
        });
      }

      return memberTotals.get(key);
    };

    for (const memberId of group.members) {
      ensureMember(memberId);
    }

    let totalExpenses = 0;

    for (const expense of expenses) {
      const amount = Number(expense.amount);

      if (!Number.isFinite(amount) || amount < 0) {
        return res.status(500).json({
          message: "Invalid expense data prevents snapshot creation.",
        });
      }

      if (!CATEGORIES.includes(expense.category)) {
        return res.status(500).json({
          message: "Invalid expense category prevents snapshot creation.",
        });
      }

      totalExpenses += amount;
      categoryTotals.set(
        expense.category,
        categoryTotals.get(expense.category) + amount,
      );

      ensureMember(expense.paidBy).paid += amount;

      if (expense.splitBetween?.length) {
        for (const split of expense.splitBetween) {
          const share = Number(split.amount);

          if (!Number.isFinite(share) || share < 0) {
            return res.status(500).json({
              message: "Invalid expense split prevents snapshot creation.",
            });
          }

          ensureMember(split.user).share += share;
        }
      } else if (group.members.length > 0) {
        const equalShare = amount / group.members.length;

        for (const memberId of group.members) {
          ensureMember(memberId).share += equalShare;
        }
      }
    }

    const totalSettlements = settlements.reduce((total, settlement) => {
      const amount = Number(settlement.amount);

      if (!Number.isFinite(amount) || amount < 0) {
        return Number.NaN;
      }

      return total + amount;
    }, 0);

    if (!Number.isFinite(totalSettlements)) {
      return res.status(500).json({
        message: "Invalid settlement data prevents snapshot creation.",
      });
    }

    const highestCategory = [...categoryTotals.entries()]
      .filter(([, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1])[0];

    const userIds = [...memberTotals.values()].map((member) => member.userId);

    const users = await User.find({
      _id: { $in: userIds },
    })
      .select("_id name")
      .lean();

    const userNames = new Map(
      users.map((user) => [user._id.toString(), getUserName(user)]),
    );

    const categories = [...categoryTotals.entries()]
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category,
        amount: roundMoney(amount),
        percentage:
          totalExpenses > 0 ? roundMoney((amount / totalExpenses) * 100) : 0,
      }));

    const members = [...memberTotals.values()].map((member) => ({
      userId: member.userId,
      name: userNames.get(member.userId.toString()) || "Unknown member",
      paid: roundMoney(member.paid),
      share: roundMoney(member.share),
    }));

    const snapshot = await MonthlySnapshot.create({
      group: group._id,
      groupName: group.name,
      month,
      totalExpenses: roundMoney(totalExpenses),
      transactionCount: expenses.length,
      totalSettlements: roundMoney(totalSettlements),
      settlementCount: settlements.length,
      topCategory: highestCategory?.[0] || null,
      categories,
      members,
      closedBy: userId,
    });

    return res.status(201).json({
      message: "Monthly snapshot created successfully.",
      snapshot,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This month has already been closed.",
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "Snapshot validation failed.",
      });
    }

    return next(error);
  }
};

export const getMonthlySnapshots = async (req, res, next) => {
  try {
    const snapshots = await MonthlySnapshot.find({
      group: req.group._id,
    })
      .sort({ month: -1 })
      .lean();

    return res.status(200).json({
      snapshots,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMonthlySnapshotByMonth = async (req, res, next) => {
  try {
    const { month } = req.params;

    if (!isValidMonth(month)) {
      return res.status(400).json({
        message: "Month must use YYYY-MM format.",
      });
    }

    const snapshot = await MonthlySnapshot.findOne({
      group: req.group._id,
      month,
    }).lean();

    if (!snapshot) {
      return res.status(404).json({
        message: "No snapshot exists for this month.",
      });
    }

    return res.status(200).json({
      snapshot,
    });
  } catch (error) {
    return next(error);
  }
};
