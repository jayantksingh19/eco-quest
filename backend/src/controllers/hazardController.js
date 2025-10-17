import HazardReport from "../models/HazardReport.js";
import { sendEmail } from "../utils/otpService.js";

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

      const htmlSections = [
        `<p>Hi ${reporterName || "there"},</p>`,
        "<p>Thanks for looking out for the environment! We received your hazard report and our team will review it right away.</p>",
        "<hr style=\"margin:16px 0;\" />",
        `<p><strong>Reference:</strong> ${reference}</p>`,
        `<p><strong>Title:</strong> ${report.title}</p>`,
        `<p><strong>Location:</strong> ${report.location}</p>`,
        `<p><strong>Category:</strong> ${resolvedCategory || "Not specified"}</p>`,
        `<p><strong>Description:</strong></p><p>${report.description?.replace(/\n/g, "<br/>")}</p>`,
        report.urgent ? "<p><strong>Priority:</strong> Urgent ✅</p>" : "<p><strong>Priority:</strong> Standard</p>",
        mapLink ? `<p><a href="${mapLink}" target="_blank" rel="noopener">View this location on Google Maps</a></p>` : "",
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
        "<p>We'll share updates as soon as the report moves forward.</p>",
        "<p>– EcoQuest Support Team</p>"
      );

      const subject = "EcoQuest Hazard Report Confirmation";

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
