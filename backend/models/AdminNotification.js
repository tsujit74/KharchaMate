import mongoose from "mongoose";

const adminNotificationSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "USER_REGISTERED",
        "GROUP_CREATED",
        "NEW_TICKET",
        "USER_BLOCKED",
        "GROUP_BLOCKED",
      ],
      required: true,
      index: true,
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AdminNotification", adminNotificationSchema);
