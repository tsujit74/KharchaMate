import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";

import Group from "../models/Group.js";
import Expense from "../models/Expense.js";
import Settlement from "../models/Settlement.js";

const PAGE = {
  width: 595.28,
  height: 841.89,
  margin: 42,
};

const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;
const CELL_PAD = 8;
const TABLE_INNER_WIDTH = CONTENT_WIDTH - CELL_PAD * 2;

const COLORS = {
  navy: "#0B1220",
  ink: "#111827",
  slate: "#475569",
  muted: "#6B7280",
  border: "#E2E8F0",
  surface: "#F8FAFC",
  surfaceAlt: "#F1F5F9",
  white: "#FFFFFF",
  accent: "#10B981",

  emerald: "#059669",
  emeraldSoft: "#D1FAE5",
  rose: "#DC2626",
  roseSoft: "#FEE2E2",
  amber: "#B45309",
  amberSoft: "#FEF3C7",
  indigo: "#4338CA",
  indigoSoft: "#E0E7FF",
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONT_DIR = path.join(__dirname, "..", "assets", "fonts");

const CUSTOM_FONTS = {
  regular: path.join(FONT_DIR, "NotoSans-Regular.ttf"),
  bold: path.join(FONT_DIR, "NotoSans-Bold.ttf"),
};

let unicodeFontsAvailable = false;

const registerFonts = (doc) => {
  try {
    if (
      fs.existsSync(CUSTOM_FONTS.regular) &&
      fs.existsSync(CUSTOM_FONTS.bold)
    ) {
      doc.registerFont("Body", CUSTOM_FONTS.regular);
      doc.registerFont("Body-Bold", CUSTOM_FONTS.bold);
      unicodeFontsAvailable = true;
      return;
    }
  } catch (error) {
    // Use built-in fonts if custom fonts are unavailable.
  }

  doc.registerFont("Body", "Helvetica");
  doc.registerFont("Body-Bold", "Helvetica-Bold");
  unicodeFontsAvailable = false;
};

const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const roundMoney = (value) =>
  Math.round((safeNumber(value) + Number.EPSILON) * 100) / 100;

const formatCurrency = (value) => {
  const amount = roundMoney(value);
  const sign = amount < 0 ? "-" : "";
  const symbol = unicodeFontsAvailable ? "₹" : "Rs. ";

  const formatted = Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${sign}${symbol}${formatted}`;
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const sanitizeFilename = (name) => {
  const cleaned = String(name || "Group")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return cleaned || "Group";
};

const getUserId = (user) => {
  if (!user) return null;
  return user._id ? user._id.toString() : user.toString();
};

const getUserName = (user) =>
  user ? user.name || user.email || "Unknown Member" : "Unknown Member";

const getUserEmail = (user) => (user ? user.email || "" : "");

const formatStatus = (status) =>
  status ? String(status).replace(/_/g, " ").toUpperCase() : "UNKNOWN";

const getBalanceStatus = (balance) => {
  const amount = roundMoney(balance);

  if (Math.abs(amount) < 0.01) return "SETTLED";

  return amount > 0 ? "RECEIVES" : "OWES";
};

const getStatusStyle = (status) => {
  switch (status) {
    case "SETTLED":
    case "COMPLETED":
      return {
        background: COLORS.emeraldSoft,
        text: COLORS.emerald,
      };

    case "OWES":
    case "CANCELLED":
      return {
        background: COLORS.roseSoft,
        text: COLORS.rose,
      };

    case "RECEIVES":
      return {
        background: COLORS.indigoSoft,
        text: COLORS.indigo,
      };

    case "PENDING":
    case "INITIATED":
      return {
        background: COLORS.amberSoft,
        text: COLORS.amber,
      };

    default:
      return {
        background: COLORS.surfaceAlt,
        text: COLORS.slate,
      };
  }
};

const calculateReport = ({ group, expenses, settlements }) => {
  const members = Array.isArray(group.members) ? group.members : [];
  const memberIds = members.map((member) => getUserId(member));

  const paidMap = {};
  const shareMap = {};

  memberIds.forEach((id) => {
    if (id) {
      paidMap[id] = 0;
      shareMap[id] = 0;
    }
  });

  let totalSpent = 0;

  expenses.forEach((expense) => {
    const amount = safeNumber(expense.amount);
    totalSpent += amount;

    const payerId = getUserId(expense.paidBy);

    if (payerId && paidMap[payerId] !== undefined) {
      paidMap[payerId] += amount;
    }

    if (
      Array.isArray(expense.splitBetween) &&
      expense.splitBetween.length > 0
    ) {
      expense.splitBetween.forEach((split) => {
        const userId = getUserId(split.user);
        const splitAmount = safeNumber(split.amount);

        if (userId && shareMap[userId] !== undefined) {
          shareMap[userId] += splitAmount;
        }
      });
    } else if (members.length > 0) {
      const equalShare = amount / members.length;

      members.forEach((member) => {
        const memberId = getUserId(member);

        if (memberId && shareMap[memberId] !== undefined) {
          shareMap[memberId] += equalShare;
        }
      });
    }
  });

  const balanceMap = {};

  memberIds.forEach((id) => {
    if (id) {
      balanceMap[id] = (paidMap[id] || 0) - (shareMap[id] || 0);
    }
  });

  // Only completed settlements affect outstanding balances.
  settlements
    .filter((settlement) => settlement.status === "COMPLETED")
    .forEach((settlement) => {
      const fromId = getUserId(settlement.from);
      const toId = getUserId(settlement.to);
      const amount = safeNumber(settlement.amount);

      if (fromId && balanceMap[fromId] !== undefined) {
        balanceMap[fromId] += amount;
      }

      if (toId && balanceMap[toId] !== undefined) {
        balanceMap[toId] -= amount;
      }
    });

  const memberReport = members.map((member) => {
    const memberId = getUserId(member);
    const paid = roundMoney(paidMap[memberId] || 0);
    const share = roundMoney(shareMap[memberId] || 0);
    const balance = roundMoney(balanceMap[memberId] || 0);

    return {
      id: memberId,
      name: getUserName(member),
      email: getUserEmail(member),
      paid,
      share,
      balance,
      status: getBalanceStatus(balance),
    };
  });

  const categoryMap = {};

  expenses.forEach((expense) => {
    const category = expense.category || "OTHER";

    categoryMap[category] =
      (categoryMap[category] || 0) + safeNumber(expense.amount);
  });

  const categoryReport = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount: roundMoney(amount),
    }))
    .sort((a, b) => b.amount - a.amount);

  const settlementReport = settlements.map((settlement) => ({
    from: getUserName(settlement.from),
    to: getUserName(settlement.to),
    amount: roundMoney(settlement.amount),
    status: settlement.status,
    transactionRef: settlement.transactionRef || "",
    note: settlement.note || "",
    createdAt: settlement.createdAt,
    settledAt: settlement.settledAt || null,
  }));

  const completedSettlements = settlements.filter(
    (item) => item.status === "COMPLETED",
  );

  const pendingSettlements = settlements.filter(
    (item) => item.status === "PENDING" || item.status === "INITIATED",
  );

  const cancelledSettlements = settlements.filter(
    (item) => item.status === "CANCELLED",
  );

  const completedSettlementAmount = completedSettlements.reduce(
    (sum, item) => sum + safeNumber(item.amount),
    0,
  );

  const pendingSettlementAmount = pendingSettlements.reduce(
    (sum, item) => sum + safeNumber(item.amount),
    0,
  );

  const budget =
    group.budget === null || group.budget === undefined
      ? null
      : roundMoney(group.budget);

  const remainingBudget =
    budget === null ? null : roundMoney(budget - totalSpent);

  const budgetUsedPercentage =
    budget && budget > 0 ? roundMoney((totalSpent / budget) * 100) : null;

  return {
    totalSpent: roundMoney(totalSpent),
    totalExpenses: expenses.length,
    totalMembers: members.length,
    averageExpense:
      expenses.length > 0 ? roundMoney(totalSpent / expenses.length) : 0,
    budget,
    remainingBudget,
    budgetUsedPercentage,
    memberReport,
    categoryReport,
    settlementReport,
    completedSettlementCount: completedSettlements.length,
    completedSettlementAmount: roundMoney(completedSettlementAmount),
    pendingSettlementCount: pendingSettlements.length,
    pendingSettlementAmount: roundMoney(pendingSettlementAmount),
    cancelledSettlementCount: cancelledSettlements.length,
  };
};

const ensureSpace = (doc, requiredHeight = 60) => {
  if (doc.y + requiredHeight > PAGE.height - PAGE.margin - 30) {
    doc.addPage();
    doc.y = PAGE.margin;
    return true;
  }

  return false;
};

const drawFooter = (doc, pageNumber, totalPages) => {
  const y = PAGE.height - PAGE.margin + 14;

  doc
    .save()
    .strokeColor(COLORS.border)
    .lineWidth(0.75)
    .moveTo(PAGE.margin, y - 10)
    .lineTo(PAGE.width - PAGE.margin, y - 10)
    .stroke();

  doc
    .font("Body")
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text("KharchaMate  •  Trip Expense & Settlement Report", PAGE.margin, y, {
      width: 320,
      align: "left",
    });

  doc
    .font("Body-Bold")
    .fontSize(7.5)
    .fillColor(COLORS.slate)
    .text(
      `Page ${pageNumber} of ${totalPages}`,
      PAGE.width - PAGE.margin - 120,
      y,
      {
        width: 120,
        align: "right",
      },
    )
    .restore();
};

const drawSectionTitle = (doc, title, subtitle = "") => {
  ensureSpace(doc, subtitle ? 70 : 55);

  const startY = doc.y;

  doc
    .roundedRect(PAGE.margin, startY + 1, 3.5, subtitle ? 30 : 18, 2)
    .fill(COLORS.accent);

  doc
    .font("Body-Bold")
    .fontSize(13)
    .fillColor(COLORS.navy)
    .text(title, PAGE.margin + 14, startY, {
      width: CONTENT_WIDTH - 14,
    });

  if (subtitle) {
    doc
      .font("Body")
      .fontSize(8.5)
      .fillColor(COLORS.muted)
      .text(subtitle, PAGE.margin + 14, startY + 18, {
        width: CONTENT_WIDTH - 14,
      });
  }

  doc.y = startY + (subtitle ? 46 : 32);
};

const drawKpiCard = (
  doc,
  x,
  y,
  width,
  height,
  label,
  value,
  accentColor = COLORS.navy,
) => {
  doc
    .save()
    .roundedRect(x, y, width, height, 8)
    .fillAndStroke(COLORS.white, COLORS.border);

  doc.roundedRect(x, y, 3.5, height, 8).fill(accentColor);

  doc
    .font("Body-Bold")
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text(label.toUpperCase(), x + 15, y + 12, {
      width: width - 28,
      characterSpacing: 0.3,
    });

  doc
    .font("Body-Bold")
    .fontSize(16.5)
    .fillColor(COLORS.navy)
    .text(value, x + 15, y + 29, {
      width: width - 28,
      ellipsis: true,
    })
    .restore();
};

const drawStatusBadge = (doc, status, x, y, width) => {
  const style = getStatusStyle(status);
  const label = formatStatus(status);
  const badgeWidth = Math.max(width, 34);

  doc.save().roundedRect(x, y, badgeWidth, 16, 8).fill(style.background);

  doc
    .font("Body-Bold")
    .fontSize(6.8)
    .fillColor(style.text)
    .text(label, x, y + 5, {
      width: badgeWidth,
      align: "center",
      characterSpacing: 0.2,
    })
    .restore();
};

const drawKeyValue = (doc, label, value, x, y, width) => {
  doc.font("Body").fontSize(7.5).fillColor(COLORS.muted).text(label, x, y, {
    width,
    characterSpacing: 0.3,
  });

  doc
    .font("Body-Bold")
    .fontSize(10)
    .fillColor(COLORS.navy)
    .text(value, x, y + 13, {
      width,
      ellipsis: true,
    });
};

const RIGHT_ALIGN_INSET = 6;

const drawTableHeader = (doc, columns) => {
  const y = doc.y;
  const height = 24;

  doc
    .save()
    .roundedRect(PAGE.margin, y, CONTENT_WIDTH, height, 4)
    .fill(COLORS.navy);

  columns.forEach((column) => {
    const absX = PAGE.margin + CELL_PAD + column.x;

    const width =
      column.align === "right"
        ? column.width - RIGHT_ALIGN_INSET
        : column.width;

    doc
      .font("Body-Bold")
      .fontSize(7.5)
      .fillColor(COLORS.white)
      .text(column.label, absX, y + 8, {
        width,
        align: column.align || "left",
        characterSpacing: 0.2,
      });
  });

  doc.restore();

  return y + height;
};

const drawTableRow = (doc, columns, row, index, rowHeight = 28) => {
  const y = doc.y;

  if (index % 2 === 1) {
    doc
      .save()
      .rect(PAGE.margin, y, CONTENT_WIDTH, rowHeight)
      .fill(COLORS.surface)
      .restore();
  }

  columns.forEach((column) => {
    const absX = PAGE.margin + CELL_PAD + column.x;

    const width =
      column.align === "right"
        ? column.width - RIGHT_ALIGN_INSET
        : column.width;

    if (typeof column.render === "function") {
      column.render(doc, {
        row,
        x: absX,
        y,
        width: column.width,
        height: rowHeight,
      });
      return;
    }

    const value = column.value ? column.value(row, index) : "";
    const color = column.colorFn
      ? column.colorFn(row)
      : column.color || COLORS.ink;

    doc
      .font(column.bold ? "Body-Bold" : "Body")
      .fontSize(column.fontSize || 8.5)
      .fillColor(color)
      .text(String(value ?? ""), absX, y + (rowHeight - 10) / 2, {
        width,
        align: column.align || "left",
        ellipsis: true,
        lineBreak: column.noWrap ? false : true,
      });
  });

  doc
    .save()
    .strokeColor(COLORS.border)
    .lineWidth(0.4)
    .moveTo(PAGE.margin, y + rowHeight)
    .lineTo(PAGE.margin + CONTENT_WIDTH, y + rowHeight)
    .stroke()
    .restore();

  doc.y = y + rowHeight;
};

const drawTable = (
  doc,
  { columns, rows, rowHeight = 28, emptyText, continuationTitle },
) => {
  const headerHeight = 24;

  ensureSpace(doc, headerHeight + rowHeight + 10);

  doc.y = drawTableHeader(doc, columns);

  if (!rows.length) {
    doc
      .font("Body")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(
        emptyText || "No records found.",
        PAGE.margin + CELL_PAD,
        doc.y + 14,
      );

    doc.y += 42;
    return;
  }

  rows.forEach((row, index) => {
    const availableBottom = PAGE.height - PAGE.margin - 30;

    if (doc.y + rowHeight > availableBottom) {
      doc.addPage();
      doc.y = PAGE.margin;

      if (continuationTitle) {
        drawSectionTitle(doc, continuationTitle, "Continued");
      }

      ensureSpace(doc, headerHeight + rowHeight + 10);
      doc.y = drawTableHeader(doc, columns);
    }

    drawTableRow(doc, columns, row, index, rowHeight);
  });

  doc.moveDown(1);
};

const drawReportHeader = (doc, group, report) => {
  const top = PAGE.margin;
  const bannerHeight = 138;

  doc
    .save()
    .roundedRect(PAGE.margin, top, CONTENT_WIDTH, bannerHeight, 12)
    .fill(COLORS.navy);

  doc.roundedRect(PAGE.margin, top, CONTENT_WIDTH, 4, 2).fill(COLORS.accent);

  doc
    .font("Body-Bold")
    .fontSize(10.5)
    .fillColor(COLORS.accent)
    .text("KHARCHAMATE", PAGE.margin + 22, top + 24, {
      characterSpacing: 1.2,
    });

  doc
    .font("Body-Bold")
    .fontSize(20)
    .fillColor(COLORS.white)
    .text("Trip Expense &", PAGE.margin + 22, top + 46)
    .text("Settlement Report", PAGE.margin + 22, top + 70);

  doc
    .font("Body")
    .fontSize(8.5)
    .fillColor("#CBD5E1")
    .text(
      "Complete financial summary of group expenses and settlements",
      PAGE.margin + 22,
      top + 104,
      {
        width: 270,
      },
    );

  const rightX = PAGE.margin + 300;
  const rightWidth = CONTENT_WIDTH - 300 - 20;

  doc
    .font("Body-Bold")
    .fontSize(12.5)
    .fillColor(COLORS.white)
    .text(group.name, rightX, top + 22, {
      width: rightWidth,
      align: "right",
      ellipsis: true,
    });

  doc
    .font("Body")
    .fontSize(7.5)
    .fillColor("#CBD5E1")
    .text(`Generated ${formatDateTime(new Date())}`, rightX, top + 43, {
      width: rightWidth,
      align: "right",
    });

  doc
    .font("Body")
    .fontSize(7.5)
    .fillColor("#CBD5E1")
    .text(
      `${report.totalMembers} members  •  ${report.totalExpenses} expenses`,
      rightX,
      top + 58,
      {
        width: rightWidth,
        align: "right",
      },
    );

  const groupStatus = group.isBlocked
    ? "BLOCKED"
    : group.isActive
      ? "ACTIVE"
      : "INACTIVE";

  const badgeWidth = 88;

  drawStatusBadge(
    doc,
    groupStatus,
    rightX + rightWidth - badgeWidth,
    top + 84,
    badgeWidth,
  );

  doc.restore();

  doc.y = top + bannerHeight + 18;
};

const drawTripInformation = (doc, group) => {
  drawSectionTitle(
    doc,
    "Trip Information",
    "Basic information about this KharchaMate group",
  );

  const y = doc.y;
  const panelHeight = 92;

  doc
    .roundedRect(PAGE.margin, y, CONTENT_WIDTH, panelHeight, 8)
    .fillAndStroke(COLORS.surface, COLORS.border);

  const columnWidth = CONTENT_WIDTH / 3;

  drawKeyValue(
    doc,
    "TRIP NAME",
    group.name,
    PAGE.margin + 18,
    y + 16,
    columnWidth - 32,
  );

  drawKeyValue(
    doc,
    "TOTAL MEMBERS",
    String(Array.isArray(group.members) ? group.members.length : 0),
    PAGE.margin + columnWidth + 18,
    y + 16,
    columnWidth - 32,
  );

  drawKeyValue(
    doc,
    "BUDGET",
    group.budget === null || group.budget === undefined
      ? "Not set"
      : formatCurrency(group.budget),
    PAGE.margin + columnWidth * 2 + 18,
    y + 16,
    columnWidth - 32,
  );

  drawKeyValue(
    doc,
    "CREATED",
    formatDate(group.createdAt),
    PAGE.margin + 18,
    y + 56,
    columnWidth - 32,
  );

  drawKeyValue(
    doc,
    "LAST UPDATED",
    formatDate(group.updatedAt),
    PAGE.margin + columnWidth + 18,
    y + 56,
    columnWidth - 32,
  );

  drawKeyValue(
    doc,
    "GROUP STATUS",
    group.isBlocked ? "Blocked" : group.isActive ? "Active" : "Inactive",
    PAGE.margin + columnWidth * 2 + 18,
    y + 56,
    columnWidth - 32,
  );

  doc.y = y + panelHeight + 18;
};

const drawExecutiveSummary = (doc, report) => {
  drawSectionTitle(doc, "Executive Summary", "High-level financial overview");

  const gap = 10;
  const cardWidth = (CONTENT_WIDTH - gap) / 2;
  const cardHeight = 62;

  const x1 = PAGE.margin;
  const x2 = PAGE.margin + cardWidth + gap;
  const y1 = doc.y;
  const y2 = y1 + cardHeight + 10;

  drawKpiCard(
    doc,
    x1,
    y1,
    cardWidth,
    cardHeight,
    "Total Spent",
    formatCurrency(report.totalSpent),
    COLORS.indigo,
  );

  drawKpiCard(
    doc,
    x2,
    y1,
    cardWidth,
    cardHeight,
    "Total Expenses",
    String(report.totalExpenses),
    COLORS.navy,
  );

  drawKpiCard(
    doc,
    x1,
    y2,
    cardWidth,
    cardHeight,
    "Members",
    String(report.totalMembers),
    COLORS.emerald,
  );

  drawKpiCard(
    doc,
    x2,
    y2,
    cardWidth,
    cardHeight,
    "Average Expense",
    formatCurrency(report.averageExpense),
    COLORS.amber,
  );

  doc.y = y2 + cardHeight + 22;

  if (report.budget !== null) {
    const budgetY = doc.y;
    const panelHeight = 64;

    doc
      .roundedRect(PAGE.margin, budgetY, CONTENT_WIDTH, panelHeight, 8)
      .fillAndStroke(COLORS.white, COLORS.border);

    const colWidth = CONTENT_WIDTH / 4;

    drawKeyValue(
      doc,
      "BUDGET",
      formatCurrency(report.budget),
      PAGE.margin + 16,
      budgetY + 14,
      colWidth - 24,
    );

    drawKeyValue(
      doc,
      "REMAINING",
      formatCurrency(report.remainingBudget),
      PAGE.margin + colWidth + 16,
      budgetY + 14,
      colWidth - 24,
    );

    drawKeyValue(
      doc,
      "BUDGET USED",
      report.budgetUsedPercentage === null
        ? "N/A"
        : `${report.budgetUsedPercentage}%`,
      PAGE.margin + colWidth * 2 + 16,
      budgetY + 14,
      colWidth - 24,
    );

    drawKeyValue(
      doc,
      "SETTLED",
      formatCurrency(report.completedSettlementAmount),
      PAGE.margin + colWidth * 3 + 16,
      budgetY + 14,
      colWidth - 24,
    );

    doc.y = budgetY + panelHeight + 18;
  }
};

const drawMemberBalances = (doc, report) => {
  drawSectionTitle(
    doc,
    "Member Balance Summary",
    "Positive balances receive money • Negative balances owe money",
  );

  const columns = [
    {
      label: "MEMBER",
      x: 0,
      width: 80,
      value: (r) => r.name,
      bold: true,
    },
    {
      label: "EMAIL",
      x: 80,
      width: 60,
      value: (r) => r.email || "—",
      color: COLORS.slate,
      fontSize: 7.5,
    },
    {
      label: "PAID",
      x: 140,
      width: 90,
      align: "right",
      value: (r) => formatCurrency(r.paid),
      noWrap: true,
    },
    {
      label: "SHARE",
      x: 230,
      width: 90,
      align: "right",
      value: (r) => formatCurrency(r.share),
      noWrap: true,
    },
    {
      label: "BALANCE",
      x: 320,
      width: 105,
      align: "right",
      bold: true,
      value: (r) => `${r.balance >= 0 ? "+" : ""}${formatCurrency(r.balance)}`,
      colorFn: (r) => getStatusStyle(r.status).text,
      fontSize: 8,
      noWrap: true,
    },
    {
      label: "STATUS",
      x: 425,
      width: 70,
      align: "center",
      render: (doc, ctx) => {
        const badgeWidth = ctx.width - 8;

        drawStatusBadge(
          doc,
          ctx.row.status,
          ctx.x + 4,
          ctx.y + (ctx.height - 16) / 2,
          badgeWidth,
        );
      },
    },
  ];

  drawTable(doc, {
    columns,
    rows: report.memberReport,
    rowHeight: 30,
    emptyText: "No members found for this group.",
    continuationTitle: "Member Balance Summary",
  });
};

const drawSettlementSummary = (doc, report) => {
  drawSectionTitle(
    doc,
    "Settlement Summary",
    "Recorded payments and their current status",
  );

  const columns = [
    {
      label: "FROM",
      x: 0,
      width: 100,
      value: (r) => r.from,
      bold: true,
    },
    {
      label: "TO",
      x: 100,
      width: 100,
      value: (r) => r.to,
      bold: true,
    },
    {
      label: "AMOUNT",
      x: 200,
      width: 95,
      align: "right",
      value: (r) => formatCurrency(r.amount),
      noWrap: true,
    },
    {
      label: "STATUS",
      x: 295,
      width: 90,
      align: "center",
      render: (doc, ctx) => {
        const badgeWidth = ctx.width - 8;

        drawStatusBadge(
          doc,
          ctx.row.status,
          ctx.x + 4,
          ctx.y + (ctx.height - 16) / 2,
          badgeWidth,
        );
      },
    },
    {
      label: "DATE",
      x: 385,
      width: 110,
      align: "right",
      color: COLORS.slate,
      value: (r) => formatDate(r.settledAt || r.createdAt),
    },
  ];

  drawTable(doc, {
    columns,
    rows: report.settlementReport,
    rowHeight: 30,
    emptyText: "No settlements have been recorded for this group.",
    continuationTitle: "Settlement Summary",
  });

  const summaryItems = [
    [
      "Completed",
      report.completedSettlementCount,
      formatCurrency(report.completedSettlementAmount),
      COLORS.emerald,
    ],
    [
      "Pending / Initiated",
      report.pendingSettlementCount,
      formatCurrency(report.pendingSettlementAmount),
      COLORS.amber,
    ],
    ["Cancelled", report.cancelledSettlementCount, "—", COLORS.rose],
  ];

  ensureSpace(doc, 65);

  const boxWidth = (CONTENT_WIDTH - 20) / 3;

  summaryItems.forEach(([title, count, amount, accentColor], index) => {
    const x = PAGE.margin + index * (boxWidth + 10);
    const y = doc.y;

    doc
      .roundedRect(x, y, boxWidth, 54, 7)
      .fillAndStroke(COLORS.surface, COLORS.border);

    doc.roundedRect(x, y, 3.5, 54, 7).fill(accentColor);

    doc
      .font("Body-Bold")
      .fontSize(7.5)
      .fillColor(COLORS.muted)
      .text(title.toUpperCase(), x + 14, y + 10, {
        width: boxWidth - 24,
        characterSpacing: 0.2,
      });

    doc
      .font("Body-Bold")
      .fontSize(11.5)
      .fillColor(COLORS.navy)
      .text(`${count} • ${amount}`, x + 14, y + 27, {
        width: boxWidth - 24,
        ellipsis: true,
      });
  });

  doc.y += 72;
};

const drawContributionSummary = (doc, report) => {
  drawSectionTitle(
    doc,
    "Member Contribution Summary",
    "Total amount paid by each member",
  );

  const columns = [
    {
      label: "#",
      x: 0,
      width: 28,
      align: "center",
      value: (r) => r.rank,
      color: COLORS.muted,
    },
    {
      label: "MEMBER",
      x: 28,
      width: 218,
      value: (r) => r.name,
      bold: true,
    },
    {
      label: "TOTAL PAID",
      x: 246,
      width: 128,
      align: "right",
      value: (r) => formatCurrency(r.paid),
      bold: true,
      noWrap: true,
    },
    {
      label: "% OF TOTAL",
      x: 374,
      width: 121,
      align: "right",
      color: COLORS.slate,
      value: (r) => `${r.pct}%`,
    },
  ];

  const sortedMembers = [...report.memberReport]
    .sort((a, b) => b.paid - a.paid)
    .map((member, index) => ({
      ...member,
      rank: index + 1,
      pct:
        report.totalSpent > 0
          ? roundMoney((member.paid / report.totalSpent) * 100)
          : 0,
    }));

  drawTable(doc, {
    columns,
    rows: sortedMembers,
    rowHeight: 28,
    emptyText: "No contributions recorded for this group.",
    continuationTitle: "Member Contribution Summary",
  });
};

const drawCategorySummary = (doc, report) => {
  if (report.categoryReport.length === 0) return;

  drawSectionTitle(
    doc,
    "Category Breakdown",
    "Expense distribution by category",
  );

  const rows = report.categoryReport.map((category) => ({
    ...category,
    pct:
      report.totalSpent > 0
        ? roundMoney((category.amount / report.totalSpent) * 100)
        : 0,
  }));

  const columns = [
    {
      label: "CATEGORY",
      x: 0,
      width: 218,
      value: (r) => r.category,
      bold: true,
    },
    {
      label: "AMOUNT",
      x: 218,
      width: 140,
      align: "right",
      value: (r) => formatCurrency(r.amount),
      bold: true,
      noWrap: true,
    },
    {
      label: "% OF TOTAL",
      x: 358,
      width: 137,
      align: "right",
      color: COLORS.slate,
      value: (r) => `${r.pct}%`,
    },
  ];

  drawTable(doc, {
    columns,
    rows,
    rowHeight: 28,
    emptyText: "No categorized expenses found.",
    continuationTitle: "Category Breakdown",
  });
};

const drawExpenseDetails = (doc, expenses) => {
  drawSectionTitle(
    doc,
    "Complete Expense Details",
    "All expenses recorded for this group",
  );

  const columns = [
    {
      label: "#",
      x: 0,
      width: 23,
      align: "center",
      color: COLORS.muted,
      value: (r, i) => i + 1,
    },
    {
      label: "DESCRIPTION",
      x: 23,
      width: 152,
      value: (r) => r.description || "—",
      bold: true,
    },
    {
      label: "PAID BY",
      x: 175,
      width: 95,
      color: COLORS.slate,
      value: (r) => getUserName(r.paidBy),
    },
    {
      label: "CATEGORY",
      x: 270,
      width: 65,
      color: COLORS.slate,
      value: (r) => r.category || "OTHER",
    },
    {
      label: "AMOUNT",
      x: 335,
      width: 90,
      align: "right",
      bold: true,
      value: (r) => formatCurrency(r.amount),
      noWrap: true,
    },
    {
      label: "DATE",
      x: 425,
      width: 70,
      align: "right",
      color: COLORS.slate,
      value: (r) => formatDate(r.createdAt),
    },
  ];

  drawTable(doc, {
    columns,
    rows: expenses,
    rowHeight: 30,
    emptyText: "No expenses have been recorded for this group.",
    continuationTitle: "Complete Expense Details",
  });
};

const drawReportNotes = (doc, report) => {
  ensureSpace(doc, 130);

  drawSectionTitle(doc, "Report Notes");

  const y = doc.y;

  const notes = [
    "Current balances are calculated from recorded expenses and COMPLETED settlements.",
    "PENDING and INITIATED settlements are shown separately and do not reduce outstanding balances.",
    "CANCELLED settlements are retained as historical records but do not affect current balances.",
    "Expense splits use the recorded splitBetween values; expenses without splits are divided equally among group members.",
  ];

  doc
    .roundedRect(PAGE.margin, y, CONTENT_WIDTH, 20 + notes.length * 17, 8)
    .fillAndStroke(COLORS.surface, COLORS.border);

  notes.forEach((note, index) => {
    doc
      .font("Body-Bold")
      .fontSize(8.5)
      .fillColor(COLORS.accent)
      .text("•", PAGE.margin + 16, y + 14 + index * 17);

    doc
      .font("Body")
      .fontSize(8.5)
      .fillColor(COLORS.slate)
      .text(note, PAGE.margin + 26, y + 14 + index * 17, {
        width: CONTENT_WIDTH - 42,
      });
  });

  doc.y = y + 30 + notes.length * 17;
};

export const downloadGroupSettlementPDF = async (req, res) => {
  let headersSent = false;

  try {
    const { groupId } = req.params;

    if (!mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group ID",
      });
    }

    const group = await Group.findById(groupId)
      .populate("members", "name email mobile")
      .lean();

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name email")
      .populate("splitBetween.user", "name email")
      .sort({ createdAt: 1 })
      .lean();

    const settlements = await Settlement.find({ group: groupId })
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ createdAt: 1 })
      .lean();

    const report = calculateReport({
      group,
      expenses,
      settlements,
    });

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      bufferPages: true,
      info: {
        Title: `KharchaMate - ${group.name}`,
        Author: "KharchaMate",
        Subject: "Trip Expense & Settlement Report",
        Creator: "KharchaMate",
      },
    });

    registerFonts(doc);

    const safeGroupName = sanitizeFilename(group.name);

    const filename = `KharchaMate-${safeGroupName}-Expense-Settlement-Report.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "private, no-store, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("X-Content-Type-Options", "nosniff");

    headersSent = true;

    doc.pipe(res);

    drawReportHeader(doc, group, report);
    drawTripInformation(doc, group);
    drawExecutiveSummary(doc, report);
    drawMemberBalances(doc, report);
    drawSettlementSummary(doc, report);
    drawContributionSummary(doc, report);
    drawCategorySummary(doc, report);

    // Keep detailed transactions on their own page.
    doc.addPage();

    drawExpenseDetails(doc, expenses);
    drawReportNotes(doc, report);

    const range = doc.bufferedPageRange();

    for (let index = range.start; index < range.start + range.count; index++) {
      doc.switchToPage(index);
      drawFooter(doc, index + 1, range.count);
    }

    doc.end();
  } catch (error) {
    console.error("PDF REPORT ERROR:", error);

    // Do not send JSON after PDF streaming has started.
    if (!headersSent && !res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate PDF report",
      });
    }

    if (!res.writableEnded) {
      res.end();
    }
  }
};
