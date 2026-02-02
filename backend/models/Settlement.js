import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0.01 },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED", "INITIATED"],
      default: "PENDING",
    },
    transactionRef: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
    },
    note: String,
    settledAt: Date,
    expiresAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Settlement", settlementSchema);
