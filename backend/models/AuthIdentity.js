import mongoose from "mongoose";

const authIdentitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: ["google", "github", "linkedin", "facebook"],
      required: true,
    },

    providerAccountId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

authIdentitySchema.index(
  { provider: 1, providerAccountId: 1 },
  { unique: true },
);

export default mongoose.model("AuthIdentity", authIdentitySchema);
