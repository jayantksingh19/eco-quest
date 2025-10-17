import HazardReport from "../models/HazardReport.js";
import { sendEmail, renderBrandedEmail } from "../utils/otpService.js";

const otpDebugFlag = process.env.OTP_DEBUG;
const OTP_DEBUG =
  otpDebugFlag === "true" || (otpDebugFlag !== "false" && process.env.NODE_ENV !== "production");

const generateReference = () => {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `HZ-${year}-${random}`;
};

const parseBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
    if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  }
  return fallback;
};

const parseCoordinates = (value) => {
  if (!value) return { lat: 0, lng: 0 };
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return {
        lat: Number(parsed?.lat) || 0,
        lng: Number(parsed?.lng) || 0,
      };
    } catch (error) {
      return { lat: 0, lng: 0 };
    }
  }

  return {
    lat: Number(value?.lat) || 0,
    lng: Number(value?.lng) || 0,
  };
};

const buildMapLink = (coordinates) => {
  if (!coordinates) return null;
  const { lat, lng } = coordinates;
  if (!lat || !lng) return null;
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

const slugify = (input) =>
  input
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "ecoquest";

export const createHazardReport = async (req, res) => {
  try {
    const {
      title,
      category,
      customCategory,
      description,
      location,
      coordinates,
      urgent,
      permission,
      reporterName = "",
      reporterEmail = "",
      reporterId = null,
      reporterRole = null,
    } = req.body || {};

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required." });
    }

    if (!parseBoolean(permission)) {
      return res
        .status(400)
        .json({ message: "Permission confirmation is required before submitting a report." });
    }

    const reference = generateReference();

    const parsedCoordinates = parseCoordinates(coordinates);

    const resolvedCategory = customCategory?.trim() || category?.trim() || "";

    const files = Array.isArray(req.files) ? req.files : [];

    const attachmentEntries = files.map((file) => {
      const extension = file.originalname.includes(".")
        ? `.${file.originalname.split(".").pop()}`
        : "";
      const baseNameParts = [
        slugify(reporterName || "ecoquest"),
        slugify(resolvedCategory || "general"),
        "hazardreport",
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

    const normalizedRole =
      reporterRole === "Teacher" || reporterRole === "Student"
        ? reporterRole
        : null;

    const report = await HazardReport.create({
      reference,
      title: title.trim(),
      category: resolvedCategory,
      description: description.trim(),
      location: location.trim(),
      coordinates: parsedCoordinates,
      urgent: parseBoolean(urgent),
      permissionConfirmed: true,
      attachments: attachmentDocs,
      reporterName: reporterName?.trim() || "",
      reporterEmail: reporterEmail?.trim().toLowerCase() || "",
      reporterId,
      reporterRole: normalizedRole,
    });

    if (reporterEmail) {
      const mapLink = buildMapLink(parsedCoordinates);
      const safeName = reporterName || "EcoQuest Guardian";
      const subject = "EcoQuest Hazard Report Confirmation";

      const summaryHtml = `<div style="background:#f1f6ff;border-radius:14px;padding:18px 20px;margin:24px 0;">
          <p style="margin:0 0 10px;"><strong>Reference:</strong> ${reference}</p>
          <p style="margin:0 0 10px;"><strong>Title:</strong> ${report.title}</p>
          <p style="margin:0 0 10px;"><strong>Location:</strong> ${report.location}</p>
          <p style="margin:0 0 10px;"><strong>Category:</strong> ${resolvedCategory || "Not specified"}</p>
          <p style="margin:0;"><strong>Priority:</strong> ${report.urgent ? "Urgent ✅" : "Standard"}</p>
        </div>`;

      const descriptionHtml = `<div style="margin-top:12px;">
          <p style="margin:0 0 6px;font-weight:600;color:#1d4d3b;">What you spotted</p>
          <p style="margin:0;color:#314338;">${(report.description || "").replace(/\n/g, "<br/>")}</p>
        </div>`;

      const mapHtml = mapLink
        ? `<p style="margin-top:16px;"><a style="color:#166534;font-weight:600;" href="${mapLink}" target="_blank" rel="noopener">View this location on Google Maps</a></p>`
        : "";

      const attachmentsList =
        attachmentEntries.length > 0
          ? `<div style="margin-top:24px;">
              <p style="margin:0 0 8px;font-weight:600;color:#1d513c;">Evidence you shared</p>
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

      const htmlBody = `${summaryHtml}${descriptionHtml}${mapHtml}${attachmentsList}<p style="margin-top:24px;">Our team will review your report and share updates as soon as we have them.</p>`;

      const html = renderBrandedEmail({
        heading: "Thanks for keeping EcoQuest safe!",
        previewText: `We received your hazard report "${report.title}".`,
        introHtml: `<p>Hi ${safeName},</p><p>Thanks for looking out for your community! We’ve logged your hazard report.</p>`,
        bodyHtml: htmlBody,
        closingHtml: "<p>Together we make every space greener.<br/><strong>EcoQuest Support Team</strong></p>",
      });

      const textBody = [
        `Hi ${safeName},`,
        "Thanks for looking out for your community! We’ve logged your hazard report.",
        "",
        `Reference: ${reference}`,
        `Title: ${report.title}`,
        `Location: ${report.location}`,
        `Category: ${resolvedCategory || "Not specified"}`,
        `Priority: ${report.urgent ? "Urgent" : "Standard"}`,
        "",
        "Description:",
        report.description || "",
        mapLink ? `Map: ${mapLink}` : "",
        attachmentEntries.length
          ? `Attachments: ${attachmentEntries
              .map((file, index) => `${index + 1}. ${file.renamed} (${Math.round(file.size / 1024)} KB)`)
              .join("; ")}`
          : "",
        "",
        "Our team will review your report and share updates as soon as we have them.",
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
        console.error("hazardController sendEmail error", emailError);
      }
    }

    if (OTP_DEBUG) {
      console.info("[hazardController] New hazard report created", {
        id: report._id,
        reference: report.reference,
        reporterEmail,
      });
    }

    const safeReport = {
      reference: report.reference,
      title: report.title,
      category: report.category,
      customCategory: customCategory?.trim() || "",
      description: report.description,
      location: report.location,
      coordinates: report.coordinates,
      urgent: report.urgent,
      permissionConfirmed: report.permissionConfirmed,
      reporterName: report.reporterName,
      reporterEmail: report.reporterEmail,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      attachments: (report.attachments || []).map(({ name, originalName, size, type }) => ({
        name,
        originalName,
        size,
        type,
      })),
    };

    return res.status(201).json({
      message: "Hazard report submitted successfully.",
      reference,
      report: safeReport,
    });
  } catch (error) {
    console.error("createHazardReport error", error);
    return res.status(500).json({ message: "Failed to submit hazard report." });
  }
};