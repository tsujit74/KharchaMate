import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["FOOD", "TRAVEL", "RENT", "SHOPPING", "OTHER"],
      default: "OTHER",
    },

    splitBetween: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Expense", expenseSchema);
