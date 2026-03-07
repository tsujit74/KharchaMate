import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subject: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM"
  },

  status: {
    type: String,
    enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    default: "OPEN"
  },

  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      role: {
        type: String,
        enum: ["USER", "ADMIN"]
      },
      message: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  resolvedAt: Date
},
{ timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);