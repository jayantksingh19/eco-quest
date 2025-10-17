import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    role: {
      type: String,
      enum: ["teacher"],
      default: "teacher",
    },
    profileImageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerification: {
      type: {
        codeHash: String,
        expiresAt: Date,
      },
      default: undefined,
    },
    wantsNotifications: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    loginFailedAttempts: {
      type: Number,
      default: 0,
    },
    lastLoginFailedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
