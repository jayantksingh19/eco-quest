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

const hazardReportSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    permissionConfirmed: {
      type: Boolean,
      default: false,
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
      enum: ["submitted", "in_review", "resolved"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

export default mongoose.model("HazardReport", hazardReportSchema);
