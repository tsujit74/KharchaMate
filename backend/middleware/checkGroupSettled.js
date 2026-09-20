import Expense from "../models/Expense.js";
import Settlement from "../models/Settlement.js";

export const checkGroupSettled = async (req, res, next) => {
  try {
    const group = req.group;

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    if (!Array.isArray(group.members) || group.members.length === 0) {
      return next();
    }

    const [expenses, completedSettlements] = await Promise.all([
      Expense.find({ group: group._id }).lean(),
      Settlement.find({
        group: group._id,
        status: "COMPLETED",
      }).lean(),
    ]);

    const balances = new Map();

    group.members.forEach((memberId) => {
      balances.set(memberId.toString(), 0);
    });

    for (const expense of expenses) {
      const paidBy = expense.paidBy.toString();

      if (balances.has(paidBy)) {
        balances.set(
          paidBy,
          balances.get(paidBy) + Number(expense.amount || 0),
        );
      }

      if (expense.splitBetween?.length) {
        for (const split of expense.splitBetween) {
          const userId = split.user.toString();

          if (balances.has(userId)) {
            balances.set(
              userId,
              balances.get(userId) - Number(split.amount || 0),
            );
          }
        }
      } else {
        const share = Number(expense.amount || 0) / group.members.length;

        for (const memberId of group.members) {
          const userId = memberId.toString();

          balances.set(userId, balances.get(userId) - share);
        }
      }
    }

    // Completed settlements
    for (const settlement of completedSettlements) {
      const from = settlement.from.toString();
      const to = settlement.to.toString();
      const amount = Number(settlement.amount || 0);

      if (balances.has(from)) {
        balances.set(from, balances.get(from) + amount);
      }

      if (balances.has(to)) {
        balances.set(to, balances.get(to) - amount);
      }
    }

    const hasOutstandingBalance = [...balances.values()].some(
      (balance) => Math.abs(balance) > 0.01,
    );

    if (hasOutstandingBalance) {
      return res.status(400).json({
        message:
          "This group cannot be deleted because there are outstanding settlements. Please settle all pending balances first.",
      });
    }

    return next();
  } catch (error) {
    console.error("CHECK GROUP SETTLED ERROR:", error);

    return res.status(500).json({
      message: "Unable to verify the group's settlement status.",
    });
  }
};
