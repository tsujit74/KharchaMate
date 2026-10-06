import Expense from "../models/Expense.js";
import Settlement from "../models/Settlement.js";
import User from "../models/User.js";

const round = (n) => Math.round(n * 100) / 100;
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

const istString = (date) =>
  new Date(new Date(date).getTime() + IST_OFFSET).toISOString();

const dayKey = (date) => istString(date).slice(0, 10);
const monthKey = (date) => istString(date).slice(0, 7);

const weekKey = (date) => {
  const d = new Date(dayKey(date));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
};

const sumBy = (expenses, keyFn) => {
  const totals = {};
  for (const e of expenses) {
    const key = keyFn(e.createdAt);
    totals[key] = (totals[key] || 0) + e.amount;
  }
  return totals;
};

const monthsBetween = (from, to) => {
  const keys = [];
  let [year, month] = from.split("-").map(Number);

  while (true) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    if (key > to) break;
    keys.push(key);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return keys;
};

const toPoints = (totals) =>
  Object.keys(totals)
    .sort()
    .map((label) => ({ label, amount: round(totals[label]) }));

const fillMonths = (totals) => {
  const keys = Object.keys(totals).sort();

  return monthsBetween(keys[0], keys[keys.length - 1]).map((label) => ({
    label,
    amount: round(totals[label] || 0),
  }));
};

const buildTrend = (expenses, type) => {
  if (expenses.length === 0) {
    return { unit: type === "ONGOING" ? "month" : "day", points: [] };
  }

  if (type === "ONGOING") {
    const totals = sumBy(expenses, monthKey);
    const first = Object.keys(totals).sort()[0];
    const months = monthsBetween(first, monthKey(new Date())).slice(-6);

    return {
      unit: "month",
      points: months.map((label) => ({
        label,
        amount: round(totals[label] || 0),
      })),
    };
  }

  const days = sumBy(expenses, dayKey);
  const dayKeys = Object.keys(days).sort();
  const span =
    (Date.parse(dayKeys[dayKeys.length - 1]) - Date.parse(dayKeys[0])) /
      86400000 +
    1;

  if (span <= 31) return { unit: "day", points: toPoints(days) };
  if (span <= 120) {
    return { unit: "week", points: toPoints(sumBy(expenses, weekKey)) };
  }
  return { unit: "month", points: fillMonths(sumBy(expenses, monthKey)) };
};

const ongoingStats = (expenses) => {
  if (expenses.length === 0) return { thisMonth: 0, avgPerMonth: null };

  const totals = sumBy(expenses, monthKey);
  const current = monthKey(new Date());
  const first = Object.keys(totals).sort()[0];

  const completed = monthsBetween(first, current).slice(0, -1);
  const completedTotal = completed.reduce((sum, m) => sum + (totals[m] || 0), 0);

  return {
    thisMonth: round(totals[current] || 0),
    avgPerMonth: completed.length
      ? round(completedTotal / completed.length)
      : null,
  };
};

export const getGroupInsights = async (req, res) => {
  try {
    const group = req.group;
    const userId = String(req.user.id);

    const [expenses, settlements, users] = await Promise.all([
      Expense.find({ group: group._id }).populate("paidBy", "name").lean(),
      Settlement.find({
        group: group._id,
        status: { $in: ["INITIATED", "COMPLETED"] },
      }).lean(),
      User.find({ _id: { $in: group.members } }).select("name").lean(),
    ]);

    const memberMap = {};
    for (const user of users) {
      memberMap[String(user._id)] = {
        userId: String(user._id),
        name: user.name,
        paid: 0,
        share: 0,
      };
    }

    const categoryTotals = {};
    let totalSpent = 0;

    for (const expense of expenses) {
      totalSpent += expense.amount;

      const category = expense.category || "OTHER";
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;

      const payer = memberMap[String(expense.paidBy._id)];
      if (payer) payer.paid += expense.amount;

      for (const split of expense.splitBetween) {
        const member = memberMap[String(split.user)];
        if (member) member.share += split.amount;
      }
    }

    const me = memberMap[userId];
    const yourShare = me ? me.share : 0;

    let balance = me ? me.paid - me.share : 0;
    let pendingCount = 0;

    for (const s of settlements) {
      const isFrom = String(s.from) === userId;
      const isTo = String(s.to) === userId;

      if (s.status === "COMPLETED") {
        if (isFrom) balance += s.amount;
        if (isTo) balance -= s.amount;
      } else if (isFrom || isTo) {
        pendingCount++;
      }
    }

    const summary = {
      totalSpent: round(totalSpent),
      yourShare: round(yourShare),
      expenseCount: expenses.length,
      averageExpense: expenses.length ? round(totalSpent / expenses.length) : 0,
    };

    if (group.type === "ONGOING") {
      Object.assign(summary, ongoingStats(expenses));
    }

    const categories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: round(amount),
        percentage: round((amount / totalSpent) * 100),
      }))
      .sort((a, b) => b.amount - a.amount);

    const members = Object.values(memberMap)
      .map((m) => ({ ...m, paid: round(m.paid), share: round(m.share) }))
      .sort((a, b) => b.paid - a.paid);

    const topExpenses =
      group.type === "NORMAL"
        ? [...expenses]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map((e) => ({
              id: e._id,
              description: e.description,
              amount: e.amount,
              category: e.category,
              paidByName: e.paidBy.name,
              createdAt: e.createdAt,
            }))
        : [];

    const budget =
      group.budget > 0
        ? {
            amount: group.budget,
            spent: round(totalSpent),
            remaining: round(group.budget - totalSpent),
          }
        : null;

    res.json({
      group: {
        id: group._id,
        name: group.name,
        type: group.type,
        isActive: group.isActive,
        memberCount: group.members.length,
      },
      summary,
      trend: buildTrend(expenses, group.type),
      categories,
      members,
      topExpenses,
      budget,
      settlement: { balance: round(balance), pendingCount },
    });
  } catch (error) {
    console.error("GROUP INSIGHTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch group insights" });
  }
};