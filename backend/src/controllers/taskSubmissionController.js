import TaskSubmission from "../models/TaskSubmission.js";
import { sendEmail } from "../utils/otpService.js";

const otpDebugFlag = process.env.OTP_DEBUG;
const OTP_DEBUG =
  otpDebugFlag === "true" || (otpDebugFlag !== "false" && process.env.NODE_ENV !== "production");

const slugify = (input) =>
  input
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "ecoquest";

const generateReference = () => {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `TS-${year}-${random}`;
};

export const submitTaskProof = async (req, res) => {
  try {
    const {
      taskId,
      taskTitle,
      description = "",
      location = "",
      driveLink = "",
      points = 0,
      reporterName = "",
      reporterEmail = "",
      reporterId = null,
      reporterRole = null,
    } = req.body || {};

    if (!taskId || Number.isNaN(Number(taskId))) {
      return res.status(400).json({ message: "Task identifier is required." });
    }

    if (!taskTitle) {
      return res.status(400).json({ message: "Task title is required." });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required." });
    }

    if (!location) {
      return res.status(400).json({ message: "Location is required." });
    }

    if (!driveLink) {
      return res.status(400).json({ message: "Drive link is required." });
    }

    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();
    const trimmedDriveLink = driveLink.trim();

    const files = Array.isArray(req.files) ? req.files : [];

    if (!files.length) {
      return res.status(400).json({ message: "Photo evidence is required." });
    }

    const numericTaskId = Number(taskId);

    const attachmentEntries = files.map((file) => {
      const extension = file.originalname.includes(".")
        ? `.${file.originalname.split(".").pop()}`
        : "";
      const baseNameParts = [
        slugify(reporterName || "ecoquest"),
        `task-${numericTaskId}`,
        "tasksubmission",
      ].filter(Boolean);
      const renamed = `${baseNameParts.join("-")}${extension}`;

      return {
        renamed,
        originalName: file.originalname,
        size: file.size,
        type: file.mimetype,
        buffer: file.buffer,
      };
    });

    const attachmentDocs = attachmentEntries.map((item) => ({
      name: item.renamed,
      originalName: item.originalName,
      size: item.size,
      type: item.type,
    }));

    const reference = generateReference();
    const normalizedRole =
      reporterRole === "Teacher" || reporterRole === "Student" ? reporterRole : null;

    const submission = await TaskSubmission.create({
      taskId: numericTaskId,
      reference,
      taskTitle: taskTitle.trim(),
      description: trimmedDescription,
      location: trimmedLocation,
      driveLink: trimmedDriveLink,
      ecoPoints: Number(points) || 0,
      attachments: attachmentDocs,
      reporterName: reporterName.trim(),
      reporterEmail: reporterEmail.trim().toLowerCase(),
      reporterId,
      reporterRole: normalizedRole,
    });

    if (reporterEmail) {
      const subject = "EcoQuest Task Submission Confirmation";
      const htmlSections = [
        `<p>Hi ${reporterName || "EcoQuest Hero"},</p>`,
        "<p>Congratulations! We received your task submission and it looks fantastic.</p>",
        "<hr style=\"margin:16px 0;\" />",
        `<p><strong>Reference:</strong> ${reference}</p>`,
        `<p><strong>Task:</strong> ${taskTitle}</p>`,
        `<p><strong>Task ID:</strong> ${numericTaskId}</p>`,
        `<p><strong>Description:</strong></p><p>${trimmedDescription.replace(/\n/g, "<br/>")}</p>`,
        `<p><strong>Location:</strong> ${trimmedLocation}</p>`,
        `<p><strong>Drive Link:</strong> <a href="${trimmedDriveLink}" target="_blank" rel="noopener">${trimmedDriveLink}</a></p>`,
        `<p><strong>EcoPoints Earned:</strong> ${Number(points) || 0}</p>`,
        "<hr style=\"margin:16px 0;\" />",
      ];

      if (attachmentEntries.length > 0) {
        htmlSections.push(
          `<p><strong>Attachments:</strong></p>` +
            "<ul>" +
            attachmentEntries
              .map(
                (file, index) =>
                  `<li>${index + 1}. ${file.renamed} (${Math.round(file.size / 1024)} KB)</li>`
              )
              .join("") +
            "</ul>"
        );
      }

      htmlSections.push(
        "<p>We’ll review your submission and update your EcoQuest progress soon. Keep up the amazing work!</p>",
        "<p>– EcoQuest Support Team</p>"
      );

      try {
        await sendEmail({
          to: reporterEmail,
          subject,
          text: htmlSections
            .map((section) =>
              section
                .replace(/<[^>]*>/g, "")
                .replace(/\s+/g, " ")
                .trim()
            )
            .filter(Boolean)
            .join("\n"),
          html: htmlSections.join(""),
          attachments:
            attachmentEntries.length > 0
              ? attachmentEntries.map((file) => ({
                  filename: file.renamed,
                  content: file.buffer,
                  contentType: file.type,
                }))
              : undefined,
        });
      } catch (emailError) {
        console.error("taskSubmission sendEmail error", emailError);
      }
    }

    if (OTP_DEBUG) {
      console.info("[taskSubmission] New submission", {
        id: submission._id,
        reference,
        reporterEmail,
      });
    }

    return res.status(201).json({
      message: "Task submitted successfully.",
      reference,
      submission: {
        taskId: submission.taskId,
        reference: submission.reference,
        taskTitle: submission.taskTitle,
        description: submission.description,
        location: submission.location,
        driveLink: submission.driveLink,
        ecoPoints: submission.ecoPoints,
        attachments: submission.attachments,
        reporterName: submission.reporterName,
        reporterEmail: submission.reporterEmail,
        status: submission.status,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error("submitTaskProof error", error);
    return res.status(500).json({ message: "Failed to submit task." });
  }
};
