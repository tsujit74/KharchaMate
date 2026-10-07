import Expense from "../models/Expense.js";
import Settlement from "../models/Settlement.js";
import User from "../models/User.js";

const DAY_MS = 86400000;
const IST_OFFSET = 5.5 * 60 * 60 * 1000;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const round = (n) => {
  const value = Number(n);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : 0;
};

const isValidAmount = (n) => Number.isFinite(n) && n >= 0;

const istString = (date) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(parsed.getTime() + IST_OFFSET).toISOString();
};

const dayKey = (date) => {
  const value = istString(date);
  return value ? value.slice(0, 10) : null;
};

const monthKey = (date) => {
  const value = istString(date);
  return value ? value.slice(0, 7) : null;
};

const weekKey = (date) => {
  const day = dayKey(date);

  if (!day) return null;

  const d = new Date(`${day}T00:00:00.000Z`);

  if (Number.isNaN(d.getTime())) {
    return null;
  }

  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));

  return d.toISOString().slice(0, 10);
};

const monthsBetween = (from, to) => {
  if (!from || !to || from > to) {
    return [];
  }

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

const sumBy = (expenses, keyFn) => {
  const totals = {};

  for (const expense of expenses) {
    const key = keyFn(expense.createdAt);
    const amount = Number(expense.amount);

    if (!key || !isValidAmount(amount)) continue;

    totals[key] = (totals[key] || 0) + amount;
  }

  return totals;
};

const fillRange = (totals, stepDays) => {
  const keys = Object.keys(totals).sort();

  if (keys.length === 0) {
    return [];
  }

  const end = Date.parse(keys[keys.length - 1]);
  const points = [];

  for (let t = Date.parse(keys[0]); t <= end; t += stepDays * DAY_MS) {
    const label = new Date(t).toISOString().slice(0, 10);
    points.push({ label, amount: round(totals[label] || 0) });
  }

  return points;
};

const fillMonths = (totals) => {
  const keys = Object.keys(totals).sort();

  if (keys.length === 0) {
    return [];
  }

  return monthsBetween(keys[0], keys[keys.length - 1]).map((label) => ({
    label,
    amount: round(totals[label] || 0),
  }));
};

const buildTrend = (expenses, type) => {
  if (expenses.length === 0) {
    return {
      unit: type === "ONGOING" ? "month" : "day",
      points: [],
    };
  }

  if (type === "ONGOING") {
    const totals = sumBy(expenses, monthKey);
    const keys = Object.keys(totals).sort();

    if (keys.length === 0) {
      return { unit: "month", points: [] };
    }

    const months = monthsBetween(keys[0], monthKey(new Date())).slice(-6);

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

  if (dayKeys.length === 0) {
    return { unit: "day", points: [] };
  }

  const firstDate = Date.parse(dayKeys[0]);
  const lastDate = Date.parse(dayKeys[dayKeys.length - 1]);

  const span =
    Number.isFinite(firstDate) && Number.isFinite(lastDate)
      ? (lastDate - firstDate) / DAY_MS + 1
      : 1;

  if (span <= 31) {
    return { unit: "day", points: fillRange(days, 1) };
  }

  if (span <= 120) {
    return { unit: "week", points: fillRange(sumBy(expenses, weekKey), 7) };
  }

  return { unit: "month", points: fillMonths(sumBy(expenses, monthKey)) };
};

const weekdayBreakdown = (expenses) => {
  const totals = Array(7).fill(0);

  for (const expense of expenses) {
    const day = dayKey(expense.createdAt);
    const amount = Number(expense.amount);

    if (!day || !isValidAmount(amount)) continue;

    const index = (new Date(`${day}T00:00:00.000Z`).getUTCDay() + 6) % 7;
    totals[index] += amount;
  }

  return WEEKDAYS.map((label, i) => ({ label, amount: round(totals[i]) }));
};

const emptyOngoingStats = () => ({
  thisMonth: 0,
  previousMonth: 0,
  monthlyChange: null,
  monthlyChangeDirection: null,
  avgPerMonth: null,
  yearToDate: 0,
  highestMonth: null,
  lowestMonth: null,
  projectedMonthEnd: null,
  daysLeftInMonth: null,
});

const ongoingStats = (expenses) => {
  if (expenses.length === 0) {
    return emptyOngoingStats();
  }

  const totals = sumBy(expenses, monthKey);
  const keys = Object.keys(totals).sort();

  if (keys.length === 0) {
    return emptyOngoingStats();
  }

  const current = monthKey(new Date());

  const previousDate = new Date(`${current}-01T00:00:00.000Z`);
  previousDate.setUTCMonth(previousDate.getUTCMonth() - 1);

  const previousKey = `${previousDate.getUTCFullYear()}-${String(
    previousDate.getUTCMonth() + 1,
  ).padStart(2, "0")}`;

  const thisMonth = round(totals[current] || 0);
  const previousMonth = round(totals[previousKey] || 0);

  const completedMonths = monthsBetween(keys[0], current).slice(0, -1);

  const completedTotal = completedMonths.reduce(
    (sum, month) => sum + (totals[month] || 0),
    0,
  );

  const year = current.slice(0, 4);

  const yearToDate = Object.entries(totals).reduce(
    (sum, [month, amount]) => (month.startsWith(year) ? sum + amount : sum),
    0,
  );

  const sortedMonths = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  const highestMonth = {
    month: sortedMonths[0][0],
    amount: round(sortedMonths[0][1]),
  };

  const lowestMonth = {
    month: sortedMonths[sortedMonths.length - 1][0],
    amount: round(sortedMonths[sortedMonths.length - 1][1]),
  };

  let monthlyChange = null;
  let monthlyChangeDirection = null;

  if (previousMonth > 0) {
    monthlyChange = round(((thisMonth - previousMonth) / previousMonth) * 100);

    monthlyChangeDirection =
      monthlyChange > 0 ? "UP" : monthlyChange < 0 ? "DOWN" : "UNCHANGED";
  } else if (thisMonth > 0) {
    monthlyChangeDirection = "UP";
  }

  const [y, m, d] = dayKey(new Date()).split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();

  // Projection is too unstable in the first days of a month
  const projectedMonthEnd =
    d >= 3 && thisMonth > 0 ? round((thisMonth / d) * daysInMonth) : null;

  return {
    thisMonth,
    previousMonth,
    monthlyChange,
    monthlyChangeDirection,
    avgPerMonth: completedMonths.length
      ? round(completedTotal / completedMonths.length)
      : null,
    yearToDate: round(yearToDate),
    highestMonth,
    lowestMonth,
    projectedMonthEnd,
    daysLeftInMonth: daysInMonth - d,
  };
};

const suggestTransfers = (members) => {
  const debtors = [];
  const creditors = [];

  for (const member of members) {
    if (member.balance < -0.01) {
      debtors.push({ ...member, left: -member.balance });
    } else if (member.balance > 0.01) {
      creditors.push({ ...member, left: member.balance });
    }
  }

  debtors.sort((a, b) => b.left - a.left);
  creditors.sort((a, b) => b.left - a.left);

  const transfers = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].left, creditors[j].left);

    if (amount > 0.01) {
      transfers.push({
        fromUserId: debtors[i].userId,
        fromName: debtors[i].name,
        toUserId: creditors[j].userId,
        toName: creditors[j].name,
        amount: round(amount),
      });
    }

    debtors[i].left -= amount;
    creditors[j].left -= amount;

    if (debtors[i].left <= 0.01) i++;
    if (creditors[j].left <= 0.01) j++;
  }

  return transfers;
};

