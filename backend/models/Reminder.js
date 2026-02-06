import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },

    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    settlementRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Settlement",
      default: null,
    },

    channel: {
      type: String,
      enum: ["WHATSAPP", "IN_APP"],
      default: "IN_APP",
    },

    status: {
      type: String,
      enum: ["SENT"],
      default: "SENT",
    },

    sentAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);


reminderSchema.index({
  fromUser: 1,
  toUser: 1,
  group: 1,
  sentAt: -1,
});

export default mongoose.model("Reminder", reminderSchema);
