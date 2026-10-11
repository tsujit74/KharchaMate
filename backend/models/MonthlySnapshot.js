import mongoose from "mongoose";

const CATEGORIES = ["FOOD", "TRAVEL", "RENT", "SHOPPING", "RECHARGE", "OTHER"];

const nonNegativeAmount = {
  type: Number,
  required: true,
  min: 0,
  validate: {
    validator: Number.isFinite,
    message: "Amount must be a finite number.",
  },
  immutable: true,
};

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
      immutable: true,
    },
    amount: nonNegativeAmount,
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      validate: {
        validator: Number.isFinite,
        message: "Percentage must be a finite number.",
      },
      immutable: true,
    },
  },
  { _id: false },
);

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      immutable: true,
    },
    paid: nonNegativeAmount,
    share: nonNegativeAmount,
  },
  { _id: false },
);

const monthlySnapshotSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      immutable: true,
    },
    groupName: {
      type: String,
      required: true,
      trim: true,
      immutable: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
      immutable: true,
    },
    totalExpenses: nonNegativeAmount,
    transactionCount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Transaction count must be a non-negative integer.",
      },
      immutable: true,
    },
    totalSettlements: nonNegativeAmount,
    settlementCount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Settlement count must be a non-negative integer.",
      },
      immutable: true,
    },
    topCategory: {
      type: String,
      enum: [...CATEGORIES, null],
      default: null,
      immutable: true,
    },
    categories: {
      type: [categorySchema],
      default: [],
      immutable: true,
    },
    members: {
      type: [memberSchema],
      default: [],
      immutable: true,
    },
    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    closedAt: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  },
);

monthlySnapshotSchema.index({ group: 1, month: 1 }, { unique: true });

const MonthlySnapshot =
  mongoose.models.MonthlySnapshot ||
  mongoose.model("MonthlySnapshot", monthlySnapshotSchema);

export default MonthlySnapshot;
