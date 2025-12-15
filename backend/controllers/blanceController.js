import Expense from "../models/Expense.js";

export const getGroupBalance = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId });

    const balanceMap = {}; 

    expenses.forEach((expense) => {
      const paidBy = expense.paidBy.toString();

      balanceMap[paidBy] = (balanceMap[paidBy] || 0) + expense.amount;

      expense.splitBetween.forEach((split) => {
        const userId = split.user.toString();
        balanceMap[userId] =
          (balanceMap[userId] || 0) - split.amount;
      });
    });

    res.json(balanceMap);
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate balance" });
  }
};