export const getGroupInsights = async (req, res) => {
  try {
    const group = req.group;
    const userId = String(req.user.id);

    const groupType =
      group.type === "ONGOING"
        ? "ONGOING"
        : group.type === "NORMAL"
          ? "NORMAL"
          : null;

    const [expenses, settlements, users] = await Promise.all([
      Expense.find({ group: group._id }).populate("paidBy", "name").lean(),

      Settlement.find({
        group: group._id,
        status: { $in: ["INITIATED", "COMPLETED"] },
      }).lean(),

      User.find({ _id: { $in: group.members } })
        .select("name")
        .lean(),
    ]);

    const memberMap = {};

    for (const user of users) {
      const id = String(user._id);

      memberMap[id] = {
        userId: id,
        name: user.name || "Unknown member",
        paid: 0,
        share: 0,
        settled: 0,
        balance: 0,
      };
    }

    const categoryTotals = {};
    const validExpenses = [];

    let totalSpent = 0;
    let largestExpense = null;

    for (const expense of expenses) {
      const amount = Number(expense.amount);

      if (!isValidAmount(amount)) continue;

      validExpenses.push(expense);
      totalSpent += amount;

      const category = expense.category || "OTHER";
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;

      if (expense.paidBy?._id) {
        const payer = memberMap[String(expense.paidBy._id)];

        if (payer) {
          payer.paid += amount;
        }
      }

      if (!largestExpense || amount > largestExpense.amount) {
        largestExpense = {
          id: String(expense._id),
          description: expense.description || "Untitled expense",
          amount: round(amount),
          category,
          paidByName: expense.paidBy?.name || "Unknown member",
          createdAt: expense.createdAt,
        };
      }

      if (Array.isArray(expense.splitBetween)) {
        for (const split of expense.splitBetween) {
          const memberId = split?.user ? String(split.user) : null;
          const splitAmount = Number(split?.amount);

          if (!memberId || !isValidAmount(splitAmount)) continue;

          const member = memberMap[memberId];

          if (member) {
            member.share += splitAmount;
          }
        }
      }
    }

    // Balance > 0 means owed money. Paying a settlement raises balance, receiving lowers it.
    for (const s of settlements) {
      if (s.status !== "COMPLETED") continue;

      const amount = Number(s.amount);

      if (!Number.isFinite(amount) || amount <= 0) continue;

      const payer = memberMap[String(s.from)];
      const receiver = memberMap[String(s.to)];

      if (payer) payer.settled += amount;
      if (receiver) receiver.settled -= amount;
    }

    for (const member of Object.values(memberMap)) {
      member.paid = round(member.paid);
      member.share = round(member.share);
      member.settled = round(member.settled);
      member.balance = round(member.paid - member.share + member.settled);
    }

    const me = memberMap[userId];

    const yourPaid = me ? me.paid : 0;
    const yourShare = me ? me.share : 0;
    const balance = me ? me.balance : 0;

    let pendingCount = 0;
    let pendingOut = 0;
    let pendingIn = 0;
    let totalSettled = 0;
    let youPaidInSettlements = 0;
    let youReceivedInSettlements = 0;

    for (const s of settlements) {
      const amount = Number(s.amount);

      if (!Number.isFinite(amount) || amount <= 0) continue;

      const isFrom = String(s.from) === userId;
      const isTo = String(s.to) === userId;

      if (!isFrom && !isTo) continue;

      if (s.status === "COMPLETED") {
        totalSettled += amount;

        if (isFrom) youPaidInSettlements += amount;
        if (isTo) youReceivedInSettlements += amount;
      } else if (s.status === "INITIATED") {
        pendingCount++;

        if (isFrom) pendingOut += amount;
        else pendingIn += amount;
      }
    }

    const members = Object.values(memberMap).sort((a, b) => b.paid - a.paid);

    const settlement = {
      balance,
      youAreOwed: balance > 0 ? balance : 0,
      youOwe: balance < 0 ? round(Math.abs(balance)) : 0,
      pendingCount,
      pendingOut: round(pendingOut),
      pendingIn: round(pendingIn),
      totalSettled: round(totalSettled),
      youPaidInSettlements: round(youPaidInSettlements),
      youReceivedInSettlements: round(youReceivedInSettlements),
      suggestedTransfers: suggestTransfers(members),
    };

    const expenseCount = validExpenses.length;

    const summary = {
      totalSpent: round(totalSpent),
      yourPaid: round(yourPaid),
      yourShare: round(yourShare),
      expenseCount,
      averageExpense: expenseCount ? round(totalSpent / expenseCount) : 0,
    };

    if (groupType === "ONGOING") {
      Object.assign(summary, ongoingStats(validExpenses));
    }

    const categories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: round(amount),
        percentage: totalSpent > 0 ? round((amount / totalSpent) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categories.length ? categories[0] : null;

    const topPayer =
      members.length && members[0].paid > 0
        ? {
            userId: members[0].userId,
            name: members[0].name,
            amount: members[0].paid,
          }
        : null;

    const topExpenses =
      groupType === "ONGOING"
        ? []
        : [...validExpenses]
            .sort((a, b) => Number(b.amount) - Number(a.amount))
            .slice(0, 5)
            .map((expense) => ({
              id: String(expense._id),
              description: expense.description || "Untitled expense",
              amount: round(expense.amount),
              category: expense.category || "OTHER",
              paidByName: expense.paidBy?.name || "Unknown member",
              createdAt: expense.createdAt,
            }));

    const budgetAmount = Number(group.budget);

    let budget = null;

    if (Number.isFinite(budgetAmount) && budgetAmount > 0) {
      const monthly = groupType === "ONGOING";
      const spent = monthly ? summary.thisMonth : round(totalSpent);

      budget = {
        scope: monthly ? "MONTH" : "TOTAL",
        amount: round(budgetAmount),
        spent: round(spent),
        remaining: round(budgetAmount - spent),
        percentageUsed: round((spent / budgetAmount) * 100),
      };
    }

    const validDates = validExpenses
      .map((expense) => new Date(expense.createdAt))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    let period = null;

    if (validDates.length > 0) {
      const first = validDates[0];
      const last = validDates[validDates.length - 1];

      const durationDays =
        Math.floor(
          (Date.parse(dayKey(last)) - Date.parse(dayKey(first))) / DAY_MS,
        ) + 1;

      period = {
        startedAt: first,
        lastExpenseAt: last,
        durationDays,
        dailyAverage: round(totalSpent / durationDays),
      };
    }

    return res.json({
      group: {
        id: group._id,
        name: group.name,
        type: group.type || null,
        isActive: group.isActive,
        memberCount: group.members.length,
      },
      summary,
      period,
      trend: buildTrend(validExpenses, groupType || "NORMAL"),
      byWeekday: weekdayBreakdown(validExpenses),
      categories,
      topCategory,
      members,
      topPayer,
      largestExpense,
      topExpenses,
      budget,
      settlement,
    });
  } catch (error) {
    console.error("GROUP INSIGHTS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch group insights",
    });
  }
};