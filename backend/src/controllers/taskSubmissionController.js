import TaskSubmission from "../models/TaskSubmission.js";
import { sendEmail, renderBrandedEmail } from "../utils/otpService.js";

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
      const safeName = reporterName || "EcoQuest Hero";
      const pointsEarned = Number(points) || 0;

      const attachmentsList =
        attachmentEntries.length > 0
          ? `<div style="margin-top:24px;">
              <p style="margin:0 0 8px;font-weight:600;color:#1d513c;">Attachments</p>
              <ul style="margin:0;padding-left:18px;color:#314338;">
                ${attachmentEntries
                  .map(
                    (file, index) =>
                      `<li style="margin:4px 0;">${index + 1}. ${file.renamed} (${Math.round(file.size / 1024)} KB)</li>`
                  )
                  .join("")}
              </ul>
            </div>`
          : "";

      const summaryHtml = `<div style="background:#f1f9f4;border-radius:14px;padding:18px 20px;margin:24px 0;">
          <p style="margin:0 0 10px;"><strong>Reference:</strong> ${reference}</p>
          <p style="margin:0 0 10px;"><strong>Task:</strong> ${taskTitle}</p>
          <p style="margin:0 0 10px;"><strong>Task ID:</strong> ${numericTaskId}</p>
          <p style="margin:0 0 10px;"><strong>Location:</strong> ${trimmedLocation}</p>
          <p style="margin:0;"><strong>Drive Link:</strong> <a style="color:#14804a;" href="${trimmedDriveLink}" target="_blank" rel="noopener">${trimmedDriveLink}</a></p>
        </div>`;

      const descriptionHtml = `<div style="margin-top:12px;">
          <p style="margin:0 0 6px;font-weight:600;color:#1d513c;">What you shared</p>
          <p style="margin:0;color:#314338;">${trimmedDescription.replace(/\n/g, "<br/>")}</p>
        </div>`;

      const htmlBody = `${summaryHtml}${descriptionHtml}${attachmentsList}<p style="margin-top:24px;">We’ll review your submission shortly and update your EcoQuest progress.</p>`;

      const html = renderBrandedEmail({
        heading: "We received your EcoQuest task!",
        previewText: `Your task "${taskTitle}" is now in review.`,
        introHtml: `<p>Hi ${safeName},</p><p>Great job! Your task submission was received successfully.</p>`,
        highlightValue: `+${pointsEarned} EcoPoints`,
        highlightLabel: "Impact Earned",
        bodyHtml: htmlBody,
        closingHtml: "<p>Keep up the inspiring work!<br/><strong>EcoQuest Support Team</strong></p>",
      });

      const textBody = [
        `Hi ${safeName},`,
        "Great job! Your task submission was received successfully.",
        "",
        `Reference: ${reference}`,
        `Task: ${taskTitle}`,
        `Task ID: ${numericTaskId}`,
        `Location: ${trimmedLocation}`,
        `Drive Link: ${trimmedDriveLink}`,
        "",
        "Description:",
        trimmedDescription,
        "",
        `EcoPoints Earned: ${pointsEarned}`,
        attachmentEntries.length
          ? `Attachments: ${attachmentEntries
              .map((file, index) => `${index + 1}. ${file.renamed} (${Math.round(file.size / 1024)} KB)`)
              .join("; ")}`
          : "",
        "",
        "We’ll review your submission shortly and update your EcoQuest progress.",
        "",
        "EcoQuest Support Team",
      ]
        .filter(Boolean)
        .join("\n");

      try {
        await sendEmail({
          to: reporterEmail,
          subject,
          text: textBody,
          html,
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