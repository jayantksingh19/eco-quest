import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    originalName: { type: String, trim: true },
    size: { type: Number },
    type: { type: String, trim: true },
  },
  { _id: false }
);

const taskSubmissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: Number,
      default: null,
      index: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    driveLink: {
      type: String,
      trim: true,
    },
    ecoPoints: {
      type: Number,
      default: 0,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    reporterName: {
      type: String,
      trim: true,
    },
    reporterEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "reporterRole",
    },
    reporterRole: {
      type: String,
      enum: ["Teacher", "Student", null],
      default: null,
    },
    status: {
      type: String,
      enum: ["submitted", "approved", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TaskSubmission", taskSubmissionSchema);
