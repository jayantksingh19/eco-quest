import mongoose from "mongoose";

const otpTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userRole: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },
    purpose: {
      type: String,
      enum: ["phone_verification", "login", "password_reset"],
      required: true,
      index: true,
    },
    identifier: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      enum: ["sms", "email"],
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    consumed: {
      type: Boolean,
      default: false,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

otpTokenSchema.index(
  { userId: 1, purpose: 1, identifier: 1, channel: 1 },
  { unique: true }
);

otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OtpToken", otpTokenSchema);
